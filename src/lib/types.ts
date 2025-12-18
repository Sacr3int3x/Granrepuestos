

export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
  description?: string;
  countryOfOrigin?: string;
  heroImageUrl?: string;
  websiteUrl?: string;
};

export type Category = {
  id: string;
  name: string;
};

export type VehicleBrand = {
    id: string;
    name: string;
}

export type VehicleModel = {
    id: string;
    name: string;
    brandId: string;
}

export type Part = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryId: string;
  imageUrls: string[];
  isFeatured: boolean;
  specifications: {
    [key: string]: string;
  };
  relatedPartIds: string[];
  vehicleBrandIds?: string[];
  vehicleModelIds?: string[];
  yearRange?: string; 
};
