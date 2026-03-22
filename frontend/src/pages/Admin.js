import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { authAPI, bookingsAPI, uploadAPI, formatUrl, API_URL } from "../api/config";

// ─── Palette ──────────────────────────────────────────────────────────────────
const G = {
  gold: "#C8963E",
  gold2: "#D4A843",
  dark: "#2C1A0E",
  dark2: "#3D2314",
  darkest: "#1E1006",
  beige: "#EDE4D3",
  beige2: "#F5EFE6",
  cream: "#FFFDF8",
};

const ROOM_CATEGORIES = [
  "Bedroom", "Living Room", "Kitchen", "Dining Room",
  "Home Office", "Bathroom", "Outdoor", "Commercial", "Other",
];

// ─── Axios instance with credentials ─────────────────────────────────────────
const api = axios.create({ baseURL: API_URL, withCredentials: true });

// ─── API helpers ──────────────────────────────────────────────────────────────
const housesAPI = {
  getAll: () => api.get("/api/houses"),
  create: (d) => api.post("/api/houses", d),
  update: (id, d) => api.put(`/api/houses/${id}`, d),
  delete: (id) => api.delete(`/api/houses/${id}`),
  gallery: () => api.get("/api/houses/gallery"),
  upload: (fd) => api.post("/api/houses/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }),
};

const enquiryAPI = {
  getAll: () => api.get("/api/enquiry"),
  delete: (id) => api.delete(`/api/enquiry/${id}`),
  update: (id, d) => api.patch(`/api/enquiry/${id}`, d),
};

const mediaAPI = {
  getAll: () => api.get("/api/upload"),
  upload: (fd) => api.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (name) => api.delete(`/api/upload/${name}`),
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} /><rect x="14" y="3" width="7" height="4" rx="1" strokeWidth={1.5} /><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} /><rect x="14" y="11" width="7" height="10" rx="1" strokeWidth={1.5} /></svg>,
  Houses: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 22V12h6v10" /></svg>,
  Gallery: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Contact: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Bookings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Star: () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
};

// ─── Reusable UI bits ─────────────────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }) => (
  <div className={`rounded-[2rem] ${className}`}
    style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 24px rgba(44,26,14,0.06)", ...style }}>
    {children}
  </div>
);

const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-8 pb-5" style={{ borderBottom: "1px solid rgba(200,150,62,0.1)" }}>
    <h3 className="font-bold uppercase tracking-[0.3em] text-[11px]" style={{ color: G.dark }}>{title}</h3>
    {action}
  </div>
);

const GoldBtn = ({ onClick, children, small, danger, outline, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className={`flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${small ? "px-5 py-2.5 text-[10px]" : "px-8 py-4 text-[11px]"}`}
    style={danger
      ? { background: "rgba(220,50,50,0.1)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.2)" }
      : outline
        ? { background: "transparent", color: G.gold, border: `1px solid ${G.gold}` }
        : { background: `linear-gradient(135deg, ${G.dark}, ${G.dark2})`, color: G.gold, boxShadow: "0 6px 20px rgba(44,26,14,0.2)", opacity: disabled ? 0.6 : 1 }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
    {children}
  </button>
);

const Badge = ({ status }) => {
  const map = {
    pending: { bg: "rgba(200,150,62,0.12)", color: G.gold, label: "Pending" },
    confirmed: { bg: "rgba(74,222,128,0.12)", color: "#16a34a", label: "Confirmed" },
    rejected: { bg: "rgba(220,50,50,0.10)", color: "#dc2626", label: "Rejected" },
    read: { bg: "rgba(100,150,255,0.12)", color: "#4060cc", label: "Read" },
    unread: { bg: "rgba(200,150,62,0.12)", color: G.gold, label: "Unread" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider text-[9px]"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
      {s.label}
    </span>
  );
};

const Spinner = ({ small }) => (
  <div className={`rounded-full animate-spin ${small ? "w-4 h-4" : "w-10 h-10"}`}
    style={{ border: `${small ? 2 : 3}px solid rgba(200,150,62,0.15)`, borderTopColor: G.gold }} />
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    {label && <label className="font-bold uppercase tracking-widest text-[10px] block" style={{ color: "#8a7660" }}>{label}</label>}
    <input className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
      style={{ background: G.beige, border: "1px solid rgba(200,150,62,0.25)", color: G.dark }} {...props} />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, accent, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    className="p-8 rounded-[2rem] group relative overflow-hidden"
    style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 20px rgba(44,26,14,0.07)" }}>
    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)` }} />
    <div className="flex items-center justify-between mb-6">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)`, color: "#fff" }}>{icon}</div>
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: "#8a7660" }}>{title}</p>
        <p className="text-4xl font-display font-bold" style={{ color: G.dark }}>{value}</p>
      </div>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(200,150,62,0.1)" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ duration: 1.2, delay: delay + 0.4 }}
        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />
    </div>
  </motion.div>
);

