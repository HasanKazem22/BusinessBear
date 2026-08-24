import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const productService = {
  /** Fetch products (public/admin search) */
  async getProducts(query?: string, category?: string, activeOnly = false): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (category) params.append("category", category);
    if (activeOnly) params.append("activeOnly", "true");
    
    const queryString = params.toString();
    return apiFetch(`/products${queryString ? `?${queryString}` : ""}`, {
      requireAuth: false,
    });
  },

  /** Get single product details */
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return apiFetch(`/products/${id}`, {
      requireAuth: false,
    });
  },

  /** Admin: create a product */
  async createProduct(dto: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  /** Admin: update product details */
  async updateProduct(id: number, dto: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  },

  /** Admin: delete a product */
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return apiFetch(`/products/${id}`, {
      method: "DELETE",
    });
  },
};
