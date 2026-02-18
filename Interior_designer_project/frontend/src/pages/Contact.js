import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bookingsAPI } from '../api/config';

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
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      await bookingsAPI.create(form);
      setStatus('success');
      setForm({ clientName: '', email: '', phone: '', location: '', budget: '', serviceType: '', bookingDate: '', bookingTime: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
      let msg = err.response?.data?.error || "Something went wrong. Please try again.";
      if (err.message === "Network Error") {
        msg = "Cannot connect to server. Please check your internet connection.";
      }
      setErrorMessage(msg);
    }
  };

  const inputClass =
    'w-full px-5 py-4 bg-white border border-gray-200 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-all duration-300 font-body text-gray-900 placeholder-gray-400 rounded-sm font-medium';
  const labelClass = 'block font-accent text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2 font-bold';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 bg-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-luxury-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="font-accent text-accent-400 tracking-[0.3em] uppercase text-xs font-bold block mb-6">
              Connect With Us
            </span>
            <h1 className="font-display text-5xl md:text-8xl font-bold mb-8 text-cream-50 leading-tight">
              Begin Your <span className="text-accent-400 italic">Legacy</span>
            </h1>
            <div className="w-24 h-1 bg-accent-500 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* INFO SIDEBAR */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary-900 mb-8 border-l-4 border-accent-500 pl-6">Contact Details</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-accent text-xs tracking-widest uppercase text-gray-500 font-bold mb-2">Our Studio</h4>
                    <p className="font-body text-primary-800 leading-relaxed font-medium">Plot No. 42, Jubilee Hills Road No. 36,<br />Hyderabad, Telangana 500033</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-accent text-xs tracking-widest uppercase text-gray-500 font-bold mb-2">Email Us</h4>
                    <p className="font-body text-primary-800 leading-relaxed font-medium">contact@arka.design</p>
                    <p className="font-body text-primary-800 leading-relaxed font-medium">inquiry@arka.design</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-900 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-accent text-xs tracking-widest uppercase text-gray-500 font-bold mb-2">Call Us</h4>
                    <p className="font-body text-primary-800 leading-relaxed font-medium">+91 98765 43210</p>
                    <p className="font-body text-primary-800 leading-relaxed font-medium">040 2345 6789</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h4 className="font-accent text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold mb-6">Follow Our Journey</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 border border-pink-100 bg-pink-50/30 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="lg:col-span-8 bg-gray-50 p-8 md:p-12 rounded shadow-premium">
            <h2 className="font-display text-3xl font-bold text-primary-900 mb-10">Consultation Request</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Dr. Arjun Reddy"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="arjun@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Property Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Jubilee Hills, Hyderabad"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Project Budget Range</label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Budget Range</option>
                    <option value="10-20L">10L - 20L</option>
                    <option value="20-50L">20L - 50L</option>
                    <option value="50L-1Cr">50L - 1Cr</option>
                    <option value="Above 1Cr">Above 1Cr</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Service Interest</label>
                  <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select a Service</option>
                    <option value="Residential">Full Home Interior</option>
                    <option value="Commercial">Commercial/Office</option>
                    <option value="Luxury">Luxury/Bespoke</option>
                    <option value="Consultation">Concept Consultation</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-12">
                <div>
                  <label className={labelClass}>Preferred Consultation Date</label>
                  <div className="relative group">
                    <input
                      type="date"
                      name="bookingDate"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.bookingDate}
                      onChange={handleChange}
                      required
                      className={`${inputClass} !py-5 cursor-pointer appearance-none !bg-gray-50/50 hover:!bg-white hover:border-accent-400`}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-accent-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Select Available Time Slot</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: '10:00', label: '10:00 AM', desc: 'Morning' },
                      { id: '12:00', label: '12:00 PM', desc: 'Noon' },
                      { id: '14:00', label: '02:00 PM', desc: 'Afternoon' },
                      { id: '16:00', label: '04:00 PM', desc: 'Evening' },
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, bookingTime: slot.id }))}
                        className={`p-5 border transition-all flex flex-col items-center justify-center gap-2 rounded-sm group relative overflow-hidden ${form.bookingTime === slot.id
                          ? 'bg-primary-900 border-primary-900 text-white shadow-xl scale-105'
                          : 'bg-white border-gray-200 text-primary-900 hover:border-accent-400 hover:bg-accent-50/30'
                          }`}
                      >
                        {form.bookingTime === slot.id && (
                          <motion.div layoutId="activeSlot" className="absolute inset-0 bg-primary-900 -z-10" />
                        )}
                        <span className="font-display font-bold text-lg">{slot.label}</span>
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-accent font-bold ${form.bookingTime === slot.id ? 'text-accent-400' : 'text-gray-400'}`}>
                          {slot.desc}
                        </span>
                        {form.bookingTime === slot.id && (
                          <div className="absolute top-2 right-2">
                            <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="bookingTime" value={form.bookingTime} required />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-primary-900 text-white w-full py-5 font-accent text-xs font-bold uppercase tracking-[0.3em] hover:bg-accent-600 transition-all duration-500 rounded shadow-premium"
                >
                  {status === 'sending' ? 'SENDING...' : 'SUBMIT'}
                </button>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 bg-accent-50 border border-accent-200 text-primary-900 text-center rounded"
                  >
                    <p className="font-display text-xl mb-2 font-bold italic text-accent-600">Request Sent Successfully</p>
                    <p className="font-body text-sm font-medium">Our design executive will contact you within 24 hours to confirm.</p>
                  </motion.div>
                )}
                {status === 'error' && (
                  <p className="mt-8 text-red-600 font-bold text-center">
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
