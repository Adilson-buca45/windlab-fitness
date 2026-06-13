export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  stock: number;
  options?: string[]; // e.g. ["Chocolate", "Baunilha"] or ["S", "M", "L"]
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  option?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue';
  address: string;
  phone: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type Category = 
  | 'Suplementos'
  | 'Proteínas'
  | 'Pré-treinos'
  | 'Creatinas'
  | 'Roupas Fitness'
  | 'Equipamentos'
  | 'Garrafas e Shakers';
