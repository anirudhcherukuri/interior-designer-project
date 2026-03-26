import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Visitor tracking removed for streamlined performance
const VisitorTracker = () => {
  return null;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#EDE4D3' }}>
      <div className="flex flex-col min-h-screen">
        {!isAdmin && <Navbar />}
        <main className={`flex-grow ${!isAdmin ? 'pt-20' : ''}`}>
          {children}
        </main>
        {!isAdmin && <Footer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <VisitorTracker />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;