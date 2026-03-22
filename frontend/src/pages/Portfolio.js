import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, formatUrl } from '../api/config';

// ── Guaranteed Local Fallback Projects ──────────────────────────────────────
const LOCAL_PROJECTS = [
  { _id: 'local-1', title: 'Contemporary Italian Living', description: 'Emerald velvet and marble living space featuring bespoke lighting.', roomType: 'Living Room', location: 'Milan, Italy', images: ['/gallery/living_room_1.jpg'] },
  { _id: 'local-2', title: 'Minimalist Master Suite', description: 'Serene minimal bedroom with warm wood floors and concrete accents.', roomType: 'Bedroom', location: 'Rome, Italy', images: ['/gallery/bedroom_1.jpg'] },
  { _id: 'local-3', title: 'Gourmet Marble Kitchen', description: 'Chef-grade kitchen with massive marble island and sleek slate cabinets.', roomType: 'Kitchen', location: 'Florence, Italy', images: ['/gallery/kitchen_1.jpg'] },
  { _id: 'local-4', title: 'The Crystal Dining Room', description: 'Grand dining with bespoke lighting and a magnificent oak table.', roomType: 'Dining Room', location: 'Venice, Italy', images: ['/gallery/hall2.jpeg'] },
  { _id: 'local-5', title: 'Spa-Like Marble Retreat', description: 'Freestanding stone tub and marble finishes for the ultimate relaxation.', roomType: 'Bathroom', location: 'Naples, Italy', images: ['/gallery/bg.jpg'] },
  { _id: 'local-6', title: 'Modern Industrial Loft', description: 'High ceilings, exposed brick, and modern luxury furnishings.', roomType: 'Living Room', location: 'Turin, Italy', images: ['/gallery/livingroom_9.jpg'] }
];

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const roomTypes = ['All', 'Bedroom', 'Living Room', 'Kitchen', 'Dining Room', 'Home Office', 'Bathroom', 'Outdoor', 'Commercial'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll().catch(() => ({ data: [] }));
      const apiData = response.data || [];
      
      // Merge local fallback with API data (preventing duplicates if API is working)
      const merged = [...LOCAL_PROJECTS];
      apiData.forEach(p => {
        if (!merged.find(m => m.title === p.title)) {
          merged.push(p);
        }
      });

      setProjects(merged);
      setFilteredProjects(merged);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback if total failure
      setProjects(LOCAL_PROJECTS);
      setFilteredProjects(LOCAL_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (roomType) => {
    setActiveFilter(roomType);
    filterProjects(roomType, searchTerm);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProjects(activeFilter, term);
  };

  const filterProjects = (room, term) => {
    let filtered = projects;
    if (room !== 'All') {
      filtered = filtered.filter(p => p.roomType === room);
    }
    if (term) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.roomType.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen" style={{ background: '#EDE4D3' }}>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        {/* Deep warm background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 35%, #1e160a 70%, #0f0b05 100%)'
        }} />

        {/* Luxury pattern overlay */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.06]" />

        {/* Gold bokeh orbs */}
        <div className="absolute top-[-15%] left-[-8%] w-[55%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[40%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,220,140,0.06) 0%, transparent 70%)', filter: 'blur(50px)' }} />

        {/* Thin gold rule top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.5), transparent)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl mx-auto"
          >
            <span className="font-accent tracking-[0.35em] uppercase text-xs font-bold mb-6 block"
              style={{ color: '#C5A059' }}>
              Our Work
            </span>

            <h1 className="font-display font-bold mb-8 leading-tight"
              style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: '#faf8f4', letterSpacing: '-0.02em' }}>
              Portfolio
            </h1>

            {/* Gold ornament */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #C5A059)' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C5A059' }} />
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #C5A059, transparent)' }} />
            </div>

            <p className="text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10"
              style={{ color: 'rgba(250,248,244,0.65)', fontFamily: 'Georgia, serif' }}>
              Discover our collection of beautifully designed spaces across different room types
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('work-grid').scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 rounded-full font-accent font-bold text-sm tracking-[0.3em] uppercase transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, #C5A059 0%, #B38E47 100%)', 
                color: '#1a1208',
                boxShadow: '0 10px 40px rgba(197,160,89,0.3)'
              }}
            >
              PROJECTS
            </motion.button>
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
      <section id="work-grid" className="py-8 sticky top-20 md:top-24 z-40 backdrop-blur-md border-b"
        style={{ background: 'rgba(237,228,211,0.95)', borderColor: 'rgba(200,150,62,0.2)' }}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search Input */}
            <div className="relative group max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Search rooms (e.g. 'Bedroom', 'Living Room')..." 
                value={searchTerm}
                onChange={handleSearch}
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

            {/* Filter Buttons */}
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {roomTypes.map((roomType) => (
                <motion.button
                  key={roomType}
                  onClick={() => handleFilter(roomType)}
                  whileTap={{ scale: 0.96 }}
                  className="px-6 py-2.5 font-accent text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-300 rounded-full border whitespace-nowrap flex-shrink-0"
                  style={activeFilter === roomType ? {
                    background: '#1a1208',
                    color: '#C5A059',
                    borderColor: '#1a1208',
                    boxShadow: '0 4px 20px rgba(26,18,8,0.25)'
                  } : {
                    background: 'transparent',
                    color: '#6b5c45',
                    borderColor: 'rgba(197,160,89,0.3)'
                  }}
                >
                  {roomType}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects grid ── */}
      <section className="py-20 relative">
        {/* Subtle mid-page texture */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.04] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl h-96 animate-pulse"
                  style={{ background: 'linear-gradient(135deg, #ede8df, #e8e0d0)' }} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                <svg className="w-10 h-10" fill="none" stroke="#C5A059" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-semibold mb-2" style={{ color: '#1a1208' }}>No Projects Found</h3>
              <p style={{ color: '#6b5c45' }}>Try selecting a different category</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="group"
                  >
                    <Link to={`/portfolio/${project._id}`}>
                      <div className="overflow-hidden rounded-2xl border transition-all duration-500"
                        style={{
                          background: '#fff',
                          borderColor: 'rgba(197,160,89,0.15)',
                          boxShadow: '0 4px 24px rgba(26,18,8,0.07)'
                        }}
                      >
                        {/* Image */}
                        <div className="relative h-72 overflow-hidden">
                          <img
                            src={formatUrl(project.images?.[0])}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                          />
                          {/* Gradient on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                            style={{ background: 'linear-gradient(to top, rgba(26,18,8,0.7) 0%, transparent 60%)' }} />

                          {/* Room type badge */}
                          <div className="absolute top-4 right-4">
                            <span className="font-accent text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
                              style={{ background: 'rgba(26,18,8,0.75)', color: '#C5A059', backdropFilter: 'blur(8px)' }}>
                              {project.roomType}
                            </span>
                          </div>

                          {/* Hover Overlay */}
                          <div 
                            className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[1px]"
                          >
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              whileHover={{ scale: 1.1 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                              style={{ background: '#C5A059', color: '#1a1208' }}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </motion.div>
                            <span className="font-accent text-[9px] tracking-[0.4em] uppercase text-white font-bold">
                              WATCH PHOTOS
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-7" style={{ borderTop: '1px solid rgba(197,160,89,0.1)' }}>
                          <h3 className="font-display text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-[#C5A059]"
                            style={{ color: '#1a1208', letterSpacing: '-0.01em' }}>
                            {project.title}
                          </h3>
                          <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: '#8a7660' }}>
                            {project.description}
                          </p>
                          {project.location && (
                            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#b5a080' }}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-accent tracking-wider uppercase">{project.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 50%, #1a1208 100%)'
        }} />
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.06]" />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.4), transparent)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '200+', label: 'Projects Completed' },
              { number: '12+', label: 'Years Experience' },
              { number: '500+', label: 'Happy Clients' },
              { number: '15+', label: 'Design Awards' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
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
        {/* Gold orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[200%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(197,160,89,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

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
              className="inline-block font-accent text-xs tracking-[0.3em] uppercase px-12 py-5 rounded-full transition-all duration-400"
              style={{ background: '#1a1208', color: '#C5A059', boxShadow: '0 8px 32px rgba(26,18,8,0.25)' }}
              onMouseEnter={e => { e.target.style.background = '#2d1f0e'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 40px rgba(26,18,8,0.35)'; }}
              onMouseLeave={e => { e.target.style.background = '#1a1208'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(26,18,8,0.25)'; }}
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