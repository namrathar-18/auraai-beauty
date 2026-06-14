import fs from "fs";
import path from "path";

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

interface DBStructure {
  products: Product[];
  users: User[];
  orders: Order[];
  skinReports: SkinAnalysisReport[];
  communityPosts: CommunityPost[];
}

const DB_FILE_PATH = path.join(process.cwd(), "server", "db.json");

// Direct placeholder gradients for our premium products
const pGrads = [
  "linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)", // Pink Rose
  "linear-gradient(135deg, #fbcfe8 0%, #fda4af 50%, #f43f5e 100%)", // Rich Rose-Gold
  "linear-gradient(135deg, #f5d0fe 0%, #d8b4fe 100%)", // Lavender Mist
  "linear-gradient(135deg, #fffbeb 0%, #fef08a 50%, #ca8a04 100%)", // Rich Gold
  "linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)", // Blush Rose
  "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)", // Honey Beige
  "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)", // Teal Splash
  "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", // Sky Breeze
  "linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)", // Classic Silver
  "linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)", // Royal Lavender
];

const seedProducts: Product[] = [
  {
    id: "prod_mac_lipstick",
    name: "Modern Matte Lipstick",
    brand: "M.A.C Cosmetics",
    category: "Lipsticks",
    price: 1750,
    rating: 4.8,
    reviewsCount: 1420,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
    shades: ["Ruby Woo (Iconic Red)", "Velvet Teddy (Warm Nude)", "Mehr (Rosy Pink)", "Diva (Deep Burgundy)"],
    description: "An iconic, ultra-matte formula that delivers highly pigmented color with a creamy, comfortable feel that lasts all day.",
    ingredients: ["Octyldodecanol", "Castor Seed Oil", "Silica", "Candelilla Wax", "Tocopheryl Acetate"],
    reviews: [
      { id: "rev1", user: "Rhea Sen", rating: 5, comment: "Ruby Woo is absolutely gorgeous! Best matte red lipstick ever.", date: "2026-05-12" },
      { id: "rev2", user: "Tanya M.", rating: 4, comment: "Velvet Teddy is my daily shade. Gorgeous formulation but a bit dry if lips are not prepped.", date: "2026-05-20" }
    ],
    stock: 50
  },
  {
    id: "prod_lakme_mousse",
    name: "Skin Natural Mousse Foundation",
    brand: "Lakmé",
    category: "Foundations",
    price: 850,
    rating: 4.4,
    reviewsCount: 890,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    shades: ["01 Ivory", "02 Rose Honey", "03 Beige Honey", "04 Natural Sand"],
    skinTypes: ["Oily", "Combination", "Normal"],
    description: "An ultra-light, whipped formula that blends into skin seamlessly. Gives a feather-light feel with a high-definition matte finish.",
    ingredients: ["Cyclopentasiloxane", "Dimethicone Crosspolymer", "Titanium Dioxide", "Zinc Oxide", "Phenoxyethanol"],
    reviews: [
      { id: "rev3", user: "Sneha Patil", rating: 5, comment: "Insanely light and matte. Solves my oily t-zone completely!", date: "2026-06-01" }
    ],
    stock: 75
  },
  {
    id: "prod_maybelline_con",
    name: "Fit Me Liquid Concealer",
    brand: "Maybelline",
    category: "Concealers",
    price: 499,
    rating: 4.6,
    reviewsCount: 3120,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
    shades: ["10 Light", "15 Fair", "20 Sand", "25 Medium", "30 Honey"],
    skinTypes: ["Normal", "Dry", "Combination", "Oily"],
    description: "Our oil-free concealer formula matches skin tones to deliver a more even complexion. Conceals dark circles, blemishes, and under-eye hollows.",
    ingredients: ["Water", "Cyclopentasiloxane", "Glycerin", "Sorbitan Isostearate", "Chamomile Extract"],
    reviews: [
      { id: "rev4", user: "Kriti Sharma", rating: 5, comment: "Blends perfectly and doesn't crease at all. Excellent shade match!", date: "2026-05-30" }
    ],
    stock: 120
  },
  {
    id: "prod_huda_matte",
    name: "Liquid Matte Ultra-Comfort Lipstick",
    brand: "Huda Beauty",
    category: "Lipsticks",
    price: 1999,
    rating: 4.7,
    reviewsCount: 450,
    image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=600",
    shades: ["Bombshell (Soft Nude)", "Trendsetter (Brown Nude)", "Icon (Classic Mauve Pink)", "Cheerleader (Bright Crimson)"],
    description: "A transfer-proof, high-pigment liquid lipstick with an incredibly lightweight formula that dries down with smooth matte precision.",
    ingredients: ["Isododecane", "Cyclopentasiloxane", "Beeswax", "Olive Oil Unsaponifiables", "Antioxidants"],
    reviews: [
      { id: "rev5", user: "Amrita V.", rating: 5, comment: "Bombshell is the perfect peach-nude shade! It is transfer-proof and doesn't dry the lips.", date: "2026-06-10" }
    ],
    stock: 45
  },
  {
    id: "prod_mac_spray",
    name: "Prep + Prime Fix+ Setting Spray",
    brand: "M.A.C Cosmetics",
    category: "Skincare",
    price: 2150,
    rating: 4.9,
    reviewsCount: 2280,
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=600",
    description: "A lightweight mist of waters packed with vitamins and minerals, gently infused with a blend of green tea, chamomile and cucumber to soothe and refresh.",
    ingredients: ["Water", "Glycerin", "Cucumber Fruit Extract", "German Chamomile Flower Extract", "Green Tea Leaf Extract", "Tocopheryl Acetate"],
    reviews: [
      { id: "rev6", user: "Diya Roy", rating: 5, comment: "Sets my powder base into a fresh, dewy second skin. Cannot live without it!", date: "2026-06-11" }
    ],
    stock: 65
  },
  {
    id: "prod_clinique_ms",
    name: "Moisture Surge 100H Hydrator",
    brand: "Clinique",
    category: "Skincare",
    price: 2950,
    rating: 4.8,
    reviewsCount: 1540,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
    skinTypes: ["Dry", "Normal", "Combination", "Oily"],
    description: "An oil-free gel-cream moisturizer with exclusive aloe bio-ferment and hyaluronic acid that penetrates deep into skin's surface for up to 100 hours of stabilization.",
    ingredients: ["Aloe Barbadensis Leaf Water", "Hyaluronic Acid", "Saccharomyces Lysate Extract", "Activated Aloe Water"],
    reviews: [
      { id: "rev7", user: "Ananya Patel", rating: 5, comment: "Magical on my dry patches. Extremely plum-like glow in mornings!", date: "2026-06-05" }
    ],
    stock: 40
  },
  {
    id: "prod_forest_cleanser",
    name: "Bhringraj & Shikakai Hair Cleanser",
    brand: "Forest Essentials",
    category: "Haircare",
    price: 1450,
    rating: 4.5,
    reviewsCount: 610,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600",
    description: "An Ayurvedic hair cleanser infused with Bhringraj, Shikakai, and Coconut Milk. Promotes hair regrowth and controls hair fall.",
    ingredients: ["Bhringraj Extract", "Shikakai Fruit Infusion", "Reetha Fruit Extract", "Coconut Milk", "Pure Essential Oils"],
    reviews: [
      { id: "rev8", user: "Pooja Mehta", rating: 4, comment: "Very natural and chemical-free. Stopped hair fall of mine drastically in 3 weeks.", date: "2026-05-15" }
    ],
    stock: 35
  },
  {
    id: "prod_chanel_coco",
    name: "Coco Mademoiselle Eau de Parfum",
    brand: "Chanel",
    category: "Fragrances",
    price: 12500,
    rating: 4.9,
    reviewsCount: 950,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    description: "The essence of a free and audacious woman. An oriental-fresh woody fragrance with a sparkling spark of orange, patchouli, and elegant rose.",
    ingredients: ["Alcohol Denat", "Parfum (Fragrance)", "Water", "Limonene", "Linalool", "Coumarin"],
    reviews: [
      { id: "rev9", user: "Malini Iyer", rating: 5, comment: "Elite, luxurious, and stands out in any crowd. True luxury scent.", date: "2026-06-08" }
    ],
    stock: 15
  },
  {
    id: "prod_lakme_blush",
    name: "Absolute Face Stylist Blush Duos",
    brand: "Lakmé",
    category: "Blush",
    price: 750,
    rating: 4.3,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&q=80&w=600",
    shades: ["Rose Pink", "Coral Peach", "Soft Tangerine"],
    description: "A combination of luminous highlighter and blush particles that gives a flushed skin look with soft radiant satin finishes.",
    ingredients: ["Talc", "Mica", "Dimethicone", "Zinc Stearate", "Prunus Amygdalus Dulcis Oil"],
    reviews: [
      { id: "rev10", user: "Pritha Das", rating: 4, comment: "Subtle but beautiful pigmentation. Rose Pink suits my dusky skin so well!", date: "2026-05-24" }
    ],
    stock: 80
  },
  {
    id: "prod_maybelline_eye",
    name: "The Colossal Bold Eyeliner",
    brand: "Maybelline",
    category: "Eyeliners",
    price: 350,
    rating: 4.5,
    reviewsCount: 4210,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    shades: ["Intense Liquid Black"],
    description: "A black liquid eyeliner with up to 24-hour waterproof and smudge-proof formula. Brush tip provides perfect jet-black wing flow.",
    ingredients: ["Water", "Acrylates Copolymer", "Butylene Glycol", "Iron Oxides", "Xanthan Gum"],
    reviews: [
      { id: "rev11", user: "Vaishali S.", rating: 5, comment: "Extremely long-lasting. Doesn't smudge even in heavy sweat!", date: "2026-06-02" }
    ],
    stock: 200
  }
];

