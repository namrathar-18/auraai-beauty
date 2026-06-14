import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { PlusCircle, Edit3, Trash2, CheckCircle, RefreshCw, BarChart2, Shield, Settings, Sliders, DollarSign, Database, Brain } from "lucide-react";

interface AdminDashboardProps {
  products: Product[];
  onProductsUpdated: () => void;
}

export default function AdminDashboard({ products, onProductsUpdated }: AdminDashboardProps) {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<"Analytics" | "Products">("Analytics");

  // Create Product states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("Lipsticks");
  const [price, setPrice] = useState<number>(850);
  const [stock, setStock] = useState<number>(40);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [products]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      brand,
      category,
      price: Number(price),
      stock: Number(stock),
      image: imageUrl || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
      description,
      shades: ["Standard Shade"],
      ingredients: ["Aqua", "Tocopheryl Acetate"],
    };

    try {
      let res;
      if (isEditing && editingId) {
        res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        onProductsUpdated();
        resetForm();
        alert("🎉 Database successfully adjusted!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (prod: Product) => {
    setIsEditing(true);
    setEditingId(prod.id);
    setName(prod.name);
    setBrand(prod.brand);
    setCategory(prod.category);
    setPrice(prod.price);
    setStock(prod.stock || 50);
    setImageUrl(prod.image);
    setDescription(prod.description);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this item from the catalog registry?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        onProductsUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setName("");
    setBrand("");
    setCategory("Lipsticks");
    setPrice(999);
    setStock(50);
    setImageUrl("");
    setDescription("");
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="admin-management-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-rose-100">
        <div>
          <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 w-fit">
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            <span>AuraAI Command Center</span>
          </span>
          <h1 className="text-3xl font-light font-display mt-2">
            Admin <span className="font-semibold italic text-slate-800">Console Gate</span>
          </h1>
        </div>

        {/* Console Sub Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 shrink-0">
          {(["Analytics", "Products"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                resetForm();
              }}
              className={`px-4 py-2 font-bold text-xs rounded-xl cursor-pointer transition-all ${
                activeSubTab === tab ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === "Analytics" && (
        <div className="space-y-6">
          {/* Top row cards */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-bold">Querying analytics telemetries...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-3xs flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                    Gross sales revenue
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">
                      ₹{analytics?.totalSales?.toLocaleString() || "1,240"}
                    </h3>
                    <p className="text-[9px] text-emerald-600 font-bold mt-1">▲ 14.8% vs last month</p>
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-3xs flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                    Total order volume
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">
                      {analytics?.totalOrders || "0"}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">Real-time express orders</p>
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-3xs flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                    Catalog Products count
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">
                      {analytics?.totalProducts || "0"}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">In local store memory</p>
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-3xs flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                    AI Scans completed
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mt-2">
                      {analytics?.totalDiagnosticsDone || "0"}
                    </h3>
                    <p className="text-[9px] text-indigo-600 font-bold mt-1">Computer vision active scans</p>
                  </div>
                </div>
              </div>

              {/* Middle row: AI Telemetry Analysis split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* AI Feature Weights */}
                <div className="lg:col-span-4 bg-white p-6 border border-slate-100 rounded-3xl shadow-3xs">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-indigo-500" />
                    <span>AI Module Usage share</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                        <span>Skin Scan Diagnostician</span>
                        <span>{analytics?.aiFeatureUsage?.skinAnalysis || 35} hits</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                        <span>Neural Shade Matching</span>
                        <span>{analytics?.aiFeatureUsage?.shadeMatcher || 48} hits</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-pink-500 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                        <span>AuraBeautyGPT Assistant</span>
                        <span>{analytics?.aiFeatureUsage?.beautyAssistant || 124} chats</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-slate-900 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                        <span>Routine Planner calendar</span>
                        <span>{analytics?.aiFeatureUsage?.routinePlanner || 65} curations</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-amber-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales growth line display chart */}
                <div className="lg:col-span-8 bg-white p-6 border border-slate-100 rounded-3xl shadow-3xs">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Aura Monthly Growth (MERN DB dynamic aggregates)</span>
                  </h3>
                  
                  {/* Styled clean chart mockup utilizing css bars */}
                  <div className="flex items-end justify-between h-36 pt-4 border-b border-slate-100">
                    {analytics?.salesGrowth?.map((g: any, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        {/* Interactive tooltip */}
                        <span className="hidden group-hover:block absolute bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-md -translate-y-8 font-bold">
                          ₹{g.sales.toLocaleString()}
                        </span>
                        <div
                          className="w-8 md:w-12 bg-gradient-to-t from-pink-400 to-indigo-500 rounded-t-lg hover:brightness-95 transition-all"
                          style={{
                            height: `${(g.sales / 300000) * 100}px`,
                          }}
                        ></div>
                        <span className="text-[10px] text-slate-400 font-bold">{g.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-[10px] text-slate-500 mt-3 text-right italic">
                    *Graph calculated by combing server completed orders + active loyalty point multipliers.
                  </p>
                </div>
              </div>

              {/* Order Telemetry Logs */}
              <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-3xs">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-4">
                  Recent Sales Telemetry
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-500">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Products</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Dispatch Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics?.recentOrders?.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400">
                            No orders placed yet. Add items to bag and checkout inside Marketplace!
                          </td>
                        </tr>
                      ) : (
                        analytics?.recentOrders?.map((ord: any) => (
                          <tr key={ord.id}>
                            <td className="p-3 font-bold text-slate-850 font-mono">{ord.id}</td>
                            <td className="p-3 max-w-xs truncate font-bold text-slate-700">
                              {ord.products.map((item: any) => `${item.name} (x${item.quantity})`).join(", ")}
                            </td>
                            <td className="p-3 font-bold text-slate-900">₹{ord.amount}</td>
                            <td className="p-3">
                              <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-bold">
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-3 font-mono">{ord.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeSubTab === "Products" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Add / Edit item */}
          <div className="lg:col-span-5 bg-white p-6 border border-slate-100 rounded-3xl shadow-3xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1">
              {isEditing ? <Edit3 className="w-4 h-4 text-indigo-500" /> : <PlusCircle className="w-4 h-4 text-pink-500" />}
              <span>{isEditing ? "Modify Product Details" : "Insert New Product Entry"}</span>
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk Blush"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.A.C"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-slate-850 text-xs p-3 border border-slate-100 bg-white rounded-xl"
                  >
                    <option value="Lipsticks">Lipsticks</option>
                    <option value="Foundations">Foundations</option>
                    <option value="Concealers">Concealers</option>
                    <option value="Blush">Blush</option>
                    <option value="Eyeliners">Eyeliners</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Fragrances">Fragrances</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Detailed description</label>
                <textarea
                  placeholder="Insert cosmetic details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 text-slate-800 text-xs p-3 border border-slate-100 rounded-xl resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 text-xs rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {isEditing ? "Update Product Records" : "Insert into Database"}
                </button>
              </div>
            </form>
          </div>

          {/* Right side: Catalog list with Update and Delete */}
          <div className="lg:col-span-7 bg-white p-5 border border-slate-100 rounded-3xl shadow-3xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex justify-between items-center">
              <span>Catalog Registry Items ({products.length})</span>
              <span className="text-[10px] text-indigo-600 font-mono">CRUDS LIVE</span>
            </h3>

            <div className="overflow-y-auto max-h-[480px] space-y-2">
              {products.map((p) => {
                const outFlag = (p.stock || 50) === 0;
                return (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100/60"
                  >
                    <div className="flex items-center gap-3 pr-2 min-w-0">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate" title={p.name}>
                          {p.name}
                        </h4>
                        <p className="text-[9px] text-slate-400 block truncate">
                          {p.brand} • {p.category} • <span className="font-extrabold text-slate-700">₹{p.price}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 items-center shrink-0">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full mr-2 ${outFlag ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"}`}>
                        {outFlag ? "Out" : `${p.stock || 45} left`}
                      </span>

                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Edit entry"
                        id={`product-edit-${p.id}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-rose-50 hover:text-rose-650 transition-colors cursor-pointer"
                        title="Delete product"
                        id={`product-delete-${p.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
