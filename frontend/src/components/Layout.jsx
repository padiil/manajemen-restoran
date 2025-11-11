import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = ({ role }) => {
  return (
    <div className="flex flex-row min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar role={role} className="md:w-64 w-full" />
      
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;