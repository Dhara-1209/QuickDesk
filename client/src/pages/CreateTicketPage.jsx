// client/src/pages/CreateTicketPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTicketPage = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General'); // Default category
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // In a real app, you might fetch these from an API
  const categories = ['General', 'Technical Support', 'Billing', 'Bug Report'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // This is a fallback; ProtectedRoute should prevent this.
        throw new Error('You must be logged in to create a ticket.');
      }

      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the token for authentication
        },
        body: JSON.stringify({ subject, category, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create ticket.');
      }

      // On success, redirect the user to the homepage to see their new ticket (eventually)
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="w-full max-w-lg mx-auto p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-8 text-black">Create a New Support Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300"
              placeholder="e.g., I cannot reset my password"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300"
              placeholder="Please describe your issue in detail..."
              required
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-center my-4">{error}</p>}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;