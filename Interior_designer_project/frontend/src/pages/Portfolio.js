import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI, formatUrl } from '../api/config';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const roomTypes = ['All', 'Bedroom', 'Living Room', 'Kitchen', 'Office', 'Full House'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data || []);
      setFilteredProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (roomType) => {
    setActiveFilter(roomType);
    if (roomType === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.roomType === roomType));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-primary-50 text-primary-900 overflow-hidden border-b border-primary-200">
        {/* Cinematic Bokeh Effect */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[70%] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[60%] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[40%] bg-accent-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="absolute inset-0 bg-luxury-pattern opacity-5" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="font-accent text-accent-600 tracking-[0.25em] uppercase text-sm block mb-4 font-bold">
              Our Work
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight text-primary-900">
              Portfolio
            </h1>
            <p className="text-xl text-primary-600 font-light max-w-2xl mx-auto">
              Explore our collection of beautifully designed spaces across different room types
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Filter Section */}
      <section className="py-10 bg-white/90 backdrop-blur-sm sticky top-20 md:top-24 z-40 border-b border-neutral-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {roomTypes.map((roomType) => (
              <button
                key={roomType}
                onClick={() => handleFilter(roomType)}
                className={`px-5 py-2.5 font-accent text-sm tracking-[0.1em] uppercase transition-all duration-300 ${activeFilter === roomType
                  ? 'bg-primary-800 text-white shadow-luxury'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
              >
                {roomType}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-neutral-200 rounded-sm h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-2">No Projects Found</h3>
              <p className="text-neutral-600">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/portfolio/${project._id}`}>
                    <div className="bg-white rounded-sm overflow-hidden shadow-luxury card-hover">
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={formatUrl(project.images[0])}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x600?text=Project+Image+Missing";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/95 backdrop-blur-sm text-primary-800 font-accent text-xs tracking-wider px-3 py-1.5">
                            {project.roomType}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-display font-light text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-neutral-500 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{project.location}</span>
                          </div>
                          <span className="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-accent text-primary-600 tracking-[0.25em] uppercase text-sm block mb-4">Start a project</span>
            <h2 className="section-title mb-6">
              Have a Project in Mind?
            </h2>
            <p className="section-subtitle mb-8 max-w-2xl mx-auto">
              Let's create something beautiful together. Contact us for a free consultation.
            </p>
            <Link to="/contact" className="btn-primary">
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;