const seedPosts: CommunityPost[] = [
  {
    id: "post_1",
    username: "Meera_Glitz",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    userRole: "Beauty Expert",
    title: "Bridal Dewy Makeup Trick using Fix+! ✨",
    description: "Struggling with cakey foundation on wedding events? Mix a drop of M.A.C Prep+Prime Fix+ spray directly into your foundation before applying. Use a damp blender. It creates a flawless, non-oxidizing, glowing glass finish that stays under lights for 12 hours straight!",
    likes: 342,
    tags: ["BridalLook", "DewyBase", "BeautyTricks", "MakeupHack"],
    date: "2026-06-11",
    comments: [
      { user: "Ritu Verma", text: "Tried this today and it actually works! Felt like a celebrity skin routine.", date: "2026-06-12" },
      { user: "Sneha G.", text: "Wow, does it work for oily skins too?", date: "2026-06-12" }
    ]
  },
  {
    id: "post_2",
    username: "Dr_Skincare_Aura",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    userRole: "Dermatologist / Advisor",
    title: "Understanding Acne-Prone Dry Skin",
    description: "Generally acne products heavily dry out the face. Never forget barrier recovery! If you are using Salicylic Acid, pair it with Clinique Moisture Surge 100H or any humectant. Dryness creates micro-tears which signal more sebum, causing cyclic acne. Hydration is key!",
    likes: 218,
    tags: ["SkincareScience", "AcneSolutions", "HydrationLock", "Clinique"],
    date: "2026-06-09",
    comments: [
      { user: "Ankita101", text: "This answered exactly why my breakouts occurred after serum routines! Thank you doctor.", date: "2026-06-10" }
    ]
  },
  {
    id: "post_3",
    username: "Glam_Neha",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    userRole: "User",
    title: "My Office Look: Classic Red Lip 💋",
    description: "Kept it clean with Colossal liner wing of Maybelline, Natural Sand Absolute mousse base, and topped with M.A.C Ruby Woo in a precise gradient stain. Perfect confidence booster for morning meetings!",
    likes: 89,
    tags: ["OfficeOffice", "MACRubyWoo", "EverydayGlam", "MakeupOfTheDay"],
    date: "2026-06-12",
    comments: []
  }
];

