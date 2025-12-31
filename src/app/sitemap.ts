import { MetadataRoute } from 'next';
import { getDb } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Part, Brand } from '@/lib/types';

const BASE_URL = 'https://www.granrepuestos.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getDb();

  // Get all parts
  const partsSnapshot = await getDocs(collection(db, 'parts'));
  const parts = partsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Part[];

  // Get all brands
  const brandsSnapshot = await getDocs(collection(db, 'brands'));
  const brands = brandsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Brand[];

  const partEntries: MetadataRoute.Sitemap = parts.map(({ id, name }) => ({
    url: `${BASE_URL}/parts/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const brandEntries: MetadataRoute.Sitemap = brands.map(({ id }) => ({
    url: `${BASE_URL}/brands/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  const staticPages: MetadataRoute.Sitemap = [
    {
        url: `${BASE_URL}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
    },
    {
        url: `${BASE_URL}/parts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    },
    {
        url: `${BASE_URL}/brands`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    },
     {
        url: `${BASE_URL}/quienes-somos`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
     {
        url: `${BASE_URL}/envios`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
     {
        url: `${BASE_URL}/politicas`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
  ]

  return [
    ...staticPages,
    ...partEntries,
    ...brandEntries,
  ];
}