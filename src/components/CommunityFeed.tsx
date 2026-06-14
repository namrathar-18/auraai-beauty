import React, { useState, useEffect } from "react";
import { Heart, MessageSquare, Tag, PlusCircle, User, Sparkles, Send, RefreshCw, Star } from "lucide-react";
import { CommunityPost } from "../types";

export default function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  
  // Create variables
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [imageLink, setImageLink] = useState<string>("");

  // Comment input state dictionary mapped by post ID
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const fetchCommunity = async () => {
    try {
      const res = await fetch("/api/community");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      );
      await fetch("/api/community/" + postId + "/like", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/community/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, newComment] }
              : p
          )
        );
        // Clear input
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const tagsArr = tagsInput
      .split(",")
      .map((t) => t.trim().replace("#", ""))
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags: tagsArr,
          image: imageLink || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [data, ...prev]);
        setShowCreateModal(false);
        setTitle("");
        setDescription("");
        setTagsInput("");
        setImageLink("");
        alert("🎉 Congratulations! Look Shared. 30 Loyalty reward points have been loaded to your Aura profile!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="community-main-section">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-rose-100">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest">
            AuraAI Beauty Community
          </span>
          <h1 className="text-3xl font-light font-display mt-2">
            Beauty <span className="font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">Circle Feed</span>
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-transform cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-pink-300" />
          <span>Post Look (+30 pts)</span>
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-pink-100 shadow-2xl relative animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Share Your Glow Look</span>
            </h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Look Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Dewy Rose Glow Makeup routine!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl focus:ring-1 focus:ring-rose-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Details & Trick Secrets</label>
                <textarea
                  required
                  placeholder="Tell the community how you did it! Mentions creams or liners..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 text-slate-800 text-xs p-3 border border-slate-100 rounded-xl focus:ring-1 focus:ring-rose-300 focus:outline-hidden resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tags (Comma split)</label>
                  <input
                    type="text"
                    placeholder="Bridal, MatteLip, Lakme"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl focus:ring-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageLink}
                    onChange={(e) => setImageLink(e.target.value)}
                    className="w-full text-slate-800 text-xs p-3 border border-slate-100 rounded-xl focus:ring-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs rounded-xl font-bold hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Broadcast Look
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-medium">Loading Community Curation...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-medium border border-dashed border-slate-200 rounded-3xl">
          No posts created yet. Share yours first to earn rewards!
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-5 md:p-6 shadow-xs border border-pink-100/60 transition-shadow hover:shadow-sm"
              id={`community-post-${post.id}`}
            >
              {/* User row */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {post.userAvatar ? (
                    <img
                      src={post.userAvatar}
                      alt={post.username}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-sm">
                      {post.username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-800">@{post.username}</span>
                    {post.userRole && (
                      <span className="text-[9px] bg-pink-100/80 text-pink-700 px-2.5 py-0.5 rounded-full font-bold">
                        {post.userRole}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{post.date}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-800 leading-snug mb-1">{post.title}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans mb-3">{post.description}</p>

              {/* Image if available */}
              {post.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border max-h-[300px]">
                  <img
                    src={post.image}
                    alt="Transformation preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Tags row */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2.5 py-1 rounded-md font-medium flex items-center gap-0.5"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>{tg}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Action Like Comments bars */}
              <div className="flex items-center gap-6 pt-3.5 border-t border-slate-50">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors text-xs font-bold cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1 text-slate-500 text-xs font-bold font-sans">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} Comments</span>
                </div>
              </div>

              {/* Comments sub feed section */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 p-3 bg-slate-50/50 rounded-2xl space-y-2 border border-slate-50">
                  {post.comments.map((comm, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-extrabold text-slate-700 mr-1.5">@{comm.user}:</span>
                      <span className="text-slate-600 leading-normal">{comm.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Write comment input inline */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment(post.id, commentInputs[post.id] || "");
                }}
                className="mt-3 flex gap-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Appreciate look or ask about shades..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  className="flex-1 bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-100 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!(commentInputs[post.id] || "").trim()}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer disabled:bg-slate-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
