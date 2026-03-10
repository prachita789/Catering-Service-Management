import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Search, ChevronLeft, ChevronRight, UtensilsCrossed, X, Leaf, Drumstick, Tag, IndianRupee } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// ── Veg / Non-Veg badge helper ────────────────────────────────
function DietBadge({ category }) {
  const nonVeg = category?.toLowerCase().includes("non-veg");
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
      nonVeg ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
    }`}>
      {nonVeg
        ? <Drumstick className="w-3 h-3" />
        : <Leaf className="w-3 h-3" />}
      {nonVeg ? "Non-Veg" : "Veg"}
    </span>
  );
}

// ── Dish Detail Modal ─────────────────────────────────────────
function DishModal({ dish, similar, onClose, onBook }) {
  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">

        {/* ── Hero image ── */}
        <div className="relative">
          <img
            src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
            alt={dish.title}
            className="w-full h-64 object-cover rounded-t-2xl"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"; }}
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1.5 shadow transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Price tag on image */}
          <div className="absolute bottom-3 left-3 bg-amber-700 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" /> {dish.price}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6">

          {/* Title + badges */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <h2 className="text-2xl font-bold text-gray-800">{dish.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <DietBadge category={dish.category} />
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                <Tag className="w-3 h-3" /> {dish.category}
              </span>
            </div>
          </div>

          {/* Full description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            {dish.description || "A delicious dish prepared with the finest ingredients by our expert chefs, crafted especially for your special event."}
          </p>

          {/* Allergen / dietary info */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-amber-800 mb-2">🌿 Dietary Information</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
              {dish.category?.toLowerCase().includes("non-veg") ? (
                <>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">🥩 Contains Meat</span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">⚠️ Not suitable for vegetarians</span>
                </>
              ) : (
                <>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">🌱 100% Vegetarian</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">✓ No meat products</span>
                </>
              )}
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">🍽️ Freshly prepared</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">👨‍🍳 Made to order</span>
            </div>
          </div>

          {/* Add to Booking CTA */}
          <button
            onClick={onBook}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-xl font-semibold text-base transition cursor-pointer shadow-md hover:shadow-lg"
          >
            Add to Booking →
          </button>

          {/* ── Similar dishes ── */}
          {similar.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Similar Dishes</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {similar.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => onBook(s)}
                    className="shrink-0 w-32 text-left group cursor-pointer"
                    title={s.title}
                  >
                    <img
                      src={s.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"}
                      alt={s.title}
                      className="w-32 h-24 object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80"; }}
                    />
                    <p className="text-xs font-medium text-gray-700 mt-1.5 line-clamp-1 group-hover:text-amber-700 transition">{s.title}</p>
                    <p className="text-xs text-amber-600 font-bold">₹{s.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 6;

const CATEGORIES = [
  "All", "Starters", "Main Course", "Rice & Biryani",
  "Breads & Dal", "Desserts", "Beverages", "Non-Veg Specials",
];

const heroImages = [
  { url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80", title: "Exquisite Wedding Catering", subtitle: "Curated menus for your special day" },
  { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80", title: "Corporate Events Made Memorable", subtitle: "Professional catering for conferences & meetings" },
  { url: "https://images.unsplash.com/photo-1591943938734-a3dfc7e70dca?auto=format&fit=crop&w=1600&q=80", title: "Birthday Parties Full of Flavor", subtitle: "Colorful, fun menus for every celebration" },
  { url: "https://images.unsplash.com/photo-1646781652500-40015cee4917?auto=format&fit=crop&w=1600&q=80", title: "Outdoor Catering with Elegance", subtitle: "Garden buffets, BBQs, and private dinners" },
];

// ── Skeleton card for loading state ──────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex justify-between mt-2">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

const Menu = () => {
  const navigate = useNavigate();
  const [menus,          setMenus]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [currentPage,    setCurrentPage]    = useState(1);
  const [selectedDish,   setSelectedDish]   = useState(null);

  // Similar dishes — same category, excluding current
  const similarDishes = useMemo(() => {
    if (!selectedDish) return [];
    return menus
      .filter((m) => m.category === selectedDish.category && m._id !== selectedDish._id)
      .slice(0, 5);
  }, [selectedDish, menus]);

  const openDish  = useCallback((dish) => setSelectedDish(dish), []);
  const closeDish = useCallback(() => setSelectedDish(null), []);
  const goBooking = useCallback(() => { closeDish(); navigate("/booking"); }, [closeDish, navigate]);

  // Fetch menus
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api.get("/menus")
      .then((res) => { if (mounted) { setMenus(res.data || []); setLoading(false); } })
      .catch(() => { if (mounted) { setError("Failed to load menu. Please try again."); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  // Reset to page 1 when filter/search changes
  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  // Filter + search (client-side on fetched data)
  const filtered = useMemo(() => {
    let result = menus;
    if (activeCategory !== "All") result = result.filter((m) => m.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) => m.title?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [menus, activeCategory, searchQuery]);

  // Pagination
  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (p) => {
    setCurrentPage(p);
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#fffaf5] min-h-screen text-gray-800">

      {/* ── HERO CAROUSEL ── */}
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          className="h-[70vh]"
        >
          {heroImages.map((h, i) => (
            <SwiperSlide key={i}>
              <div
                className="h-[70vh] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url(${h.url})` }}
              >
                <div className="text-center text-white px-6 max-w-3xl">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{h.title}</h1>
                  <p className="text-md md:text-lg">{h.subtitle}</p>
                  <a href="#menu-section" className="inline-block mt-6 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer">
                    Explore Menu
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div id="menu-section" className="max-w-6xl mx-auto px-4 mt-10 space-y-5">

        {/* Search bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-amber-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >✕</button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-center text-sm text-gray-400">
            {filtered.length === 0
              ? "No dishes found"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} dishes`}
          </p>
        )}
      </div>

      {/* ── MENU GRID ── */}
      <main className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our <span className="text-amber-700">Signature Dishes</span>
        </h2>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-14 h-14 text-amber-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-14 h-14 text-amber-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No dishes found.</p>
            <p className="text-gray-400 text-sm mb-4">Try a different category or search term.</p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Dish grid */}
        {!loading && !error && paginated.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {paginated.map((dish) => (
              <article
                key={dish._id || dish.title}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fadeIn"
              >
                <img
                  src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"}
                  alt={dish.title}
                  className="h-56 w-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"; }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-800">{dish.title}</h3>
                    <span className="font-bold text-amber-700 whitespace-nowrap">₹{dish.price}</span>
                  </div>
                  <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mb-2 font-medium">
                    {dish.category}
                  </span>
                  <p className="text-gray-600 text-sm line-clamp-2">{dish.description}</p>
                  <button
                    onClick={() => openDish(dish)}
                    className="mt-4 w-full block text-center bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  page === currentPage
                    ? "bg-amber-700 text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* ── CTA ── */}
      <section className="bg-amber-700 text-white text-center py-16 mt-12">
        <h3 className="text-2xl font-bold mb-3">Planning an event? Let's make it unforgettable.</h3>
        <p className="mb-6">Choose from our curated menus or request a custom catering package.</p>
        <Link to="/booking" className="bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer">
          Book Catering
        </Link>
      </section>

      {/* ── DISH DETAIL MODAL ── */}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          similar={similarDishes}
          onClose={closeDish}
          onBook={(d) => d?._id ? openDish(d) : goBooking()}
        />
      )}
    </div>
  );
};

export default Menu;