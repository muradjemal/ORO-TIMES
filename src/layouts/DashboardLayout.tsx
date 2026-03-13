import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Avatar } from '@/components/ui/Avatar';

/**
 * Dashboard layout with collapsible sidebar and top action bar.
 * On mobile the sidebar overlays the content with a backdrop.
 */
const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRole = user?.role ?? 'journalist';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((p) => !p)}
          userRole={userRole}
        />
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              userRole={userRole}
            />
          </div>
        </>
      )}

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          {/* Left: mobile menu + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-lg p-2 text-navy-700 hover:bg-navy-50 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-lg font-semibold text-navy-900 font-serif">
              Dashboard
            </h1>
          </div>

          {/* Right: notifications + user */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-lg p-2 text-navy-700 hover:bg-navy-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {/* Unread dot */}
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {user && (
              <div className="flex items-center gap-2">
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name}
                  size="sm"
                />
                <span className="hidden sm:block text-sm font-medium text-navy-900 max-w-[120px] truncate">
                  {user.full_name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
