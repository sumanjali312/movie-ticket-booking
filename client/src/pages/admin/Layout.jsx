import React from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavbar />

      {/* Sidebar + Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 px-4 py-10 md:px-8 h-[calc(100vh-64px)] overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
