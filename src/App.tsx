import React, { useState, useEffect } from "react";
import { ActiveTab, Product, User, Order, CartItem, BeautyProfile } from "./types";
import Navbar from "./components/Navbar";
import Marketplace from "./components/Marketplace";
import AISkinAnalyzer from "./components/AISkinAnalyzer";
import AIShadeFinder from "./components/AIShadeFinder";
import VirtualMakeupStudio from "./components/VirtualMakeupStudio";
import AIBeautyGPT from "./components/AIBeautyGPT";
import MakeupRoutinePlanner from "./components/MakeupRoutinePlanner";
import CommunityFeed from "./components/CommunityFeed";
import AdminDashboard from "./components/AdminDashboard";

import { Sparkles, Heart, ShoppingBag, Eye, Award, CheckCircle, ClipboardList, ShieldAlert, ArrowRight, Star, Settings } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Home");
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Profile customization triggers
  const [profileSkinType, setProfileSkinType] = useState<string>("Combined");
  const [profileSkinTone, setProfileSkinTone] = useState<string>("Medium");
  const [profileSkinUndertone, setProfileSkinUndertone] = useState<string>("Warm");
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);

  // Fetch initial state
  const loadDatabaseState = async () => {
    try {
      // Products
      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      // User session
      const userRes = await fetch("/api/user/session");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        setProfileSkinType(userData.beautyProfile?.skinType || "Combined");
        setProfileSkinTone(userData.beautyProfile?.skinTone || "Medium");
        setProfileSkinUndertone(userData.beautyProfile?.undertone || "Warm");
      }

      // Orders
      const orderRes = await fetch("/api/user/orders");
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

    } catch (err) {
      console.error("Failed to load initial AuraAI state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseState();
  }, []);

  // Sync products refetch
  const handleProductsUpdated = async () => {
    const prodRes = await fetch("/api/products");
    if (prodRes.ok) {
      const prodData = await prodRes.json();
      setProducts(prodData);
    }
  };

  // Add items to bag handler
  const handleAddProductToCart = async (productId: string, shade?: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, selectedShade: shade || "" }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity handler
  const handleUpdateCartQty = async (productId: string, quantity: number) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/cart/quantity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle wishlist item
  const handleToggleWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mock checkout logic (subtracts stock and increases reward points +10%)
  const handleCheckout = async () => {
    if (!user || user.cart.length === 0) return;
    try {
      const res = await fetch("/api/user/cart/checkout", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setOrders(data.orders);
        await handleProductsUpdated(); // reload stock count
        setActiveTab("Orders");
        alert(`🛒 Order Placed successfully! You have earned loyalty credit points. Review tracking details on your profile.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Custom user profile characteristics update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType: profileSkinType,
          skinTone: profileSkinTone,
          undertone: profileSkinUndertone,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setTimeout(() => {
          setUpdatingProfile(false);
          alert("✨ Custom Aura beauty characteristics synced successfully!");
        }, 800);
      }
    } catch (err) {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-radial from-rose-50 to-indigo-50">
        <div className="text-center animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-indigo-400 flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-md">
            A
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Compiling AuraAI Curation Base...
          </p>
        </div>
      </div>
    );
  }

  // Get Cart items count
  const cartCount = user?.cart.reduce((acc, c) => acc + c.quantity, 0) || 0;
  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden border-t-4 border-slate-900" id="main-application-frame">
      
      {/* Absolute blurry pink/purple glow balls mimicking high end Apple product landing page design */}
      <div className="absolute top-10 left-[-15%] w-96 h-96 rounded-full glow-bg blur-[95px] opacity-70" />
      <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] rounded-full glow-bg blur-[110px] opacity-50" />

      {/* Modern navigation bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <main className="flex-1 z-10 relative">
        
        {/* Render Views dynamically based on active tab selection */}
        {activeTab === "Home" && (
          <div className="max-w-6xl mx-auto py-12 px-4 md:px-12 space-y-16" id="home-view-container">
            
            {/* Elegant Hero Pitch */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-[10px] uppercase font-bold tracking-widest">
                Tomorrow's Cosmetics, Today
              </span>
              <h1 className="text-5xl md:text-7xl font-light font-display tracking-tight text-slate-900">
                Personalized Beauty <span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600">Perfected by AI</span>
              </h1>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                Connect your unique facial specifications with precise formulation remedies. AuraAI uses advanced computer vision & neural tone color-mapping to guide your shopping choices securely.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                <button
                  onClick={() => setActiveTab("Marketplace")}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-md hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Explore Cosmetic Catalog</span>
                  <ArrowRight className="w-4 h-4 text-pink-300" />
                </button>

                <button
                  onClick={() => setActiveTab("SkinAnalyzer")}
                  className="px-6 py-3.5 bg-white border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-slate-900 rounded-full text-xs font-bold shadow-2xs hover:bg-rose-50/20 cursor-pointer"
                >
                  Run Skin Scan Analysis
                </button>
              </div>
            </div>

            {/* Quick Profile config widget - USP */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-pink-100/60 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 text-left">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-1">
                  Aura Profile Card
                </span>
                <h3 className="text-xl font-bold text-slate-800 leading-snug">
                  Fine-Tune Your Diagnostic Specs
                </h3>
                <p className="text-xs text-slate-400 mt-1 lines-spaced">
                  These values are used to dynamically filter foundations and cosmetics matching your skin. Change them any time.
                </p>
                
                {user && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                      {user.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-semibold">Logged Member</span>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form config options */}
              <form onSubmit={handleUpdateProfile} className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                {/* Skin Type */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Skin Surface</label>
                  <select
                    value={profileSkinType}
                    onChange={(e) => setProfileSkinType(e.target.value)}
                    className="w-full text-xs text-slate-800 p-2.5 bg-slate-50 border border-slate-150 rounded-xl bg-white"
                  >
                    <option value="Dry">Dry / Dehydrated</option>
                    <option value="Oily">Oily / Sebum Active</option>
                    <option value="Sensitive">Sensitive / Red Skin</option>
                    <option value="Combined">Combined T-Zone</option>
                    <option value="Normal">Normal Skin</option>
                  </select>
                </div>

                {/* Skin Tone */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Skin Tone Shade</label>
                  <select
                    value={profileSkinTone}
                    onChange={(e) => setProfileSkinTone(e.target.value)}
                    className="w-full text-xs text-slate-800 p-2.5 bg-slate-50 border border-slate-150 rounded-xl bg-white"
                  >
                    <option value="Very Fair">Fair Porcelain</option>
                    <option value="Fair">Fair Natural</option>
                    <option value="Medium">Medium Wheatish</option>
                    <option value="Dusky">Dusky Saffron</option>
                    <option value="Deep">Deep Chocolate</option>
                  </select>
                </div>

                {/* Undertone */}
                <div className="relative">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Undertone</label>
                  <select
                    value={profileSkinUndertone}
                    onChange={(e) => setProfileSkinUndertone(e.target.value)}
                    className="w-full text-xs text-slate-800 p-2.5 bg-slate-50 border border-slate-150 rounded-xl bg-white"
                  >
                    <option value="Warm">Warm Gold</option>
                    <option value="Cool">Cool Pinkish</option>
                    <option value="Neutral">Neutral Balance</option>
                  </select>
                </div>

                {/* Sync Trigger button */}
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer w-full sm:w-auto"
                  >
                    {updatingProfile ? "Syncing specifications..." : "Sync Specifications"}
                  </button>
                </div>
              </form>
            </div>

            {/* AI Capability showcase boxes */}
            <div className="space-y-6">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider text-center block">
                Explore Neural AI Modules
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Try On */}
                <div
                  onClick={() => setActiveTab("VirtualStudio")}
                  className="p-6 bg-white hover:bg-pink-50/5/10 border border-pink-150/40 rounded-3xl cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between h-[180px]"
                >
                  <div>
                    <span className="p-2 bg-pink-50 text-pink-600 rounded-lg text-xs font-bold inline-block">01 try-ons</span>
                    <h4 className="text-sm font-bold text-slate-850 mt-3">Try-on Simulation Mirror</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Virtually overlay rich lip colors and blush on a model or selfie portrait.</p>
                  </div>
                  <span className="text-[10px] text-pink-600 font-bold hover:underline inline-flex items-center gap-0.5">
                    <span>Open Mirror</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Skin analyzer */}
                <div
                  onClick={() => setActiveTab("SkinAnalyzer")}
                  className="p-6 bg-white hover:bg-indigo-55/10 border border-indigo-150/40 rounded-3xl cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between h-[180px]"
                >
                  <div>
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold inline-block">02 Dermal scan</span>
                    <h4 className="text-sm font-bold text-slate-850 mt-3">Computer Vision Scan</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-sans">Analyze dryness, dark circles and pores with precise rating diagnostics.</p>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5">
                    <span>Open Scanner</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Shade matcher */}
                <div
                  onClick={() => setActiveTab("ShadeMatch")}
                  className="p-6 bg-white hover:bg-violet-55/10 border border-violet-150/45 rounded-3xl cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between h-[180px]"
                >
                  <div>
                    <span className="p-2 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold inline-block">03 shades match</span>
                    <h4 className="text-sm font-bold text-slate-850 mt-3">Neural Shade Finder</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Find cosmetics containing density pigment values compatible with your tint.</p>
                  </div>
                  <span className="text-[10px] text-violet-600 font-bold hover:underline inline-flex items-center gap-0.5">
                    <span>Find Shades</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* BeautyGPT */}
                <div
                  onClick={() => setActiveTab("BeautyGPT")}
                  className="p-6 bg-white hover:bg-rose-55/10 border border-rose-150/40 rounded-3xl cursor-pointer hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between h-[180px]"
                >
                  <div>
                    <span className="p-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold inline-block">04 chat advisor</span>
                    <h4 className="text-sm font-bold text-slate-850 mt-3">AuraBeautyGPT Line</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-sans">Chat directly with an AI cosmetic scientist for bridal guides.</p>
                  </div>
                  <span className="text-[10px] text-rose-600 font-bold hover:underline inline-flex items-center gap-0.5">
                    <span>Consult Advisor</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Promotional offer block */}
            <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl text-white text-left flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="text-amber-400 text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                  <Award className="w-4 h-4 animate-bounce" />
                  <span>Aura Premium Loyalty Club</span>
                </span>
                <h3 className="text-xl md:text-2xl font-bold mt-2">Earn 10% Cash-Back (Aura Points) on Checkout!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Redeem reward points inside product purchases. Post looks to community grid (+30 points) or simply buy items to gain credit multipliers.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("Marketplace")}
                className="px-6 py-3 bg-white text-slate-950 text-xs rounded-xl font-bold hover:bg-slate-100 cursor-pointer text-center shrink-0"
              >
                Shop Now
              </button>
            </div>

          </div>
        )}

        {activeTab === "Marketplace" && (
          <Marketplace
            products={products}
            userWishlist={user?.wishlist || []}
            userCart={user?.cart || []}
            onToggleWishlist={handleToggleWishlist}
            onAddProductToCart={handleAddProductToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onCheckout={handleCheckout}
          />
        )}

        {activeTab === "SkinAnalyzer" && (
          <AISkinAnalyzer
            onAddProductToCart={handleAddProductToCart}
            products={products}
          />
        )}

        {activeTab === "ShadeMatch" && (
          <AIShadeFinder
            onAddProductToCart={handleAddProductToCart}
            products={products}
          />
        )}

        {activeTab === "VirtualStudio" && (
          <VirtualMakeupStudio
            onAddProductToCart={handleAddProductToCart}
            products={products}
          />
        )}

        {activeTab === "BeautyGPT" && (
          <AIBeautyGPT
            onAddProductToCart={handleAddProductToCart}
            products={products}
          />
        )}

        {activeTab === "RoutinePlanner" && (
          <MakeupRoutinePlanner
            onAddProductToCart={handleAddProductToCart}
            products={products}
          />
        )}

        {activeTab === "Community" && (
          <CommunityFeed />
        )}

        {activeTab === "Admin" && (
          <AdminDashboard
            products={products}
            onProductsUpdated={handleProductsUpdated}
          />
        )}

        {/* PROFILE AND ORDERS LIST TRACKING */}
        {activeTab === "Orders" && (
          <div className="max-w-4xl mx-auto py-8 px-4" id="order-and-loyalty-tier-dashboard">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest">
                Account & Club Curation
              </span>
              <h1 className="text-3xl font-light font-display mt-3">
                Aura <span className="font-semibold italic text-slate-800">VIP Profile</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Profile card left and loyalty status */}
              <div className="md:col-span-1 bg-white p-5 border border-pink-100/60 rounded-3xl shadow-3xs flex flex-col gap-4">
                <div className="text-center pb-4 border-b">
                  <div className="w-16 h-16 bg-gradient-to-tr from-pink-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-white font-black text-xl shadow-xs">
                    {user?.name[0]?.toUpperCase() || "A"}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-3">{user?.name}</h3>
                  <span className="text-[10px] text-slate-400 block">{user?.email}</span>
                </div>

                {/* Loyalty Tier information display */}
                <div className="p-3 bg-amber-50/50 border border-amber-250/40 rounded-2xl">
                  <span className="text-[9px] uppercase font-extrabold text-amber-700 tracking-wider">
                    Tier Status Class:
                  </span>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-bold text-slate-800">Silver Patron</span>
                    <span className="text-xs font-extrabold text-amber-600">{user?.points || 0} pts</span>
                  </div>

                  <p className="text-[9px] text-slate-400 mt-1 lines-spaced font-sans">
                    Reach 1,000 points to upgrade to **Gold Status** and trigger free premium shipping.
                  </p>
                </div>

                {/* Dynamic Skin specifications */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Dynamic skin specs:
                  </span>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Surface Condition:</span>
                      <span className="font-bold text-slate-800">{user?.beautyProfile?.skinType || "Combined"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reflective Tone:</span>
                      <span className="font-bold text-slate-800">{user?.beautyProfile?.skinTone || "Medium"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Undertone Hue:</span>
                      <span className="font-bold text-slate-800">{user?.beautyProfile?.undertone || "Warm"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Lists tracking Right side */}
              <div className="md:col-span-2 bg-white p-5 border border-pink-100/60 rounded-3xl shadow-3xs">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-rose-500" />
                  <span>My Active Purchases & Logs ({orders.length})</span>
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 border border-dashed rounded-2xl bg-slate-50/30">
                    No active purchases found. Choose cosmetics inside Shop tab to checkout.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 border border-rose-50 rounded-2xl bg-rose-50/5 hover:border-pink-200 transition-colors"
                      >
                        <div className="flex justify-between items-center text-xs pb-2 border-b">
                          <div>
                            <span className="text-slate-450 block text-[10px]">Purchase Id</span>
                            <span className="font-bold font-mono text-slate-800 text-[10px]">{ord.id}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-450 block text-[10px]">Placed On</span>
                            <span className="font-bold text-slate-700">{ord.date}</span>
                          </div>
                        </div>

                        {/* Order Products */}
                        <div className="py-3 space-y-2">
                          {ord.products.map((p, i) => (
                            <div key={i} className="flex gap-3 justify-between items-start text-xs">
                              <div>
                                <p className="font-bold text-slate-850 truncate">{p.name}</p>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {p.brand} {p.selectedShade ? `• Shade: ${p.selectedShade}` : ""}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-slate-400">Qty x{p.quantity}</span>
                                <p className="font-bold text-slate-900 mt-0.5">₹{p.price * p.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status dispatch bar */}
                        <div className="pt-2 border-t flex justify-between items-center text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping"></span>
                            <span className="font-bold text-yellow-700 text-[11px] uppercase tracking-wide">
                              Status: {ord.status}
                            </span>
                          </span>

                          <div>
                            <span className="text-slate-450 text-[10px]">Secure Paid:</span>
                            <span className="font-black text-slate-900 block">₹{ord.amount}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Styled Footer under architectural guidelines */}
      <footer className="mt-14 border-t border-pink-100 bg-white/50 backdrop-blur-md py-6 text-center text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
          <p>© 2026 AuraAI Beauty Inc. All cosmetic active formulas are clinically evaluated under luxury guidelines.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab("Home")} className="hover:text-slate-650 cursor-pointer">Specs</button>
            <button onClick={() => setActiveTab("Marketplace")} className="hover:text-slate-655 cursor-pointer">Shop</button>
            <button onClick={() => setActiveTab("Admin")} className="hover:text-slate-650 cursor-pointer">CRUD portal Base</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
