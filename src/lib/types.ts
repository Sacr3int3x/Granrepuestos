export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Part = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  brand: Brand;
  category: Category;
  imageUrls: string[];
  isFeatured: boolean;
  specifications: {
    [key: string]: string;
  };
  relatedPartIds: string[];
};
