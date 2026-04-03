
import { notFound } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import type { Part, Brand, Category } from "@/lib/types";
import { getCategories } from "@/lib/data";
import { getDb } from "@/lib/firebase";
import { Metadata, ResolvingMetadata } from 'next';
import PartDetailPageClient from "./page.client";

type Props = {
    params: Promise<{ id: string }>;
};

async function getPartData(id: string) {
    const db = getDb();
    const partRef = doc(db, 'parts', id);
    const partSnap = await getDoc(partRef);

    if (!partSnap.exists()) {
      return null;
    }
    
    const part = { ...partSnap.data(), id: partSnap.id } as Part;
    
    let brandData: Brand | null = null;
    if (part.brandId) {
      const brandRef = doc(db, 'brands', part.brandId);
      const brandSnap = await getDoc(brandRef);
      if (brandSnap.exists()) {
        brandData = { ...brandSnap.data(), id: brandSnap.id } as Brand;
      }
    }
    
    let categoryData: Category | null = null;
    const allCategories = getCategories();
    if (part.categoryIds && part.categoryIds.length > 0) {
      categoryData = allCategories.find(c => c.id === part.categoryIds[0]) || null;
    }

    let relatedParts: Part[] = [];
    if (part.vehicleModelIds && part.vehicleModelIds.length > 0) {
        const relatedQuery = query(
            collection(db, 'parts'),
            where('vehicleModelIds', 'array-contains-any', part.vehicleModelIds),
            limit(5)
        );
        const relatedSnap = await getDocs(relatedQuery);
        relatedParts = relatedSnap.docs
            .map(doc => ({...doc.data(), id: doc.id}))
            .filter(p => (p as Part).id !== id)
            .slice(0, 4) as Part[];
    }

    return { part, brand: brandData, category: categoryData, relatedParts };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getPartData(resolvedParams.id);

  if (!data) {
      return { title: 'Repuesto no encontrado | GranRepuestos' };
  }

  const { part, brand } = data;
  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = part.imageUrls && part.imageUrls.length > 0 ? part.imageUrls[0] : '';
  const title = `${part.name} - ${brand?.name || 'GranRepuestos'}`;
  const description = part.description ? part.description.substring(0, 155) : `Encuentra ${part.name} (SKU: ${part.sku}) en GranRepuestos. Calidad garantizada para tu vehículo en Guatire, Miranda.`;

  return {
    title,
    description,
    keywords: [part.name, brand?.name || '', part.sku, "repuestos guatire", "repuestos venezuela", "repuestos miranda"],
    openGraph: {
      images: [imageUrl, ...previousImages],
      type: 'website',
      title,
      description,
      price: {
        amount: part.price.toString(),
        currency: 'EUR',
      },
    },
  }
}

export default async function PartDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const data = await getPartData(resolvedParams.id);
    
    if (!data) {
        notFound();
    }

    return <PartDetailPageClient part={data.part} brand={data.brand} category={data.category} relatedParts={data.relatedParts} />;
}
