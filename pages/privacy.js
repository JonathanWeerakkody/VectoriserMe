// pages/privacy.js
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TranslatedText from '../components/i18n/TranslatedText';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Privacy Policy - Vectorise.Me</title>
        <meta name="description" content="Privacy Policy for Vectorise.Me - Free Online Image to SVG Converter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-indigo max-w-none">
          <p className="text-sm text-gray-500 mb-6">Last updated: March 18, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Introduction</h2>
            <p className="mb-3">
              Welcome to Vectorise.Me ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
            </p>
            <p>
              This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">The Data We Collect</h2>
            <p className="mb-3">
              When you use Vectorise.Me, we collect minimal data to provide our service:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="font-semibold">Images you upload:</strong> These are temporarily stored on our servers for processing and are automatically deleted after 24 hours.</li>
              <li><strong className="font-semibold">Technical data:</strong> This includes your IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and platform.</li>
              <li><strong className="font-semibold">Usage data:</strong> Information about how you use our website and services.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">How We Use Your Data</h2>
            <p className="mb-3">We use your data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide our image to SVG conversion service</li>
              <li>To improve our website and user experience</li>
              <li>To administer and protect our website (including troubleshooting, data analysis, testing, system maintenance, support, reporting, and hosting of data)</li>
              <li>To measure the effectiveness of our advertising</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Cookies</h2>
            <p className="mb-3">
              We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
            </p>
            <p>
              For detailed information on the cookies we use and the purposes for which we use them, see our <a href="/cookies" className="text-indigo-600 hover:text-indigo-800">Cookie Policy</a>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Data Security</h2>
            <p className="mb-3">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            </p>
            <p>
              In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Third-Party Services</h2>
            <p className="mb-3">
              We use third-party services to help us operate our website and provide our services. These third parties may have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="font-semibold">Analytics:</strong> We use analytics providers to help us understand how users interact with our website.</li>
              <li><strong className="font-semibold">Advertising:</strong> We use advertising services to display advertisements on our website.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Rights</h2>
            <p className="mb-3">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us through our <a href="/contact" className="text-indigo-600 hover:text-indigo-800">contact form</a> on the website.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