class StorageManager {
  private data: DBStructure;

  constructor() {
    this.data = {
      products: seedProducts,
      users: [
        {
          id: "user_pioneer",
          name: "Jasmin Chopda",
          email: "jasminchopda540@gmail.com",
          role: "admin",
          wishlist: ["prod_mac_lipstick", "prod_clinique_ms"],
          cart: [{ productId: "prod_mac_lipstick", quantity: 1, selectedShade: "Velocity Nude (Velvet Teddy)" }],
          beautyProfile: {
            skinType: "Combination",
            skinTone: "Medium-Fair",
            undertone: "Neutral Warm",
            concerns: ["Dark Circles", "Acne"]
          },
          points: 450
        }
      ],
      orders: [
        {
          id: "order_1",
          userId: "user_pioneer",
          products: [
            {
              productId: "prod_maybelline_con",
              name: "Fit Me Liquid Concealer",
              brand: "Maybelline",
              price: 499,
              quantity: 1,
              selectedShade: "20 Sand",
              image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600"
            }
          ],
          amount: 499,
          status: "Shipped",
          date: "2026-06-10"
        }
      ],
      skinReports: [
        {
          id: "report_1",
          userId: "user_pioneer",
          score: 82,
          concerns: {
            acne: { score: 12, status: "Moderate", info: "Mild hormonal congestion found around cheek areas." },
            darkCircles: { score: 28, status: "Needs Attention", info: "Visible darkness under the lower eye orbitals, typical of exhaustion or high screen time." },
            dryness: { score: 7, status: "Good", info: "Hydration levels are well-retained, moist and supple." },
            oiliness: { score: 18, status: "Moderate", info: "Slight sebum congestion detected in the central T-zone." },
            pigmentation: { score: 4, status: "Good", info: "Skin tone uniformity is high; no major sun-spots detected." },
            pores: { score: 9, status: "Good", info: "Surface pores are minimized and elastic." }
          },
          recommendedProductIds: ["prod_clinique_ms", "prod_maybelline_con"],
          timestamp: "2026-06-11T12:00:00.000Z"
        }
      ],
      communityPosts: seedPosts
    };

    this.init();
  }

