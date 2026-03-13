import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <>
      <SEOHead
        title="Sign In — Oromo Times"
        description="Sign in to your Oromo Times account to access your dashboard and manage content."
      />

      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-navy-50 via-white to-navy-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="w-full max-w-md py-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-serif font-bold">
                <span className="text-navy-900">OROMO</span>
                <span className="text-gold ml-1">TIMES</span>
              </h1>
            </Link>
          </div>

          <LoginForm />
        </div>
      </div>
    </>
  );
}
