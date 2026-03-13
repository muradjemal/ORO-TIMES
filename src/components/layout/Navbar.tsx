import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from '@/components/search/SearchBar';
import { Avatar } from '@/components/ui/Avatar';

/** Main navigation categories */
const CATEGORIES = [
  { label: 'Politics', slug: 'politics' },
  { label: 'Business', slug: 'business' },
  { label: 'Culture', slug: 'culture' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Technology', slug: 'technology' },
  { label: 'Opinion', slug: 'opinion' },
] as const;

/**
 * Top navigation bar with logo, category links, search, language toggle, and auth.
 * Fixed to the top of the viewport. Includes a mobile hamburger drawer.
 */
export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'om' | 'en'>('en');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'om' : 'en'));

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Left: Logo ── */}
          <Link to="/" className="flex-shrink-0 group">
            <span className="font-serif text-xl font-bold text-navy-900 tracking-tight">
              OROMO TIMES
            </span>
            <span className="block h-0.5 w-full bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>

          {/* ── Center: Category links (hidden on mobile) ── */}
          <nav className="hidden md:flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium text-navy-700 rounded-lg hover:bg-navy-50 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* ── Right: Search, Language, Auth ── */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <SearchBar variant="navbar" />

            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLang}
              className="hidden sm:inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-50 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Auth */}
            {user ? (
              <Link
                to={`/dashboard/${user.role === 'reader' ? 'journalist' : user.role}`}
                className="hidden sm:flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-navy-50 transition-colors"
              >
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name}
                  size="sm"
                />
                <span className="text-sm font-medium text-navy-900 max-w-[100px] truncate">
                  {user.full_name}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-navy-700 hover:bg-navy-50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="space-y-1 px-4 py-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-50 transition-colors"
              >
                {cat.label}
              </Link>
            ))}

            <hr className="my-3 border-gray-100" />

            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-50 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {lang === 'en' ? 'Afaan Oromoo' : 'English'}
            </button>

            {/* Auth actions */}
            {user ? (
              <>
                <Link
                  to={`/dashboard/${user.role === 'reader' ? 'journalist' : user.role}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  <Avatar
                    src={user.avatar_url}
                    name={user.full_name}
                    size="sm"
                  />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-navy-900 hover:bg-navy-50 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
