import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-sand-gradient text-primary-900 border-t border-primary-200">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-4xl font-bold tracking-tight text-primary-900 hover:text-accent-500 transition-colors inline-block mb-6">
              ARKA
            </Link>
            <p className="font-display text-xl text-accent-600 leading-relaxed max-w-sm mb-6 italic">
              Where Luxury Meets Legacy
            </p>
            <p className="font-body text-primary-700 text-base leading-relaxed max-w-md">
              Transforming spaces into masterpieces of refined elegance. Creating timeless sanctuaries that inspire and elevate every moment of living.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="font-accent text-xs tracking-widest uppercase text-accent-600 mb-6 font-bold">Navigate</h3>
            <ul className="space-y-4">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-primary-800 hover:text-accent-500 transition-colors font-body font-medium text-base">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="font-accent text-xs tracking-widest uppercase text-accent-600 mb-6 font-bold">Get in Touch</h3>
            <div className="space-y-4">
              <p className="text-primary-700 font-body text-base leading-relaxed">
                Start your project with a personalized consultation.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 font-accent text-xs tracking-widest uppercase text-accent-500 hover:text-accent-600 transition-colors font-bold group"
              >
                Contact Us
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-200 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-body text-sm text-primary-700">
            © {new Date().getFullYear()} ARKA. All rights reserved.
          </p>
          <p className="font-body text-sm text-primary-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Hyderabad, India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
