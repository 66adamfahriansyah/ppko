import { useLocation, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTrends = location.pathname === '/trends';
  
  // Initial for backup avatar image
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar-header">
      <div className="navbar-left">
        {/* Hamburger Button (mobile only) */}
        <button
          onClick={onToggleSidebar}
          className="hamburger-btn"
          aria-label="Buka Menu Navigasi"
          id="hamburger-toggle"
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="flex items-center text-emerald-700">
          <i className="bi bi-flower1 text-xl mr-2"></i>
          <span className="font-semibold text-gray-800 text-base">
            {location.pathname === '/admin' ? 'Monitoring Area' : 
             location.pathname === '/admin/trends' ? 'Tren & Analitik' : 
             location.pathname === '/admin/toko' ? 'Kelola Toko Saya' :
             location.pathname.startsWith('/admin/product/') ? 'Detail Produk' :
             location.pathname === '/admin/education' ? 'Materi Edukasi' : 
             location.pathname === '/admin/cms' ? 'Kelola Website (CMS)' : 'Pengaturan Sistem'}


          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
        {/* Date Selector for Trends page */}
        {isTrends && (
          <div className="relative flex items-center bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 gap-1.5">
            <i className="bi bi-calendar3 text-emerald-700"></i>
            <select className="bg-transparent border-none outline-none cursor-pointer text-gray-700">
              <option>01 Jan 2026 - 31 Jan 2026</option>
              <option>1 Des 2025 - 31 Des 2025</option>
              <option>1 Nov 2025 - 30 Nov 2025</option>
            </select>
          </div>
        )}

        {/* Icons status */}
        <div className="flex items-center space-x-2">
          <button className="relative p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full transition flex items-center justify-center">
            <i className="bi bi-bell text-sm"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full transition flex items-center justify-center navbar-hide-mobile" title="Status Gateway">
            <i className="bi bi-router text-sm"></i>
          </button>
          <button className="p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full transition flex items-center justify-center navbar-hide-mobile" title="Sync Cloud">
            <i className="bi bi-cloud-check text-sm"></i>
          </button>
        </div>

        {/* Language Switcher - hide on very small screens */}
        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs navbar-hide-mobile">
          <button className="px-2 py-1 text-[10px] font-bold rounded-md bg-emerald-700 text-white shadow-sm">ID</button>
          <button className="px-2 py-1 text-[10px] font-bold rounded-md text-gray-500 hover:text-gray-800">EN</button>
        </div>

        {/* Profile Widget */}
        <div className="flex items-center pl-2 border-l border-gray-200">
          {user ? (
            <>
              <div className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 mr-2 w-8 h-8 flex items-center justify-center font-bold text-xs">
                {firstLetter}
              </div>
              <span className="text-xs font-bold text-gray-700 hidden lg:inline capitalize">{user?.username} ({user?.role})</span>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login', { state: { from: 'monitoring' } })}
              className="text-xs font-bold text-[#0b5924] hover:text-[#073c18] transition-colors"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;


