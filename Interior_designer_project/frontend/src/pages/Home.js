import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const services = [
    {
      image: '/gallery/living_room1.jpeg',
      title: 'Residential Design',
      description: 'Transforming houses into dream homes with personalized interior solutions.',
    },
    {
      image: '/gallery/hall2.jpeg',
      title: 'Commercial Spaces',
      description: 'Creating productive and inspiring work environments for businesses.',
    },
    {
      image: '/gallery/living_room3.jpeg',
      title: 'Luxury Interiors',
      description: 'Bespoke high-end designs that reflect sophistication and elegance.',
    },
    {
      image: '/gallery/hall.jpeg',
      title: 'Design Consultation',
      description: 'Expert guidance to bring your vision to life with professional insights.',
    },
  ];

  const testimonials = [
    {
      id: 1,
      clientName: "Dr. Arjun Reddy",
      rating: 5,
      review: "Arka transformed our villa into a masterpiece. The blend of traditional elegance with modern luxury is exactly what we wanted. Truly the best in Hyderabad.",
      project: "Villa in Jubilee Hills"
    },
    {
      id: 2,
      clientName: "Lakshmi Rao",
      rating: 5,
      review: "I was looking for sophistication and comfort, and they delivered beyond my expectations. My penthouse feels like a 7-star hotel suite now.",
      project: "Penthouse at Banjara Hills"
    },
    {
      id: 3,
      clientName: "Vikram Raju",
      rating: 5,
      review: "Our corporate office needed a premium look to impress international clients. The design team nailed it. Professional, timely, and world-class.",
      project: "Corporate Office, Hitech City"
    },
    {
      id: 4,
      clientName: "Sravani Krishna",
      rating: 5,
      review: "Absolutely in love with my new home! They utilized every inch of space so beautifully. The color palette is stunning and very premium.",
      project: "Luxury Apt, Gachibowli"
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/gallery/bg.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-hero-overlay"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-15"></div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="mb-8">
                <span className="inline-block font-accent text-accent-200 tracking-widest uppercase text-xs font-semibold mb-6">
                  Hyderabad
                </span>
              </div>

              <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-cream-50 mb-8 leading-none">
                Crafting
                <span className="block mt-2 text-accent-200 italic">Timeless</span>
                <span className="block mt-2">Elegance</span>
              </h1>

              <div className="w-32 h-1 bg-gradient-to-r from-accent-300 to-accent-400 mb-10 rounded-full"></div>

              <p className="text-xl md:text-2xl text-cream-100 mb-8 leading-relaxed max-w-3xl font-body italic">
                "Design is not just what it looks like and feels like. Design is how it works."
              </p>

              <p className="text-lg md:text-xl text-cream-200 mb-12 leading-relaxed max-w-3xl font-body">
                We orchestrate spaces where luxury meets functionality, creating sanctuaries of refined living that transcend the ordinary.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/portfolio"
                  className="btn-luxury inline-block text-center"
                >
                  Explore Portfolio
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary inline-block text-center"
                >
                  Begin Your Journey
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-20 left-10 w-80 h-80 bg-cream-300/20 rounded-full blur-3xl"></div>
      </section>

      {/* Services Section - Redesigned with Real Images */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Elements */}

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-accent text-accent-500 tracking-[0.2em] uppercase text-sm font-bold mb-4 block">
                Our Expertise
              </span>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-primary-900 mb-6 leading-tight">
                Curated Design <span className="text-accent-500 italic">Services</span>
              </h2>
              <div className="w-24 h-1.5 bg-accent-500 mx-auto rounded-full mb-8"></div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-[450px] overflow-hidden cursor-pointer"
              >
                {/* Background Image with Zoom Effect */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.image})` }}
                ></div>

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/40 to-transparent transition-opacity duration-300 opacity-80 group-hover:opacity-90"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-wide border-l-4 border-accent-500 pl-4 group-hover:border-white transition-colors">
                      {service.title}
                    </h3>

                    <p className="font-body text-cream-200 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-xs">
                      {service.description}
                    </p>

                    <span className="inline-block border-b border-accent-400 pb-1 text-xs font-accent tracking-widest uppercase text-accent-400 group-hover:text-white group-hover:border-white transition-all duration-300">
                      Explore Service
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="w-20 h-1 bg-accent-300 mx-auto mb-8 rounded-full"></div>
            <p className="font-display text-3xl md:text-5xl text-cream-50 mb-8 italic leading-relaxed">
              "Excellence is not a destination; it is a continuous journey that never ends."
            </p>
            <p className="font-body text-cream-200 text-lg tracking-wider">
              — BRIAN TRACY
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-sand-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-accent text-accent-500 tracking-widest uppercase text-sm font-semibold mb-6 block">
                Client Stories
              </span>
              <h2 className="font-display text-5xl md:text-7xl font-bold text-primary-900 mb-8">
                What They <span className="text-accent-500 italic">Say</span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-accent-500 to-accent-600 mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-10 shadow-premium hover:shadow-luxury transition-all duration-500 border border-transparent hover:border-accent-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-6xl text-accent-400 font-display opacity-50 leading-none">"</div>
                  <div className="text-yellow-500 text-lg">{"★".repeat(testimonial.rating)}</div>
                </div>
                <p className="font-body text-lg text-primary-800 mb-8 leading-relaxed italic">
                  "{testimonial.review}"
                </p>
                <div className="border-t border-primary-100 pt-6">
                  <p className="font-accent text-sm tracking-wider uppercase text-primary-900 font-bold">
                    {testimonial.clientName}
                  </p>
                  <p className="font-body text-sm text-primary-600 mt-1">
                    {testimonial.project}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-cream-gradient">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display text-5xl md:text-6xl font-bold text-primary-900 mb-8">
              Ready to Transform Your Space?
            </h2>
            <p className="text-lg md:text-2xl text-primary-700 mb-12 font-body leading-relaxed">
              Let's create something extraordinary together. Schedule your personalized consultation today.
            </p>
            <Link to="/contact" className="btn-luxury">
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;