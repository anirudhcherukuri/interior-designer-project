import React, { useState, useEffect, useCallback, useRef } from "react";
import { projectsAPI, bookingsAPI, uploadAPI, authAPI, API_URL, USE_MOCK, formatUrl } from "../api/config";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─── Palette ─────────────────────────────────────────────────────────────────
const GOLD = "#C8963E";
const GOLD2 = "#D4A843";
const DARK = "#2C1A0E";   // deep brown (replaces indigo)
const DARK2 = "#3D2314";
const DARKEST = "#1E1006";
const BEIGE = "#EDE4D3";
const BEIGE2 = "#F5EFE6";
const CREAM = "#FFFDF8";

// ─── Constants ────────────────────────────────────────────────────────────────
const ROOM_CATEGORIES = [
  "Bedroom", "Living Room", "Kitchen", "Dining Room", "Home Office", 
  "Bathroom", "Outdoor", "Commercial", "Other",
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, delay, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-[2rem] group hover:shadow-xl transition-all duration-500 overflow-hidden relative"
    style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.18)", boxShadow: "0 4px 20px rgba(44,26,14,0.07)" }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)` }} />

    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-400 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, color: "#fff" }}>
        {icon}
      </div>
      <div className="text-right">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1" style={{ color: "#8a7660" }}>{title}</h3>
        <p className="text-4xl font-display font-bold tracking-tighter" style={{ color: DARK }}>{value}</p>
      </div>
    </div>
    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(200,150,62,0.1)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "70%" }}
        transition={{ duration: 1, delay: delay + 0.5 }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}60)` }}
      />
    </div>
  </motion.div>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /></svg>,
  Portfolio: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Gallery: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Bookings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Tag: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
};

// ─── Main ─────────────────────────────────────────────────────────────────────
function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", roomType: "", images: "", videos: "" });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mediaCategory, setMediaCategory] = useState("Bedroom");
  const [activeMediaFilter, setActiveMediaFilter] = useState("All");
  const [pendingUploads, setPendingUploads] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [editingMediaId, setEditingMediaId] = useState(null);
  const [tempMediaName, setTempMediaName] = useState("");
  const [tempMediaCategory, setTempMediaCategory] = useState("");
  const mediaFileInputRef = useRef(null);
  const projectFileInputRef = useRef(null);

  // Check for existing cookie session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        await authAPI.me();
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {}
    setIsAuthenticated(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        setIsAuthenticated(true);
        setLoginError("");
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid credentials");
    }
  };

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    const hasData =
      (activeTab === "dashboard") ||
      (activeTab === "projects" && projects.length > 0) ||
      (activeTab === "bookings" && bookings.length > 0) ||
      (activeTab === "media" && mediaFiles.length > 0);
    if (!hasData) setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const [projRes, bookRes] = await Promise.all([
          projectsAPI.getAll().catch(() => ({ data: [] })),
          bookingsAPI.getAll().catch(() => ({ data: [] })),
        ]);
        setProjects(projRes.data || []);
        setBookings(bookRes.data || []);
      } else if (activeTab === "projects") {
        const res = await projectsAPI.getAll();
        setProjects(res.data || []);
      } else if (activeTab === "bookings") {
        const res = await bookingsAPI.getAll();
        setBookings(res.data || []);
      } else if (activeTab === "media") {
        const res = await uploadAPI.getAll().catch(() => ({ data: [] }));
        setMediaFiles(res.data || []);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
    setInitialLoading(false);
  }, [activeTab]); // Remove projects.length etc to break the feedback loop

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(initialLoading);
    }
  }, [fetchData, isAuthenticated]); // Only run when auth status changes or tab changes
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPendingUploads(prev => [...prev, ...files.map(file => ({
      file, preview: URL.createObjectURL(file), category: mediaCategory,
      id: `${Date.now()}-${Math.random()}`,
    }))]);
    e.target.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!pendingUploads.length) return;
    setLoading(true);
    try {
      for (const item of pendingUploads) {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("category", item.category);
        if (USE_MOCK) {
          setMediaFiles(prev => [{ name: item.file.name, url: item.preview, category: item.category, isMock: true }, ...prev]);
        } else {
          const res = await uploadAPI.upload(formData);
          const fullUrl = res.data.fileUrl.startsWith("http") ? res.data.fileUrl : `${API_URL}${res.data.fileUrl}`;
          setMediaFiles(prev => [{ name: item.file.name, url: fullUrl, category: item.category }, ...prev]);
        }
      }
      setPendingUploads([]);
      if (!USE_MOCK) fetchData();
    } catch (err) { console.error(err); alert("Upload failed."); }
    setLoading(false);
  };

  const handleProjectFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLoading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      if (USE_MOCK) {
        await new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => { setUploadedFiles(prev => [...prev, reader.result]); resolve(); };
          reader.readAsDataURL(file);
        });
      } else {
        try {
          const res = await uploadAPI.upload(formData);
          const fullUrl = res.data.fileUrl.startsWith("http") ? res.data.fileUrl : `${API_URL}${res.data.fileUrl}`;
          setUploadedFiles(prev => [...prev, fullUrl]);
        } catch (err) { console.error(err); }
      }
    }
    setLoading(false);
    e.target.value = "";
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const manualImages = newProject.images ? newProject.images.split(",").map(u => u.trim()).filter(Boolean) : [];
      const projectData = { ...newProject, images: [...manualImages, ...uploadedFiles], videos: newProject.videos ? newProject.videos.split(",").map(v => v.trim()) : [] };
      if (editingId) await projectsAPI.update(editingId, projectData);
      else await projectsAPI.create(projectData);
      setShowProjectForm(false); setEditingId(null);
      setNewProject({ title: "", description: "", roomType: "", images: "", videos: "" });
      setUploadedFiles([]);
      fetchData();
    } catch (err) {
      console.error(err);
      setProjects([{ ...newProject, _id: Date.now().toString(), images: [...uploadedFiles] }, ...projects]);
      setShowProjectForm(false);
    }
    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { await projectsAPI.delete(id); fetchData(); }
    catch { setProjects(projects.filter(p => p._id !== id)); }
  };

  const updateBookingStatus = async (id, status) => {
    try { await bookingsAPI.updateStatus(id, status); fetchData(); }
    catch { setBookings(bookings.map(b => b._id === id ? { ...b, status } : b)); }
  };

  const filteredMedia = activeMediaFilter === "All" ? mediaFiles : mediaFiles.filter(f => f.category === activeMediaFilter);
  const usedCategories = ["All", ...Array.from(new Set(mediaFiles.map(f => f.category).filter(Boolean)))];

  const tabs = [
    { id: "dashboard", label: "Overview", icon: <Icons.Dashboard /> },
    { id: "projects", label: "Portfolio", icon: <Icons.Portfolio /> },
    { id: "media", label: "Gallery", icon: <Icons.Gallery /> },
    { id: "bookings", label: "Appointments", icon: <Icons.Bookings /> },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // LOGIN PAGE
  // ══════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${DARKEST} 0%, ${DARK} 40%, ${DARK2} 100%)` }}>

        {/* Gold bokeh glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(200,150,62,0.18) 0%, transparent 70%)`, filter: "blur(80px)" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(200,150,62,0.10) 0%, transparent 70%)`, filter: "blur(60px)" }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.05]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md rounded-[2.5rem] p-8 md:p-14"
          style={{
            background: "rgba(255,253,248,0.97)",
            border: "1px solid rgba(200,150,62,0.2)",
            boxShadow: "0 50px 100px rgba(0,0,0,0.5)",
          }}
        >
          {/* Logo mark */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center font-display font-bold text-3xl"
              style={{ background: `linear-gradient(135deg, ${DARK}, ${DARK2})`, color: GOLD, boxShadow: "0 12px 40px rgba(44,26,14,0.35)" }}>
              II
            </div>
            <h1 className="font-display font-bold text-4xl mb-2 tracking-tight" style={{ color: DARK }}>
              Italian Interiors
            </h1>
            <p className="font-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-6" style={{ color: GOLD }}>
              Curated Management
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: "#8a7660" }}>Username</label>
              <input type="text" value={credentials.username}
                onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-6 py-4 outline-none transition-all rounded-2xl text-sm"
                style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.25)", color: DARK }}
                placeholder="admin" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: "#8a7660" }}>Password</label>
              <input type="password" value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-6 py-4 outline-none transition-all rounded-2xl text-sm"
                style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.25)", color: DARK }}
                placeholder="••••••••" />
            </div>

            {loginError && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider py-3 rounded-xl"
                style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.15)" }}>
                {loginError}
              </motion.p>
            )}

            <button type="submit"
              className="w-full py-5 font-accent font-bold text-[11px] uppercase tracking-[0.3em] rounded-2xl transition-all duration-300 mt-2"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: DARK, boxShadow: "0 8px 28px rgba(200,150,62,0.35)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(200,150,62,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,150,62,0.35)"; }}>
              Open Studio
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/" className="font-accent text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
              style={{ color: "#b5a080" }}
              onMouseEnter={e => e.target.style.color = GOLD}
              onMouseLeave={e => e.target.style.color = "#b5a080"}>
              ← Back to Main Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD SHELL
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body" style={{ background: BEIGE }}>
      <div className="fixed inset-0 bg-luxury-pattern opacity-[0.04] pointer-events-none" />

      {/* ── Mobile Header ── */}
      <div className="lg:hidden flex items-center justify-between px-6 py-5 sticky top-0 z-[60] border-b backdrop-blur-md"
        style={{ background: "rgba(30,16,6,0.95)", borderColor: "rgba(200,150,62,0.2)" }}>
        <h1 className="font-display font-bold text-lg tracking-tight" style={{ color: BEIGE2 }}>Italian Interiors</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2" style={{ color: GOLD }}>
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {/* ── Sidebar (Collapsible on Mobile) ── */}
      <AnimatePresence>
        {(mobileMenuOpen || window.innerWidth >= 1024) && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-[50]" 
              style={{ background: "rgba(15,11,5,0.8)", backdropFilter: "blur(4px)" }}
            />
            
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 flex flex-col fixed top-0 left-0 h-screen z-[55]"
              style={{
                background: `linear-gradient(180deg, ${DARKEST} 0%, ${DARK} 60%, ${DARK2} 100%)`,
                boxShadow: "10px 0 50px rgba(0,0,0,0.3)",
                borderRight: "1px solid rgba(200,150,62,0.12)",
              }}>
              {/* Sidebar content */}
              <div className="absolute top-0 right-0 w-full h-48 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top right, rgba(200,150,62,0.12) 0%, transparent 70%)", filter: "blur(30px)" }} />
              <div className="absolute inset-0 bg-luxury-pattern opacity-[0.04] pointer-events-none" />

              {/* Brand (Desktop only) */}
              <div className="hidden lg:block relative z-10 px-8 py-10 border-b text-center" style={{ borderColor: "rgba(200,150,62,0.12)" }}>
                <h1 className="font-display font-bold text-xl tracking-tight leading-none mb-2" style={{ color: BEIGE2 }}>
                  Italian Interiors
                </h1>
                <div className="h-0.5 w-8 rounded-full mx-auto" style={{ background: GOLD }} />
                <p className="font-accent font-bold uppercase mt-2" style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(200,150,62,0.55)" }}>
                  Studio Dashboard
                </p>
              </div>

              {/* Nav */}
              <nav className="relative z-10 flex-1 py-10 px-5 space-y-2">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-400 relative group"
                    style={activeTab === tab.id ? {
                      background: "rgba(200,150,62,0.15)",
                      border: "1px solid rgba(200,150,62,0.25)",
                      color: GOLD,
                    } : {
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "rgba(245,239,230,0.35)",
                    }}>
                    <span className="transition-transform duration-400 group-hover:scale-110">{tab.icon}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full" style={{ background: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
                    )}
                  </button>
                ))}
              </nav>

              {/* Sign out */}
              <div className="relative z-10 px-6 py-8 border-t" style={{ borderColor: "rgba(200,150,62,0.1)", background: "rgba(0,0,0,0.2)" }}>
                <button onClick={handleLogout}
                  className="flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-400"
                  style={{ background: "rgba(220,50,50,0.15)", color: "#f87171", border: "1px solid rgba(220,50,50,0.2)" }}>
                  End Session <Icons.Logout />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <main className="flex-1 lg:ml-72 p-6 md:p-10 lg:p-16 relative z-10 min-h-screen">

        {/* Header */}
        <header className={`flex flex-col md:flex-row justify-between items-start gap-8 mb-16 sticky top-0 md:top-0 z-40 transition-all duration-300 py-4 -mx-6 px-6 md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 ${isScrolled ? 'backdrop-blur-xl shadow-lg border-b' : ''}`}
          style={{ 
            background: isScrolled ? "rgba(255,253,248,0.85)" : "transparent",
            borderColor: isScrolled ? "rgba(200,150,62,0.15)" : "transparent"
          }}>
          <div>
            <h2 className="font-display font-bold tracking-tighter leading-none mb-4 transition-all duration-300"
              style={{ fontSize: isScrolled ? "clamp(1.5rem,4vw,2.5rem)" : "clamp(2.5rem,5vw,4rem)", color: DARK }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            {!isScrolled && (
              <div className="flex items-center gap-4">
                <div className="h-px w-12" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
                <p className="font-accent font-bold uppercase tracking-[0.35em] text-[10px]" style={{ color: "#b5a080" }}>Studio Console</p>
              </div>
            )}
          </div>
          <div className="px-5 md:px-7 py-3 md:py-4 rounded-2xl flex items-center gap-3 self-center md:self-auto"
            style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.2)", boxShadow: "0 4px 20px rgba(44,26,14,0.07)" }}>
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#4ade80", boxShadow: "0 0 10px #4ade80" }} />
            <span className="font-accent font-bold uppercase tracking-widest text-[9px] md:text-[10px]" style={{ color: "#8a7660" }}>
              {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* Add project button & Search */}
        {activeTab === "projects" && (
          <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96 group">
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl outline-none transition-all duration-300 font-accent text-[10px] tracking-widest uppercase"
                style={{ 
                  background: CREAM, 
                  border: "1px solid rgba(200,150,62,0.25)",
                  color: DARK,
                  boxShadow: "0 4px 12px rgba(44,26,14,0.04)"
                }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => { setEditingId(null); setNewProject({ title: "", description: "", roomType: "", images: "", videos: "" }); setShowProjectForm(!showProjectForm); }}
              className="flex items-center gap-3 px-10 py-4 rounded-xl font-accent font-bold text-[11px] uppercase tracking-[0.25em] transition-all duration-300 w-full md:w-auto justify-center"
              style={{ background: `linear-gradient(135deg, ${DARK}, ${DARK2})`, color: GOLD, boxShadow: "0 8px 28px rgba(44,26,14,0.25)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}>
              <Icons.Plus /> {showProjectForm ? "Close" : "New Creation"}
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {loading || initialLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full" style={{ border: "3px solid rgba(200,150,62,0.15)" }} />
              <div className="absolute inset-0 rounded-full animate-spin" style={{ border: "3px solid transparent", borderTopColor: GOLD }} />
            </div>
            <p className="font-accent font-bold uppercase tracking-[0.5em] animate-pulse text-[10px]" style={{ color: "#b5a080" }}>Loading…</p>
          </div>
        ) : (
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            {/* ═══════ DASHBOARD ═══════ */}
            {activeTab === "dashboard" && (
              <div className="space-y-10">
                {/* Stat cards — brown accent shades instead of purple/emerald/amber */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCard title="Total Projects" value={projects.length} icon={<Icons.Portfolio />} delay={0.1} accent={GOLD} />
                  <StatCard title="Appointments" value={bookings.length} icon={<Icons.Bookings />} delay={0.2} accent="#B8832A" />
                  <StatCard title="Pending Approvals" value={bookings.filter(b => b.status === "pending").length} icon={<Icons.Dashboard />} delay={0.3} accent="#7A4020" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">

                    {/* Recent projects */}
                    <div className="rounded-[2rem] p-10"
                      style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 24px rgba(44,26,14,0.06)" }}>
                      <div className="flex justify-between items-center mb-8 pb-5" style={{ borderBottom: "1px solid rgba(200,150,62,0.1)" }}>
                        <h3 className="font-bold uppercase tracking-[0.3em] text-[11px]" style={{ color: DARK }}>Recent Projects</h3>
                        <button onClick={() => setActiveTab("projects")} className="font-bold uppercase tracking-widest text-[10px] transition-opacity hover:opacity-70" style={{ color: GOLD }}>View All →</button>
                      </div>
                      <div className="space-y-4">
                        {projects.slice(0, 4).map((p, i) => (
                          <div key={i} className="flex items-center gap-6 p-5 rounded-xl"
                            style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.1)" }}>
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(200,150,62,0.1)" }}>
                              {p.images?.[0]
                                ? <img src={formatUrl(p.images[0])} alt={p.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center" style={{ color: "rgba(200,150,62,0.4)" }}><Icons.Portfolio /></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate" style={{ color: DARK }}>{p.title}</p>
                              <p className="font-bold uppercase tracking-widest mt-0.5 text-[10px]" style={{ color: "#b5a080" }}>{p.roomType}</p>
                            </div>
                          </div>
                        ))}
                        {projects.length === 0 && <p className="text-center py-8 font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No projects yet</p>}
                      </div>
                    </div>

                    {/* Pending bookings */}
                    <div className="rounded-[2rem] p-10"
                      style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 24px rgba(44,26,14,0.06)" }}>
                      <div className="flex justify-between items-center mb-8 pb-5" style={{ borderBottom: "1px solid rgba(200,150,62,0.1)" }}>
                        <h3 className="font-bold uppercase tracking-[0.3em] text-[11px]" style={{ color: DARK }}>Pending Approvals</h3>
                        <button onClick={() => setActiveTab("bookings")} className="font-bold uppercase tracking-widest text-[10px] transition-opacity hover:opacity-70" style={{ color: GOLD }}>View All →</button>
                      </div>
                      <div className="space-y-3">
                        {bookings.filter(b => b.status === "pending").slice(0, 3).map((b, i) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-xl"
                            style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.1)" }}>
                            <div>
                              <p className="font-bold text-sm" style={{ color: DARK }}>{b.clientName}</p>
                              <p className="font-bold uppercase tracking-widest mt-0.5 text-[10px]" style={{ color: "#b5a080" }}>{b.serviceType || "Interior Design"}</p>
                            </div>
                            <button onClick={() => updateBookingStatus(b._id, "confirmed")}
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all"
                              style={{ background: "rgba(74,222,128,0.1)", color: "#16a34a", border: "1px solid rgba(74,222,128,0.2)" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.color = "#16a34a"; }}>✓</button>
                          </div>
                        ))}
                        {bookings.filter(b => b.status === "pending").length === 0 && (
                          <p className="text-center py-8 font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No pending requests</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* By room type */}
                    <div className="rounded-[2rem] p-10"
                      style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 24px rgba(44,26,14,0.06)" }}>
                      <h3 className="font-bold uppercase tracking-[0.3em] text-[11px] mb-8 pb-5" style={{ color: DARK, borderBottom: "1px solid rgba(200,150,62,0.1)" }}>By Room Type</h3>
                      <div className="space-y-4">
                        {Array.from(new Set(projects.map(p => p.roomType).filter(Boolean))).map((type, i) => {
                          const count = projects.filter(p => p.roomType === type).length;
                          const pct = Math.round((count / projects.length) * 100);
                          return (
                            <div key={i}>
                              <div className="flex justify-between mb-1.5">
                                <span className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>{type}</span>
                                <span className="font-bold text-[10px]" style={{ color: DARK }}>{count}</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(200,150,62,0.12)" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                  className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${GOLD}, rgba(200,150,62,0.5))` }} />
                              </div>
                            </div>
                          );
                        })}
                        {projects.length === 0 && <p className="font-bold uppercase text-center py-4 text-[10px]" style={{ color: "#c8b99a" }}>No data</p>}
                      </div>
                    </div>

                    {/* System health */}
                    <div className="rounded-[2rem] p-10 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${DARKEST} 0%, ${DARK} 100%)`, border: "1px solid rgba(200,150,62,0.15)" }}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle, rgba(200,150,62,0.15) 0%, transparent 70%)", filter: "blur(30px)" }} />
                      <h3 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-7 relative z-10" style={{ color: "rgba(200,150,62,0.7)" }}>System</h3>
                      <div className="space-y-4 relative z-10">
                        {[
                          { label: "Status", value: <span className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "#4ade80" }}><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online</span> },
                          { label: "Gallery Files", value: mediaFiles.length },
                          { label: "Projects", value: projects.length },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "rgba(245,239,230,0.4)" }}>{row.label}</span>
                            <span className="font-bold text-[10px]" style={{ color: "rgba(245,239,230,0.8)" }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ PROJECTS ═══════ */}
            {activeTab === "projects" && (
              <div className="space-y-10">
                <AnimatePresence>
                  {showProjectForm && (
                    <motion.form initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                      onSubmit={handleAddProject}
                      className="rounded-[2rem] p-6 md:p-12 space-y-8"
                      style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.2)", boxShadow: "0 8px 40px rgba(44,26,14,0.1)" }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>Project Title</label>
                          <input value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl text-sm outline-none transition-all"
                            style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.2)", color: DARK }}
                            placeholder="Villa Serenity" required />
                        </div>
                        <div className="space-y-2">
                          <label className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>Room Type</label>
                          <select value={newProject.roomType} onChange={e => setNewProject({ ...newProject, roomType: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl text-sm outline-none appearance-none"
                            style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.2)", color: DARK }} required>
                            <option value="">Select type</option>
                            {ROOM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="Residential">Residential</option>
                            <option value="Hospitality">Hospitality</option>
                            <option value="Minimalist">Minimalist</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>Description</label>
                        <textarea value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl text-sm outline-none h-32 resize-none"
                          style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.2)", color: DARK }}
                          placeholder="Describe the design…" required />
                      </div>
                      <div className="space-y-3">
                        <label className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>Images</label>
                        <input value={newProject.images} onChange={e => setNewProject({ ...newProject, images: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl text-xs outline-none"
                          style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.2)", color: DARK }}
                          placeholder="Paste image URLs separated by commas, or upload below" />
                        <div onClick={() => projectFileInputRef.current?.click()}
                          className="h-32 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300"
                          style={{ background: "rgba(200,150,62,0.04)", border: "2px dashed rgba(200,150,62,0.3)" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(200,150,62,0.6)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(200,150,62,0.3)"}>
                          <div style={{ color: GOLD }}><Icons.Upload /></div>
                          <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#b5a080" }}>Click to upload images</p>
                        </div>
                        <input ref={projectFileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleProjectFileSelect} />
                        {uploadedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-3 p-4 rounded-xl" style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.1)" }}>
                            {uploadedFiles.map((url, i) => (
                              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ background: "rgba(220,50,50,0.75)" }}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-5 pt-6" style={{ borderTop: "1px solid rgba(200,150,62,0.1)" }}>
                        <button type="button" onClick={() => { setShowProjectForm(false); setEditingId(null); }}
                          className="px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors"
                          style={{ color: "#8a7660" }}
                          onMouseEnter={e => e.target.style.color = DARK}
                          onMouseLeave={e => e.target.style.color = "#8a7660"}>Discard</button>
                        <button type="submit"
                          className="px-10 py-3 rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-300"
                          style={{ background: `linear-gradient(135deg, ${DARK}, ${DARK2})`, color: GOLD, boxShadow: "0 4px 16px rgba(44,26,14,0.25)" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                          {editingId ? "Save Changes" : "Publish Project"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {projects.length === 0 ? (
                  <div className="py-28 text-center rounded-[2rem]"
                    style={{ background: "rgba(255,253,248,0.7)", border: "2px dashed rgba(200,150,62,0.2)" }}>
                    <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No projects yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects
                      .filter(p => !adminSearchTerm || 
                        p.title.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
                        p.roomType.toLowerCase().includes(adminSearchTerm.toLowerCase()))
                      .map(project => (
                        <div key={project._id} className="group rounded-[2rem] overflow-hidden transition-all duration-500"
                        style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 20px rgba(44,26,14,0.07)" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 16px 50px rgba(44,26,14,0.14)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(44,26,14,0.07)"}>
                        <div className="relative h-60 overflow-hidden">
                          <img src={project.images?.[0] ? formatUrl(project.images[0]) : "https://via.placeholder.com/800x600?text=No+Image"} alt={project.title}
                            loading="lazy" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                            onError={e => { e.target.src = "https://via.placeholder.com/800x600?text=No+Image"; }} />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center gap-5"
                            style={{ background: "rgba(255,253,248,0.93)", backdropFilter: "blur(8px)" }}>
                            <button onClick={() => {
                              setEditingId(project._id);
                              setNewProject({ title: project.title, description: project.description, roomType: project.roomType, images: (project.images || []).join(", "), videos: (project.videos || []).join(", ") });
                              setShowProjectForm(true);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                              style={{ background: DARK, color: GOLD }}
                              onMouseEnter={e => { e.currentTarget.style.background = DARK2; e.currentTarget.style.transform = "scale(1.1)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.transform = "scale(1)"; }}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => deleteProject(project._id)}
                              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                              style={{ background: "rgba(220,50,50,0.1)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.2)" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.1)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.1)"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.transform = "scale(1)"; }}>✕</button>
                          </div>
                        </div>
                        <div className="p-8" style={{ borderTop: "1px solid rgba(200,150,62,0.08)" }}>
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <h3 className="font-display font-bold text-xl leading-tight" style={{ color: DARK }}>{project.title}</h3>
                            <span className="font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg flex-shrink-0 text-[9px]"
                              style={{ background: "rgba(200,150,62,0.1)", color: GOLD, border: "1px solid rgba(200,150,62,0.15)" }}>
                              {project.roomType}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#8a7660" }}>{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════ MEDIA GALLERY ═══════ */}
            {activeTab === "media" && (
              <div className="space-y-8">
                <div className="rounded-[2rem] p-10"
                  style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.2)", boxShadow: "0 4px 24px rgba(44,26,14,0.06)" }}>
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-5 gap-4" style={{ borderBottom: "1px solid rgba(200,150,62,0.1)" }}>
                    <h3 className="font-bold uppercase tracking-[0.3em] text-[11px]"
                      style={{ color: DARK }}>Upload to Gallery</h3>
                    
                    <div className="relative w-full md:w-64 group">
                      <input 
                        type="text" 
                        placeholder="Search gallery..." 
                        value={adminSearchTerm}
                        onChange={(e) => setAdminSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-all duration-300 font-accent text-[9px] tracking-widest uppercase"
                        style={{ 
                          background: BEIGE, 
                          border: "1px solid rgba(200,150,62,0.15)",
                          color: DARK
                        }}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex-1 space-y-2">
                      <label className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-2" style={{ color: "#8a7660" }}>
                        <Icons.Tag /> Room Category
                      </label>
                      <select value={mediaCategory} onChange={e => setMediaCategory(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl text-sm outline-none appearance-none"
                        style={{ background: BEIGE, border: "1px solid rgba(200,150,62,0.2)", color: DARK }}>
                        {ROOM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button type="button" onClick={() => mediaFileInputRef.current?.click()}
                        className="flex items-center gap-3 px-10 py-4 rounded-xl font-accent font-bold text-[11px] uppercase tracking-[0.25em] transition-all duration-300"
                        style={{ background: `linear-gradient(135deg, ${DARK}, ${DARK2})`, color: GOLD, boxShadow: "0 6px 24px rgba(44,26,14,0.2)" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                        <Icons.Upload /> Select Files
                      </button>
                      <input ref={mediaFileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {pendingUploads.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="pt-6" style={{ borderTop: "1px solid rgba(200,150,62,0.1)" }}>
                          <div className="flex justify-between items-center mb-5">
                            <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#8a7660" }}>
                              {pendingUploads.length} file{pendingUploads.length > 1 ? "s" : ""} staged
                            </p>
                            <button onClick={() => setPendingUploads([])}
                              className="font-bold uppercase tracking-widest text-[10px] transition-colors"
                              style={{ color: "#c8b99a" }}
                              onMouseEnter={e => e.target.style.color = "#dc2626"}
                              onMouseLeave={e => e.target.style.color = "#c8b99a"}>Clear All</button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            {pendingUploads.map(item => (
                              <div key={item.id} className="relative group rounded-xl overflow-hidden"
                                style={{ border: "1px solid rgba(200,150,62,0.15)" }}>
                                <div className="aspect-square"><img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" /></div>
                                <select value={item.category}
                                  onChange={e => setPendingUploads(prev => prev.map(u => u.id === item.id ? { ...u, category: e.target.value } : u))}
                                  className="w-full px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider outline-none appearance-none text-center"
                                  style={{ background: CREAM, borderTop: "1px solid rgba(200,150,62,0.15)", color: "#6b5c45" }}>
                                  {ROOM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <button onClick={() => setPendingUploads(prev => prev.filter(u => u.id !== item.id))}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                  style={{ background: "#dc2626" }}>✕</button>
                              </div>
                            ))}
                          </div>
                          <button onClick={handleConfirmUpload}
                            className="w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-300"
                            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: DARK, boxShadow: "0 6px 24px rgba(200,150,62,0.3)" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                            Confirm & Upload {pendingUploads.length} File{pendingUploads.length > 1 ? "s" : ""}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter pills */}
                {mediaFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {usedCategories.map(cat => (
                      <button key={cat} onClick={() => setActiveMediaFilter(cat)}
                        className="px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-400"
                        style={activeMediaFilter === cat ? {
                          background: `linear-gradient(135deg, ${DARK}, ${DARK2})`,
                          color: GOLD,
                          boxShadow: "0 8px 24px rgba(44,26,14,0.2)",
                        } : {
                          background: CREAM,
                          color: "#8a7660",
                          border: "1px solid rgba(200,150,62,0.2)",
                        }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {filteredMedia.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <AnimatePresence>
                      {filteredMedia
                        .filter(f => !adminSearchTerm || 
                          f.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) || 
                          (f.category && f.category.toLowerCase().includes(adminSearchTerm.toLowerCase())))
                        .map((file, index) => (
                          <motion.div key={`${file.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="group relative rounded-[1.5rem] overflow-hidden transition-all duration-400"
                          style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 2px 12px rgba(44,26,14,0.06)" }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(44,26,14,0.14)"; e.currentTarget.style.borderColor = "rgba(200,150,62,0.35)"; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(44,26,14,0.06)"; e.currentTarget.style.borderColor = "rgba(200,150,62,0.15)"; }}>
                          <div className="aspect-[4/5] overflow-hidden">
                            <img src={formatUrl(file.url)} alt={file.name} loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                              onError={e => { e.target.src = "https://via.placeholder.com/400x500?text=Missing"; }} />
                          </div>
                          {file.category && (
                            <div className="px-4 py-2.5" style={{ borderTop: "1px solid rgba(200,150,62,0.1)" }}>
                              <span className="font-bold uppercase tracking-widest text-[9px]" style={{ color: GOLD }}>{file.category}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col items-center justify-center gap-4 p-5"
                            style={{ background: "rgba(255,253,248,0.95)", backdropFilter: "blur(8px)" }}>
                             <p className="font-bold uppercase tracking-wider text-center break-all text-[9px]" style={{ color: "#6b5c45" }}>{file.name}</p>
                             
                             {editingMediaId === file.name ? (
                               <div className="flex flex-col gap-2 w-full">
                                 <input 
                                   className="w-full px-3 py-2 rounded-lg text-[10px] outline-none" 
                                   style={{ background: "#fff", border: `1px solid ${GOLD}` }} 
                                   value={tempMediaName} 
                                   onChange={e => setTempMediaName(e.target.value)} 
                                   placeholder="New Title"
                                 />
                                 <select 
                                   className="w-full px-3 py-2 rounded-lg text-[10px] outline-none appearance-none" 
                                   style={{ background: "#fff", border: `1px solid ${GOLD}` }}
                                   value={tempMediaCategory}
                                   onChange={e => setTempMediaCategory(e.target.value)}
                                 >
                                   {ROOM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                 </select>
                                 <div className="flex gap-2">
                                   <button 
                                     onClick={async () => {
                                       setLoading(true);
                                       try {
                                         await uploadAPI.updateMetadata(file.name, { title: tempMediaName, roomType: tempMediaCategory });
                                         setEditingMediaId(null);
                                         fetchData();
                                       } catch (err) { alert("Failed to update"); }
                                       setLoading(false);
                                     }}
                                     className="flex-1 py-2 rounded-lg text-white text-[9px] font-bold uppercase tracking-widest" 
                                     style={{ background: DARK }}>Save</button>
                                   <button 
                                     onClick={() => setEditingMediaId(null)}
                                     className="px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest" 
                                     style={{ background: "rgba(220,50,50,0.1)", color: "#dc2626" }}>✕</button>
                                 </div>
                               </div>
                             ) : (
                               <>
                                 <span className="px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[9px]"
                                   style={{ background: "rgba(200,150,62,0.1)", color: GOLD, border: "1px solid rgba(200,150,62,0.2)" }}>
                                   {file.category || "Uncategorised"}
                                 </span>
                                 <div className="flex gap-3">
                                   <button
                                     onClick={() => {
                                       setEditingMediaId(file.name);
                                       setTempMediaName(file.name);
                                       setTempMediaCategory(file.category || "Bedroom");
                                     }}
                                     className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                     style={{ background: DARK, color: GOLD }}
                                     onMouseEnter={e => e.currentTarget.style.background = DARK2}
                                     onMouseLeave={e => e.currentTarget.style.background = DARK}><Icons.Edit /></button>
                                   <button
                                     onClick={async () => {
                                       if (!window.confirm("Delete this file?")) return;
                                       try { await uploadAPI.delete(file.name); fetchData(); }
                                       catch { setMediaFiles(prev => prev.filter((_, i) => i !== index)); }
                                     }}
                                     className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                     style={{ background: "rgba(220,50,50,0.1)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.2)" }}
                                     onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                                     onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.1)"; e.currentTarget.style.color = "#dc2626"; }}>✕</button>
                                 </div>
                               </>
                             )}
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="py-40 rounded-[2rem] flex flex-col items-center gap-6"
                    style={{ background: "rgba(255,253,248,0.7)", border: "2px dashed rgba(200,150,62,0.2)" }}>
                    <div style={{ color: "rgba(200,150,62,0.3)", transform: "scale(2)" }}><Icons.Gallery /></div>
                    <p className="font-bold uppercase tracking-[0.5em] text-[10px]" style={{ color: "#c8b99a" }}>
                      {activeMediaFilter === "All" ? "No gallery images uploaded yet" : `No gallery images in "${activeMediaFilter}"`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ═══════ BOOKINGS ═══════ */}
            {activeTab === "bookings" && (
              <div className="rounded-[2rem] overflow-hidden"
                style={{ background: CREAM, border: "1px solid rgba(200,150,62,0.15)", boxShadow: "0 4px 24px rgba(44,26,14,0.06)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ background: "rgba(200,150,62,0.06)", borderBottom: "1px solid rgba(200,150,62,0.12)" }}>
                        {["Client", "Request", "Status", "Schedule", "Actions"].map(h => (
                          <th key={h} className="px-10 py-7 font-bold uppercase tracking-[0.35em] text-[10px]" style={{ color: "#8a7660" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, rowIdx) => (
                        <tr key={booking._id}
                          style={{ borderBottom: rowIdx < bookings.length - 1 ? "1px solid rgba(200,150,62,0.07)" : "none" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(200,150,62,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td className="px-10 py-8">
                            <p className="font-bold text-base mb-0.5" style={{ color: DARK }}>{booking.clientName}</p>
                            <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#b5a080" }}>
                              {booking.email}{booking.phone && ` · ${booking.phone}`}
                            </p>
                          </td>
                          <td className="px-10 py-8 max-w-xs">
                            <span className="inline-block px-3 py-1 rounded-lg font-bold uppercase tracking-widest text-[9px] mb-2"
                              style={{ background: "rgba(200,150,62,0.1)", color: GOLD, border: "1px solid rgba(200,150,62,0.15)" }}>
                              {booking.serviceType || "Consultation"}
                            </span>
                            <p className="text-sm italic line-clamp-2" style={{ color: "#8a7660" }}>"{booking.message}"</p>
                          </td>
                          <td className="px-10 py-8">
                            <span className="px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-[10px]"
                              style={booking.status === "confirmed"
                                ? { background: "rgba(74,222,128,0.1)", color: "#16a34a", border: "1px solid rgba(74,222,128,0.2)" }
                                : { background: "rgba(200,150,62,0.1)", color: GOLD, border: "1px solid rgba(200,150,62,0.2)" }}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-10 py-8">
                            <p className="font-bold text-sm" style={{ color: DARK }}>{booking.bookingDate || "Flexible"}</p>
                            <p className="font-bold uppercase tracking-widest mt-0.5 text-[10px]" style={{ color: "#b5a080" }}>{booking.bookingTime || "TBD"}</p>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex gap-3">
                              {booking.status === "pending" && (
                                <button onClick={() => updateBookingStatus(booking._id, "confirmed")}
                                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all"
                                  style={{ background: "rgba(74,222,128,0.1)", color: "#16a34a", border: "1px solid rgba(74,222,128,0.2)" }}
                                  onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.color = "#16a34a"; }}>✓</button>
                              )}
                              <button onClick={async () => {
                                if (!window.confirm("Delete booking?")) return;
                                try { await bookingsAPI.delete(booking._id); fetchData(); }
                                catch { setBookings(prev => prev.filter(b => b._id !== booking._id)); }
                              }}
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                style={{ background: "rgba(220,50,50,0.07)", color: "#dc2626", border: "1px solid rgba(220,50,50,0.15)" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,50,50,0.07)"; e.currentTarget.style.color = "#dc2626"; }}>✕</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bookings.length === 0 && (
                  <div className="py-28 text-center">
                    <p className="font-bold uppercase tracking-widest text-[10px]" style={{ color: "#c8b99a" }}>No bookings yet</p>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Admin;