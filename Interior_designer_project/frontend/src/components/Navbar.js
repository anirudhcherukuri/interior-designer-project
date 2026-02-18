import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-royal-50/95 backdrop-blur-md border-b border-royal-200 shadow-sm transition-all duration-300">
      <nav className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="font-display text-3xl font-bold tracking-tight text-primary-900 hover:text-royal-600 transition-colors duration-300">
            ARKA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-accent text-xs tracking-widest uppercase font-semibold transition-colors duration-300 ${isActive(link.to) ? 'text-royal-600' : 'text-primary-800 hover:text-royal-500'
                  }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-royal-500 rounded-full" />
                )}
              </Link>
            ))}

            {/* Admin Link */}
            <Link
              to="/admin"
              className="px-4 py-2 border border-royal-200 text-royal-800 hover:text-white hover:bg-royal-700 hover:border-royal-700 transition-all font-accent text-xs tracking-widest uppercase font-bold rounded-sm ml-4"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 text-primary-800 hover:text-royal-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-royal-200/50 bg-royal-50"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-accent text-sm tracking-widest uppercase font-semibold py-3 border-l-4 pl-4 ${isActive(to)
                    ? 'border-royal-500 text-royal-600 bg-royal-100'
                    : 'border-transparent text-primary-800 hover:border-royal-400 hover:text-royal-500 hover:bg-royal-50'
                    } transition-all duration-200`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="font-accent text-sm tracking-widest uppercase font-semibold py-3 border-l-4 pl-4 border-transparent text-royal-900 bg-royal-100 hover:bg-royal-200 transition-all duration-200 mt-2"
              >
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
