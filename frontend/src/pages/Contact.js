import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bookingsAPI } from '../api/config';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Contact = () => {
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    location: '',
    budget: '',
    serviceType: '',
    bookingDate: '',
    bookingTime: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Limit message to 1000 chars
    if (name === 'message' && value.length > 1000) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.clientName || !form.email || !form.phone || !form.bookingTime) {
      setErrorMessage('Please fill all required fields, including a time slot.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('sending');
    setErrorMessage('');
    try {
      await bookingsAPI.create(form);
      setStatus('success');
      setForm({
        clientName: '',
        email: '',
        phone: '',
        location: '',
        budget: '',
        serviceType: '',
        bookingDate: '',
        bookingTime: '',
        message: '',
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
      let msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      if (err.message === 'Network Error') msg = 'Cannot connect to server. Please check your internet connection.';
      setErrorMessage(msg);
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    background: '#F5EFE6',
    border: '1px solid rgba(200,150,62,0.25)',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '0.875rem',
    color: '#2C1A0E',
    fontFamily: 'inherit',
    transition: 'border-color 0.25s',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.6rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#8a7660',
    marginBottom: '0.5rem',
  };

  return (
    <div className="min-h-screen" style={{ background: '#EDE4D3' }}>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E1006 0%, #2C1A0E 50%, #3D2314 100%)' }}>
        <div className="absolute inset-0 bg-luxury-pattern opacity-[0.06]" />
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,150,62,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden leading-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '0.65rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.4em',
              color: '#C8963E', display: 'block', marginBottom: '1.5rem',
            }}>
              Connect With Us
            </span>
            <h1 className="font-display font-bold mb-8 leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', color: '#F5EFE6' }}>
              Begin Your <span style={{ color: '#C8963E', fontStyle: 'italic' }}>Legacy</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #C8963E)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C8963E' }} />
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #C8963E, transparent)' }} />
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '48px' }}>
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" fill="#EDE4D3" />
          </svg>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="py-24 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* ── Info Sidebar ── */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2 className="font-display text-3xl font-bold mb-8"
                style={{ color: '#2C1A0E', borderLeft: '4px solid #C8963E', paddingLeft: '1.25rem' }}>
                Contact Details
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
                    icon2: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
                    label: 'Our Studio',
                    lines: ['Plot No. 42, Jubilee Hills Road No. 36,', 'Hyderabad, Telangana 500033'],
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                    label: 'Email Us',
                    lines: ['contact@italianinteriors.design', 'inquiry@italianinteriors.design'],
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                    label: 'Call Us',
                    lines: ['+91 98765 43210', '040 2345 6789'],
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(200,150,62,0.12)', border: '1px solid rgba(200,150,62,0.2)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="#C8963E" viewBox="0 0 24 24">
                        {item.icon}
                        {item.icon2}
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#8a7660', marginBottom: '0.5rem' }}>
                        {item.label}
                      </h4>
                      {item.lines.map((line, j) => (
                        <p key={j} className="font-body leading-relaxed" style={{ color: '#3D2314', fontSize: '0.875rem' }}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="pt-8" style={{ borderTop: '1px solid rgba(200,150,62,0.2)' }}>
              <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#8a7660', marginBottom: '1.25rem' }}>
                Follow Our Journey
              </h4>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300"
                style={{ border: '1px solid rgba(200,150,62,0.3)', color: '#C8963E', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C8963E'; e.currentTarget.style.color = '#2C1A0E'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C8963E'; }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="lg:col-span-8 rounded-[2rem] p-8 md:p-12"
            style={{ background: '#FFFDF8', border: '1px solid rgba(200,150,62,0.2)', boxShadow: '0 8px 48px rgba(44,26,14,0.1)' }}>

            <h2 className="font-display text-3xl font-bold mb-10" style={{ color: '#2C1A0E' }}>
              Consultation Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="clientName" value={form.clientName} onChange={handleChange} required
                    placeholder="Enter your full name" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C8963E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="yourname@example.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C8963E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    placeholder="+91 XXXXX XXXXX" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C8963E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'} />
                </div>
                <div>
                  <label style={labelStyle}>Property Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} required
                    placeholder="e.g. Jubilee Hills, Hyderabad" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C8963E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'} />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label style={labelStyle}>Project Budget Range</label>
                  <select name="budget" value={form.budget} onChange={handleChange} required
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#C8963E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'}>
                    <option value="">Select Budget Range</option>
                    <option value="10-20L">10L – 20L</option>
                    <option value="20-50L">20L – 50L</option>
                    <option value="50L-1Cr">50L – 1Cr</option>
                    <option value="Above 1Cr">Above 1Cr</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Service Interest</label>
                  <select name="serviceType" value={form.serviceType} onChange={handleChange} required
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#C8963E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'}>
                    <option value="">Select a Service</option>
                    <option value="Residential">Full Home Interior</option>
                    <option value="Commercial">Commercial / Office</option>
                    <option value="Luxury">Luxury / Bespoke</option>
                    <option value="Consultation">Concept Consultation</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label style={labelStyle}>Preferred Consultation Date</label>
                <div style={{ position: 'relative' }}>
                  <DatePicker
                    selected={form.bookingDate ? new Date(form.bookingDate) : null}
                    onChange={(date) => setForm(f => ({ ...f, bookingDate: date ? date.toISOString().split('T')[0] : '' }))}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a consultation date"
                    className="custom-datepicker"
                  />
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#C8963E', zIndex: 10 }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time slots */}
              <div>
                <label style={labelStyle}>Select Available Time Slot</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: '10:00', label: '10:00 AM', desc: 'Morning' },
                    { id: '12:00', label: '12:00 PM', desc: 'Noon' },
                    { id: '14:00', label: '02:00 PM', desc: 'Afternoon' },
                    { id: '16:00', label: '04:00 PM', desc: 'Evening' },
                  ].map((slot) => {
                    const active = form.bookingTime === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, bookingTime: slot.id }))}
                        className="p-5 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden"
                        style={active ? {
                          background: 'linear-gradient(135deg, #2C1A0E, #3D2314)',
                          border: '1px solid #C8963E',
                          transform: 'scale(1.04)',
                          boxShadow: '0 8px 24px rgba(44,26,14,0.2)',
                        } : {
                          background: '#F5EFE6',
                          border: '1px solid rgba(200,150,62,0.25)',
                        }}
                      >
                        <span className="font-display font-bold text-lg"
                          style={{ color: active ? '#F5EFE6' : '#2C1A0E' }}>
                          {slot.label}
                        </span>
                        <span style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '0.6rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.2em',
                          color: active ? '#C8963E' : '#8a7660',
                        }}>
                          {slot.desc}
                        </span>
                        {active && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '50%', background: '#C8963E' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="bookingTime" value={form.bookingTime} required />
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Your Vision & Requirements (Optional)</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={form.message} 
                  onChange={handleChange}
                  placeholder="Tell us about your space, style preferences, and any specific requirements..." 
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#C8963E'}
                  onBlur={e => e.target.style.borderColor = 'rgba(200,150,62,0.25)'}
                />
                <p style={{ fontSize: '0.65rem', color: '#8a7660', fontStyle: 'italic', marginTop: '0.5rem' }}>
                  Max 1000 characters. {1000 - (form.message?.length || 0)} remaining.
                </p>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-5 font-accent font-bold uppercase transition-all duration-400"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '0.7rem', letterSpacing: '0.3em',
                    background: status === 'sending'
                      ? 'rgba(200,150,62,0.5)'
                      : 'linear-gradient(135deg, #C8963E, #D4A843)',
                    color: '#2C1A0E',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 28px rgba(200,150,62,0.3)',
                  }}
                  onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {status === 'sending' ? 'Sending…' : 'Submit Request'}
                </button>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 text-center rounded-xl"
                    style={{ background: 'rgba(200,150,62,0.1)', border: '1px solid rgba(200,150,62,0.3)' }}>
                    <p className="font-display text-xl font-bold italic mb-2" style={{ color: '#C8963E' }}>
                      Request Sent Successfully
                    </p>
                    <p className="font-body text-sm" style={{ color: '#3D2314' }}>
                      Our design executive will contact you within 24 hours to confirm.
                    </p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <p className="mt-6 text-center font-bold text-sm" style={{ color: '#dc2626' }}>
                    {errorMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;