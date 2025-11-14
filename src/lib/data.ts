

import type { Category, Part, VehicleBrand, VehicleModel, Brand } from './types';


// The brands data is now fetched from Firestore.
// This array can be kept for fallback or initial seeding if necessary, but the primary source is Firestore.
const brands: Brand[] = [];


const categories: Category[] = [
  { id: 'engine', name: 'Motor' },
  { id: 'suspension', name: 'Suspensión' },
  { id: 'brakes', name: 'Frenos' },
  { id: 'body', name: 'Carrocería' },
  { id: 'electrical', name: 'Eléctrico' },
];

const vehicleBrands: VehicleBrand[] = [
  { id: 'toyota', name: 'Toyota' },
  { id: 'honda', name: 'Honda' },
  { id: 'mitsubishi', name: 'Mitsubishi' },
  { id: 'chevrolet', name: 'Chevrolet' },
  { id: 'ford', name: 'Ford' },
  { id: 'isuzu', name: 'Isuzu' },
  { id: 'jeep', name: 'Jeep' },
]

const vehicleModels: VehicleModel[] = [
    // Toyota
    { id: '4runner', name: '4Runner', brandId: 'toyota' },
    { id: 'meru', name: 'Meru', brandId: 'toyota' },
    { id: 'prado', name: 'Prado', brandId: 'toyota' },
    { id: 'celica', name: 'Celica', brandId: 'toyota' },
    { id: 'corolla', name: 'Corolla', brandId: 'toyota' },
    { id: 'hilux', name: 'Hilux', brandId: 'toyota' },
    { id: 'fortuner', name: 'Fortuner', brandId: 'toyota' },
    { id: 'land-cruiser', name: 'Land Cruiser', brandId: 'toyota' },
    { id: 'tundra', name: 'Tundra', brandId: 'toyota' },
    { id: 'sequoia', name: 'Sequoia', brandId: 'toyota' },
    { id: 'yaris', name: 'Yaris', brandId: 'toyota' },
    { id: 'lexus', name: 'Lexus', brandId: 'toyota' },
    { id: 'terios', name: 'Terios', brandId: 'toyota' },
    { id: 'camry', name: 'Camry', brandId: 'toyota' },
    { id: 'rav4', name: 'RAV4', brandId: 'toyota' },
    { id: 'yaris-advance', name: 'Yaris Advance', brandId: 'toyota' },
    { id: '4runner-meru-prado', name: '4Runner Meru Prado', brandId: 'toyota' },
    { id: 'prado-4runner', name: 'Prado 4Runner', brandId: 'toyota' },
    { id: '4runner-prado', name: '4Runner Prado', brandId: 'toyota' },
    { id: 'baby-camry-pantallita-sapito-celica', name: 'Baby Camry Pantallita Sapito Celica', brandId: 'toyota' },
    { id: 'corolla-sensacion-celica-pantallita', name: 'Corolla Sensacion Celica Pantallita', brandId: 'toyota' },
    { id: 'corolla-explocion-robocot', name: 'Corolla Explocion Robocot', brandId: 'toyota' },
    { id: 'hilux-2.7-fortuner-4.0', name: 'Hilux 2.7 Fortuner 4.0', brandId: 'toyota' },
    { id: 'tundra-sequoia', name: 'Tundra - Sequoia', brandId: 'toyota' },
    { id: 'hilux-prado', name: 'Hilux Prado', brandId: 'toyota' },
    { id: 'hilux-fortuner', name: 'Hilux Fortuner', brandId: 'toyota' },
    { id: 'prado-lexus', name: 'Prado Lexus', brandId: 'toyota' },
    { id: 'hilux-vigo', name: 'Hilux Vigo', brandId: 'toyota' },
    { id: 'corolla-brasil', name: 'Corolla Brasil', brandId: 'toyota' },
    { id: 'robocot', name: 'Robocot', brandId: 'toyota' },
    { id: 'baby-camry', name: 'Baby Camry', brandId: 'toyota' },
    { id: 'pantallita', name: 'Pantallita', brandId: 'toyota' },
    { id: 'sapito', name: 'Sapito', brandId: 'toyota' },
    { id: 'sensacion', name: 'Sensacion', brandId: 'toyota' },
    { id: 'explocion', name: 'Explocion', brandId: 'toyota' },
    { id: 'vigo', name: 'Vigo', brandId: 'toyota' },
    // Honda
    { id: 'civic', name: 'Civic', brandId: 'honda' },
    { id: 'crv', name: 'CR-V', brandId: 'honda' },
    // Mitsubishi
    { id: 'lancer', name: 'Lancer', brandId: 'mitsubishi' },
    { id: 'l200', name: 'L200', brandId: 'mitsubishi' },
    // Chevrolet
    { id: 'spark', name: 'Spark', brandId: 'chevrolet' },
    { id: 'silverado', name: 'Silverado', brandId: 'chevrolet' },
    // Ford
    { id: 'focus', name: 'Focus', brandId: 'ford' },
    { id: 'ranger', name: 'Ranger', brandId: 'ford' },
    // Isuzu
    { id: 'dmax', name: 'D-Max', brandId: 'isuzu' },
    // Jeep
    { id: 'wrangler', name: 'Wrangler', brandId: 'jeep' },
    { id: 'cherokee', name: 'Cherokee', brandId: 'jeep' },
]