  private init() {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.data, ...parsed };
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Error loading database, using memory-only system:", e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing database:", e);
    }
  }

  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProduct(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public addProduct(p: Product) {
    this.data.products.push(p);
    this.save();
  }

  public updateProduct(id: string, updated: Partial<Product>) {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updated } as Product;
      this.save();
    }
  }

  public deleteProduct(id: string) {
    this.data.products = this.data.products.filter((p) => p.id !== id);
    this.save();
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUser(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public updateUser(id: string, updated: Partial<User>) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updated } as User;
      this.save();
    }
  }

  public getOrders(): Order[] {
    return this.data.orders;
  }

  public addOrder(o: Order) {
    this.data.orders.push(o);
    this.save();
  }

  public updateOrder(id: string, status: Order["status"]) {
    const order = this.data.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      this.save();
    }
  }

  public getSkinReports(): SkinAnalysisReport[] {
    return this.data.skinReports;
  }

  public addSkinReport(r: SkinAnalysisReport) {
    this.data.skinReports.push(r);
    this.save();
  }

  public getCommunityPosts(): CommunityPost[] {
    return this.data.communityPosts;
  }

  public addCommunityPost(p: CommunityPost) {
    this.data.communityPosts.unshift(p); // Add new post to start of feed
    this.save();
  }

  public addCommentToPost(postId: string, comment: CommunityComment) {
    const post = this.data.communityPosts.find((p) => p.id === postId);
    if (post) {
      post.comments.push(comment);
      this.save();
    }
  }

  public likePost(postId: string) {
    const post = this.data.communityPosts.find((p) => p.id === postId);
    if (post) {
      post.likes += 1;
      this.save();
    }
  }
}

export const dbStore = new StorageManager();
