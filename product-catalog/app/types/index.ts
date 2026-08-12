export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  categoryId: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  inventoryId: number;
}
