import { useState, useEffect } from 'react';
import { SEOHead } from '@/components/seo/SEOHead';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Oromo Times platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    id: 'use-of-service',
    title: '2. Use of Service',
    content: `You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service: (a) in any way that violates any applicable national or international law or regulation; (b) to transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation; (c) to impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity; (d) to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.`,
  },
  {
    id: 'user-accounts',
    title: '3. User Accounts',
    content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`,
  },
  {
    id: 'user-content',
    title: '4. User Content',
    content: `Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness. By posting Content to the Service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.`,
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual Property',
    content: `The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Oromo Times and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Oromo Times.`,
  },
  {
    id: 'privacy',
    title: '6. Privacy Policy',
    content: `Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Service and informs users of our data collection practices. We are committed to protecting the privacy of our users and handle all personal data in accordance with applicable data protection laws.`,
  },
  {
    id: 'disclaimers',
    title: '7. Disclaimers',
    content: `The information contained in this Service is for general information purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the Service or the information, products, services, or related graphics contained in the Service for any purpose. Any reliance you place on such information is therefore strictly at your own risk.`,
  },
  {
    id: 'limitation-of-liability',
    title: '8. Limitation of Liability',
    content: `In no event shall Oromo Times, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.`,
  },
  {
    id: 'governing-law',
    title: '9. Governing Law',
    content: `These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`,
  },
  {
    id: 'changes',
    title: '10. Changes to Terms',
    content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.`,
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: `If you have any questions about these Terms, please contact us at legal@oromotimes.com.`,
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEOHead
        title="Terms of Service — Oromo Times"
        description="Read the Terms of Service for Oromo Times."
      />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-navy-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-navy-500">Last updated: January 1, 2026</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Desktop sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-6 bg-white rounded-xl shadow-sm border border-navy-100 p-6">
              <h3 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`text-sm transition-colors block py-1 ${
                        activeSection === section.id
                          ? 'text-gold font-medium'
                          : 'text-navy-600 hover:text-navy-800'
                      }`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-8">
              <div className="prose prose-navy max-w-none">
                {SECTIONS.map((section) => (
                  <section key={section.id} id={section.id} className="mb-8 last:mb-0">
                    <h2 className="text-xl font-serif font-bold text-navy-900 mb-3">
                      {section.title}
                    </h2>
                    <p className="text-navy-700 leading-relaxed text-sm">{section.content}</p>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
