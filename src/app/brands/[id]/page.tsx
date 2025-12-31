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

// Function to get brand data from Firestore
async function getBrand(id: string): Promise<Brand | null> {
    const db = getDb();
    const brandRef = doc(db, 'brands', id);
    const brandSnap = await getDoc(brandRef);
    if (!brandSnap.exists()) {
        return null;
    }
    return { ...brandSnap.data(), id: brandSnap.id } as Brand;
}

// Function to get parts for a brand
async function getPartsForBrand(brandId: string): Promise<Part[]> {
    const db = getDb();
    const partsQuery = query(collection(db, 'parts'), where('brandId', '==', brandId));
    const partsSnapshot = await getDocs(partsQuery);
    return partsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Part[];
}

// Generate dynamic metadata for SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const brand = await getBrand(id);

  if (!brand) {
    return {
      title: "Marca No Encontrada",
      description: "La marca que buscas no existe o fue eliminada.",
    }
  }

  return {
    title: `${brand.name} | GranRepuestos`,
    description: brand.description || `Catálogo de repuestos de la marca ${brand.name} en GranRepuestos.`,
  }
}

export default async function BrandDetailPage({ params }: Props) {
    const { id } = params;
    const brand = await getBrand(id);
    
    if (!brand) {
        notFound();
    }

    const parts = await getPartsForBrand(id);
    const categories = getCategories();

    return <BrandPageClient brand={brand} parts={parts} categories={categories} />;
}
