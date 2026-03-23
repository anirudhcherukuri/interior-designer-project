import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, uploadAPI, formatUrl } from '../api/config';

// ── Local gallery images (static files served from /gallery/) ─────────────────
// These always work regardless of backend status
const generateLocalGallery = () => {
  const items = [];
  let id = 1;

  const add = (files, ext, room) => {
    files.forEach(f => {
      items.push({
        key: `local-${id++}`, 
        type: 'image',
        url: `/gallery/${f}.${ext}`,
        projectTitle: `Hyderabad Interior Project ${id}`,
        roomType: room, 
        projectId: null, 
        link: '#'
      });
    });
  };

  add(['bedroom_1','bedroom_2','bedroom_3','bedroom_4','bedroom_6','bedroom_7','bedroom_8','bedroom_9',
       'bedroom_10','bedroom_11','bedroom_12','bedroom_13','bedroom_14','bedroom_15','bedroom_16',
       'bedroom_18','bedroom_19','bedroom_20','bedroom_21','bedroom_23','bedroom_24','bedroom_25',
       'bedroom_26','bedroom_27','bedroom_28','bedroom_29','bedroom_30',
       'bedrrom_5','bedrrom_17','bedrrom_22'], 'jpg', 'Bedroom');

  add(['living_room_1','living_room_2','living_room_3','living_room_4','living_room_5',
       'living_room_6','living_room_7','living_room_8','living_room_11',
       'livingroom_9','livingroom_10','livingroom_13','livingroom_14','livingroom_15','livingroom_20'], 'jpg', 'Living Room');

  add(['kitchen_1','kitchen_2'], 'jpg', 'Kitchen');

  add(['cupboard_1','cupboard_2','cupboard_3','cupboard_4','cupboard_9'], 'jpg', 'Commercial');

  items.push(
    { key:`local-${id++}`, type:'image', url:'/gallery/hall.jpeg', projectTitle:`Hyderabad Project ${id}`, roomType:'Living Room', projectId:null, link:'#' },
    { key:`local-${id++}`, type:'image', url:'/gallery/hall2.jpeg', projectTitle:`Hyderabad Project ${id}`, roomType:'Living Room', projectId:null, link:'#' },
    { key:`local-${id++}`, type:'image', url:'/gallery/ceiling.jpeg', projectTitle:`Hyderabad Project ${id}`, roomType:'Living Room', projectId:null, link:'#' },
    { key:`local-${id++}`, type:'image', url:'/gallery/poojaroom_1.jpg', projectTitle:`Hyderabad Project ${id}`, roomType:'Commercial', projectId:null, link:'#' },
    { key:`local-${id++}`, type:'image', url:'/gallery/bg.jpg', projectTitle:`Hyderabad Project ${id}`, roomType:'Living Room', projectId:null, link:'#' }
  );

  return items;
};

