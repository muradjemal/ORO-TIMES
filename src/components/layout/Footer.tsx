import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { label: 'Politics', slug: 'politics' },
  { label: 'Business', slug: 'business' },
  { label: 'Culture', slug: 'culture' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Technology', slug: 'technology' },
  { label: 'Opinion', slug: 'opinion' },
];

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy', to: '/terms' },
];

/**
 * Site-wide footer with newsletter signup, category links, company links, and social icons.
 */
export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── Column 1: Brand ── */}
          <div>
            <Link to="/" className="inline-block">
              <span className="font-serif text-xl font-bold tracking-tight">
                OROMO TIMES
              </span>
              <span className="block h-0.5 w-10 bg-gold mt-1" />
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Your trusted bilingual source for news and analysis from the
              Oromo community and beyond. Delivering stories in Afaan Oromoo
              and English.
            </p>
            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ── Column 2: Categories ── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Company ── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Newsletter ── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-gray-400">
              Stay informed. Get the latest stories delivered to your inbox
              every week.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 min-w-0 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <Button variant="gold" size="sm" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-navy-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Oromo Times. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Powered by <span className="text-gold font-medium">OROMO TIMES</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
