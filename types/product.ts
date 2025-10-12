export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  featured: boolean;
  // optional array of flavour/variant names (some products include flavour lists)
  flavours?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  // optional unique id for this cart line (allows same product, different flavours)
  cartItemId?: string;
  // selected flavour/variant for this cart item
  selectedFlavour?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  isAdmin?: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
