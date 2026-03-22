import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
            <span style={{
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
              Admin
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

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(30,16,6,0.98)',
          backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
        }}>
          {/* Close button inside mobile menu */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#F5EFE6', cursor: 'pointer' }}>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {[...links, { label: 'Admin', path: '/admin' }].map(link => (
            <Link key={link.path} to={link.path}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.5rem', fontWeight: 700,
                color: location.pathname === link.path ? '#C8963E' : '#F5EFE6',
                textDecoration: 'none', letterSpacing: '-0.01em',
                transition: 'color 0.2s',
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={e => e.target.style.color = '#C8963E'}
              onMouseLeave={e => e.target.style.color = location.pathname === link.path ? '#C8963E' : '#F5EFE6'}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .nav-container { padding: 0 1.25rem !important; height: 64px !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;