// ══════════════════════════════════════════════════════════════════════════════
// HOUSE FORM MODAL
// ══════════════════════════════════════════════════════════════════════════════
const HouseModal = ({ editing, onClose, onSaved }) => {
  const [title, setTitle] = useState(editing?.title || "");
  const [location, setLocation] = useState(editing?.location || "");
  const [images, setImages] = useState(editing?.images || []);
  const [cover, setCover] = useState(editing?.cover || "");
  const [gallery, setGallery] = useState([]);
  const [tab, setTab] = useState("existing");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    housesAPI.gallery().then(r => setGallery(r.data || [])).catch(() => { });
  }, []);

  const doUpload = async (files) => {
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("photos", f));
      const res = await housesAPI.upload(fd);
      const names = res.data.filenames || [];
      setGallery(prev => [...names, ...prev]);
      setImages(prev => { const next = [...prev, ...names]; if (!cover && names[0]) setCover(names[0]); return next; });
    } catch (e) { alert("Upload failed: " + (e.response?.data?.error || e.message)); }
    setUploading(false);
  };

  const toggle = (f) => setImages(prev => {
    if (prev.includes(f)) {
      const next = prev.filter(x => x !== f);
      if (cover === f) setCover(next[0] || "");
      return next;
    }
    if (!cover) setCover(f);
    return [...prev, f];
  });

  const save = async () => {
    if (!title.trim()) return alert("Enter a house name");
    if (!images.length) return alert("Select at least one photo");
    setSaving(true);
    try {
      const payload = { title, location, cover: cover || images[0], images };
      editing ? await housesAPI.update(editing.id, payload) : await housesAPI.create(payload);
      onSaved(); onClose();
    } catch (e) { alert("Save failed: " + (e.response?.data?.error || e.message)); }
    setSaving(false);
  };

  const filtered = gallery.filter(f => f.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(10,6,2,0.88)", backdropFilter: "blur(14px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.25 }}
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2rem] overflow-hidden"
        style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.45)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-10 py-6 flex-shrink-0"
          style={{ background: G.beige2, borderBottom: "1px solid rgba(200,150,62,0.12)" }}>
          <div>
            <p className="font-accent text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: G.gold }}>
              {editing ? "Edit Project" : "New House Project"}
            </p>
            <h2 className="font-display text-2xl font-bold" style={{ color: G.dark }}>
              {editing ? editing.title : "Create House"}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: "rgba(200,150,62,0.1)", color: G.dark }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(200,150,62,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(200,150,62,0.1)"}>
            <Ic.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Name + location */}
          <div className="px-10 py-7 grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ borderBottom: "1px solid rgba(200,150,62,0.1)" }}>
            <Input label="House Name *" value={title} onChange={e => setTitle(e.target.value)} placeholder="Villa Razia" />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Banjara Hills, Hyderabad" />
          </div>

          {/* Photos */}
          <div className="px-10 py-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-bold uppercase tracking-widest text-[11px]" style={{ color: G.dark }}>
                  Photos
                  {images.length > 0 &&
                    <span className="ml-3 px-3 py-0.5 rounded-full text-[10px]"
                      style={{ background: "rgba(200,150,62,0.15)", color: G.gold }}>{images.length} selected</span>}
                </p>
                {cover && <p className="text-[10px] mt-0.5" style={{ color: "#b5a080" }}>Cover: <span style={{ color: G.gold }}>{cover}</span> — click ★ to change</p>}
              </div>
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,150,62,0.2)" }}>
                {[["existing", "Gallery"], ["upload", "Upload New"]].map(([id, lbl]) => (
                  <button key={id} onClick={() => setTab(id)}
                    className="px-5 py-2.5 font-bold text-[10px] uppercase tracking-widest transition-all"
                    style={tab === id ? { background: G.dark, color: G.gold } : { color: "#8a7660" }}>{lbl}</button>
                ))}
              </div>
            </div>

            {/* Upload tab */}
            {tab === "upload" && (
              <div className="mb-4">
                <div className="rounded-2xl flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all mb-4"
                  style={{ background: drag ? "rgba(200,150,62,0.07)" : "rgba(200,150,62,0.03)", border: `2px dashed rgba(200,150,62,${drag ? 0.6 : 0.25})` }}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); doUpload(Array.from(e.dataTransfer.files)); }}
                  onClick={() => fileRef.current?.click()}>
                  <div style={{ color: G.gold }}><Ic.Upload /></div>
                  <p className="font-bold uppercase tracking-widest text-[11px]" style={{ color: "#8a7660" }}>
                    {uploading ? "Uploading…" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-[10px]" style={{ color: "#c8b99a" }}>JPG, PNG, WebP — up to 15 MB each</p>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                    onChange={e => doUpload(Array.from(e.target.files || []))} />
                </div>
                {uploading && <div className="flex justify-center py-3"><Spinner /></div>}
              </div>
            )}

            {/* Search (existing tab) */}
            {tab === "existing" && (
              <div className="relative mb-4">
                <input type="text" placeholder="Search gallery…" value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-5 py-3 rounded-xl text-xs outline-none"
                  style={{ background: G.beige, border: "1px solid rgba(200,150,62,0.2)", color: G.dark }} />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}

            {/* Photo grid */}
            {gallery.length === 0 && tab === "existing" ? (
              <div className="py-14 text-center rounded-2xl" style={{ background: G.beige, border: "1px dashed rgba(200,150,62,0.2)" }}>
                <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No photos yet — switch to Upload New</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                {filtered.map(filename => {
                  const sel = images.includes(filename);
                  const isCover = cover === filename;
                  return (
                    <div key={filename} onClick={() => toggle(filename)}
                      className="relative cursor-pointer rounded-xl overflow-hidden group"
                      style={{ aspectRatio: "1", border: `2px solid ${sel ? G.gold : "transparent"}` }}>
                      <img src={`${API_URL}/gallery/${filename}`} alt={filename}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={e => { e.target.src = "https://via.placeholder.com/120?text=?"; }} />
                      <div className="absolute inset-0 transition-opacity" style={{ background: sel ? "transparent" : "rgba(0,0,0,0.22)" }} />
                      {sel && <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: G.gold, color: G.dark }}><Ic.Check /></div>}
                      {sel && <button className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                        style={{ background: isCover ? G.gold : "rgba(0,0,0,0.5)", color: isCover ? G.dark : "#fff" }}
                        onClick={e => { e.stopPropagation(); setCover(filename); }} title="Set as cover"><Ic.Star /></button>}
                      {isCover && <div className="absolute bottom-0 left-0 right-0 py-0.5 text-center"
                        style={{ background: "rgba(200,150,62,0.9)", fontSize: "7px", fontWeight: "bold", letterSpacing: "0.12em", color: G.dark }}>COVER</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-10 py-5 flex-shrink-0"
          style={{ background: G.beige2, borderTop: "1px solid rgba(200,150,62,0.12)" }}>
          <p className="text-[11px]" style={{ color: "#b5a080" }}>
            {images.length} photo{images.length !== 1 ? "s" : ""} selected{cover ? " · Cover set" : ""}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest" style={{ color: "#8a7660" }}>Cancel</button>
            <GoldBtn onClick={save} disabled={saving}>
              {saving ? <><Spinner small /> Saving…</> : editing ? "Save Changes" : "Create Project"}
            </GoldBtn>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ENQUIRY DETAIL MODAL
// ══════════════════════════════════════════════════════════════════════════════
const EnquiryModal = ({ enquiry, onClose, onUpdate }) => {
  const [status, setStatus] = useState(enquiry.status || "unread");
  const [saving, setSaving] = useState(false);

  const save = async (newStatus) => {
    setSaving(true);
    try {
      await enquiryAPI.update(enquiry._id, { status: newStatus });
      setStatus(newStatus);
      onUpdate();
    } catch { alert("Failed to update status"); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(10,6,2,0.88)", backdropFilter: "blur(14px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden"
        style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between px-10 py-6"
          style={{ background: G.beige2, borderBottom: "1px solid rgba(200,150,62,0.12)" }}>
          <div>
            <p className="font-accent text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: G.gold }}>Contact Submission</p>
            <h2 className="font-display text-xl font-bold" style={{ color: G.dark }}>{enquiry.name || enquiry.clientName}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(200,150,62,0.1)", color: G.dark }}><Ic.Close /></button>
        </div>

        <div className="px-10 py-8 space-y-5">
          {[
            ["Email", enquiry.email],
            ["Phone", enquiry.phone || "—"],
            ["Service", enquiry.service || enquiry.serviceType || "—"],
            ["Date", enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"],
          ].map(([lbl, val]) => (
            <div key={lbl} className="flex justify-between items-center py-3"
              style={{ borderBottom: "1px solid rgba(200,150,62,0.08)" }}>
              <span className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>{lbl}</span>
              <span className="text-sm font-medium" style={{ color: G.dark }}>{val}</span>
            </div>
          ))}

          <div className="rounded-2xl p-5 mt-2" style={{ background: G.beige, border: "1px solid rgba(200,150,62,0.12)" }}>
            <p className="font-bold uppercase tracking-widest text-[10px] mb-3" style={{ color: "#8a7660" }}>Message</p>
            <p className="text-sm leading-relaxed italic" style={{ color: G.dark }}>"{enquiry.message}"</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Badge status={status} />
            <div className="flex gap-3 ml-auto">
              {status !== "read" && (
                <GoldBtn small onClick={() => save("read")} disabled={saving}>
                  <Ic.Check /> Mark Read
                </GoldBtn>
              )}
              <GoldBtn small danger onClick={async () => {
                if (!window.confirm("Delete this enquiry?")) return;
                try { await enquiryAPI.delete(enquiry._id); onUpdate(); onClose(); }
                catch { alert("Delete failed"); }
              }}>
                <Ic.Trash /> Delete
              </GoldBtn>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB: DASHBOARD OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
const DashboardTab = ({ houses, bookings, enquiries, onNav }) => {
  const pending = bookings.filter(b => b.status === "pending").length;
  const unread = enquiries.filter(e => e.status === "unread" || !e.status).length;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="House Projects" value={houses.length} icon={<Ic.Houses />} accent={G.gold} delay={0.05} />
        <StatCard title="Gallery Photos" value="—" icon={<Ic.Gallery />} accent="#B8832A" delay={0.1} />
        <StatCard title="Unread Enquiries" value={unread} icon={<Ic.Contact />} accent="#7A5020" delay={0.15} />
        <StatCard title="Pending Bookings" value={pending} icon={<Ic.Bookings />} accent="#5A3010" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent enquiries */}
        <Card className="p-8">
          <SectionHeader title="Recent Enquiries"
            action={<button onClick={() => onNav("contacts")} className="font-bold uppercase tracking-widest text-[10px]" style={{ color: G.gold }}>View All →</button>} />
          <div className="space-y-3">
            {enquiries.slice(0, 4).map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: G.beige, border: "1px solid rgba(200,150,62,0.1)" }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: G.dark }}>{e.name || e.clientName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#b5a080" }}>{e.email}</p>
                </div>
                <Badge status={e.status || "unread"} />
              </div>
            ))}
            {enquiries.length === 0 && <p className="text-center py-8 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c8b99a" }}>No enquiries yet</p>}
          </div>
        </Card>

        {/* Recent bookings */}
        <Card className="p-8">
          <SectionHeader title="Recent Bookings"
            action={<button onClick={() => onNav("bookings")} className="font-bold uppercase tracking-widest text-[10px]" style={{ color: G.gold }}>View All →</button>} />
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: G.beige, border: "1px solid rgba(200,150,62,0.1)" }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: G.dark }}>{b.clientName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#b5a080" }}>{b.serviceType || "Consultation"}</p>
                </div>
                <Badge status={b.status || "pending"} />
              </div>
            ))}
            {bookings.length === 0 && <p className="text-center py-8 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#c8b99a" }}>No bookings yet</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB: HOUSES
