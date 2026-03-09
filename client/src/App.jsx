import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import ServiceSelection from './pages/ServiceSelection';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; 
import AdminNotice from './pages/AdminNotice';
import AdminCertificates from './pages/AdminCertificates';
import AdminDashboard from './pages/AdminDashboard';
import ApplyCertificate from './pages/ApplyCertificate';
import MyRecords from './pages/MyRecords'; // New Page
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const updateAuthStatus = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.replace('/'); 
  };

  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLoginSuccess={updateAuthStatus} />} />
          
          {/* CITIZEN ROUTES */}
          <Route path="/dashboard" element={
            <PrivateRoute roleRequired="citizen">
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute roleRequired="citizen">
              <Profile />
            </PrivateRoute>
          } />

          {/* UPDATED: Service Selection Menu */}
          <Route path="/services" element={
            <PrivateRoute roleRequired="citizen">
              <ServiceSelection />
            </PrivateRoute>
          } />

          {/* UPDATED: Dynamic Application Form */}
          <Route path="/apply/:serviceId" element={
            <PrivateRoute roleRequired="citizen">
              <ApplyCertificate />
            </PrivateRoute>
          } />

          <Route path="/my-records" element={
            <PrivateRoute roleRequired="citizen">
              <MyRecords />
            </PrivateRoute>
          } />

          {/* ADMIN ROUTES */}
          <Route path="/admin-dashboard" element={
            <PrivateRoute roleRequired="admin">
              <AdminDashboard onLogout={handleLogout} />
            </PrivateRoute>
          } />
          
          <Route path="/admin-notices" element={
            <PrivateRoute roleRequired="admin">
              <AdminNotice />
            </PrivateRoute>
          } />
          
          <Route path="/admin-certificates" element={
            <PrivateRoute roleRequired="admin">
              <AdminCertificates />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

// Reset scroll on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const LayoutWrapper = ({ children, user, onLogout }) => {
  const location = useLocation();
  
  const hideNavbarPaths = [
    '/dashboard',
    '/admin',
    '/profile',
    '/services',
    '/apply',
    '/my-records'
  ];

  const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!shouldHideNavbar && <Navbar user={user} onLogout={onLogout} />}
      {children}
    </>
  );
};

export default App;