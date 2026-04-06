export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryItem {
  id: number;
  name: string;
}
