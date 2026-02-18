import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, uploadAPI, API_URL, formatUrl } from '../api/config';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        // Separate fetches to be more resilient
        const projRes = await projectsAPI.getAll().catch(err => {
          console.error("Failed to fetch projects:", err);
          return { data: [] };
        });
        const libRes = await uploadAPI.getAll().catch(err => {
          console.error("Failed to fetch library files:", err);
          return { data: [] };
        });

        setProjects(projRes.data || []);
        setLibraryFiles(libRes.data || []);
      } catch (e) {
        console.error("Unexpected error in fetch:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const mediaItems = [];

  // Add project media
  projects.forEach((p) => {
    (p.images || []).forEach((url, i) => {
      mediaItems.push({
        type: 'image',
        url: formatUrl(url),
        projectId: p._id,
        link: `/portfolio/${p._id}`,
        projectTitle: p.title,
        roomType: p.roomType,
        key: `img-${p._id}-${i}`,
      });
    });
    (p.videos || []).forEach((url, i) => {
      mediaItems.push({
        type: 'video',
        url: formatUrl(url),
        projectId: p._id,
        link: `/portfolio/${p._id}`,
        projectTitle: p.title,
        roomType: p.roomType,
        poster: formatUrl((p.images || [])[0]),
        key: `vid-${p._id}-${i}`,
      });
    });
  });

  // Add general library media (if not already strictly filtered)
  libraryFiles.forEach((file, i) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file.name);
    const url = formatUrl(`/uploads/${file.name}`);

    // Avoid duplicates if they are already in projects (check both exact match and filename)
    if (!mediaItems.some(m => m.url === url || m.url.includes(file.name))) {
      mediaItems.push({
        type: isImage ? 'image' : 'video',
        url,
        projectId: null,
        link: '#',
        projectTitle: 'Design Showcase',
        roomType: 'General',
        poster: isImage ? url : null,
        key: `lib-${i}`,
      });
    }
  });

  const filtered =
    filter === 'videos'
      ? mediaItems.filter((m) => m.type === 'video')
      : filter === 'images'
        ? mediaItems.filter((m) => m.type === 'image')
        : mediaItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Header */}
      <section className="relative pt-32 pb-20 bg-primary-50 overflow-hidden border-b border-primary-100">
        {/* Cinematic Bokeh Effect */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[70%] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[65%] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[30%] right-[15%] w-[25%] h-[45%] bg-accent-500/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="absolute inset-0 bg-luxury-pattern opacity-5" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="font-accent text-accent-500 tracking-[0.25em] uppercase text-sm block mb-4 font-bold">Media Library</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight text-primary-900">Gallery</h1>
            <p className="text-xl text-gray-500 font-light">
              A curated collection of our finest interior design works
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
            {['all', 'images', 'videos'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 font-accent text-sm tracking-[0.1em] uppercase transition-all duration-300 ${filter === f
                  ? 'bg-primary-800 text-white shadow-luxury'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-neutral-200 rounded-sm animate-pulse shadow-sm" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-neutral-600">
              <p className="text-xl font-medium">No media items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="group relative"
                >
                  <div className="rounded-sm overflow-hidden bg-white shadow-luxury group-hover:shadow-luxury-lg transition-all duration-500 cursor-pointer h-full border border-primary-50">
                    <div
                      className="aspect-[4/3] overflow-hidden relative"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.projectTitle}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            console.error("Image load failed:", item.url);
                            e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full">
                          <video
                            src={item.url}
                            poster={item.poster}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => {
                              e.target.pause();
                              e.target.currentTime = 0;
                            }}
                            onError={(e) => {
                              console.error("Video load failed:", item.url);
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6 text-primary-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-accent text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-2 backdrop-blur-sm">View Full</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-accent-600 uppercase tracking-widest">
                          {item.roomType}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium uppercase">
                          {item.type}
                        </span>
                      </div>
                      <p className="font-display font-medium text-primary-950 truncate">
                        {item.projectTitle}
                      </p>
                      {item.projectId && (
                        <Link
                          to={item.link}
                          className="text-[11px] text-primary-500 font-bold uppercase tracking-wider mt-2 inline-block hover:text-accent-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-950/95 backdrop-blur-md p-6"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-8 right-8 text-white hover:text-accent-400 transition-colors z-[110]"
              onClick={() => setSelectedItem(null)}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.projectTitle}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm border border-white/10"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  className="max-w-full max-h-full shadow-2xl rounded-sm border border-white/10"
                  controls
                  autoPlay
                />
              )}

              <div className="mt-8 text-center text-white">
                <span className="text-accent-400 font-accent text-xs font-bold uppercase tracking-[0.2em]">
                  {selectedItem.roomType}
                </span>
                <h3 className="text-3xl font-display font-light mt-2 tracking-tight">
                  {selectedItem.projectTitle}
                </h3>
                {selectedItem.projectId && (
                  <Link
                    to={selectedItem.link}
                    className="inline-block mt-4 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white border-b border-white/20 pb-1 transition-all"
                  >
                    View Complete Project
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="py-20 border-t border-neutral-100 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Link to="/portfolio" className="btn-primary">
            Visit Full Portfolio
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
