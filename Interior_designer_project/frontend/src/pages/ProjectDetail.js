import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, formatUrl } from '../api/config';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectsAPI.getById(id);
        setProject(response.data);
      } catch (err) {
        setError(err.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-neutral-600 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-semibold text-neutral-900 mb-2">Project not found</h1>
          <p className="text-neutral-600 mb-8">{error || 'This project may have been removed.'}</p>
          <Link to="/portfolio" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </motion.div>
      </div>
    );
  }

  const { title, description, location, roomType, images = [], videos = [] } = project;
  const hasVideos = videos && videos.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Back nav */}
      <div className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-20 md:top-24 z-30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Portfolio
          </Link>
        </div>
      </div>

      {/* Hero: first image or first video */}
      <section className="relative bg-neutral-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-block font-accent text-accent-400 tracking-[0.2em] uppercase text-sm mb-4">
              {roomType}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-4">{title}</h1>
            <p className="text-sand-200 text-lg font-light">{location}</p>
          </motion.div>
        </div>
        <div className="relative w-full aspect-[21/9] max-h-[70vh] overflow-hidden">
          {hasVideos && videos[0] ? (
            <video
              className="w-full h-full object-cover"
              src={formatUrl(videos[0])}
              poster={formatUrl(images[0])}
              controls
              autoPlay
              muted
              loop
              playsInline
              onError={(e) => console.error("Video load failed:", videos[0])}
            >
              Your browser does not support the video tag.
            </video>
          ) : images[0] ? (
            <img
              src={formatUrl(images[0])}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x600?text=Project+Image+Missing";
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Description */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="font-display text-2xl font-light text-neutral-900 mb-6">About this project</h2>
            <p className="text-neutral-600 text-lg leading-relaxed font-light">{description}</p>
          </motion.div>
        </div>
      </section>

      {/* Image gallery */}
      {images.length > 1 && (
        <section className="py-12 md:py-16 border-t border-neutral-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-light text-neutral-900 mb-10">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {images.slice(1).map((src, index) => (
                <motion.button
                  key={`${src}-${index}`}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setSelectedImage(src)}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <img
                    src={formatUrl(src)}
                    alt={`${title} - ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x600?text=Image+Missing";
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos section */}
      {hasVideos && (
        <section className="py-12 md:py-16 bg-neutral-50 border-t border-neutral-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-light text-neutral-900 mb-10">Videos</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {videos.map((url, index) => (
                <motion.div
                  key={`${url}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl overflow-hidden bg-neutral-900 shadow-xl"
                >
                  <video
                    className="w-full aspect-video object-cover"
                    src={formatUrl(url)}
                    poster={formatUrl(images[index])}
                    controls
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                  {videos.length > 1 && (
                    <p className="p-4 text-sm text-neutral-500 font-medium">Video {index + 1}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={formatUrl(selectedImage)}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x800?text=Image+Missing";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 border-t border-neutral-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-neutral-600 mb-6">Explore more of our work or start your own project.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/portfolio" className="btn-primary">
              View all projects
            </Link>
            <Link to="/contact" className="btn-secondary btn-secondary-light inline-flex items-center">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
