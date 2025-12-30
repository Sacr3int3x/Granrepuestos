

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
  { id: 'hyundai', name: 'Hyundai' },
  { id: 'kia', name: 'Kia' },
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
    { id: 'tacoma', name: 'Tacoma', brandId: 'toyota' },
    { id: 'c-hr', name: 'C-HR', brandId: 'toyota' },

    // Honda
    { id: 'civic', name: 'Civic', brandId: 'honda' },
    { id: 'crv', name: 'CR-V', brandId: 'honda' },
    { id: 'accord', name: 'Accord', brandId: 'honda' },
    { id: 'pilot', name: 'Pilot', brandId: 'honda' },
    { id: 'element', name: 'Element', brandId: 'honda' },
    { id: 'fit', name: 'Fit', brandId: 'honda' },

    // Mitsubishi
    { id: 'lancer', name: 'Lancer', brandId: 'mitsubishi' },
    { id: 'l200', name: 'L200', brandId: 'mitsubishi' },
    { id: 'montero', name: 'Montero', brandId: 'mitsubishi' },
    { id: 'outlander', name: 'Outlander', brandId: 'mitsubishi' },

    // Chevrolet
    { id: 'spark', name: 'Spark', brandId: 'chevrolet' },
    { id: 'spark-lite', name: 'Spark Lite', brandId: 'chevrolet' },
    { id: 'silverado', name: 'Silverado', brandId: 'chevrolet' },
    { id: 'optra', name: 'Optra', brandId: 'chevrolet' },
    { id: 'aveo', name: 'Aveo', brandId: 'chevrolet' },
    { id: 'trax', name: 'Trax', brandId: 'chevrolet' },
    { id: 'cruze', name: 'Cruze', brandId: 'chevrolet' },

    // Ford
    { id: 'focus', name: 'Focus', brandId: 'ford' },
    { id: 'ranger', name: 'Ranger', brandId: 'ford' },
    { id: 'f-150', name: 'F-150', brandId: 'ford' },
    { id: 'explorer', name: 'Explorer', brandId: 'ford' },

    // Isuzu
    { id: 'dmax', name: 'D-Max', brandId: 'isuzu' },
    
    // Jeep
    { id: 'wrangler', name: 'Wrangler', brandId: 'jeep' },
    { id: 'cherokee', name: 'Cherokee', brandId: 'jeep' },
    { id: 'compass', name: 'Compass', brandId: 'jeep' },
    { id: 'patriot', name: 'Patriot', brandId: 'jeep' },

    // Hyundai
    { id: 'accent', name: 'Accent', brandId: 'hyundai' },
    { id: 'elantra', name: 'Elantra', brandId: 'hyundai' },
    { id: 'santa-fe', name: 'Santa Fe', brandId: 'hyundai' },
    { id: 'tucson', name: 'Tucson', brandId: 'hyundai' },
    { id: 'getz', name: 'Getz', brandId: 'hyundai' },
    { id: 'i10', name: 'i10', brandId: 'hyundai' },
    { id: 'atos', name: 'Atos', brandId: 'hyundai' },
    { id: 'matrix', name: 'Matrix', brandId: 'hyundai' },
    { id: 'veracruz', name: 'Veracruz', brandId: 'hyundai' },
    { id: 'eon', name: 'Eon', brandId: 'hyundai' },

    // Kia
    { id: 'rio', name: 'Rio', brandId: 'kia' },
    { id: 'sportage', name: 'Sportage', brandId: 'kia' },
    { id: 'picanto', name: 'Picanto', brandId: 'kia' },
    { id: 'sorento', name: 'Sorento', brandId: 'kia' },
    { id: 'carnival', name: 'Carnival', brandId: 'kia' },
    { id: 'cerato', name: 'Cerato', brandId: 'kia' },
    { id: 'carens', name: 'Carens', brandId: 'kia' },
    { id: 'cadenza', name: 'Cadenza', brandId: 'kia' },
    { id: 'optima', name: 'Optima', brandId: 'kia' },
    { id: 'soul', name: 'Soul', brandId: 'kia' },
]

export function sanitizeImageUrls(imageUrls: string | string[] | null | undefined): string[] {
    if (!imageUrls) {
        return [];
    }

    if (Array.isArray(imageUrls)) {
        // Filter out any non-string or empty values, then return
        return imageUrls.filter(url => typeof url === 'string' && url.trim() !== '');
    }

    if (typeof imageUrls === 'string') {
        const urls: string[] = [];
        
        // Regex to find all src attributes within img tags
        const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = imgTagRegex.exec(imageUrls)) !== null) {
            urls.push(match[1].trim());
        }

        // If we found URLs in img tags, return them
        if (urls.length > 0) {
            return urls;
        }

        // If no img tags, try splitting by common delimiters for plain text lists
        // This handles cases like 'url1,url2' or 'url1\nurl2'
        const plainTextUrls = imageUrls.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
        if(plainTextUrls.length > 0 && plainTextUrls.every(url => url.startsWith('http'))) {
            return plainTextUrls;
        }

        // If it's just a single URL string
        if (imageUrls.startsWith('http')) {
            return [imageUrls];
        }
    }
    
    // Return an empty array if the input is not a recognized format
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
  let filteredParts = allParts.map(part => ({
    ...part,
    imageUrls: sanitizeImageUrls(part.imageUrls),
  }));

  if (filters.query) {
    const searchWords = filters.query.toLowerCase().split(' ').filter(Boolean);
    filteredParts = filteredParts.filter((part) => {
        const partText = [
            part.name.toLowerCase(),
            part.sku.toLowerCase(),
            part.description?.toLowerCase() || ''
        ].join(' ');

        return searchWords.every(word => partText.includes(word));
    });
  }

  if (filters.brand) {
    filteredParts = filteredParts.filter((part) => part.brandId === filters.brand);
  }

  if (filters.category) {
    filteredParts = filteredParts.filter((part) => part.categoryIds && part.categoryIds.includes(filters.category as string));
  }
  
  if (filters.vehicleBrand) {
    filteredParts = filteredParts.filter((part) => {
        if (part.vehicleBrandIds && part.vehicleBrandIds.includes(filters.vehicleBrand as string)) return true;
        return false;
    });
  }
  
  if (filters.vehicleModel) {
     filteredParts = filteredParts.filter((part) => {
        if (part.vehicleModelIds && part.vehicleModelIds.includes(filters.vehicleModel as string)) return true;
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

export function getVehicleModels(brandIds?: string[] | string): VehicleModel[] {
    if (!brandIds || (Array.isArray(brandIds) && brandIds.length === 0)) return [];
    
    const ids = Array.isArray(brandIds) ? brandIds : [brandIds];

    return vehicleModels.filter(model => ids.includes(model.brandId));
}

export function getRelatedParts(allParts: Part[], part: Part): Part[] {
    if (!part || !part.relatedPartIds) return [];
    return allParts.filter(p => part.relatedPartIds.includes(p.id) && p.id !== part.id);
}

    
