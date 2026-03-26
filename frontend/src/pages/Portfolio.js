import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import projectsConfig from '../config/projects.config.json';

// Base path for all gallery images
const GALLERY_BASE = '/gallery/';
const img = (filename) => `${GALLERY_BASE}${filename}`;

// ── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({ project, startIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const images = project.images || [];

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[999] flex flex-col"
      style={{ background: 'rgba(8,5,2,0.97)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      {/* Top bar — Now only for text/info */}
      <div
        className="flex items-center justify-between px-8 py-6 flex-shrink-0"
        style={{ background: 'rgba(8,5,2,0.4)', borderBottom: '1px solid rgba(197,160,89,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <p className="font-accent text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: '#C5A059' }}>
            {project.location}
          </p>
          <h3 className="font-display text-2xl font-semibold" style={{ color: '#faf8f4', letterSpacing: '0.02em' }}>
            {project.title}
          </h3>
        </div>

        <div className="flex items-center gap-8">
          <span className="font-accent text-sm tracking-[0.2em]" style={{ color: 'rgba(250,248,244,0.5)' }}>
            {current + 1} / {images.length}
          </span>
          
          {/* Close is now more prominent and isolated */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300"
            style={{ 
              background: 'rgba(197,160,89,0.15)', 
              border: '2px solid rgba(197,160,89,0.6)', 
              color: '#C5A059',
              boxShadow: '0 0 20px rgba(197,160,89,0.1)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C5A059'; e.currentTarget.style.color = '#1a1208'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.15)'; e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main image area with side content */}
      <div
        className="flex-1 flex items-center justify-between relative min-h-0 px-4 md:px-12"
        onClick={e => e.stopPropagation()}
      >
        {/* Navigation Button Beside Image (Left) */}
        <div className="flex-shrink-0 hidden md:flex items-center justify-center w-24">
          <button
            onClick={prev}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group"
            style={{ background: 'rgba(197,160,89,0.08)', border: '1.5px solid rgba(197,160,89,0.3)', color: '#C5A059' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C5A059'; e.currentTarget.style.color = '#1a1208'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.08)'; e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 max-h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={img(images[current])}
              alt={`${project.title} — ${current + 1}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="object-contain rounded-lg"
              style={{ 
                maxHeight: 'calc(100vh - 280px)', 
                maxWidth: '100%',
                boxShadow: '0 30px 90px rgba(0,0,0,0.8), 0 0 0 1px rgba(197,160,89,0.15)'
              }}
              onError={e => { e.target.src = 'https://via.placeholder.com/1200x800?text=Image+Not+Found'; }}
            />
          </AnimatePresence>
        </div>

        {/* Navigation Button Beside Image (Right) */}
        <div className="flex-shrink-0 hidden md:flex items-center justify-center w-24">
          <button
            onClick={next}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group"
            style={{ background: 'rgba(197,160,89,0.08)', border: '1.5px solid rgba(197,160,89,0.3)', color: '#C5A059' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C5A059'; e.currentTarget.style.color = '#1a1208'; e.currentTarget.style.transform = 'translateX(4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,160,89,0.08)'; e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        
        {/* Mobile-only float buttons */}
        <div className="md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
          <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto shadow-lg" style={{ background: 'rgba(10,8,6,0.8)', color: '#C5A059', border: '1px solid #C5A059' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto shadow-lg" style={{ background: 'rgba(10,8,6,0.8)', color: '#C5A059', border: '1px solid #C5A059' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex-shrink-0 py-3 px-4 overflow-x-auto"
        style={{ borderTop: '1px solid rgba(197,160,89,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex gap-2 justify-center" style={{ minWidth: 'max-content', margin: '0 auto' }}>
          {images.map((file, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex-shrink-0 rounded-md overflow-hidden transition-all duration-200"
              style={{
                width: '52px', height: '52px',
                border: i === current ? '2px solid #C5A059' : '2px solid transparent',
                opacity: i === current ? 1 : 0.4,
                transform: i === current ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <img
                src={img(file)}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://via.placeholder.com/60?text=?'; }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pb-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <span className="font-accent text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(250,248,244,0.18)' }}>
          ← → navigate &nbsp;·&nbsp; ESC close
        </span>
      </div>
    </motion.div>
  );
};

// ── Project Card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  const photoCount = project.images.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <div
        className="overflow-hidden rounded-2xl border transition-all duration-400 cursor-pointer"
        style={{
          background: '#fff',
          borderColor: hovered ? 'rgba(197,160,89,0.5)' : 'rgba(197,160,89,0.15)',
          boxShadow: hovered ? '0 16px 48px rgba(26,18,8,0.16)' : '0 4px 20px rgba(26,18,8,0.06)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onOpen(project, 0)}
      >
        {/* Cover image */}
        <div className="relative overflow-hidden" style={{ height: '280px' }}>
          <img
            src={img(project.cover)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(10,8,5,0.8) 0%, rgba(10,8,5,0.1) 55%, transparent 100%)',
              opacity: hovered ? 1 : 0.55,
            }}
          />

          {/* Photo count badge — top left */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(10,8,5,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(197,160,89,0.35)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="font-accent text-[10px] tracking-[0.15em]" style={{ color: '#C5A059' }}>
              {photoCount} PHOTOS
            </span>
          </div>

          {/* Hover thumbnail preview strip — peek at first 4 images */}
          <div
            className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 transition-all duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            }}
          >
            {project.images.slice(0, 4).map((file, i) => (
              <div
                key={i}
                className="flex-1 rounded overflow-hidden hover:opacity-90 transition-opacity duration-200"
                style={{ height: '46px', border: '1px solid rgba(197,160,89,0.3)' }}
                onClick={e => { e.stopPropagation(); onOpen(project, i); }}
              >
                <img src={img(file)} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://via.placeholder.com/80?text=?'; }} />
              </div>
            ))}
            {photoCount > 4 && (
              <div
                className="flex-1 rounded flex items-center justify-center"
                style={{ height: '46px', background: 'rgba(10,8,5,0.75)', border: '1px solid rgba(197,160,89,0.3)' }}
              >
                <span className="font-accent text-[10px] tracking-widest" style={{ color: '#C5A059' }}>
                  +{photoCount - 4}
                </span>
              </div>
            )}
          </div>

          {/* Hover centre button */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: '#C5A059', color: '#1a1208', boxShadow: '0 6px 28px rgba(197,160,89,0.5)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(197,160,89,0.1)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="font-display text-xl font-semibold mb-1 truncate transition-colors duration-300"
                style={{ color: hovered ? '#C5A059' : '#1a1208', letterSpacing: '-0.01em' }}
              >
                {project.title}
              </h3>
              {project.location && (
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#b5a080' }}>
                  <svg className="flex-shrink-0 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-accent tracking-wider uppercase truncate">{project.location}</span>
                </div>
              )}
            </div>
            <span
              className="flex-shrink-0 font-accent text-[10px] tracking-[0.2em] uppercase flex items-center gap-1 mt-1"
              style={{ color: '#C5A059' }}
            >
              Gallery
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Portfolio Page ────────────────────────────────────────────────────────────
const Portfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lightbox, setLightbox] = useState(null);

  const filtered = projectsConfig.filter(p => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q)
    );
  });

  const openLightbox = (project, index) => setLightbox({ project, index });
  const closeLightbox = () => setLightbox(null);

  return (
    <div className="min-h-screen" style={{ background: '#EDE4D3' }}>

      <AnimatePresence>
        {lightbox && (
          <Lightbox project={lightbox.project} startIndex={lightbox.index} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 35%, #1e160a 70%, #0f0b05 100%)'
        }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.06]" />
        <div className="absolute top-[-15%] left-[-8%] w-[55%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.5), transparent)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="font-accent tracking-[0.35em] uppercase text-xs font-bold mb-6 block" style={{ color: '#C5A059' }}>
              Our Work
            </span>
            <h1 className="font-display font-bold mb-8 leading-tight"
              style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: '#faf8f4', letterSpacing: '-0.02em' }}>
              Portfolio
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #C5A059)' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C5A059' }} />
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #C5A059, transparent)' }} />
            </div>
            <p className="text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10"
              style={{ color: 'rgba(250,248,244,0.65)', fontFamily: 'Georgia, serif' }}>
              Each project tells the complete story of a home — room by room.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 rounded-full font-accent font-bold text-sm tracking-[0.3em] uppercase"
              style={{ background: 'linear-gradient(135deg, #C5A059 0%, #B38E47 100%)', color: '#1a1208', boxShadow: '0 10px 40px rgba(197,160,89,0.3)' }}
            >
              EXPLORE HOMES
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" style={{ height: '60px' }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#EDE4D3" />
          </svg>
        </div>
      </section>

      {/* ── Search ── */}
      <section
        id="projects"
        className="py-7 sticky top-20 md:top-24 z-40 backdrop-blur-md border-b"
        style={{ background: 'rgba(237,228,211,0.95)', borderColor: 'rgba(200,150,62,0.2)' }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="Search by project name or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-12 py-4 rounded-2xl outline-none transition-all duration-300 font-accent text-xs tracking-widest"
              style={{ background: 'rgba(255,253,248,0.8)', border: '1px solid rgba(197,160,89,0.3)', color: '#1a1208' }}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.04] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">

          <div className="mb-8 text-center">
            <span className="font-accent text-xs tracking-[0.2em] uppercase" style={{ color: '#b5a080' }}>
              {filtered.length} {filtered.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                <svg className="w-10 h-10" fill="none" stroke="#C5A059" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-semibold mb-2" style={{ color: '#1a1208' }}>No Results</h3>
              <p style={{ color: '#6b5c45' }}>Try a different project name or location</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={searchTerm}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} onOpen={openLightbox} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 50%, #1a1208 100%)' }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.06]" />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4), transparent)' }} />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '200+', label: 'Projects Completed' },
              { number: '12+', label: 'Years Experience' },
              { number: '500+', label: 'Happy Clients' },
              { number: '15+', label: 'Design Awards' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <p className="font-display font-bold mb-2"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#C5A059', letterSpacing: '-0.02em' }}>
                  {stat.number}
                </p>
                <p className="font-accent text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(250,248,244,0.5)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: '#EDE4D3' }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.05]" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="font-accent tracking-[0.3em] uppercase text-xs font-bold mb-6 block" style={{ color: '#C5A059' }}>
              Start a project
            </span>
            <h2 className="font-display font-bold mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1a1208', letterSpacing: '-0.02em' }}>
              Have a Project in Mind?
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #C5A059)' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: '#C5A059' }} />
              <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #C5A059, transparent)' }} />
            </div>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#6b5c45' }}>
              Let's create something beautiful together. Contact us for a free consultation.
            </p>
            <Link
              to="/contact"
              className="inline-block font-accent text-xs tracking-[0.3em] uppercase px-12 py-5 rounded-full transition-all duration-300"
              style={{ background: '#1a1208', color: '#C5A059', boxShadow: '0 8px 32px rgba(26,18,8,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2d1f0e'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1208'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Portfolio;