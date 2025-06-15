import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

interface ThemeClasses {
  cardBg: string;
  border: string;
  text: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
}

interface ContactFormProps {
  themeClasses: ThemeClasses;
  isDarkMode: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ themeClasses, isDarkMode }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message' });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br ${themeClasses.cardBg} border ${themeClasses.border} rounded-2xl p-8 backdrop-blur-sm`}>
      <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Send a Message</h3>
      
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' 
          ? 'bg-green-100 border border-green-300 text-green-700' 
          : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={`block ${themeClasses.textMuted} text-sm mb-2`}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg focus:border-blue-500 focus:outline-none ${themeClasses.text} ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'} transition-colors`}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className={`block ${themeClasses.textMuted} text-sm mb-2`}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg focus:border-blue-500 focus:outline-none ${themeClasses.text} ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'} transition-colors`}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className={`block ${themeClasses.textMuted} text-sm mb-2`}>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg focus:border-blue-500 focus:outline-none ${themeClasses.text} ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'} transition-colors`}
            placeholder="Project Discussion"
          />
        </div>

        <div>
          <label className={`block ${themeClasses.textMuted} text-sm mb-2`}>Message</label>
          <textarea
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg focus:border-blue-500 focus:outline-none ${themeClasses.text} ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'} resize-none transition-colors`}
            placeholder="Tell me about your project..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 ${
            isSubmitting 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;