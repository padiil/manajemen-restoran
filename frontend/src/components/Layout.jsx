import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, role }) => {
  return (
    <div className="flex flex-row min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar role={role} className="md:w-64 w-full" />  {/* Sidebar lebar 64 pada layar medium ke atas */}
      
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