const LOCAL_GALLERY = generateLocalGallery();

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const roomTypes = ['All', 'Bedroom', 'Living Room', 'Kitchen', 'Dining Room', 'Home Office', 'Bathroom', 'Outdoor', 'Commercial'];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projRes, libRes] = await Promise.all([
          projectsAPI.getAll().catch(() => ({ data: [] })),
          uploadAPI.getAll().catch(() => ({ data: [] })),
        ]);
        setProjects(projRes.data || []);
        setLibraryFiles(libRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build flat media list
  const mediaItems = [...LOCAL_GALLERY];
  
  projects.forEach((p) => {
    // Backend now returns imageUrl or an images array
    const defaultUrl = p.imageUrl || (p.images && p.images[0]);
    if (defaultUrl) {
      // Don't add if already exists locally (prevent duplicates if APIs sync)
      const formatted = formatUrl(defaultUrl);
      if (!mediaItems.some(m => m.url === formatted)) {
        mediaItems.push({
          type: 'image', url: formatted,
          projectId: p._id, link: `/portfolio/${p._id}`,
          projectTitle: p.title, roomType: p.roomType,
          key: `img-${p._id}`,
        });
      }
    }
  });

  libraryFiles.forEach((file, i) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url || file.name);
    // Use file.url directly if backend provides it (which it does now)
    const url = formatUrl(file.url || `/uploads/${file.name}`);
    
    if (!mediaItems.some(m => m.url === url)) {
      mediaItems.push({
        type: isImage ? 'image' : 'video', url,
        projectId: null, link: '#',
        projectTitle: file.title || 'Design Showcase', 
        roomType: file.category || 'General',
        poster: isImage ? url : null,
        key: `lib-${i}`,
      });
    }
  });

  const filtered = mediaItems.filter(m => {
    const matchesGlobal = filter === 'all' || (filter === 'images' ? m.type === 'image' : m.type === 'video');
    const matchesRoom = roomFilter === 'All' || m.roomType === roomFilter;
    const matchesSearch = !searchTerm || 
      m.projectTitle.toLowerCase().includes(searchTerm) || 
      m.roomType.toLowerCase().includes(searchTerm);
    return matchesGlobal && matchesRoom && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: '#EDE4D3' }}>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 35%, #1e160a 70%, #0f0b05 100%)'
        }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.06]" />

        {/* Gold bokeh */}
        <div className="absolute top-[-15%] right-[-8%] w-[50%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[45%] h-[70%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.5), transparent)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl mx-auto"
          >
            <span className="font-accent tracking-[0.35em] uppercase text-xs font-bold mb-6 block"
              style={{ color: '#C5A059' }}>
              Gallery Overview
            </span>

            <h1 className="font-display font-bold mb-8 leading-tight"
              style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: '#faf8f4', letterSpacing: '-0.02em' }}>
              Gallery
            </h1>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #C5A059)' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C5A059' }} />
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #C5A059, transparent)' }} />
            </div>

            <p className="text-xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'rgba(250,248,244,0.65)', fontFamily: 'Georgia, serif' }}>
              A curated collection of our finest interior design works
            </p>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: '60px' }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#EDE4D3" />
          </svg>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <section className="py-8 sticky top-20 md:top-24 z-40 backdrop-blur-md border-b"
        style={{ background: 'rgba(237,228,211,0.95)', borderColor: 'rgba(200,150,62,0.2)' }}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Search Bar */}
            <div className="relative group max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Search gallery (e.g. 'Bedroom', 'Living Room')..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full px-12 py-4 rounded-2xl outline-none transition-all duration-300 font-accent text-xs tracking-widest"
                style={{ 
                  background: 'rgba(255,253,248,0.7)', 
                  border: '1px solid rgba(197,160,89,0.3)',
                  color: '#1a1208'
                }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              {/* Type Filter */}
              <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'images', 'videos'].map((f) => (
                  <motion.button
                    key={f}
                    onClick={() => setFilter(f)}
                    whileTap={{ scale: 0.96 }}
                    className="px-8 py-2.5 font-accent text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-full border whitespace-nowrap flex-shrink-0"
                    style={filter === f ? {
                      background: '#1a1208', color: '#C5A059', borderColor: '#1a1208',
                      boxShadow: '0 4px 20px rgba(26,18,8,0.2)'
                    } : {
                      background: 'transparent', color: '#6b5c45', borderColor: 'rgba(197,160,89,0.3)'
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>

              {/* Room Filter */}
              <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {roomTypes.map((room) => (
                  <motion.button
                    key={room}
                    onClick={() => setRoomFilter(room)}
                    whileTap={{ scale: 0.96 }}
                    className="px-5 py-2 font-accent text-[9px] md:text-[10px] tracking-[0.15em] uppercase transition-all duration-300 rounded-lg border whitespace-nowrap flex-shrink-0"
                    style={roomFilter === room ? {
                      background: '#C5A059', color: '#1a1208', borderColor: '#C5A059'
                    } : {
                      background: 'transparent', color: '#8a7660', borderColor: 'rgba(197,160,89,0.15)'
                    }}
                  >
                    {room}
                  </motion.button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.03] pointer-events-none" />

        {/* Floating gold orb mid-page */}
        <div className="absolute top-1/3 right-0 w-[30%] h-[50%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl animate-pulse"
                  style={{ background: 'linear-gradient(135deg, #ede8df, #e8e0d0)' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-xl font-medium" style={{ color: '#6b5c45' }}>No gallery items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group"
                >
                  <div className="overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer"
                    style={{
                      background: '#fff',
                      borderColor: 'rgba(197,160,89,0.15)',
                      boxShadow: '0 4px 20px rgba(26,18,8,0.06)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,18,8,0.14)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,18,8,0.06)'; e.currentTarget.style.borderColor = 'rgba(197,160,89,0.15)'; }}
                  >
                    {/* Media */}
                    <div className="aspect-[4/3] overflow-hidden relative"
                      onClick={() => setSelectedItem(item)}>
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.projectTitle}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; }}
                        />
                      ) : (
                        <div className="w-full h-full">
                          <video
                            src={item.url} poster={item.poster}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            muted loop playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'rgba(26,18,8,0.2)' }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                              style={{ background: 'rgba(250,248,244,0.92)' }}>
                              <svg className="w-5 h-5 ml-0.5" fill="#1a1208" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{ background: 'rgba(26,18,8,0.45)' }}>
                        <span className="font-accent text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full"
                          style={{ background: 'rgba(250,248,244,0.12)', color: '#faf8f4', border: '1px solid rgba(197,160,89,0.4)', backdropFilter: 'blur(8px)' }}>
                          View Full
                        </span>
                      </div>
                    </div>

                    {/* Card info */}
                    <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(197,160,89,0.1)' }}>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-accent text-[9px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: '#C5A059' }}>
                          {item.roomType}
                        </span>
                        <span className="font-accent text-[9px] uppercase tracking-wider"
                          style={{ color: '#b5a080' }}>
                          {item.type}
                        </span>
                      </div>
                      <p className="font-display font-medium text-sm truncate mb-2" style={{ color: '#1a1208' }}>
                        {item.projectTitle}
                      </p>
                      {item.projectId && (
                        <Link
                          to={item.link}
                          className="font-accent text-[10px] uppercase tracking-widest border-b pb-0.5 transition-colors"
                          style={{ color: '#8a7660', borderColor: 'rgba(197,160,89,0.3)' }}
                          onMouseEnter={e => { e.target.style.color = '#C5A059'; e.target.style.borderColor = '#C5A059'; }}
                          onMouseLeave={e => { e.target.style.color = '#8a7660'; e.target.style.borderColor = 'rgba(197,160,89,0.3)'; }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ borderTop: '1px solid rgba(197,160,89,0.15)' }}>
        <div className="absolute inset-0" style={{ background: '#EDE4D3' }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.04]" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <Link
            to="/portfolio"
            className="inline-block font-accent text-xs tracking-[0.3em] uppercase px-12 py-5 rounded-full transition-all duration-400"
            style={{ background: '#1a1208', color: '#C5A059', boxShadow: '0 8px 32px rgba(26,18,8,0.2)' }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(26,18,8,0.3)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(26,18,8,0.2)'; }}
          >
            Visit Full Portfolio
          </Link>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: 'rgba(15,11,5,0.96)', backdropFilter: 'blur(16px)' }}
            onClick={() => setSelectedItem(null)}
          >
            {/* Close */}
            <button
              className="absolute top-8 right-8 z-[110] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)', color: '#C5A059' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.1)'; }}
              onClick={() => setSelectedItem(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              style={{ maxHeight: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.projectTitle}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  style={{ border: '1px solid rgba(197,160,89,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
                />
              ) : (
                <video
                  src={selectedItem.url}
                  className="max-w-full max-h-full rounded-2xl"
                  style={{ border: '1px solid rgba(197,160,89,0.2)' }}
                  controls autoPlay
                />
              )}

              <div className="mt-8 text-center">
                <span className="font-accent text-xs font-bold uppercase tracking-[0.25em] block mb-2"
                  style={{ color: '#C5A059' }}>
                  {selectedItem.roomType}
                </span>
                <h3 className="font-display text-2xl font-light tracking-tight mb-3"
                  style={{ color: '#faf8f4' }}>
                  {selectedItem.projectTitle}
                </h3>
                {selectedItem.projectId && (
                  <Link
                    to={selectedItem.link}
                    className="font-accent text-xs tracking-widest uppercase border-b pb-0.5 transition-all"
                    style={{ color: 'rgba(197,160,89,0.6)', borderColor: 'rgba(197,160,89,0.2)' }}
                    onMouseEnter={e => { e.target.style.color = '#C5A059'; e.target.style.borderColor = '#C5A059'; }}
                    onMouseLeave={e => { e.target.style.color = 'rgba(197,160,89,0.6)'; e.target.style.borderColor = 'rgba(197,160,89,0.2)'; }}
                  >
                    View Complete Project
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;