export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  image: string;
  productCount: number;
  color: string;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  role: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface TrustBadge {
  icon: string;
  value: string;
  label: string;
}
