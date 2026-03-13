import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PenLine,
  Plus,
  ClipboardCheck,
  Globe,
  Users,
  FolderTree,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface SidebarProps {
  /** Whether the sidebar is in collapsed (icon-only) mode */
  collapsed: boolean;
  /** Toggle collapsed state */
  onToggle: () => void;
  /** Current user role — controls which nav items are visible */
  userRole: UserRole;
}

interface NavItem {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  to: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    roles: ['journalist', 'editor', 'admin'],
  },
  {
    label: 'Articles',
    icon: FileText,
    to: '/dashboard/articles',
    roles: ['journalist', 'editor', 'admin'],
  },
  {
    label: 'My Drafts',
    icon: PenLine,
    to: '/dashboard/drafts',
    roles: ['journalist'],
  },
  {
    label: 'New Article',
    icon: Plus,
    to: '/dashboard/new-article',
    roles: ['journalist'],
  },
  {
    label: 'Review Queue',
    icon: ClipboardCheck,
    to: '/dashboard/review',
    roles: ['editor'],
  },
  {
    label: 'Published',
    icon: Globe,
    to: '/dashboard/published',
    roles: ['editor'],
  },
  {
    label: 'Users',
    icon: Users,
    to: '/dashboard/users',
    roles: ['admin'],
  },
  {
    label: 'Categories',
    icon: FolderTree,
    to: '/dashboard/categories',
    roles: ['admin'],
  },
  {
    label: 'Comments',
    icon: MessageSquare,
    to: '/dashboard/comments',
    roles: ['admin'],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    to: '/dashboard/analytics',
    roles: ['admin'],
  },
];

/**
 * Dashboard sidebar navigation.
 * Shows navigation items based on the user role.
 * Collapses to icon-only mode for more content space.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  userRole,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole),
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (to: string) => location.pathname === to;

  return (
    <aside
      className={[
        'flex flex-col bg-navy-950 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      ].join(' ')}
    >
      {/* ── Logo ── */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-navy-800">
        <Link to="/" className="overflow-hidden whitespace-nowrap">
          <span className="font-serif font-bold text-lg tracking-tight">
            {collapsed ? 'OT' : 'OROMO TIMES'}
          </span>
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-navy-800 border-l-4 border-gold text-white'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800/60',
              ].join(' ')}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom actions ── */}
      <div className="border-t border-navy-800 px-2 py-4 space-y-1">
        <Link
          to="/dashboard/settings"
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-navy-800/60 transition-colors"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          title={collapsed ? 'Sign Out' : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-navy-800/60 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
