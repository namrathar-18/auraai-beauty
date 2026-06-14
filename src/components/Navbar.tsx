import React from "react";
import { ActiveTab, User } from "../types";
import { Sparkles, ShoppingBag, Heart, ShieldAlert, Award, UserCheck } from "lucide-react";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User | null;
  cartCount: number;
  wishlistCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  cartCount,
  wishlistCount,
}: NavbarProps) {
  const navItems: { id: ActiveTab; label: string; icon?: React.ReactNode }[] = [
    { id: "Marketplace", label: "Shop" },
    { id: "VirtualStudio", label: "Virtual Studio" },
    { id: "SkinAnalyzer", label: "AI Skin Scan" },
    { id: "ShadeMatch", label: "Shade Finder" },
    { id: "BeautyGPT", label: "Beauty GPT" },
    { id: "RoutinePlanner", label: "Routines" },
    { id: "Community", label: "Community" },
  ];

  return (
    <nav className="sticky top-0 h-20 px-4 md:px-12 flex items-center justify-between border-b border-pink-100/80 bg-white/70 backdrop-blur-md z-50 shadow-xs">
      {/* Brand Logo */}
      <button
        onClick={() => setActiveTab("Home")}
        className="flex items-center gap-2.5 cursor-pointer group text-left focus:outline-hidden"
        id="navbar-brand-logo"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-indigo-400 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-all">
          A
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600">
            AURA AI
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Beauty Consultant
          </span>
        </div>
      </button>

      {/* Tabs */}
      <div className="hidden lg:flex gap-1 xl:gap-4 text-sm font-medium text-slate-600">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-full transition-all cursor-pointer border ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white font-semibold shadow-xs"
                  : "border-transparent hover:bg-rose-50/50 hover:text-rose-600"
              }`}
              id={`nav-item-${item.id}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Side Widgets */}
      <div className="flex items-center gap-4">
        {/* Loyalty Points display */}
        {user && (
          <div 
            onClick={() => setActiveTab("Orders")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-xs text-amber-700 font-medium cursor-pointer hover:shadow-xs transition-shadow"
            title="Your Reward Points - Shop to earn 10% cash back!"
          >
            <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{user.points || 0} pts</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setActiveTab("Marketplace")}
          className="relative p-2 text-slate-600 hover:text-rose-500 transition-colors cursor-pointer rounded-full hover:bg-rose-50/50"
          title="Wishlisted items"
          id="navbar-wishlist-btn"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart Button */}
        <button
          onClick={() => setActiveTab("Marketplace")}
          className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer rounded-full hover:bg-indigo-50/50"
          title="Shopping Bags"
          id="navbar-cart-btn"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </button>

        {/* Orders button */}
        <button
          onClick={() => setActiveTab("Orders")}
          className={`p-2 rounded-full cursor-pointer transition-colors ${
            activeTab === "Orders" 
              ? "bg-slate-100 text-slate-900" 
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title="Order Status & Profile"
        >
          <UserCheck className="w-5 h-5" />
        </button>

        {/* Admin Switcher */}
        <button
          onClick={() => setActiveTab(activeTab === "Admin" ? "Home" : "Admin")}
          className={`flex items-center justify-center p-2 rounded-full cursor-pointer transition-all ${
            activeTab === "Admin"
              ? "bg-rose-500 text-white rotate-12 shadow-sm"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
          title="Admin Panel & CRUD System"
          id="navbar-admin-toggle-btn"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
