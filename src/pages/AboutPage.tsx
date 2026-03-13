import { Heart, Lightbulb, Users, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/Button';

const TEAM_MEMBERS = [
  { name: 'Abdisa Gemechu', role: 'Editor-in-Chief', avatar: null },
  { name: 'Chaltu Bekele', role: 'Senior Reporter', avatar: null },
  { name: 'Darajjee Hussien', role: 'Technology Lead', avatar: null },
  { name: 'Fatuma Mohammed', role: 'Community Editor', avatar: null },
  { name: 'Guutama Asefa', role: 'Multimedia Producer', avatar: null },
  { name: 'Hawwii Tadesse', role: 'Social Media Manager', avatar: null },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Truth',
    description: 'We are committed to accurate, unbiased reporting that serves the public interest and upholds the highest standards of journalism.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Our platform is built for and by the Oromo community, providing a trusted space for shared stories, perspectives, and dialogue.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage cutting-edge technology, including AI-powered tools like QALACA, to deliver news in new and accessible ways.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About — Oromo Times"
        description="Learn about Oromo Times, a bilingual digital news platform serving the Oromo community with trusted journalism in Afaan Oromoo and English."
      />

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-6">
            About Oromo Times
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed max-w-2xl mx-auto">
            Oromo Times is a bilingual digital news platform dedicated to delivering timely,
            accurate, and impactful news coverage to the Oromo community worldwide.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-navy-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Our Mission</h2>
          <p className="text-navy-700 leading-relaxed mb-4">
            We believe that every community deserves access to quality journalism in their own language.
            Oromo Times bridges the information gap by providing comprehensive news coverage in both
            Afaan Oromoo and English, ensuring that the stories that matter most to the Oromo people
            are told with accuracy, depth, and cultural sensitivity.
          </p>
          <p className="text-navy-700 leading-relaxed">
            Founded on the principles of truth, transparency, and community empowerment, Oromo Times
            serves as a vital platform for news, analysis, opinion, and cultural stories. Our team of
            dedicated journalists and contributors works tirelessly to inform, educate, and connect
            the Oromo diaspora and beyond.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gold/10 rounded-xl flex items-center justify-center">
                  <value.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">{value.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-navy-200 rounded-full flex items-center justify-center text-navy-700 font-bold text-xl">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-sm font-semibold text-navy-900">{member.name}</h3>
                <p className="text-xs text-navy-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 md:p-12">
          <Mail className="h-10 w-10 mx-auto mb-4 text-gold" />
          <h2 className="text-2xl font-serif font-bold text-white mb-3">Get in Touch</h2>
          <p className="text-navy-200 mb-6 max-w-md mx-auto">
            Have a story tip, feedback, or want to contribute? We&apos;d love to hear from you.
          </p>
          <Link to="/contact">
            <Button variant="gold">Contact Us</Button>
          </Link>
        </section>
      </div>
    </>
  );
}
