import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  LayoutDashboard, CalendarCheck, ShoppingBag, UtensilsCrossed,
  Users, TrendingUp, Clock, CheckCircle, XCircle, ChefHat,
  Truck, PackageCheck, Pencil, Trash2, Plus, X, IndianRupee,
  RefreshCw, LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Sidebar nav items ────────────────────────────────────────
const NAV = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "bookings",  label: "Bookings",  icon: CalendarCheck },
  { id: "orders",    label: "Orders",    icon: ShoppingBag },
  { id: "menus",     label: "Menu",      icon: UtensilsCrossed },
  { id: "users",     label: "Users",     icon: Users },
];

// ─── Status badge helper ──────────────────────────────────────
function Badge({ label, color }) {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-700",
    green:  "bg-green-100 text-green-700",
    red:    "bg-red-100 text-red-700",
    blue:   "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    teal:   "bg-teal-100 text-teal-700",
    gray:   "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[color] || colors.gray}`}>
      {label}
    </span>
  );
}

function statusColor(s) {
  const map = {
    pending: "yellow", confirmed: "teal", completed: "green",
    cancelled: "red", preparing: "purple",
    "out for delivery": "blue", delivered: "green", placed: "yellow",
  };
  return map[s?.toLowerCase()] || "gray";
}

// ─── Stat card ────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, accent, delay }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
      style={{ animationDelay: delay, animation: "fadeUp 0.4s ease both" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────
function Section({ title, action, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Scrollable table wrapper ─────────────────────────────────
function Table({ heads, children, empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {heads.map((h) => (
              <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
      {empty && (
        <p className="text-center text-gray-400 py-10 text-sm">{empty}</p>
      )}
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Input helper ─────────────────────────────────────────────
function Field({ label, ...props }) {
  const Tag = props.as || "input";
  const { as, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Tag
        {...rest}
        className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [active, setActive]   = useState("overview");
  const [overview, setOverview] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [menus,    setMenus]    = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(false);

  // Menu modal state
  const [menuModal, setMenuModal] = useState(false);
  const [editMenu,  setEditMenu]  = useState(null);
  const [menuForm,  setMenuForm]  = useState({
    title: "", category: "", price: "", description: "", image: "",
  });

  // ── Loaders ──────────────────────────────────────────────────
  const load = useCallback(async (section) => {
    setLoading(true);
    try {
      if (section === "overview") {
        const { data } = await api.get("/admin/overview");
        setOverview(data);
      } else if (section === "bookings") {
        const { data } = await api.get("/admin/bookings?per=50");
        setBookings(data.items || data);
      } else if (section === "orders") {
        const { data } = await api.get("/admin/orders");
        setOrders(data.items || data);
      } else if (section === "menus") {
        const { data } = await api.get("/menus");
        setMenus(data);
      } else if (section === "users") {
        const { data } = await api.get("/admin/users");
        setUsers(data.items || data);
      }
    } catch (err) {
      toast.error(`Failed to load ${section}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(active); }, [active, load]);

  // ── Booking status update ─────────────────────────────────────
  async function updateBookingStatus(id, status) {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      load("bookings");
    } catch { toast.error("Failed to update booking."); }
  }

  // ── Order status update ───────────────────────────────────────
  async function updateOrderStatus(id, status) {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Order updated to: ${status}`);
      load("orders");
    } catch { toast.error("Failed to update order."); }
  }

  // ── Menu CRUD ─────────────────────────────────────────────────
  function openAddMenu() {
    setEditMenu(null);
    setMenuForm({ title: "", category: "", price: "", description: "", image: "" });
    setMenuModal(true);
  }
  function openEditMenu(menu) {
    setEditMenu(menu);
    setMenuForm({
      title: menu.title, category: menu.category,
      price: menu.price, description: menu.description, image: menu.image || "",
    });
    setMenuModal(true);
  }
  async function saveMenu() {
    if (!menuForm.title || !menuForm.price) {
      toast.error("Title and price are required."); return;
    }
    try {
      if (editMenu) {
        await api.put(`/menus/${editMenu._id}`, menuForm);
        toast.success("Menu item updated!");
      } else {
        await api.post("/menus", menuForm);
        toast.success("Menu item added!");
      }
      setMenuModal(false);
      load("menus");
    } catch { toast.error("Failed to save menu item."); }
  }
  async function deleteMenu(id) {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await api.delete(`/menus/${id}`);
      toast.success("Menu item deleted.");
      load("menus");
    } catch { toast.error("Failed to delete."); }
  }

  // ── Logout ────────────────────────────────────────────────────
  function handleLogout() { logout(); navigate("/login"); }

  // ─────────────────────────────────────────────────────────────
  //  RENDER PANELS
  // ─────────────────────────────────────────────────────────────

  function renderOverview() {
    const stats = [
      { title: "Total Revenue",   value: overview ? `₹${overview.totalRevenue?.toLocaleString("en-IN")}` : "—", icon: IndianRupee,  accent: "bg-amber-500",  delay: "0ms" },
      { title: "Total Bookings",  value: overview?.totalBookings,  icon: CalendarCheck, accent: "bg-blue-500",   delay: "60ms" },
      { title: "Pending",         value: overview?.pending,        icon: Clock,         accent: "bg-yellow-500", delay: "120ms" },
      { title: "Confirmed",       value: overview?.confirmed,      icon: CheckCircle,   accent: "bg-teal-500",   delay: "180ms" },
      { title: "Completed",       value: overview?.completed,      icon: PackageCheck,  accent: "bg-green-500",  delay: "240ms" },
      { title: "Cancelled",       value: overview?.cancelled,      icon: XCircle,       accent: "bg-red-400",    delay: "300ms" },
      { title: "Upcoming (14d)",  value: overview?.upcomingCount,  icon: TrendingUp,    accent: "bg-purple-500", delay: "360ms" },
    ];
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Quick tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-semibold text-amber-800 mb-3">📋 Admin Quick Guide</p>
          <ul className="text-sm text-amber-700 space-y-1.5">
            <li>• <strong>Bookings</strong> — View all customer bookings. Confirm, Complete, or Cancel them.</li>
            <li>• <strong>Orders</strong> — Update delivery status from Placed → Confirmed → Preparing → Out for Delivery → Delivered.</li>
            <li>• <strong>Menu</strong> — Add new dishes, edit prices/descriptions, or remove items from your menu.</li>
            <li>• <strong>Users</strong> — View all registered customers and their details.</li>
          </ul>
        </div>
      </div>
    );
  }

  function renderBookings() {
    return (
      <Section
        title="All Bookings"
        action={
          <button onClick={() => load("bookings")} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-800 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      >
        <Table
          heads={["Client", "Event", "Date", "Guests", "Amount", "Status", "Actions"]}
          empty={!loading && bookings.length === 0 ? "No bookings found." : undefined}
        >
          {bookings.map((b) => (
            <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
              <td className="py-3 px-3 font-medium text-gray-800">{b.fullName}</td>
              <td className="py-3 px-3 text-gray-600">{b.eventType}</td>
              <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                {new Date(b.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </td>
              <td className="py-3 px-3 text-gray-600">{b.guests}</td>
              <td className="py-3 px-3 font-semibold text-amber-700">₹{b.totalPrice || b.guests * 500}</td>
              <td className="py-3 px-3">
                <Badge label={b.status} color={statusColor(b.status)} />
              </td>
              <td className="py-3 px-3">
                <div className="flex gap-1 flex-wrap">
                  {b.status !== "confirmed" && b.status !== "cancelled" && (
                    <button
                      onClick={() => updateBookingStatus(b._id, "confirmed")}
                      className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition font-medium"
                    >Confirm</button>
                  )}
                  {b.status !== "completed" && b.status !== "cancelled" && (
                    <button
                      onClick={() => updateBookingStatus(b._id, "completed")}
                      className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium"
                    >Complete</button>
                  )}
                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => updateBookingStatus(b._id, "cancelled")}
                      className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
                    >Cancel</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {loading && <p className="text-center text-gray-400 py-6 text-sm">Loading...</p>}
      </Section>
    );
  }

  function renderOrders() {
    // ✅ Matches Order.js enum exactly: pending, preparing, delivered, cancelled
    const ORDER_STEPS = ["pending", "preparing", "delivered"];
    return (
      <Section
        title="All Orders"
        action={
          <button onClick={() => load("orders")} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-800 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      >
        {loading ? (
          <p className="text-center text-gray-400 py-10 text-sm">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="border border-gray-100 rounded-xl p-4 hover:border-amber-200 transition">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-700">
                      #{o.orderId || o._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {o.customerName && ` · ${o.customerName}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-700 text-sm">₹{o.totalPrice}</span>
                    <Badge label={o.status} color={statusColor(o.status)} />
                  </div>
                </div>

                {/* Step selector */}
                {o.status !== "cancelled" && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium">Update delivery status:</p>
                    <div className="flex flex-wrap gap-2">
                      {ORDER_STEPS.map((step) => (
                        <button
                          key={step}
                          onClick={() => updateOrderStatus(o._id, step)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition border ${
                            o.status === step
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700"
                          }`}
                        >
                          {step}
                        </button>
                      ))}
                      <button
                        onClick={() => updateOrderStatus(o._id, "cancelled")}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium border border-red-200 text-red-500 hover:bg-red-50 transition"
                      >Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    );
  }

  function renderMenus() {
    const CATEGORIES = ["Starters", "Main Course", "Rice & Biryani", "Breads & Dal", "Desserts", "Beverages", "Non-Veg Specials"];
    return (
      <Section
        title="Menu Management"
        action={
          <button
            onClick={openAddMenu}
            className="flex items-center gap-2 bg-amber-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-700 transition font-medium"
          >
            <Plus className="w-4 h-4" /> Add Dish
          </button>
        }
      >
        {loading ? (
          <p className="text-center text-gray-400 py-10 text-sm">Loading...</p>
        ) : menus.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No menu items yet. Add your first dish!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((m) => (
              <div key={m._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                {m.image && (
                  <img src={m.image} alt={m.title} className="h-56 w-full object-cover" />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-800 leading-snug">{m.title}</h3>
                    <span className="font-bold text-amber-700 whitespace-nowrap">₹{m.price}</span>
                  </div>
                  <p className="text-xs text-amber-600 font-medium mb-1">{m.category}</p>
                  {m.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{m.description}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditMenu(m)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => deleteMenu(m._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {menuModal && (
          <Modal title={editMenu ? "Edit Menu Item" : "Add New Dish"} onClose={() => setMenuModal(false)}>
            <div className="space-y-4">
              <Field label="Dish Name *" value={menuForm.title} onChange={e => setMenuForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Paneer Butter Masala" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={menuForm.category}
                  onChange={e => setMenuForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Price (₹) *" type="number" value={menuForm.price} onChange={e => setMenuForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 250" />
              <Field label="Image URL" value={menuForm.image} onChange={e => setMenuForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
              <Field as="textarea" label="Description" rows={3} value={menuForm.description} onChange={e => setMenuForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description of the dish..." />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setMenuModal(false)} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
                <button onClick={saveMenu} className="flex-1 py-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition text-sm font-semibold">{editMenu ? "Save Changes" : "Add Dish"}</button>
              </div>
            </div>
          </Modal>
        )}
      </Section>
    );
  }

  function renderUsers() {
    return (
      <Section
        title="All Users"
        action={
          <button onClick={() => load("users")} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-800 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      >
        <Table
          heads={["Name", "Email", "Role", "Joined"]}
          empty={!loading && users.length === 0 ? "No users found." : undefined}
        >
          {users.map((u) => (
            <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
              <td className="py-3 px-3 font-medium text-gray-800">{u.name}</td>
              <td className="py-3 px-3 text-gray-500">{u.email}</td>
              <td className="py-3 px-3">
                <Badge label={u.role || "user"} color={u.role === "admin" ? "amber" : "gray"} />
              </td>
              <td className="py-3 px-3 text-gray-400 text-xs">
                {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </td>
            </tr>
          ))}
        </Table>
        {loading && <p className="text-center text-gray-400 py-6 text-sm">Loading...</p>}
      </Section>
    );
  }

  const panelMap = {
    overview: renderOverview,
    bookings: renderBookings,
    orders:   renderOrders,
    menus:    renderMenus,
    users:    renderUsers,
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xl font-bold text-amber-600">CaterEase</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === id
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800 capitalize">
              {NAV.find(n => n.id === active)?.label}
            </h1>
            <p className="text-xs text-gray-400">Manage your catering business</p>
          </div>
          <div className="text-sm bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full font-medium text-amber-800">
            👑 Admin
          </div>
        </header>

        {/* Panel */}
        <main className="flex-1 overflow-y-auto p-8">
          <div key={active} style={{ animation: "fadeUp 0.3s ease" }}>
            {panelMap[active]?.()}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}