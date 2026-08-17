import { Product, Category } from '../app/types';
import { API_BASE_URL } from './config';
 
async function fetchData(url: string, label: string) {
  try {
        const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
   
   
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
   
    const data = await response.json();
   
    return data;
  } catch (error) {
    throw error;
  }
}
 
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchData(`${API_BASE_URL}/products`, 'Products');
 
    const result = Array.isArray(data) ? data : Object.values(data);
    
    return result;
  } catch (error) {
    
    return [];
  }
}
 
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const data = await fetchData(`${API_BASE_URL}/products/${id}`, `Product ${id}`);
    return data || null;
  } catch (error) {
   
    return null;
  }
}
 
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchData(`${API_BASE_URL}/categories`, 'Categories');
    
    const result = Array.isArray(data) ? data : Object.values(data);
   
    return result;
  } catch (error) {
    
    return [];
  }
}