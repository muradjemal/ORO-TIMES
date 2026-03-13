import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NotFoundPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Display */}
        <h1 className="text-8xl md:text-9xl font-serif font-bold text-navy-200 mb-2">
          404
        </h1>

        <h2 className="text-2xl font-serif font-bold text-navy-900 mb-3">
          Page Not Found
        </h2>

        <p className="text-navy-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Go Home button */}
        <Link to="/">
          <Button variant="primary" className="mb-8">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Link>

        {/* Search option */}
        <div className="border-t border-navy-100 pt-8">
          <p className="text-sm text-navy-500 mb-4">Or try searching for what you need:</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
