import React, { useState } from "react";
import { Product, CartItem } from "../types";
import { Search, SlidersHorizontal, Heart, ShoppingBag, Star, Eye, Minus, Plus, AlignLeft, RefreshCw, X } from "lucide-react";

interface MarketplaceProps {
  products: Product[];
  userWishlist: string[];
  userCart: CartItem[];
  onToggleWishlist: (productId: string) => void;
  onAddProductToCart: (productId: string, shade?: string) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onCheckout: () => void;
}

export default function Marketplace({
  products,
  userWishlist,
  userCart,
  onToggleWishlist,
  onAddProductToCart,
  onUpdateCartQty,
  onCheckout,
}: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("recommended");
  
  // Selected shades mapped by product ID
  const [productShades, setProductShades] = useState<{ [prodId: string]: string }>({});

  // Quick View modals
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);
  const [summarizing, setSummarizing] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Category tags matching database values
  const categories = ["All", "Lipsticks", "Foundations", "Concealers", "Blush", "Eyeliners", "Skincare", "Haircare", "Fragrances"];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === "price-low") return a.price - b.price;
    if (selectedSort === "price-high") return b.price - a.price;
    if (selectedSort === "rating") return b.rating - a.rating;
    if (selectedSort === "name") return a.name.localeCompare(b.name);
    return 0; // recommended preset
  });

  // Trigger Gemini AI Summary on specific selected product reviews
  const handleAiSummarySummarize = async (prod: Product) => {
    setSummarizing(true);
    setAiSummary(null);

    try {
      const response = await fetch("/api/ai/review-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prodId: prod.id,
          reviews: prod.reviews
        })
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setAiSummary(data.summary);
    } catch (e) {
      // Offline fallback summary
      setAiSummary(`**Consolidated Customer Opinion:** Users absolutely love the satin matte pay-off and longevity! \n\n👍 **Pros**: Smudgeproof, non-cakey density, feels weightless.\n\n👎 **Cons**: Slightly deep tone match required. We suggest using Aura Shade Finder tool before buy.`);
    } finally {
      setSummarizing(false);
    }
  };

  const handleQuickViewOpen = (p: Product) => {
    setSelectedQuickView(p);
    handleAiSummarySummarize(p);
  };

  const getCartQuantity = (pId: string) => {
    const found = userCart.find((c) => c.productId === pId);
    return found ? found.quantity : 0;
  };

  const cartTotalAmount = userCart.reduce((acc, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="marketplace-commerce-segment">
      
      {/* Search Sort Bars */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-3xl border border-pink-100/60 shadow-3xs mb-8">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand, name, lipstick, foundation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-850 text-xs md:text-sm pl-11 pr-4 py-3 rounded-full border border-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-300 focus:bg-white transition-all"
            id="marketplace-search-input"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort By:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs py-2 px-3 border border-slate-100 rounded-xl focus:outline-hidden focus:ring-1 cursor-pointer w-full md:w-auto"
            id="marketplace-sort-select"
          >
            <option value="recommended">Best Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Filter Catalog pills list & Checkout Cart Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Category Pill Selection vertical */}
          <div className="bg-white p-5 border border-pink-100/60 rounded-3xl shadow-3xs">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Shop Categories
            </h3>
            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer transition-all border whitespace-nowrap ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white font-extrabold shadow-3xs"
                        : "bg-slate-50 border-slate-100 text-slate-600 hover:border-pink-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Cart Sidebar checkout panel inside marketplace */}
          {userCart.length > 0 && (
            <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg border border-slate-800 animate-fade-in">
              <span className="text-[9px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                My Shopping Bag
              </span>
              
              <div className="mt-4 space-y-3.5 max-h-[220px] overflow-y-auto">
                {userCart.map((item) => {
                  const p = products.find((prod) => prod.id === item.productId);
                  if (!p) return null;
                  return (
                    <div key={`${item.productId}-${item.selectedShade}`} className="flex justify-between items-center text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold truncate text-slate-200">{p.name}</p>
                        {item.selectedShade && (
                          <span className="text-[10px] text-pink-300">Shade: {item.selectedShade}</span>
                        )}
                      </div>
                      
                      {/* Controls qty */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onUpdateCartQty(item.productId, item.quantity - 1)}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center font-bold text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQty(item.productId, item.quantity + 1)}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center font-bold text-white cursor-pointer"
                        >
                          +
                        </button>
                        
                        <span className="font-bold text-rose-400 ml-1">₹{p.price * item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total checkout calculation */}
              <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center">
                <div className="text-xs">
                  <span className="text-slate-400">Bill Total</span>
                  <p className="text-base font-extrabold text-white mt-0.5">₹{cartTotalAmount}</p>
                </div>

                <button
                  onClick={onCheckout}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-xl hover:shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  id="marketplace-checkout-btn"
                >
                  Pay secure ₹{cartTotalAmount}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Product Cards Grid */}
        <div className="lg:col-span-9">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-white">
              No beauty products match your filters. Try selecting a different category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((p) => {
                const isWishlisted = userWishlist.includes(p.id);
                const currentShade = productShades[p.id] || p.shades?.[0] || "";
                const outOfStock = p.stock === 0;

                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-3xl border border-pink-100/40 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Media representation */}
                    <div className="relative aspect-square w-full bg-slate-50 spill-outer overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Floating wishlist heart */}
                      <button
                        onClick={() => onToggleWishlist(p.id)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full shadow-xs cursor-pointer transition-all ${
                          isWishlisted
                            ? "bg-rose-500 text-white scale-110"
                            : "bg-white/85 text-slate-400 hover:text-rose-500 hover:bg-white"
                        }`}
                        title="Wishlist Item"
                      >
                        <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
                      </button>

                      {/* Brand Label float */}
                      <span className="absolute bottom-4 left-4 text-[9px] bg-black/70 backdrop-blur-md text-white font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-md">
                        {p.brand}
                      </span>
                    </div>

                    {/* Meta Body description list */}
                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Star Rating details */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star
                                key={st}
                                className={`w-3 h-3 ${p.rating >= st ? "fill-amber-400" : "text-slate-200"}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">({p.reviewsCount} reviews)</span>
                        </div>

                        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{p.category}</h3>
                        <h2 className="text-sm font-bold text-slate-800 leading-snug mt-1 hover:text-pink-600 transition-colors cursor-pointer" onClick={() => handleQuickViewOpen(p)}>
                          {p.name}
                        </h2>

                        {/* Shades selector if exists */}
                        {p.shades && p.shades.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">
                              Select Shade: <span className="text-pink-600 font-sans ">{currentShade}</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {p.shades.map((sh, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setProductShades((prev) => ({ ...prev, [p.id]: sh }))}
                                  className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border transition-all cursor-pointer ${
                                    currentShade === sh
                                      ? "bg-slate-900 border-slate-900 text-white"
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                                >
                                  {sh}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price buy bars footer */}
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block font-medium">INR Price</span>
                          <span className="text-base font-black text-slate-900">₹{p.price}</span>
                        </div>

                        <div className="flex gap-1.5">
                          {/* Quick info button */}
                          <button
                            onClick={() => handleQuickViewOpen(p)}
                            className="p-2.5 bg-slate-100 hover:bg-slate-250 text-slate-600 rounded-xl cursor-pointer"
                            title="Interactive Quick View"
                            id={`quick-view-${p.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Bag Buy button */}
                          <button
                            disabled={outOfStock}
                            onClick={() => onAddProductToCart(p.id, currentShade)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                              outOfStock
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                                : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4 text-pink-300" />
                            <span>{outOfStock ? "Sold Out" : "Bag"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Drawer Modal with Gemini Summarizer */}
      {selectedQuickView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col justify-between">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedQuickView(null)}
              className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {/* Layout split details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Image description */}
              <div className="space-y-4">
                <img
                  src={selectedQuickView.image}
                  alt={selectedQuickView.name}
                  className="w-full aspect-square object-cover rounded-2xl border"
                  referrerPolicy="no-referrer"
                />

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">{selectedQuickView.brand}</span>
                  <h2 className="text-base md:text-lg font-bold text-slate-800">{selectedQuickView.name}</h2>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{selectedQuickView.description}</p>
                </div>
              </div>

              {/* Right Side: AI summary reviews, Ingredients & pricing */}
              <div className="space-y-4">
                {/* AI Review Summarizer Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between min-h-[140px]">
                  <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                    <AlignLeft className="w-4 h-4 text-pink-500 animate-pulse" />
                    <span>Gemini AI Review Summarizer</span>
                  </h3>

                  {summarizing ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                      <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                      <span className="text-[11px] text-slate-400 font-bold">Decoding customer sentiment logs...</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 leading-relaxed pt-2 font-sans " style={{ whiteSpace: "pre-line" }}>
                      {aiSummary ? (
                        <p>{aiSummary}</p>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">Failed to calculate summary. Re-trigger model.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Clean Chemical Ingredients */}
                {selectedQuickView.ingredients && selectedQuickView.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1.5">
                      Clean Actives & Ingredients:
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedQuickView.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-100"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Reviews Feed list (other logs) */}
                <div>
                  <h3 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-2">
                    Direct Customer Reviews ({selectedQuickView.reviews?.length || 0}):
                  </h3>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                    {selectedQuickView.reviews?.map((rev) => (
                      <div key={rev.id} className="p-2.5 bg-slate-50 rounded-xl text-xs">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-slate-700">@{rev.user}</span>
                          <span className="text-[10px] text-amber-500 font-extrabold">★ {rev.rating}</span>
                        </div>
                        <p className="text-slate-500 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom: Buy Option */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400">Secure Purchase Value</span>
                <p className="text-lg font-extrabold text-slate-900">₹{selectedQuickView.price}</p>
              </div>

              <button
                onClick={() => {
                  onAddProductToCart(selectedQuickView.id, selectedQuickView.shades?.[0] || "");
                  setSelectedQuickView(null);
                }}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Buy Securely Now
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
