export interface CartItem {
  id: number;
  name: string;
  description: string;
  release_date: string;
  cover_image: string;
  images: string[];
  price: number;
  total_price: number;
  quantity: number;
  brand: {
    id: number;
    name: string;
    image: string;
  };
}