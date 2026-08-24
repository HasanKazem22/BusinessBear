export interface Product {
  id?: number;
  sku?: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  buyingPrice?: number | null;
  imageUrl?: string;
  brandLogo?: string;
  rating?: number;
  category?: string;
  stockQuantity: number;
  salesCount?: number;
  isAvailable?: boolean;
  isActive?: boolean;
  description?: string;
}
