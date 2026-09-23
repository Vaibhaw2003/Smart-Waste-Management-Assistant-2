import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Assistant from './pages/Assistant';
import Complaints from './pages/Complaints';
import AdminDashboard from './pages/AdminDashboard';

function Guard({ children, admin }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div className="live-dot" style={{ width: '12px', height: '12px' }} />
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading EcoTrack...</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return admin && user.role !== 'admin' ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/assistant" element={<Guard><Assistant /></Guard>} />
          <Route path="/complaints" element={<Guard><Complaints /></Guard>} />
          <Route path="/admin" element={<Guard admin><AdminDashboard /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
