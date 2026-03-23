import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, formatUrl } from '../api/config';

// ── Guaranteed Local Fallback Projects ──────────────────────────────────────
const LOCAL_PROJECTS = [
  { _id: 'local-1', title: 'Contemporary Italian Living', imageUrl: '/gallery/living_room_8.jpg' },
  { _id: 'local-2', title: 'Minimalist Master Suite', imageUrl: '/gallery/bedroom_27.jpg' },
  { _id: 'local-3', title: 'Gourmet Marble Kitchen', imageUrl: '/gallery/kitchen_2.jpg' },
  { _id: 'local-4', title: 'The Crystal Dining Room', imageUrl: '/gallery/bedroom_28.jpg' },
];

function Home() {
  const [services, setServices] = useState([
    {
      image: '/gallery/living_room_8.jpg', 
      title: 'Residential Design',
      description: 'Transforming houses into dream homes with personalized interior solutions.',
    },
    {
      image: '/gallery/livingroom_13.jpg', 
      title: 'Commercial Spaces',
      description: 'Creating productive and inspiring work environments for businesses.',
    },
    {
      image: '/gallery/bedroom_27.jpg',
      title: 'Luxury Interiors',
      description: 'Bespoke high-end designs that reflect sophistication and elegance.',
    },
    {
      image: '/gallery/bedroom_28.jpg',
      title: 'Design Consultation',
      description: 'Expert guidance to bring your vision to life with professional insights.',
    },
  ]);

  useEffect(() => {
    const fetchProj = async () => {
      try {
        const res = await projectsAPI.getAll().catch(() => ({ data: [] }));
        let apiData = res.data || [];
        
        // Use local fallback if API returns fewer than 4 items
        if (apiData.length < 4) {
          apiData = LOCAL_PROJECTS;
        }

        setServices(prev => prev.map((s, i) => ({
          ...s,
          image: formatUrl(apiData[i].imageUrl || apiData[i].images?.[0]) || s.image
        })));
      } catch (e) {
        console.error('Home Fetch Error:', e);
        setServices(prev => prev.map((s, i) => ({
          ...s,
          image: formatUrl(LOCAL_PROJECTS[i].imageUrl) || s.image
        })));
      }
    };
    fetchProj();
  }, []);

  const testimonials = [
    {
      id: 1,
      clientName: 'Dr. Arjun Reddy',
      rating: 5,
      review: 'Italian Interiors transformed our villa into a masterpiece. The blend of traditional elegance with modern luxury is exactly what we wanted. Truly the best in Hyderabad.',
      project: 'Villa in Jubilee Hills',
    },
    {
      id: 2,
      clientName: 'Lakshmi Rao',
      rating: 5,
      review: 'I was looking for sophistication and comfort, and they delivered beyond my expectations. My penthouse feels like a 7-star hotel suite now.',
      project: 'Penthouse at Banjara Hills',
    },
    {
      id: 3,
      clientName: 'Vikram Raju',
      rating: 5,
      review: 'Our corporate office needed a premium look to impress international clients. The design team nailed it. Professional, timely, and world-class.',
      project: 'Corporate Office, Hitech City',
    },
    {
      id: 4,
      clientName: 'Sravani Krishna',
      rating: 5,
      review: 'Absolutely in love with my new home! They utilized every inch of space so beautifully. The color palette is stunning and very premium.',
      project: 'Luxury Apt, Gachibowli',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#EDE4D3' }}>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Your actual background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/gallery/bg.jpg')",
            backgroundPosition: 'center 60%',
          }}
        />
        {/* Light overlay — just enough for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(44,26,14,0.55) 0%, rgba(44,26,14,0.40) 50%, rgba(44,26,14,0.30) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-luxury-pattern opacity-10" />

        {/* Gold bokeh glows */}
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full"
          style={{ background: 'rgba(200,150,62,0.08)', filter: 'blur(60px)' }} />
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full"
          style={{ background: 'rgba(200,150,62,0.06)', filter: 'blur(50px)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-32 relative z-10">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="mb-8">
                <span className="inline-block font-accent tracking-widest uppercase text-xs font-bold mb-6"
                  style={{ color: '#C8963E' }}>
                  Hyderabad
                </span>
              </div>

              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-8"
                style={{ color: '#F5EFE6' }}>
                Crafting
                <span className="block mt-2 italic" style={{ color: '#C8963E' }}>Timeless</span>
                <span className="block mt-2">Elegance</span>
              </h1>

              {/* Gold ornament bar */}
              <div className="flex items-center gap-3 mb-10">
                <div className="h-1 w-32 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #C8963E, rgba(200,150,62,0.2))' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#C8963E' }} />
              </div>

              <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl font-body italic"
                style={{ color: 'rgba(245,239,230,0.75)' }}>
                "Design is not just what it looks like and feels like. Design is how it works."
              </p>

              <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-3xl font-body"
                style={{ color: 'rgba(245,239,230,0.60)' }}>
                We orchestrate spaces where luxury meets functionality, creating sanctuaries of refined living that transcend the ordinary.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/portfolio"
                className="inline-block text-center font-accent font-bold uppercase tracking-widest px-8 py-4 sm:px-10 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #C8963E, #D4A843)',
                    color: '#2C1A0E',
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    boxShadow: '0 8px 32px rgba(200,150,62,0.35)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(200,150,62,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,150,62,0.35)'; }}
                >
                  PROJECTS
                </Link>
                <Link
                  to="/contact"
                  className="inline-block text-center font-accent font-bold uppercase tracking-widest px-8 py-4 sm:px-10 transition-all duration-300"
                  style={{
                    background: 'rgba(30,16,6,0.25)',
                    backdropFilter: 'blur(8px)',
                    color: '#C8963E',
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    border: '1px solid rgba(200,150,62,0.5)',
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.borderColor = '#C8963E'; 
                    e.currentTarget.style.background = 'rgba(200,150,62,0.1)'; 
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.borderColor = 'rgba(200,150,62,0.5)'; 
                    e.currentTarget.style.background = 'rgba(30,16,6,0.25)'; 
                  }}
                >
                  Begin Your Journey
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="font-accent text-[9px] uppercase tracking-[0.3em]" style={{ color: 'rgba(200,150,62,0.6)' }}>Scroll</span>
          <div className="w-px h-10" style={{ background: 'linear-gradient(180deg, #C8963E, transparent)' }} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES — dark brown bg, keeps your gallery images
      ══════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden" style={{ background: '#EDE4D3' }}>
        {/* Subtle texture */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.04]" />
        {/* Gold bokeh top-right */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,150,62,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-accent tracking-[0.3em] uppercase text-xs font-bold mb-4 block"
                style={{ color: '#C8963E' }}>
                Our Expertise
              </span>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ color: '#2C1A0E' }}>
                Curated Design <span style={{ color: '#C8963E', fontStyle: 'italic' }}>Services</span>
              </h2>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #C8963E)' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8963E' }} />
                <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #C8963E, transparent)' }} />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-[450px] overflow-hidden cursor-pointer"
              >
                {/* Your actual gallery image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                {/* Dark brown gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(30,10,0,0.96) 0%, rgba(44,26,14,0.55) 50%, rgba(44,26,14,0.15) 100%)',
                    opacity: 0.85,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(44,26,14,0.15)' }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {/* Gold left bar */}
                    <div className="w-8 h-0.5 mb-4 transition-all duration-300 group-hover:w-12"
                      style={{ background: '#C8963E' }} />
                    <h3 className="font-display text-2xl font-bold mb-3 tracking-wide"
                      style={{ color: '#F5EFE6', borderLeft: '3px solid #C8963E', paddingLeft: '1rem' }}>
                      {service.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-xs"
                      style={{ color: 'rgba(245,239,230,0.7)' }}>
                      {service.description}
                    </p>
                    <span className="inline-block pb-1 text-xs font-accent tracking-widest uppercase transition-all duration-300"
                      style={{ color: '#C8963E', borderBottom: '1px solid rgba(200,150,62,0.5)' }}>
                      View Details
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          QUOTE — warm beige bg matching screenshot
      ══════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#EDE4D3' }}>
        {/* Large decorative quote mark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold pointer-events-none select-none"
          style={{ fontSize: 'clamp(10rem,25vw,20rem)', color: 'rgba(200,150,62,0.07)', lineHeight: 1 }}>
          "
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Ornament */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex-1 max-w-[80px] h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.4))' }} />
              <div className="w-2 h-2 rounded-full" style={{ background: '#C8963E' }} />
              <div className="flex-1 max-w-[80px] h-px"
                style={{ background: 'linear-gradient(90deg, rgba(200,150,62,0.4), transparent)' }} />
            </div>

            <p className="font-display text-4xl md:text-5xl mb-10 italic leading-relaxed font-medium"
              style={{ color: '#2C1A0E' }}>
              "Excellence is not a destination; it is a continuous journey that never ends."
            </p>
            <span className="font-accent text-xs tracking-[0.4em] font-bold uppercase"
              style={{ color: '#C8963E' }}>
              — Brian Tracy
            </span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS — beige bg, white cards with gold accent
      ══════════════════════════════════════════════════ */}
      <section className="py-32 relative" style={{ background: '#F5EFE6' }}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-accent tracking-[0.3em] uppercase text-xs font-bold mb-6 block"
                style={{ color: '#C8963E' }}>
                Client Stories
              </span>
              <h2 className="font-display font-bold mb-8 tracking-tight"
                style={{ fontSize: 'clamp(3rem,8vw,6rem)', color: '#2C1A0E' }}>
                What They <span style={{ color: '#C8963E', fontStyle: 'italic' }}>Say</span>
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #C8963E)' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8963E', opacity: 0.6 }} />
                <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #C8963E, transparent)' }} />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white relative group overflow-hidden transition-all duration-500"
                style={{
                  borderLeft: '4px solid #C8963E',
                  padding: '2.5rem 2rem',
                  boxShadow: '0 8px 40px rgba(44,26,14,0.08)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 60px rgba(44,26,14,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(44,26,14,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: 'linear-gradient(90deg, #C8963E, rgba(200,150,62,0.1))' }} />

                <div className="flex justify-between items-start mb-8">
                  <span className="font-display leading-none" style={{ fontSize: '4rem', color: 'rgba(200,150,62,0.25)' }}>"</span>
                  <div className="flex gap-1" style={{ color: '#C8963E' }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="font-body text-lg mb-8 leading-relaxed italic" style={{ color: '#3D2314' }}>
                  "{testimonial.review}"
                </p>

                <div className="pt-6" style={{ borderTop: '1px solid rgba(200,150,62,0.15)' }}>
                  <p className="font-accent text-sm tracking-[0.2em] uppercase font-bold mb-1" style={{ color: '#2C1A0E' }}>
                    {testimonial.clientName}
                  </p>
                  <p className="font-body text-sm italic" style={{ color: '#C8963E' }}>
                    {testimonial.project}
                  </p>
                </div>

                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
                  style={{ background: 'rgba(200,150,62,0.05)', filter: 'blur(20px)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — dark brown bg, gold headline, gold button
      ══════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #3D2314 50%, #2C1A0E 100%)' }}>
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.05]" />
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.4), transparent)' }} />
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(200,150,62,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="font-accent uppercase font-bold mb-4 block"
              style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'rgba(200,150,62,0.7)' }}>
              Start a Project
            </span>
            <h2 className="font-display font-bold mb-6 leading-tight"
              style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', color: '#F5EFE6' }}>
              Ready to Transform <span style={{ color: '#C8963E', fontStyle: 'italic' }}>Your Space?</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,150,62,0.4))' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C8963E' }} />
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(200,150,62,0.4), transparent)' }} />
            </div>
            <p className="text-lg md:text-xl mb-12 leading-relaxed font-body"
              style={{ color: 'rgba(245,239,230,0.55)' }}>
              Let's create something extraordinary together. Schedule your personalized consultation today.
            </p>
            <Link
              to="/contact"
              className="inline-block font-accent font-bold uppercase transition-all duration-300"
              style={{
                padding: '1.1rem 3.5rem',
                background: 'linear-gradient(135deg, #C8963E, #D4A843)',
                color: '#2C1A0E',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                boxShadow: '0 8px 32px rgba(200,150,62,0.3)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(200,150,62,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(200,150,62,0.3)'; }}
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default Home;