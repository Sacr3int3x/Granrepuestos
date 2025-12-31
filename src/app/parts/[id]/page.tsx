
import { notFound } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import type { Part, Brand, Category } from "@/lib/types";
import { getCategories } from "@/lib/data";
import { getDb } from "@/lib/firebase";
import { Metadata, ResolvingMetadata } from 'next';
import PartDetailPageClient from "./page.client";

type Props = {
    params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  if (!id) return { title: "Error", description: "ID de repuesto no válido." };

  const db = getDb();
  const partRef = doc(db, 'parts', id);
  const partSnap = await getDoc(partRef);

  if (!partSnap.exists()) {
    return {
      title: "Repuesto No Encontrado",
      description: "El repuesto que buscas no existe o fue eliminado.",
    }
  }
  
  const part = { ...partSnap.data(), id: partSnap.id } as Part;
  
  let brand: Brand | null = null;
  if (part.brandId) {
    const brandRef = doc(db, 'brands', part.brandId);
    const brandSnap = await getDoc(brandRef);
    if (brandSnap.exists()) {
      brand = { ...brandSnap.data(), id: brandSnap.id } as Brand;
    }
  }

  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = part.imageUrls && part.imageUrls.length > 0 ? part.imageUrls[0] : '';

  return {
    title: `${part.name} - ${brand?.name || 'GranRepuestos'}`,
    description: part.description || `Encuentra ${part.name} (SKU: ${part.sku}) en GranRepuestos. Calidad garantizada.`,
    openGraph: {
      images: [imageUrl, ...previousImages],
      type: 'website',
      title: `${part.name} - ${brand?.name || 'GranRepuestos'}`,
      description: part.description || `Encuentra ${part.name} (SKU: ${part.sku}) en GranRepuestos. Calidad garantizada.`,
      price: {
        amount: part.price.toString(),
        currency: 'EUR',
      },
    },
  }
}


export default async function PartDetailPage({ params }: Props) {
    const id = params.id;
    if(!id) {
        notFound();
    }
    
    const db = getDb();
    const partRef = doc(db, 'parts', id);
    const partSnap = await getDoc(partRef);

    if (!partSnap.exists()) {
      notFound();
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
    
    return <PartDetailPageClient part={part} brand={brandData} category={categoryData} relatedParts={relatedParts} />;
}
