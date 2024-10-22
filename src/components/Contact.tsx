// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For this example, we'll just simulate a successful submission
    setSubmitStatus('Thank you for your message. We\'ll get back to you soon!');
    toast.success('Message sent successfully!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-header">Contact Us</h1>
      <div className="max-w-lg mx-auto">
        <p className="mb-6 text-sm">Have questions or want to learn more about SpatialMods? We'd love to hear from you!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-xs font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors text-sm"
          >
            Send Message
          </button>
        </form>
        {submitStatus && (
          <p className="mt-4 text-green-600 text-sm">{submitStatus}</p>
        )}
      </div>
    </div>
  );
}

export default Contact;