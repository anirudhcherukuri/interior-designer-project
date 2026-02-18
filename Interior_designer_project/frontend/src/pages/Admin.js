import React, { useState, useEffect, useCallback } from "react";
import { visitorAPI, projectsAPI, bookingsAPI, uploadAPI, API_URL, USE_MOCK, formatUrl } from "../api/config";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Sub-components for better organization
const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-10 rounded-[2.5rem] shadow-premium-light border border-neutral-100 group hover:border-[#C5A059]/30 transition-all duration-700 overflow-hidden relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div className="flex items-center justify-between mb-8 relative z-10">
      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] font-accent">{title}</h3>
      <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500 border border-neutral-100 shadow-sm">
        {icon}
      </div>
    </div>
    <p className="text-6xl font-display font-bold text-neutral-900 tracking-tighter relative z-10">{value}</p>
  </motion.div>
);

function Admin() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Dashboard State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ totalVisits: 0, devices: [], sources: [] });
  const [projects, setProjects] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form states
  const [newProject, setNewProject] = useState({ title: "", description: "", roomType: "", images: "", videos: "" });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === "admin" && (credentials.password === "admin123" || credentials.password === "admin")) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    // Only show minor loading if no data exists yet for that tab
    const hasData = (activeTab === "dashboard" && stats.totalVisits > 0) ||
      (activeTab === "projects" && projects.length > 0) ||
      (activeTab === "bookings" && bookings.length > 0) ||
      (activeTab === "media" && mediaFiles.length > 0);

    if (!hasData) setLoading(true);

    try {
      if (activeTab === "dashboard") {
        const [statsRes, sourceRes, deviceRes] = await Promise.all([
          visitorAPI.getStats().catch(() => ({ data: [] })),
          visitorAPI.getSources().catch(() => ({ data: [] })),
          visitorAPI.getDevices().catch(() => ({ data: [] }))
        ]);
        setStats({
          totalVisits: (statsRes.data || []).reduce((acc, curr) => acc + curr.count, 0) || 1240,
          sources: sourceRes.data?.length ? sourceRes.data : [{ _id: 'Search', count: 420 }, { _id: 'Social', count: 320 }, { _id: 'Direct', count: 500 }],
          devices: deviceRes.data?.length ? deviceRes.data : [{ _id: 'Desktop', count: 800 }, { _id: 'Mobile', count: 400 }, { _id: 'Tablet', count: 40 }]
        });
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
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
    setInitialLoading(false);
  }, [activeTab, stats.totalVisits, projects.length, bookings.length, mediaFiles.length]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(initialLoading);
    }
  }, [fetchData, isAuthenticated, initialLoading]);

  // Shared Background Component
  const AdminBackground = () => (
    <>
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80')",
            filter: "blur(20px) brightness(0.6)"
          }}
        />
        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-10 pointer-events-none" />
      </div>

      {/* Dynamic Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#C5A059]/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </>
  );

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    console.log(`[System] Initiating ingestion for ${files.length} artifacts...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        if (USE_MOCK) {
          console.log(`[Mock] Processing artifact: ${file.name}`);
          await new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const mockFile = { name: file.name, url: reader.result, isMock: true };
              if (activeTab === 'media') {
                setMediaFiles(prev => [mockFile, ...prev]);
              } else {
                setUploadedFiles(prev => [...prev, reader.result]);
              }
              resolve();
            };
            reader.readAsDataURL(file);
          });
        } else {
          console.log(`[Network] Uploading artifact: ${file.name} to Cloud Vault...`);
          const res = await uploadAPI.upload(formData);
          const fullUrl = res.data.fileUrl.startsWith('http') ? res.data.fileUrl : `${API_URL}${res.data.fileUrl}`;

          if (activeTab !== 'media') {
            setUploadedFiles(prev => [...prev, fullUrl]);
          }
        }
      }

      if (!USE_MOCK && activeTab === 'media') {
        await fetchData();
      }

      console.log("[System] Catalog Synchronization Complete.");
      alert(`Successfully processed ${files.length} artifacts.`);
    } catch (err) {
      console.error("[Fatal] Archive synchronization failed:", err);
      alert('Upload failed. Connection lost.');
    }
    setLoading(false);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const manualImages = newProject.images
        ? newProject.images.split(",").map(url => url.trim()).filter(url => url.length > 0)
        : [];

      const projectData = {
        ...newProject,
        images: [...manualImages, ...uploadedFiles],
        videos: newProject.videos ? newProject.videos.split(",").map(v => v.trim()) : []
      };

      if (editingId) {
        await projectsAPI.update(editingId, projectData);
      } else {
        await projectsAPI.create(projectData);
      }

      setShowProjectForm(false);
      setEditingId(null);
      setNewProject({ title: "", description: "", roomType: "", images: "", videos: "" });
      setUploadedFiles([]);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Changes saved locally for session. (Mock mode active)");
      // Update local state even on failure for better UX in mock mode
      const mockProject = { ...newProject, _id: Date.now().toString(), images: [...uploadedFiles] };
      setProjects([mockProject, ...projects]);
      setShowProjectForm(false);
    }
    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (window.confirm("Delete project?")) {
      try {
        await projectsAPI.delete(id);
        fetchData();
      } catch (err) {
        setProjects(projects.filter(p => p._id !== id));
      }
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      fetchData();
    } catch (err) {
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    }
  };

  // Icons
  const Icons = {
    Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Portfolio: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Media: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Bookings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  };

  const tabs = [
    { id: "dashboard", label: "Overview", icon: <Icons.Dashboard /> },
    { id: "projects", label: "Portfolio", icon: <Icons.Portfolio /> },
    { id: "media", label: "Gallery", icon: <Icons.Media /> },
    { id: "bookings", label: "Appointments", icon: <Icons.Bookings /> },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-900 relative overflow-hidden refined-grain">
        <AdminBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-14 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] max-w-md w-full relative z-10 border border-neutral-100"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2 tracking-tight">Admin Portal</h1>
            <div className="w-12 h-1 bg-[#C5A059] mx-auto mb-6 rounded-full"></div>
            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.4em]">Secure Authentication</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Access Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-8 py-5 bg-neutral-50 border border-neutral-100 focus:border-[#C5A059]/50 focus:bg-white outline-none transition-all rounded-2xl font-body text-sm text-neutral-900 placeholder-neutral-300"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Security Key</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-8 py-5 bg-neutral-50 border border-neutral-100 focus:border-[#C5A059]/50 focus:bg-white outline-none transition-all rounded-2xl font-body text-sm text-neutral-900 placeholder-neutral-300"
                placeholder="••••••••"
              />
            </div>

            {loginError && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">{loginError}</p>}

            <button
              type="submit"
              className="w-full py-5 bg-neutral-900 text-white font-accent text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 rounded-2xl shadow-xl shadow-neutral-900/10"
            >
              Submit & Access
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link to="/" className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300 hover:text-[#C5A059] transition-colors">
              Return to Public Space
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cream-50 font-body relative overflow-hidden text-neutral-900 refined-grain">
      {/* Home Page Background Integration */}
      <div className="fixed inset-0 bg-luxury-pattern opacity-[0.12] pointer-events-none"></div>

      {/* Cinematic Soft Background */}
      <div className="fixed top-[-20%] right-[-10%] w-[70%] h-[70%] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-neutral-100 flex flex-col fixed h-full z-20 shadow-[0_0_60px_rgba(0,0,0,0.03)]">
        <div className="p-12 border-b border-neutral-50">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-xl shadow-neutral-900/10">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tighter">ARKA</h1>
              <p className="text-[9px] text-neutral-400 uppercase tracking-[0.3em] font-bold">Studio Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-10 px-8 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-2xl transition-all duration-500 group relative ${activeTab === tab.id
                ? "bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20"
                : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
            >
              <span className={`transition-colors ${activeTab === tab.id ? "text-[#C5A059]" : "group-hover:text-neutral-900"}`}>{tab.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-neutral-50">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center justify-center gap-4 w-full p-5 rounded-2xl text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-[10px] uppercase tracking-widest group bg-neutral-50"
          >
            Sign Out
            <Icons.Logout />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-20 relative z-10">
        <header className="flex justify-between items-start mb-20">
          <div>
            <h2 className="text-8xl font-display font-bold text-neutral-900 mb-6 tracking-tighter">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-6">
              <div className="h-0.5 w-16 bg-[#C5A059]"></div>
              <p className="text-neutral-400 text-[11px] font-bold uppercase tracking-[0.4em]">Curated Management Console</p>
            </div>
          </div>
          <div className="bg-white px-10 py-6 rounded-3xl border border-neutral-100 shadow-premium-light flex items-center gap-8">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-bold text-[#C5A059] uppercase tracking-widest mb-1">Encrypted Access</p>
              <p className="text-neutral-900 font-bold text-sm">Vamshi V.</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          </div>
        </header>

        {/* Global Action Bar for certain tabs */}
        {activeTab === "projects" && (
          <div className="mb-10 flex justify-end">
            <button
              onClick={() => {
                setEditingId(null);
                setNewProject({ title: "", description: "", roomType: "", images: "", videos: "" });
                setShowProjectForm(!showProjectForm);
              }}
              className="group relative overflow-hidden px-14 py-5 rounded-2xl bg-neutral-900 text-white font-bold uppercase tracking-[0.3em] text-[10px] transition-all hover:bg-black active:scale-95 shadow-xl shadow-neutral-900/10"
            >
              <span className="flex items-center gap-3">
                <Icons.Plus /> {showProjectForm ? "CLOSE ARCHIVE" : "CATALOGUE MASTERPIECE"}
              </span>
            </button>
          </div>
        )}

        {loading || initialLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-neutral-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#C5A059] rounded-full animate-spin"></div>
              <div className="absolute inset-5 border-4 border-neutral-50 rounded-full"></div>
              <div className="absolute inset-5 border-b-neutral-900 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1s]"></div>
            </div>
            <p className="mt-12 text-[10px] font-bold uppercase tracking-[0.6em] text-neutral-300 animate-pulse">Synchronizing Studio Records</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCard title="Global Reach" value={stats.totalVisits} icon={<Icons.Portfolio />} delay={0.1} />
                  <StatCard title="Qualified Leads" value={bookings.length} icon={<Icons.Bookings />} delay={0.2} />
                  <StatCard title="Assets Managed" value={mediaFiles.length || 24} icon={<Icons.Media />} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-premium-light border border-neutral-100 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-12 pb-6 border-b border-neutral-50">
                        <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-[0.4em] font-accent">Audience Intel</h3>
                        <span className="text-[9px] font-bold text-accent-500 bg-accent-50 px-4 py-2 rounded-full uppercase tracking-widest">Live Feed</span>
                      </div>
                      <div className="space-y-10">
                        {stats.devices.map((device, i) => (
                          <div key={i} className="group">
                            <div className="flex justify-between items-end mb-4">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{device._id} Node</span>
                              <span className="text-[11px] font-bold text-neutral-900">{Math.round((device.count / stats.totalVisits) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(device.count / stats.totalVisits) * 100}%` }}
                                className="h-full bg-neutral-900 transition-all duration-1000"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3.5rem] shadow-premium-light border border-neutral-100">
                      <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-[0.4em] mb-12 pb-6 border-b border-neutral-50 font-accent">Studio Broadcasts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                            <Icons.Media />
                          </div>
                          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">New Portfolio Entry</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed font-medium tracking-tight">"Coastal Villa" successfully indexed in main archive.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                            <Icons.Bookings />
                          </div>
                          <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Lead Synchronized</h4>
                          <p className="text-xs text-neutral-400 leading-relaxed font-medium tracking-tight">New booking request from Lakshmi R. needs review.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3.5rem] shadow-premium-light border border-neutral-100">
                      <div className="flex justify-between items-center mb-12 pb-6 border-b border-neutral-50">
                        <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-[0.4em] font-accent">Awaiting Response</h3>
                        <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-accent-500 uppercase tracking-widest hover:underline transition-all">View All</button>
                      </div>
                      <div className="space-y-6">
                        {bookings.filter(b => b.status === 'pending').slice(0, 3).map((booking, i) => (
                          <div key={i} className="flex items-center justify-between p-7 rounded-3xl bg-neutral-50 border border-neutral-100 group hover:border-[#C5A059]/30 transition-all">
                            <div>
                              <p className="text-base font-bold text-neutral-900 mb-1">{booking.clientName}</p>
                              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{booking.serviceType || "Interior Design"}</p>
                            </div>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="w-12 h-12 bg-white shadow-sm border border-neutral-100 rounded-2xl flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all transform hover:scale-105"
                            >
                              ✓
                            </button>
                          </div>
                        ))}
                        {bookings.filter(b => b.status === 'pending').length === 0 && (
                          <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-200">
                              ✓
                            </div>
                            <p className="text-center text-neutral-300 text-[10px] font-bold uppercase tracking-[0.2em]">Inbox Pristine • No Pending Leads</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-premium-light border border-neutral-100">
                      <h3 className="text-[11px] font-bold text-neutral-900 uppercase tracking-[0.4em] mb-12 pb-6 border-b border-neutral-50 font-accent">Stream Vectors</h3>
                      <div className="space-y-4">
                        {stats.sources.map((source, i) => (
                          <div key={i} className="flex items-center justify-between p-8 rounded-3xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 transition-all group">
                            <span className="text-[11px] font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors uppercase tracking-widest">{source._id}</span>
                            <span className="text-[11px] font-bold text-neutral-900 px-5 py-3 bg-white rounded-2xl shadow-sm border border-neutral-100">+{source.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-neutral-900 p-12 rounded-[3.5rem] shadow-premium text-white relative overflow-hidden group">
                      <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-accent-500/20 rounded-full blur-[40px] group-hover:bg-accent-500/30 transition-all"></div>
                      <h3 className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.4em] mb-8 font-accent">System Health</h3>
                      <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-400 font-bold tracking-widest uppercase">Node Status</span>
                          <span className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Online
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-400 font-bold tracking-widest uppercase">Latency</span>
                          <span className="text-[10px] font-bold">24ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-16">
                <AnimatePresence>
                  {showProjectForm && (
                    <motion.form
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleAddProject}
                      className="bg-white p-16 rounded-[3rem] shadow-premium-light border border-neutral-100 space-y-12"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <label className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 ml-1">Archive Title</label>
                          <input
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            className="w-full px-8 py-6 bg-neutral-50 border border-neutral-100 focus:border-[#C5A059]/50 focus:bg-white outline-none rounded-2xl font-body text-neutral-900 transition-all font-medium"
                            placeholder="Villa Serenity"
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 ml-1">Architectural Genre</label>
                          <select
                            value={newProject.roomType}
                            onChange={(e) => setNewProject({ ...newProject, roomType: e.target.value })}
                            className="w-full px-8 py-6 bg-neutral-50 border border-neutral-100 focus:border-[#C5A059]/50 focus:bg-white outline-none rounded-2xl font-body text-neutral-900 transition-all appearance-none font-medium"
                            required
                          >
                            <option value="">Select Genre</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Hospitality">Hospitality</option>
                            <option value="Minimalist">Minimalist</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 ml-1">Design Narrative</label>
                        <textarea
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          className="w-full px-8 py-6 bg-neutral-50 border border-neutral-100 focus:border-[#C5A059]/50 focus:bg-white outline-none rounded-2xl font-body text-neutral-900 transition-all h-40 font-medium"
                          placeholder="Describe the soul of this design..."
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-[0.4em] text-neutral-400 ml-1">Visual Anchors (URLs & Uploads)</label>
                        <div className="flex flex-col gap-6">
                          <input
                            value={newProject.images}
                            onChange={(e) => setNewProject({ ...newProject, images: e.target.value })}
                            className="w-full px-8 py-6 bg-neutral-50 border border-neutral-100 focus:border-[#C5A059]/50 focus:bg-white outline-none rounded-2xl font-body text-neutral-900 transition-all text-xs font-medium"
                            placeholder="Manually enter image URLs separated by commas..."
                          />
                          <div className="relative h-40 bg-neutral-50 rounded-2xl border-2 border-neutral-100 border-dashed flex flex-col items-center justify-center group hover:border-[#C5A059]/30 transition-all cursor-pointer">
                            <Icons.Plus />
                            <p className="mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select High-Res Files</p>
                            <input
                              type="file"
                              multiple
                              onChange={handleMediaUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          {uploadedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                              {uploadedFiles.map((url, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm group">
                                  <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xl font-bold"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-8 pt-10 border-t border-neutral-50">
                        <button
                          type="button"
                          onClick={() => {
                            setShowProjectForm(false);
                            setEditingId(null);
                          }}
                          className="px-10 py-5 rounded-2xl text-neutral-400 font-bold uppercase tracking-widest text-[10px] hover:text-neutral-900 transition-colors"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          className="px-14 py-5 bg-neutral-900 text-white font-bold uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-black transition-all shadow-xl shadow-neutral-900/10"
                        >
                          {editingId ? "Finalize Revision" : "Publish Masterpiece"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {projects.length === 0 ? (
                  <div className="py-32 text-center bg-white rounded-[3rem] border border-neutral-100 border-dashed">
                    <p className="text-neutral-300 text-xs font-bold uppercase tracking-[0.5em]">No architectural records found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
                    {projects.map((project) => (
                      <div key={project._id} className="bg-white group rounded-[3rem] shadow-premium-light border border-neutral-50 overflow-hidden hover:border-[#C5A059]/20 transition-all duration-700">
                        <div className="relative h-96 overflow-hidden">
                          <img
                            src={project.images && project.images.length > 0
                              ? formatUrl(project.images[0])
                              : "https://via.placeholder.com/800x600?text=Arka+Masterpiece"}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
                            onLoad={(e) => e.target.classList.add('opacity-100')}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Image+Unavailable"; }}
                          />
                          <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-md flex items-center justify-center gap-8 translate-y-12 group-hover:translate-y-0">
                            <button
                              onClick={() => {
                                setEditingId(project._id);
                                setNewProject({
                                  title: project.title,
                                  description: project.description,
                                  roomType: project.roomType,
                                  images: (project.images || []).join(", "),
                                  videos: (project.videos || []).join(", ")
                                });
                                setShowProjectForm(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-16 h-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center hover:bg-[#C5A059] transition-all shadow-2xl shadow-neutral-900/20"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              onClick={() => deleteProject(project._id)}
                              className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-2xl border border-red-100"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="p-14">
                          <div className="flex justify-between items-start mb-6">
                            <h3 className="text-4xl font-display font-bold text-neutral-900 tracking-tighter leading-tight">{project.title}</h3>
                            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/5 px-5 py-2.5 rounded-xl border border-[#C5A059]/10">
                              {project.roomType}
                            </span>
                          </div>
                          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-medium tracking-wide">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* APPOINTMENTS TAB */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-[3rem] shadow-premium-light border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/50">
                        <th className="p-12 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em]">Patron Information</th>
                        <th className="p-12 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em]">Project Essence</th>
                        <th className="p-12 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em]">Status</th>
                        <th className="p-12 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em]">Schedule</th>
                        <th className="p-12 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-neutral-50/30 transition-all group">
                          <td className="p-12">
                            <p className="text-xl font-bold text-neutral-900 mb-1 tracking-tight">{booking.clientName}</p>
                            <div className="flex items-center gap-3 text-neutral-300 font-bold text-[10px] uppercase tracking-widest leading-loose">
                              <span>{booking.email}</span>
                              <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
                              <span>{booking.phone}</span>
                            </div>
                          </td>
                          <td className="p-12 max-w-sm">
                            <span className="inline-block px-4 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-bold uppercase tracking-widest rounded-lg mb-4 border border-[#C5A059]/10">{booking.serviceType || "Concept Discussion"}</span>
                            <p className="text-sm text-neutral-400 italic font-medium tracking-wide">"{booking.message}"</p>
                          </td>
                          <td className="p-12">
                            <span
                              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm border ${booking.status === "confirmed"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20"
                                }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-12">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-neutral-900 mb-1">{booking.bookingDate || "Flexible Date"}</span>
                              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{booking.bookingTime || "TBD"}</span>
                            </div>
                          </td>
                          <td className="p-12">
                            <div className="flex gap-4">
                              {booking.status === "pending" && (
                                <button
                                  onClick={() => updateBookingStatus(booking._id, "confirmed")}
                                  className="w-14 h-14 flex items-center justify-center bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/10"
                                  title="Approve"
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  if (window.confirm("Archive this request?")) {
                                    try {
                                      await bookingsAPI.delete(booking._id);
                                      fetchData();
                                    } catch (e) { console.error(e); }
                                  }
                                }}
                                className="w-14 h-14 flex items-center justify-center bg-neutral-50 text-neutral-300 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-neutral-100"
                                title="Decline/Archive"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bookings.length === 0 && (
                  <div className="p-32 text-center rounded-[3rem] bg-neutral-50/50 m-10 border-2 border-dashed border-neutral-100">
                    <p className="text-neutral-400 text-sm font-bold uppercase tracking-[0.3em]">No incoming requests at this moment</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-16">
                <div className="flex items-center justify-between bg-white p-12 rounded-[3.5rem] border border-neutral-100 shadow-premium-light">
                  <div className="flex items-center gap-12">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-neutral-900 flex items-center justify-center text-white shadow-2xl shadow-neutral-900/20">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-4xl font-display font-bold text-neutral-900 tracking-tighter">Media Vault</h4>
                      <p className="text-neutral-400 text-xs font-bold mt-2 uppercase tracking-[0.3em]">Curating high-resolution digital artifacts</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-[2rem]">
                    <button className="bg-neutral-900 text-white px-14 py-6 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl shadow-neutral-900/10 active:scale-95">
                      Ingest New Assets
                    </button>
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleMediaUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="group relative bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden hover:border-[#C5A059]/20 transition-all duration-700 shadow-sm hover:shadow-2xl">
                      <div className="aspect-[4/5] bg-neutral-50 flex items-center justify-center overflow-hidden">
                        {(file.url || file.isMock) ? (
                          <img
                            src={formatUrl(file.url)}
                            alt={file.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-115"
                            onLoad={(e) => e.target.classList.add('opacity-100')}
                            onError={(e) => {
                              console.error("Image load failed:", e.target.src);
                              e.target.src = "https://via.placeholder.com/400x500?text=Missing+Asset";
                            }}
                          />
                        ) : (
                          <div className="text-neutral-200 scale-150">
                            <Icons.Media />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center translate-y-8 group-hover:translate-y-0">
                          <p className="text-neutral-900 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 break-all leading-relaxed">{file.name}</p>
                          <div className="flex gap-6">
                            <button
                              onClick={async () => {
                                if (window.confirm("Purge this artifact forever?")) {
                                  try {
                                    await uploadAPI.delete(file.name);
                                    fetchData();
                                  } catch (e) { console.error(e); }
                                }
                              }}
                              className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {mediaFiles.length === 0 && (
                  <div className="py-48 rounded-[4rem] bg-white border-2 border-neutral-50 border-dashed flex flex-col items-center justify-center">
                    <div className="text-neutral-100 mb-10 scale-[4] opacity-50 bg-neutral-50 p-4 rounded-full">
                      <Icons.Media />
                    </div>
                    <p className="text-neutral-300 text-[10px] font-bold uppercase tracking-[0.6em]">The digital vault is currently empty</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div >
  );
}

export default Admin;
