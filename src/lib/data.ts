
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
    { id: 'yaris-advance', name: 'Yaris Advance', brandId: 'toyota' },
    { id: 'lexus', name: 'Lexus', brandId: 'toyota' },
    { id: 'terios', name: 'Terios', brandId: 'toyota' },
    { id: 'camry', name: 'Camry', brandId: 'toyota' },
    { id: 'baby-camry', name: 'Baby Camry', brandId: 'toyota' },
    { id: 'rav4', name: 'RAV4', brandId: 'toyota' },
    { id: 'corolla-sensacion', name: 'Corolla Sensación', brandId: 'toyota' },

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

export function sanitizeImageUrls(imageUrls: string[] | string | undefined | null): string[] {
    if (Array.isArray(imageUrls)) {
        // If it's already an array, filter out any non-string or empty values
        return imageUrls.filter(url => typeof url === 'string' && url.trim() !== '');
    }
    if (typeof imageUrls === 'string') {
        const urls: string[] = [];
        // Regex to find all src attributes within img tags
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = imgRegex.exec(imageUrls)) !== null) {
            urls.push(match[1].trim());
        }

        // If we found URLs in img tags, return them
        if (urls.length > 0) return urls;

        // Otherwise, split by newline or comma for plain text URLs
        return imageUrls.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }
    // Return an empty array if the input is not a string or an array
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
  const sanitizedParts = allParts.map(part => ({
    ...part,
    imageUrls: sanitizeImageUrls(part.imageUrls),
  }));

  let filteredParts = sanitizedParts;

  if (filters.query) {
    const lowerCaseQuery = filters.query.toLowerCase();
    filteredParts = filteredParts.filter(
      (part) =>
        part.name.toLowerCase().includes(lowerCaseQuery) ||
        part.sku.toLowerCase().includes(lowerCaseQuery) ||
        (part.description && part.description.toLowerCase().includes(lowerCaseQuery))
    );
  }

  if (filters.brand) {
    filteredParts = filteredParts.filter((part) => part.brandId === filters.brand);
  }

  if (filters.category) {
    filteredParts = filteredParts.filter((part) => part.categoryId === filters.category);
  }
  
  if (filters.vehicleBrand) {
    filteredParts = filteredParts.filter((part) => {
        if (part.vehicleBrandId === filters.vehicleBrand) return true;
        if (part.vehicleCompatibility) {
            return part.vehicleCompatibility.some(comp => comp.brandId === filters.vehicleBrand);
        }
        return false;
    });
  }
  
  if (filters.vehicleModel) {
     filteredParts = filteredParts.filter((part) => {
        if (part.vehicleModelIds && part.vehicleModelIds.includes(filters.vehicleModel as string)) return true;
        if (part.vehicleCompatibility) {
            return part.vehicleCompatibility.some(comp => comp.modelId === filters.vehicleModel);
        }
        return false;
    });
  }

  return filteredParts;
}

export function getPartById(allParts: Part[], id: string): Part | undefined {
  return allParts.find((part) => part.id === id);
}

export function getFeaturedParts(allParts: Part[]): Part[] {
  return allParts.filter((part) => part.isFeatured);
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
    return allParts.filter(p => part.relatedPartIds.includes(p.id) && p.id !== part.id);
}

    