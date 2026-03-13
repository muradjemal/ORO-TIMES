import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Twitter, Facebook, Youtube } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Placeholder — in production this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message sent! We\'ll get back to you soon.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us — Oromo Times"
        description="Get in touch with Oromo Times. Send us story tips, feedback, or inquiries."
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-navy-900 mb-2 text-center">
          Get in Touch
        </h1>
        <p className="text-navy-600 text-center mb-12 max-w-xl mx-auto">
          Have a question, story tip, or just want to say hello? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-8">
            <h2 className="text-xl font-serif font-bold text-navy-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-navy-700 mb-1">
                  Your Name
                </label>
                <Input
                  id="contactName"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-navy-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="contactSubject" className="block text-sm font-medium text-navy-700 mb-1">
                  Subject
                </label>
                <Input
                  id="contactSubject"
                  type="text"
                  placeholder="What is this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="contactMessage" className="block text-sm font-medium text-navy-700 mb-1">
                  Message
                </label>
                <textarea
                  id="contactMessage"
                  placeholder="Tell us more..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm text-navy-800 resize-none focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent placeholder:text-navy-400 disabled:opacity-60"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif font-bold text-navy-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-navy-100 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-navy-900">Email</h3>
                    <p className="text-sm text-navy-600">info@oromotimes.com</p>
                    <p className="text-sm text-navy-600">tips@oromotimes.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-navy-100 rounded-lg flex-shrink-0">
                    <Phone className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-navy-900">Phone</h3>
                    <p className="text-sm text-navy-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-navy-100 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5 text-navy-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-navy-900">Address</h3>
                    <p className="text-sm text-navy-600">
                      123 Media Street, Suite 456<br />
                      Washington, DC 20001<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="p-2.5 bg-navy-100 rounded-lg text-navy-600 hover:bg-navy-200 hover:text-navy-800 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2.5 bg-navy-100 rounded-lg text-navy-600 hover:bg-navy-200 hover:text-navy-800 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2.5 bg-navy-100 rounded-lg text-navy-600 hover:bg-navy-200 hover:text-navy-800 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-navy-100 rounded-xl h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-navy-400 mx-auto mb-2" />
                <p className="text-sm text-navy-500">Map</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
