import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ background: '#1E1006', padding: '4rem 0 2rem', position: 'relative' }}>
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.4), transparent)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <h3
              className="font-display font-bold mb-2"
              style={{ fontSize: '1.8rem', color: '#F5EFE6', letterSpacing: '-0.01em' }}
            >
              Italian Interiors
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, #C8963E, transparent)' }} />
              <span
                className="font-accent font-bold uppercase"
                style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(200,150,62,0.55)' }}
              >
                Hyderabad
              </span>
            </div>
            <p
              className="font-body"
              style={{ fontSize: '0.85rem', color: 'rgba(245,239,230,0.4)', lineHeight: 1.8, maxWidth: '300px' }}
            >
              Crafting timeless spaces where luxury meets functionality. Your vision, our expertise.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4
              className="font-accent font-bold uppercase mb-5"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#C8963E' }}
            >
              Navigate
            </h4>
            {['Home', 'Portfolio', 'Gallery', 'Contact'].map(link => (
              <Link
                key={link}
                to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                className="block font-body mb-3 transition-colors duration-200"
                style={{ fontSize: '0.85rem', color: 'rgba(245,239,230,0.4)', textDecoration: 'none' }}
                onMouseEnter={e => (e.target.style.color = '#C8963E')}
                onMouseLeave={e => (e.target.style.color = 'rgba(245,239,230,0.4)')}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-accent font-bold uppercase mb-5"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#C8963E' }}
            >
              Contact
            </h4>
            {['Hyderabad, Telangana', 'hello@italianinteriors.in', '+91 98765 43210'].map((item, i) => (
              <p
                key={i}
                className="font-body mb-3"
                style={{ fontSize: '0.85rem', color: 'rgba(245,239,230,0.4)' }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(200,150,62,0.1)' }}
        >
          <p
            className="font-accent"
            style={{ fontSize: '0.65rem', color: 'rgba(245,239,230,0.22)', letterSpacing: '0.1em' }}
          >
            © {new Date().getFullYear()} Italian Interiors. All rights reserved.
          </p>
          <p
            className="font-display italic"
            style={{ fontSize: '0.9rem', color: 'rgba(200,150,62,0.35)' }}
          >
            Crafting Timeless Elegance
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;