// ══════════════════════════════════════════════════════════════════════════════
const HousesTab = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | house-object
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await housesAPI.getAll(); setHouses(r.data || []); }
    catch { setHouses([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? Photos remain in gallery.`)) return;
    try { await housesAPI.delete(id); setHouses(p => p.filter(h => h.id !== id)); }
    catch (e) { alert("Delete failed: " + e.message); }
  };

  const filtered = houses.filter(h =>
    !search || h.title.toLowerCase().includes(search.toLowerCase()) ||
    (h.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {modal && <HouseModal editing={modal === "new" ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input type="text" placeholder="Search houses…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-5 py-4 rounded-xl outline-none text-[11px] tracking-widest uppercase font-bold"
            style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.25)", color: G.dark }} />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <GoldBtn onClick={() => setModal("new")}><Ic.Plus /> New House Project</GoldBtn>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="py-32 text-center rounded-[2rem]"
          style={{ background: "rgba(255,253,248,0.7)", border: "2px dashed rgba(200,150,62,0.2)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(200,150,62,0.08)", color: "rgba(200,150,62,0.35)" }}><Ic.Houses /></div>
          <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>
            {search ? "No houses match your search" : "No house projects yet — click New House Project"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((house, i) => (
            <motion.div key={house.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group rounded-[2rem] overflow-hidden transition-all duration-400"
              style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 20px rgba(44,26,14,0.07)" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(44,26,14,0.14)"; e.currentTarget.style.borderColor = "rgba(200,150,62,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(44,26,14,0.07)"; e.currentTarget.style.borderColor = "rgba(200,150,62,0.15)"; }}>

              <div className="relative h-52 overflow-hidden">
                {house.cover
                  ? <img src={`${API_URL}/gallery/${house.cover}`} alt={house.title}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    onError={e => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }} />
                  : <div className="w-full h-full flex items-center justify-center"
                    style={{ background: G.beige, color: "rgba(200,150,62,0.3)" }}><Ic.Houses /></div>}

                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,16,6,0.65) 0%, transparent 55%)", opacity: 0.7 }} />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(15,10,5,0.72)", backdropFilter: "blur(6px)", border: "1px solid rgba(200,150,62,0.3)" }}>
                  <span className="text-[10px] font-bold tracking-widest" style={{ color: G.gold }}>{house.images?.length || 0} PHOTOS</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: "rgba(255,253,248,0.93)", backdropFilter: "blur(6px)" }}>
                  <GoldBtn small onClick={() => setModal(house)}><Ic.Edit /> Edit</GoldBtn>
                  <GoldBtn small danger onClick={() => del(house.id, house.title)}><Ic.Trash /> Delete</GoldBtn>
                </div>
              </div>

              <div className="p-6" style={{ borderTop: "1px solid rgba(200,150,62,0.08)" }}>
                <h3 className="font-display font-bold text-lg mb-1" style={{ color: G.dark }}>{house.title}</h3>
                {house.location && (
                  <div className="flex items-center gap-1.5" style={{ color: "#b5a080" }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-accent text-[10px] tracking-widest uppercase">{house.location}</span>
                  </div>
                )}
                {house.images?.length > 0 && (
                  <div className="flex gap-1.5 mt-4">
                    {house.images.slice(0, 5).map((f, idx) => (
                      <div key={idx} className="flex-1 rounded-lg overflow-hidden" style={{ height: "34px" }}>
                        <img src={`${API_URL}/gallery/${f}`} alt="" className="w-full h-full object-cover"
                          onError={e => { e.target.src = "https://via.placeholder.com/60?text=?"; }} />
                      </div>
                    ))}
                    {house.images.length > 5 && (
                      <div className="flex-1 rounded-lg flex items-center justify-center text-[9px] font-bold"
                        style={{ height: "34px", background: G.beige, color: G.gold }}>+{house.images.length - 5}</div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB: GALLERY (media upload)
// ══════════════════════════════════════════════════════════════════════════════
const GalleryTab = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [cat, setCat] = useState("Bedroom");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await mediaAPI.getAll(); setFiles(r.data || []); }
    catch { setFiles([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    setPending(prev => [...prev, ...selected.map(file => ({
      file, preview: URL.createObjectURL(file), category: cat, id: `${Date.now()}-${Math.random()}`
    }))]);
    e.target.value = "";
  };

  const confirmUpload = async () => {
    setUploading(true);
    for (const item of pending) {
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("category", item.category);
      try { await mediaAPI.upload(fd); } catch (e) { console.error("upload failed", e); }
    }
    setPending([]);
    await load();
    setUploading(false);
  };

  const del = async (name, idx) => {
    if (!window.confirm("Delete this photo from gallery?")) return;
    try { await mediaAPI.delete(name); setFiles(p => p.filter((_, i) => i !== idx)); }
    catch (e) { alert("Delete failed: " + e.message); }
  };

  const cats = ["All", ...Array.from(new Set(files.map(f => f.category).filter(Boolean)))];
  const shown = files
    .filter(f => filter === "All" || f.category === filter)
    .filter(f => !search || (f.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Upload panel */}
      <Card className="p-8">
        <SectionHeader title="Upload Photos" />
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select value={cat} onChange={e => setCat(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl text-sm outline-none appearance-none"
            style={{ background: G.beige, border: "1px solid rgba(200,150,62,0.2)", color: G.dark }}>
            {ROOM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <GoldBtn onClick={() => fileRef.current?.click()}><Ic.Upload /> Select Photos</GoldBtn>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleSelect} />
        </div>

        <AnimatePresence>
          {pending.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
                {pending.map(item => (
                  <div key={item.id} className="relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,150,62,0.15)" }}>
                    <div className="aspect-square"><img src={item.preview} alt="" className="w-full h-full object-cover" /></div>
                    <select value={item.category}
                      onChange={e => setPending(p => p.map(u => u.id === item.id ? { ...u, category: e.target.value } : u))}
                      className="w-full px-1.5 py-1 text-[9px] font-bold uppercase outline-none appearance-none text-center"
                      style={{ background: G.cream, borderTop: "1px solid rgba(200,150,62,0.12)", color: "#6b5c45" }}>
                      {ROOM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => setPending(p => p.filter(u => u.id !== item.id))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ background: "#dc2626" }}>✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <GoldBtn onClick={confirmUpload} disabled={uploading}>
                  {uploading ? <><Spinner small /> Uploading…</> : `Confirm & Upload ${pending.length} Photo${pending.length > 1 ? "s" : ""}`}
                </GoldBtn>
                <GoldBtn outline onClick={() => setPending([])}>Clear</GoldBtn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Filter + search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
              style={filter === c
                ? { background: `linear-gradient(135deg, ${G.dark}, ${G.dark2})`, color: G.gold }
                : { background: G.cream, color: "#8a7660", border: "1px solid rgba(200,150,62,0.2)" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <input type="text" placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-5 py-3 rounded-xl text-xs outline-none"
            style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.2)", color: G.dark }} />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : shown.length === 0 ? (
        <div className="py-32 text-center rounded-[2rem]"
          style={{ background: "rgba(255,253,248,0.7)", border: "2px dashed rgba(200,150,62,0.2)" }}>
          <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>
            {search || filter !== "All" ? "No photos match your filter" : "No photos uploaded yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AnimatePresence>
            {shown.map((file, idx) => (
              <motion.div key={`${file.name}-${idx}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, delay: idx * 0.02 }}
                className="group relative rounded-2xl overflow-hidden"
                style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.12)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,150,62,0.4)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,26,14,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,150,62,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={formatUrl(file.url)} alt={file.name} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    onError={e => { e.target.src = "https://via.placeholder.com/300?text=?"; }} />
                </div>
                {file.category && (
                  <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(200,150,62,0.1)" }}>
                    <span className="font-bold uppercase tracking-widest text-[9px]" style={{ color: G.gold }}>{file.category}</span>
                  </div>
                )}
                {/* Delete overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: "rgba(255,253,248,0.92)", backdropFilter: "blur(4px)" }}>
                  <button onClick={() => del(file.name, idx)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                    style={{ background: "rgba(220,50,50,0.1)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.2)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.1)"; e.currentTarget.style.color = "#dc2626"; }}>
                    <Ic.Trash /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB: CONTACT FORM SUBMISSIONS
// ══════════════════════════════════════════════════════════════════════════════
const ContactsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await enquiryAPI.getAll(); setItems(r.data || []); }
    catch { setItems([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try { await enquiryAPI.delete(id); setItems(p => p.filter(x => x._id !== id)); }
    catch { alert("Delete failed"); }
  };

  const markRead = async (id) => {
    try { await enquiryAPI.update(id, { status: "read" }); setItems(p => p.map(x => x._id === id ? { ...x, status: "read" } : x)); }
    catch { alert("Update failed"); }
  };

  const shown = items
    .filter(e => filter === "all" || (filter === "unread" ? (!e.status || e.status === "unread") : e.status === "read"))
    .filter(e => !search || (e.name || e.clientName || "").toLowerCase().includes(search.toLowerCase()) || (e.email || "").toLowerCase().includes(search.toLowerCase()));

  const unread = items.filter(e => !e.status || e.status === "unread").length;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {selected && <EnquiryModal enquiry={selected} onClose={() => setSelected(null)} onUpdate={load} />}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          {[["all", "All"], ["unread", `Unread (${unread})`], ["read", "Read"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setFilter(id)}
              className="px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
              style={filter === id
                ? { background: `linear-gradient(135deg, ${G.dark}, ${G.dark2})`, color: G.gold }
                : { background: G.cream, color: "#8a7660", border: "1px solid rgba(200,150,62,0.2)" }}>
              {lbl}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <input type="text" placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-5 py-3 rounded-xl text-xs outline-none"
            style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.2)", color: G.dark }} />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : shown.length === 0 ? (
        <div className="py-32 text-center rounded-[2rem]"
          style={{ background: "rgba(255,253,248,0.7)", border: "2px dashed rgba(200,150,62,0.2)" }}>
          <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No enquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((e, i) => {
            const isUnread = !e.status || e.status === "unread";
            return (
              <motion.div key={e._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 cursor-pointer"
                style={{
                  background: isUnread ? `linear-gradient(135deg, ${G.cream}, rgba(200,150,62,0.04))` : G.cream,
                  border: `1px solid ${isUnread ? "rgba(200,150,62,0.25)" : "rgba(200,150,62,0.12)"}`,
                  boxShadow: isUnread ? "0 4px 20px rgba(200,150,62,0.07)" : "none"
                }}
                onClick={() => setSelected(e)}>
                {/* Unread dot */}
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: isUnread ? G.gold : "transparent", boxShadow: isUnread ? `0 0 8px ${G.gold}` : "none" }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-base" style={{ color: G.dark }}>{e.name || e.clientName}</p>
                    {isUnread && <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest"
                      style={{ background: "rgba(200,150,62,0.15)", color: G.gold }}>New</span>}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#b5a080" }}>{e.email}</p>
                  <p className="text-sm truncate italic" style={{ color: "#8a7660" }}>"{e.message}"</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-[10px]" style={{ color: "#c8b99a" }}>
                    {e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
                  </p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUnread && (
                      <button onClick={ev => { ev.stopPropagation(); markRead(e._id); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: "rgba(74,222,128,0.1)", color: "#16a34a", border: "1px solid rgba(74,222,128,0.2)" }}
                        onMouseEnter={ev => { ev.currentTarget.style.background = "#16a34a"; ev.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={ev => { ev.currentTarget.style.background = "rgba(74,222,128,0.1)"; ev.currentTarget.style.color = "#16a34a"; }}
                        title="Mark as read"><Ic.Check /></button>
                    )}
                    <button onClick={ev => { ev.stopPropagation(); del(e._id); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "rgba(220,50,50,0.08)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.15)" }}
                      onMouseEnter={ev => { ev.currentTarget.style.background = "#dc2626"; ev.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={ev => { ev.currentTarget.style.background = "rgba(220,50,50,0.08)"; ev.currentTarget.style.color = "#dc2626"; }}
                      title="Delete"><Ic.Trash /></button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(200,150,62,0.1)", color: G.gold, border: "1px solid rgba(200,150,62,0.2)" }}
                      title="View details"><Ic.Eye /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB: BOOKINGS
// ══════════════════════════════════════════════════════════════════════════════
const BookingsTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await bookingsAPI.getAll(); setItems(r.data || []); }
    catch { setItems([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    try { await bookingsAPI.updateStatus(id, status); setItems(p => p.map(x => x._id === id ? { ...x, status } : x)); }
    catch { alert("Failed to update status"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try { await bookingsAPI.delete(id); setItems(p => p.filter(x => x._id !== id)); }
    catch { alert("Delete failed"); }
  };

  const pending = items.filter(b => b.status === "pending").length;
  const shown = items
    .filter(b => filter === "all" || b.status === filter)
    .filter(b => !search || (b.clientName || "").toLowerCase().includes(search.toLowerCase()) || (b.email || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[["all", "All"], ["pending", `Pending (${pending})`], ["confirmed", "Confirmed"], ["rejected", "Rejected"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setFilter(id)}
              className="px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
              style={filter === id
                ? { background: `linear-gradient(135deg, ${G.dark}, ${G.dark2})`, color: G.gold }
                : { background: G.cream, color: "#8a7660", border: "1px solid rgba(200,150,62,0.2)" }}>
              {lbl}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <input type="text" placeholder="Search client or email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-5 py-3 rounded-xl text-xs outline-none"
            style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.2)", color: G.dark }} />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : shown.length === 0 ? (
        <div className="py-32 text-center rounded-[2rem]"
          style={{ background: "rgba(255,253,248,0.7)", border: "2px dashed rgba(200,150,62,0.2)" }}>
          <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-2xl p-6 transition-all duration-300"
              style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 2px 12px rgba(44,26,14,0.05)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,26,14,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(44,26,14,0.05)"}>
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-display font-bold text-lg" style={{ color: G.dark }}>{b.clientName}</p>
                    <Badge status={b.status || "pending"} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#b5a080" }}>
                    {b.email}{b.phone ? ` · ${b.phone}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {b.serviceType && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: "rgba(200,150,62,0.1)", color: G.gold, border: "1px solid rgba(200,150,62,0.15)" }}>
                        {b.serviceType}
                      </span>
                    )}
                    {b.bookingDate && (
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: G.beige, color: "#8a7660" }}>
                        📅 {b.bookingDate}{b.bookingTime ? ` at ${b.bookingTime}` : ""}
                      </span>
                    )}
                  </div>
                  {b.message && (
                    <p className="text-sm italic leading-relaxed" style={{ color: "#8a7660" }}>"{b.message}"</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 flex-shrink-0">
                  {b.status === "pending" && (
                    <>
                      <button onClick={() => setStatus(b._id, "confirmed")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                        style={{ background: "rgba(74,222,128,0.1)", color: "#16a34a", border: "1px solid rgba(74,222,128,0.25)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.color = "#16a34a"; }}>
                        <Ic.Check /> Accept
                      </button>
                      <button onClick={() => setStatus(b._id, "rejected")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                        style={{ background: "rgba(220,50,50,0.08)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.2)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.08)"; e.currentTarget.style.color = "#dc2626"; }}>
                        <Ic.Close /> Reject
                      </button>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <button onClick={() => setStatus(b._id, "rejected")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                      style={{ background: "rgba(220,50,50,0.08)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.2)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.08)"; e.currentTarget.style.color = "#dc2626"; }}>
                      <Ic.Close /> Reject
                    </button>
                  )}
                  {b.status === "rejected" && (
                    <button onClick={() => setStatus(b._id, "confirmed")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                      style={{ background: "rgba(74,222,128,0.1)", color: "#16a34a", border: "1px solid rgba(74,222,128,0.25)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.color = "#16a34a"; }}>
                      <Ic.Check /> Approve
                    </button>
                  )}
                  <button onClick={() => del(b._id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: "rgba(220,50,50,0.06)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.12)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.06)"; e.currentTarget.style.color = "#dc2626"; }}>
                    <Ic.Trash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN
// ══════════════════════════════════════════════════════════════════════════════
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [mobileOpen, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Data for dashboard overview
  const [houses, setHouses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    authAPI.me().then(() => setAuthed(true)).catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Load dashboard data when on overview tab
  useEffect(() => {
    if (!authed || tab !== "dashboard") return;
    housesAPI.getAll().then(r => setHouses(r.data || [])).catch(() => { });
    bookingsAPI.getAll().then(r => setBookings(r.data || [])).catch(() => { });
    enquiryAPI.getAll().then(r => setEnquiries(r.data || [])).catch(() => { });
  }, [authed, tab]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const r = await authAPI.login(creds);
      if (r.data.success) { setAuthed(true); setLoginErr(""); }
    } catch (err) { setLoginErr(err.response?.data?.message || "Invalid credentials"); }
  };

  const logout = async () => { try { await authAPI.logout(); } catch { } setAuthed(false); };

  const TABS = [
    { id: "dashboard", label: "Overview", icon: <Ic.Dashboard /> },
    { id: "houses", label: "Houses", icon: <Ic.Houses /> },
    { id: "gallery", label: "Gallery", icon: <Ic.Gallery /> },
    { id: "contacts", label: "Enquiries", icon: <Ic.Contact /> },
    { id: "bookings", label: "Bookings", icon: <Ic.Bookings /> },
  ];

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${G.darkest} 0%, ${G.dark} 45%, ${G.dark2} 100%)` }}>
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,150,62,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,150,62,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full max-w-md rounded-[2.5rem] p-10 md:p-14"
          style={{ background: "rgba(255,253,248,0.98)", border: "1px solid rgba(200,150,62,0.2)", boxShadow: "0 50px 100px rgba(0,0,0,0.5)" }}>

          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-[1.5rem] mx-auto mb-5 flex items-center justify-center font-display font-bold text-3xl"
              style={{ background: `linear-gradient(135deg, ${G.dark}, ${G.dark2})`, color: G.gold, boxShadow: "0 12px 40px rgba(44,26,14,0.35)" }}>
              II
            </div>
            <h1 className="font-display font-bold text-4xl mb-1 tracking-tight" style={{ color: G.dark }}>Italian Interiors</h1>
            <p className="font-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-6" style={{ color: G.gold }}>Studio Dashboard</p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${G.gold})` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.gold }} />
              <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${G.gold}, transparent)` }} />
            </div>
          </div>

          <form onSubmit={login} className="space-y-5">
            <Input label="Email / Username" type="text" value={creds.username}
              onChange={e => setCreds({ ...creds, username: e.target.value })}
              placeholder="italianinteriors93@gmail.com" />
            <Input label="Password" type="password" value={creds.password}
              onChange={e => setCreds({ ...creds, password: e.target.value })}
              placeholder="••••••••" />
            <AnimatePresence>
              {loginErr && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-center uppercase tracking-wider py-3 rounded-xl"
                  style={{ color: "#dc2626", background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.15)" }}>
                  {loginErr}
                </motion.p>
              )}
            </AnimatePresence>
            <button type="submit"
              className="w-full py-5 font-accent font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.gold2})`, color: G.dark, boxShadow: "0 8px 28px rgba(200,150,62,0.35)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Open Studio
            </button>
          </form>

          <p className="text-center mt-8">
            <Link to="/" className="font-accent text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#b5a080" }}>
              ← Back to Portfolio
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard shell ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: G.beige }}>
      <div className="fixed inset-0 bg-luxury-pattern opacity-[0.035] pointer-events-none" />

      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-6 py-5 sticky top-0 z-[60] border-b backdrop-blur-md"
        style={{ background: "rgba(30,16,6,0.96)", borderColor: "rgba(200,150,62,0.2)" }}>
        <span className="font-display font-bold text-lg" style={{ color: G.beige2 }}>Italian Interiors</span>
        <button onClick={() => setMobile(o => !o)} style={{ color: G.gold }}>
          {mobileOpen ? <Ic.Close /> : <Ic.Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(mobileOpen || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobile(false)}
              className="lg:hidden fixed inset-0 z-[50]"
              style={{ background: "rgba(10,6,2,0.82)", backdropFilter: "blur(4px)" }} />

            <motion.aside initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-72 flex flex-col fixed top-0 left-0 h-screen z-[55]"
              style={{
                background: `linear-gradient(180deg, ${G.darkest} 0%, ${G.dark} 55%, ${G.dark2} 100%)`,
                borderRight: "1px solid rgba(200,150,62,0.1)",
                boxShadow: "12px 0 48px rgba(0,0,0,0.35)",
              }}>
              <div className="absolute top-0 right-0 w-full h-56 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top right, rgba(200,150,62,0.1) 0%, transparent 70%)", filter: "blur(30px)" }} />

              {/* Brand */}
              <div className="hidden lg:block relative z-10 px-8 py-10 border-b text-center"
                style={{ borderColor: "rgba(200,150,62,0.1)" }}>
                <p className="font-display font-bold text-xl mb-2" style={{ color: G.beige2 }}>Italian Interiors</p>
                <div className="h-0.5 w-8 rounded-full mx-auto mb-2" style={{ background: G.gold }} />
                <p style={{ fontSize: "0.52rem", letterSpacing: "0.32em", color: "rgba(200,150,62,0.5)", fontWeight: "bold", textTransform: "uppercase" }}>
                  Studio Dashboard
                </p>
              </div>

              {/* Nav */}
              <nav className="relative z-10 flex-1 px-5 py-8 space-y-1.5">
                {TABS.map(t => (
                  <button key={t.id}
                    onClick={() => { setTab(t.id); setMobile(false); }}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative group"
                    style={tab === t.id
                      ? { background: "rgba(200,150,62,0.14)", border: "1px solid rgba(200,150,62,0.28)", color: G.gold }
                      : { background: "transparent", border: "1px solid transparent", color: "rgba(245,239,230,0.32)" }}>
                    <span className="group-hover:scale-110 transition-transform duration-300">{t.icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t.label}</span>
                    {tab === t.id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full" style={{ background: G.gold }} />}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <div className="relative z-10 px-6 py-7 border-t" style={{ borderColor: "rgba(200,150,62,0.1)", background: "rgba(0,0,0,0.18)" }}>
                <button onClick={logout}
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
                  style={{ background: "rgba(220,50,50,0.14)", color: "#f87171", border: "1px solid rgba(220,50,50,0.2)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(220,50,50,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(220,50,50,0.14)"}>
                  End Session <Ic.Logout />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 lg:p-14 relative z-10">
        {/* Header */}
        <header className={`flex items-start justify-between gap-6 mb-14 sticky top-0 z-40 py-5 -mx-6 px-6 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14 transition-all duration-300 ${scrolled ? "backdrop-blur-xl border-b shadow-sm" : ""}`}
          style={{ background: scrolled ? "rgba(237,228,211,0.92)" : "transparent", borderColor: scrolled ? "rgba(200,150,62,0.15)" : "transparent" }}>
          <div>
            <h2 className="font-display font-bold tracking-tighter transition-all duration-300"
              style={{ fontSize: scrolled ? "clamp(1.6rem,3.5vw,2.4rem)" : "clamp(2.4rem,5vw,3.8rem)", color: G.dark, lineHeight: 1 }}>
              {TABS.find(t => t.id === tab)?.label}
            </h2>
            {!scrolled && (
              <div className="flex items-center gap-3 mt-3">
                <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${G.gold}, transparent)` }} />
                <p className="font-accent font-bold uppercase tracking-[0.35em] text-[10px]" style={{ color: "#b5a080" }}>Studio Console</p>
              </div>
            )}
          </div>
          <div className="px-5 py-3 rounded-2xl flex items-center gap-2.5 flex-shrink-0"
            style={{ background: G.cream, border: "1px solid rgba(200,150,62,0.18)", boxShadow: "0 4px 16px rgba(44,26,14,0.06)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
            <span className="font-accent font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>
              {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </header>

        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {tab === "dashboard" && <DashboardTab houses={houses} bookings={bookings} enquiries={enquiries} onNav={setTab} />}
          {tab === "houses" && <HousesTab />}
          {tab === "gallery" && <GalleryTab />}
          {tab === "contacts" && <ContactsTab />}
          {tab === "bookings" && <BookingsTab />}
        </motion.div>
      </main>
    </div>
  );
}