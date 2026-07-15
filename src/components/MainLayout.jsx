import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function MainLayout() {
  const { user, logoutUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* GLOBAL SIDEBAR */}
      <Sidebar 
        user={user} 
        onLogout={logoutUser} 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="app-main">
        {/* GLOBAL NAVBAR */}
        <Navbar 
          user={user} 
          onLogout={logoutUser} 
          onToggleSidebar={toggleSidebar} 
        />

        {/* PAGE BODY */}
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>

        {/* FOOTER */}
        <footer className="bg-white text-center py-4 border-t border-gray-150 text-xs text-gray-400 mt-auto">
          © 2026 E-BIO PENS. Developed by the Software Development Team of PPK Ormawa E-BIO PENS.
        </footer>
      </main>
    </div>
  );
}

export default MainLayout;
