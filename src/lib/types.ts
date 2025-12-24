


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
}

export type Part = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryIds: string[];
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

export type Order = {
  id: string;
  userId: string;
  items: {
    partId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'verified' | 'rejected' | 'shipped';
  createdAt: any; // Firestore Timestamp
  paymentDetails?: {
    referenceNumber: string;
    bank: string;
    phone: string;
    idNumber: string;
    amount: number;
    paymentDate: string; // YYYY-MM-DD
  };
};
