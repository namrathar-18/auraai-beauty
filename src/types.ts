export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  shades?: string[];
  skinTypes?: string[];
  description: string;
  ingredients: string[];
  reviews: Review[];
  stock: number;
}

export interface BeautyProfile {
  skinType?: string;
  skinTone?: string;
  undertone?: string;
  concerns?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedShade?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "beauty_expert" | "admin";
  wishlist: string[];
  cart: CartItem[];
  beautyProfile: BeautyProfile;
  points: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  selectedShade?: string;
  price: number;
  name: string;
  brand: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  amount: number;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered";
  date: string;
}

export interface ConcernAnalysis {
  score: number;
  status: "Good" | "Moderate" | "Needs Attention";
  info: string;
}

export interface SkinAnalysisReport {
  id: string;
  userId: string;
  score: number;
  concerns: {
    acne: ConcernAnalysis;
    darkCircles: ConcernAnalysis;
    dryness: ConcernAnalysis;
    oiliness: ConcernAnalysis;
    pigmentation: ConcernAnalysis;
    pores: ConcernAnalysis;
  };
  recommendedProductIds: string[];
  timestamp: string;
  isSimulation?: boolean;
}

export interface CommunityComment {
  user: string;
  avatar?: string;
  text: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  username: string;
  userAvatar?: string;
  userRole?: string;
  title: string;
  description: string;
  image?: string;
  likes: number;
  comments: CommunityComment[];
  tags: string[];
  date: string;
}

export type ActiveTab = 
  | "Home" 
  | "Marketplace" 
  | "SkinAnalyzer" 
  | "ShadeMatch" 
  | "VirtualStudio" 
  | "BeautyGPT" 
  | "RoutinePlanner" 
  | "Community" 
  | "Orders"
  | "Admin";
