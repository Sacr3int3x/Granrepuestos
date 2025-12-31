
import { notFound } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import type { Part, Brand, Category } from "@/lib/types";
import { getCategories } from "@/lib/data";
import { getDb } from "@/lib/firebase";
import { Metadata, ResolvingMetadata } from "next";
import BrandPageClient from "./page.client";

type Props = {
    params: { id: string };
};

async function getBrandData(id: string) {
    const db = getDb();
    const brandRef = doc(db, 'brands', id);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
        notFound();
    }

    const brand = { ...brandSnap.data(), id: brandSnap.id } as Brand;

    const partsQuery = query(collection(db, 'parts'), where('brandId', '==', id));
    const partsSnapshot = await getDocs(partsQuery);
    const parts = partsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Part[];
    
    const categories = getCategories();
    
    return { brand, parts, categories };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { brand } = await getBrandData(params.id);

  return {
    title: `${brand.name} | GranRepuestos`,
    description: brand.description || `Catálogo de repuestos de la marca ${brand.name} en GranRepuestos.`,
  }
}

export default async function BrandDetailPage({ params }: Props) {
    const { brand, parts, categories } = await getBrandData(params.id);

    return <BrandPageClient brand={brand} parts={parts} categories={categories} />;
}
