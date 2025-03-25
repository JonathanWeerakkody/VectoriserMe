import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import TranslatedText from '../components/i18n/TranslatedText';

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ status: 'idle', message: '' });
  
  const handleSubmit = async (formData) => {
    setFormStatus({ status: 'submitting', message: '' });
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ 
        status: 'success', 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Contact Support - Vectorise.Me</title>
        <meta name="description" content="Contact the Vectorise.Me team for support or feedback." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            <TranslatedText id="contactTitle" defaultText="Contact Us" />
          </h1>
          
          <ContactForm onSubmit={handleSubmit} formStatus={formStatus} />
          
          {/* Common Problems & Solutions Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                <TranslatedText id="commonProblems" defaultText="Common Problems & Solutions" />
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                <TranslatedText id="commonProblemsDesc" defaultText="Here are some common issues you might encounter and how to resolve them." />
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <ul className="list-disc pl-5 space-y-4">
                <li>
                  <strong><TranslatedText id="imageQualityIssue" defaultText="Image Quality Issues" /></strong>
                  <p><TranslatedText id="imageQualitySolution" defaultText="The converted SVG doesn't match the original image quality. Adjust the settings in the vectorization process, such as increasing the number of colors or adjusting the tolerance levels." /></p>
                </li>
                <li>
                  <strong><TranslatedText id="performanceIssue" defaultText="Performance Issues" /></strong>
                  <p><TranslatedText id="performanceSolution" defaultText="The conversion process is slow or unresponsive. Try reducing the image size or complexity before uploading. Large or highly detailed images may take longer to process." /></p>
                </li>
                <li>
                  <strong><TranslatedText id="compatibilityIssue" defaultText="Compatibility Problems" /></strong>
                  <p><TranslatedText id="compatibilitySolution" defaultText="The generated SVG doesn't display correctly in certain browsers or applications. Ensure that the SVG is optimized and check for any incompatible features. You may need to simplify the SVG or use a different viewer." /></p>
                </li>
                <li>
                  <strong><TranslatedText id="errorMessages" defaultText="Error Messages" /></strong>
                  <p><TranslatedText id="errorMessagesSolution" defaultText="Encountering error messages during the conversion process. Check the error message for specific details. Common issues include unsupported file formats or corrupted images. Ensure your image is in a supported format (e.g., PNG, JPG)." /></p>
                </li>
                <li>
                  <strong><TranslatedText id="backendConnectionIssue" defaultText="Backend Connection Issues" /></strong>
                  <p><TranslatedText id="backendConnectionSolution" defaultText="Unable to connect to the vectoriser backend for conversion. Verify your internet connection and try again. If the problem persists, there might be a server-side issue; please try again later or contact support." /></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
