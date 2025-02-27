import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthProvider';
import { AdminRoute } from './components/AdminRoute';
import { Database } from './lib/db';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Hosting from './pages/Hosting';
import Websites from './pages/Websites';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = Database.getInstance();
        await db.initialize();
      } catch (error) {
        console.error('Failed to initialize database:', error);
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

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
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
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
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