const parts: Part[] = [];

function sanitizeImageUrls(imageUrls: any): string[] {
    if (Array.isArray(imageUrls)) {
        // If it's already an array, just filter out any non-string or empty string values.
        return imageUrls.filter(url => typeof url === 'string' && url.trim() !== '');
    }
    if (typeof imageUrls === 'string') {
        // If it's a string, first try to extract from <img> tags
        const htmlRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [...imageUrls.matchAll(htmlRegex)];
        if (matches.length > 0) {
            return matches.map(match => match[1].trim()).filter(Boolean);
        }
        
        // If no img tags are found, assume it's a list of URLs separated by commas or newlines.
        const cleanedString = imageUrls.replace(/<br\s*\/?>/gi, ',');
        return cleanedString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }
    // If the input is neither an array nor a string, return an empty array.
    return [];
}


export function getParts(
  allParts: Part[],
  filters: {
    query?: string;
    brand?: string;
    category?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
  } = {}
) {
  // First, sanitize all parts to ensure imageUrls is always a clean string array
  let sanitizedParts = allParts.map(part => ({
    ...part,
    imageUrls: sanitizeImageUrls(part.imageUrls)
  }));


  if (filters.query) {
    const lowerCaseQuery = filters.query.toLowerCase();
    sanitizedParts = sanitizedParts.filter(
      (part) =>
        part.name.toLowerCase().includes(lowerCaseQuery) ||
        part.sku.toLowerCase().includes(lowerCaseQuery) ||
        part.description.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (filters.brand) {
    sanitizedParts = sanitizedParts.filter((part) => part.brandId === filters.brand);
  }

  if (filters.category) {
    sanitizedParts = sanitizedParts.filter((part) => part.categoryId === filters.category);
  }
  
  if (filters.vehicleBrand) {
    sanitizedParts = sanitizedParts.filter((part) => {
        // First check the top-level vehicleBrandId
        if (part.vehicleBrandId === filters.vehicleBrand) return true;
        // Then check the vehicleCompatibility array
        if (part.vehicleCompatibility) {
            return part.vehicleCompatibility.some(comp => comp.brandId === filters.vehicleBrand);
        }
        return false;
    });
  }
  
  if (filters.vehicleModel) {
     sanitizedParts = sanitizedParts.filter((part) => {
        // First check the top-level vehicleModelId
        if (part.vehicleModelId === filters.vehicleModel) return true;
        // Then check the vehicleCompatibility array
        if (part.vehicleCompatibility) {
            return part.vehicleCompatibility.some(comp => comp.modelId === filters.vehicleModel);
        }
        return false;
    });
  }

  return sanitizedParts;
}

export function getPartById(allParts: Part[], id: string): Part | undefined {
  return allParts.find((part) => part.id === id);
}

export function getFeaturedParts(allParts: Part[]): Part[] {
  const sanitizedParts = allParts.map(part => ({
    ...part,
    imageUrls: sanitizeImageUrls(part.imageUrls)
  }));
  return sanitizedParts.filter((part) => part.isFeatured);
}

export function getBrands(): Brand[] {
  // This function is now illustrative. In a real app, you'd fetch this from Firestore.
  return brands;
}

export function getCategories(): Category[] {
  return categories;
}

export function getVehicleBrands(): VehicleBrand[] {
  return vehicleBrands;
}

export function getVehicleModels(brandId?: string): VehicleModel[] {
    if (!brandId) return vehicleModels;
    return vehicleModels.filter(model => model.brandId === brandId);
}

export function getRelatedParts(allParts: Part[], part: Part): Part[] {
    if (!part || !part.relatedPartIds) return [];
    const sanitizedAllParts = allParts.map(p => ({
        ...p,
        imageUrls: sanitizeImageUrls(p.imageUrls)
    }));
    return sanitizedAllParts.filter(p => part.relatedPartIds.includes(p.id) && p.id !== part.id);
}
