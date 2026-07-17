import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Trends from './pages/Trends';
import ManualControl from './pages/ManualControl';
import Education from './pages/Education';
import Settings from './pages/Settings';
import LoginRegister from './pages/LoginRegister';
import Home from './pages/Home';
import CmsAdmin from './pages/CmsAdmin';
import MyShop from './pages/MyShop';
import ProductDetail from './pages/ProductDetail';
import { AuthContextProvider, useAuth } from './context/AuthContext';



function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f3]">
        <div className="flex flex-col items-center space-y-4">
          {/* Modern Pulse/Loader Bar */}
          <div className="flex space-x-2 justify-center items-center">
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <span className="text-xs font-semibold text-emerald-800 tracking-wider">Memuat Halaman...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route 
          path="/login" 
          element={!user ? <LoginRegister mode="login" /> : <Navigate to="/admin" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <LoginRegister mode="register" /> : <Navigate to="/admin" replace />} 
        />


        {/* MONITORING & ADMIN LAYOUT ROUTE */}
        <Route 
          path="/admin" 
          element={<MainLayout />}
        >
          {/* Public Pages */}
          <Route index element={<Dashboard />} />
          <Route path="trends" element={<Trends />} />



          {/* Protected Toko Page (For logged-in farmers/admins) */}
          <Route 
            path="toko" 
            element={
              <ProtectedRoute>
                <MyShop />
              </ProtectedRoute>
            } 
          />



          {/* Protected Pages (Admin Only) */}
          <Route 
            path="manual-control" 
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <ManualControl />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-gray-150 text-center text-sm font-bold text-red-500">
                    <i className="bi bi-shield-lock-fill text-3xl block mb-2 text-red-400"></i>
                    Akses Ditolak: Halaman ini hanya dapat diakses oleh Admin.
                  </div>
                )}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="education" 
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <Education />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-gray-150 text-center text-sm font-bold text-red-500">
                    <i className="bi bi-shield-lock-fill text-3xl block mb-2 text-red-400"></i>
                    Akses Ditolak: Halaman ini hanya dapat diakses oleh Admin.
                  </div>
                )}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <Settings />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-gray-150 text-center text-sm font-bold text-red-500">
                    <i className="bi bi-shield-lock-fill text-3xl block mb-2 text-red-400"></i>
                    Akses Ditolak: Halaman ini hanya dapat diakses oleh Admin.
                  </div>
                )}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="cms" 
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <CmsAdmin />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-gray-150 text-center text-sm font-bold text-red-500">
                    <i className="bi bi-shield-lock-fill text-3xl block mb-2 text-red-400"></i>
                    Akses Ditolak: Halaman ini hanya dapat diakses oleh Admin.
                  </div>
                )}
              </ProtectedRoute>
            } 
          />


          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>


        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <AppContent />
    </AuthContextProvider>
  );
}

export default App;

