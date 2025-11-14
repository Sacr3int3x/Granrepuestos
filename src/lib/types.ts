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

export type VehicleCompatibility = {
    brandId: string;
    modelId: string;
    yearRange: string; // e.g., "2015-2020"
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
  vehicleBrandId?: string; // Optional top-level for primary vehicle
  vehicleModelId?: string; // Optional top-level for primary vehicle
  vehicleCompatibility?: VehicleCompatibility[];
};
