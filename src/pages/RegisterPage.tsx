import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { RegisterForm } from '@/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <SEOHead
        title="Create Account — Oromo Times"
        description="Join Oromo Times to stay informed with bilingual news coverage for the Oromo community."
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

          <RegisterForm />
        </div>
      </div>
    </>
  );
}
