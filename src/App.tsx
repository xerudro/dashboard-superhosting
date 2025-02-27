import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthProvider';
import { AdminRoute } from './components/AdminRoute';
import { Database } from './lib/db';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Hosting from './pages/Hosting';
import Websites from './pages/Websites';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = Database.getInstance();
        await db.initialize();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeDatabase();

    // Handle errors that bubble up to window
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black text-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/hosting" element={<Hosting />} />
              <Route path="/websites" element={<Websites />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;