export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
    
  images?: string[];
  thumbnail?: string;
}


export interface ProductResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
