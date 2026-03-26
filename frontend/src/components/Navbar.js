import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  // Always solid dark brown — no transparent state
  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 1000,
    background: '#1E1006',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(200,150,62,0.15)',
    transition: 'box-shadow 0.4s ease',
    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
  };

  const linkColor = (path) =>
    location.pathname === path ? '#C8963E' : 'rgba(245,239,230,0.65)';

  return (
    <>
      <nav style={navStyle}>
        <div className="nav-container" style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px',
          transition: 'all 0.3s ease',
        }}>
          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="navbar-logo-text" style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.4rem', fontWeight: 800,
              color: '#F5EFE6', letterSpacing: '-0.01em', lineHeight: 1,
            }}>
              Italian Interiors
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#C8963E', flexShrink: 0 }} />
          </Link>
          
          {/* Desktop links */}
          <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {links.map(link => (
              <Link key={link.path} to={link.path}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.65rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.2em',
                  textDecoration: 'none',
                  color: linkColor(link.path),
                  transition: 'color 0.25s',
                  position: 'relative',
                  paddingBottom: '4px',
                }}
                onMouseEnter={e => e.target.style.color = '#C8963E'}
                onMouseLeave={e => e.target.style.color = linkColor(link.path)}>
                {link.label}
                {location.pathname === link.path && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '1px', background: '#C8963E',
                  }} />
                )}
              </Link>
            ))}

            <Link to="/admin"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.65rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                textDecoration: 'none',
                color: '#C8963E',
                border: '1px solid rgba(200,150,62,0.4)',
                padding: '0.5rem 1.2rem',
                borderRadius: '4px',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C8963E'; e.currentTarget.style.color = '#2C1A0E'; e.currentTarget.style.borderColor = '#C8963E'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8963E'; e.currentTarget.style.borderColor = 'rgba(200,150,62,0.4)'; }}>
              STUDIO LOGIN
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#F5EFE6' }}
            aria-label="Toggle menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: '#1a1006',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              padding: '6rem 2rem 4rem',
            }}
          >
            {/* Elegant Background Texture */}
            <div className="absolute inset-0 bg-luxury-pattern opacity-[0.05] pointer-events-none" />
            
            {/* Close button inside mobile menu */}
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#F5EFE6', cursor: 'pointer', zIndex: 100 }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col h-full relative z-10">
              {/* Decorative side line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C8963E]/30 to-transparent" />

              <div className="flex flex-col gap-6 mb-auto">
                {[...links, { label: 'Studio Login', path: '/admin' }].map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link to={link.path}
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '2rem', fontWeight: 500,
                        color: location.pathname === link.path ? '#C8963E' : '#faf8f4',
                        textDecoration: 'none', letterSpacing: '0.01em',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                      }}
                      onClick={() => setMenuOpen(false)}>
                      <span>{link.label}</span>
                      {location.pathname === link.path && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8963E] flex-shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Mobile info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-12 border-t border-[#C8963E]/10"
              >
                <p className="font-accent text-[9px] tracking-[0.4em] uppercase text-[#C8963E] mb-6">Contact Us</p>
                <div className="space-y-4">
                  <p className="text-[#faf8f4]/60 text-sm font-light">info@italianinteriors.design</p>
                  <p className="text-[#faf8f4]/60 text-sm font-light">+91 98765 43210</p>
                </div>
                
                <div className="flex gap-6 mt-10">
                  {['Instagram', 'Facebook', 'LinkedIn'].map(s => (
                    <span key={s} className="font-accent text-[9px] tracking-widest uppercase text-[#C8963E]/60">{s}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .nav-container { padding: 0 1.25rem !important; height: 64px !important; }
          .navbar-logo-text { fontSize: 1.15rem !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;