import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Public-facing layout wrapper.
 * Renders the sticky Navbar, page content (via Outlet), and Footer.
 */
const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      {/* pt-16 compensates for the fixed navbar height */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
