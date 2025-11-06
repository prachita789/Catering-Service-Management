import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const Menu = () => {
    // state
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
  "All",
  "Starters",
  "Main Course",
  "Rice & Biryani",
  "Breads & Dal",
  "Desserts",
  "Beverages",
  "Non-Veg Specials",
];

    // hero images (Unsplash URLs)
    const heroImages = [
        {
            url: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
            title: "Exquisite Wedding Catering",
            subtitle: "Curated menus for your special day",
        },
        {
            url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
            title: "Corporate Events Made Memorable",
            subtitle: "Professional catering for conferences & meetings",
        },
        {
            url: "https://images.unsplash.com/photo-1591943938734-a3dfc7e70dca?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
            title: "Birthday Parties Full of Flavor",
            subtitle: "Colorful, fun menus for every celebration",
        },
        {
            url: "https://images.unsplash.com/photo-1646781652500-40015cee4917?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2073",
            title: "Outdoor Catering with Elegance",
            subtitle: "Garden buffets, BBQs, and private dinners",
        },
    ];

    // fetch menus from backend on mount
    useEffect(() => {
        let mounted = true;
        axios
            .get("http://localhost:5000/api/menus") // adjust if your backend URL is different
            .then((res) => {
                if (!mounted) return;
                setMenus(res.data || []);
                setFilteredMenus(res.data || []);
            })
            .catch((err) => {
                console.error("Error fetching menus:", err);
                setMenus([]);
                setFilteredMenus([]);
            });
        return () => {
            mounted = false;
        };
    }, []);

    // update filteredMenus when activeCategory or menus change
    useEffect(() => {
        if (activeCategory === "All") {
            setFilteredMenus(menus);
        } else {
            setFilteredMenus(menus.filter((m) => m.category === activeCategory));
        }
    }, [activeCategory, menus]);

    const handleFilter = (cat) => {
        setActiveCategory(cat);
        // filtering handled by useEffect
    };

    return (
        <div className="bg-[#fffaf5] min-h-screen text-gray-800">
            {/* HERO CAROUSEL */}
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
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${h.url})`,
                                }}
                            >
                                <div className="text-center text-white px-6 max-w-3xl">
                                    <h1 className="text-3xl md:text-5xl font-bold mb-3">{h.title}</h1>
                                    <p className="text-md md:text-lg">{h.subtitle}</p>
                                    <a
                                        href="#menu-section"
                                        className="inline-block mt-6 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                                    >
                                        Explore Menu
                                    </a>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* EVENT FILTERS */}
            {/* <div className="max-w-6xl mx-auto mt-8 flex flex-wrap justify-center gap-4 px-4">
                {["All Events", "Wedding", "Corporate", "Birthday", "Outdoor"].map((eventType) => (
                    <button
                        key={eventType}
                        onClick={() => console.log(`Filter by: ${eventType}`)} // later we can connect this to backend or local filter
                        className="px-4 py-2 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 transition font-medium"
                    >
                        {eventType}
                    </button>
                ))}
            </div> */}

            {/* CATEGORY FILTERS */}
            <div className="max-w-6xl mx-auto mt-8 flex flex-wrap justify-center gap-4 px-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat
                                ? "bg-amber-700 text-white"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* MENU GRID */}
            <main id="menu-section" className="max-w-6xl mx-auto py-12 px-6">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Our <span className="text-amber-700">Signature Dishes</span>
                </h2>

                {filteredMenus.length === 0 ? (
                    <p className="text-center text-gray-600">No dishes found in this category.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filteredMenus.map((dish) => (
                            <article
                                key={dish._id || dish.title}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform"
                            >
                                <img
                                    src={dish.image}
                                    alt={dish.title || dish.name || "Dish"}
                                    className="h-56 w-full object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg mb-1">{dish.title || dish.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{dish.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-amber-700">₹{dish.price}</span>
                                        <button className="bg-amber-700 text-white px-3 py-1 rounded-md text-sm hover:bg-amber-800">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* CTA */}
            <section className="bg-amber-700 text-white text-center py-16 mt-12">
                <h3 className="text-2xl font-bold mb-3">Planning an event? Let’s make it unforgettable.</h3>
                <p className="mb-6">Choose from our curated menus or request a custom catering package.</p>
                <a
                    href="/booking"
                    className="bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    Book Catering
                </a>
            </section>
        </div>
    );
};

export default Menu;
