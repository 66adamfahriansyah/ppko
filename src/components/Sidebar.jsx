import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Sidebar({ user, onLogout, isOpen, onClose }) {
  const navigate = useNavigate();
  // Get initials for profile avatar
  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : 'US';
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay (mobile only) */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div>
          {/* Mobile Close Button */}
          <div className="sidebar-close-row">
            <button
              onClick={onClose}
              className="sidebar-close-btn"
              aria-label="Tutup Menu"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Logo & Brand Header */}
          <div className="mb-8" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <h1 className="text-xl font-bold text-emerald-950 tracking-tight leading-tight">PPK ORMAWA</h1>
            <h2 className="text-2xl font-extrabold text-emerald-700 leading-none">E-BIO PENS</h2>
            <p className="text-xs font-semibold text-gray-400 mt-1">Agriculture Monitoring</p>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex flex-col space-y-1">
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                }`
              }
            >
              <i className="bi bi-grid-fill mr-3"></i> Dashboard
            </NavLink>
            <NavLink 
              to="/admin/trends" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                }`
              }
            >
              <i className="bi bi-graph-up mr-3"></i> Trends
            </NavLink>

            <NavLink 
              to="/admin/education" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                }`
              }
            >
              <i className="bi bi-journal-bookmark mr-3"></i> Education
            </NavLink>

            {user && user.role === 'user' && (
              <NavLink 
                to="/admin/toko" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                  }`
                }
              >
                <i className="bi bi-shop mr-3"></i> Toko
              </NavLink>
            )}


            
            {user?.role === 'admin' && (
              <>
                <NavLink 
                  to="/admin/cms" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                    }`
                  }
                >
                  <i className="bi bi-layout-text-window-reverse mr-3"></i> Kelola Website
                </NavLink>

                <NavLink 
                  to="/admin/settings" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                    }`
                  }
                >
                  <i className="bi bi-gear mr-3"></i> Settings
                </NavLink>
              </>
            )}

            {/* Kembali ke Landing Page */}
            <div className="border-t border-gray-100 my-2 pt-2">
              <NavLink 
                to="/" 
                className="flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <i className="bi bi-arrow-left-circle mr-3"></i> Landing Page
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Profile Footer with Logout option */}
        {user && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mr-3 shadow-inner">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h6 className="text-xs font-bold text-gray-800 truncate capitalize">{user?.username}</h6>
                <span className="text-[10px] text-gray-400 block font-medium capitalize">{user?.role} Profile</span>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-red-100 cursor-pointer"
            >
              <i className="bi bi-box-arrow-right"></i> Keluar Aplikasi
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;


