// components/ContactForm.js
import { useState } from 'react';
import TranslatedText from './i18n/TranslatedText';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real implementation, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 shadow-lg rounded-xl p-8 border border-purple-100">
      {submitStatus && (
        <div className={`p-4 mb-6 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="email" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
            <TranslatedText id="email" defaultText="Email" />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Your email"
          />
        </div>
        
        <div className="relative">
          <label htmlFor="subject" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
            <TranslatedText id="subject" defaultText="Subject" />
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-3 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Message subject"
          />
        </div>
        
        <div className="relative">
          <label htmlFor="message" className="absolute -top-2.5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-600">
            <TranslatedText id="message" defaultText="Message" />
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="mt-1 block w-full px-4 py-3 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Your message"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 text-white font-medium rounded-lg shadow-md 
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
            hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
            transform transition-all duration-200 hover:scale-[1.02] 
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <TranslatedText id="sending" defaultText="Sending..." />
            </div>
          ) : (
            <TranslatedText id="sendMessage" defaultText="Send Message" />
          )}
        </button>
      </form>
    </div>
  );
}
