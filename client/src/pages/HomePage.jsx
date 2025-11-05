// client/src/pages/HomePage.jsx


import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TicketItem from '../components/tickets/TicketItem'; // We'll use our TicketItem component
import PostLoginWelcome from '../components/PostLoginWelcome';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch tickets if the user is logged in
    if (user) {
      const fetchTickets = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found.');

          const response = await fetch('http://localhost:5000/api/tickets', {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) throw new Error('Failed to fetch tickets.');
          
          const data = await response.json();
          setTickets(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTickets();
    } else {
      // If there's no user, we're not loading anything
      setLoading(false);
    }
  }, [user]); // This effect re-runs whenever the user state changes

  // This is the content for logged-in users
  const renderDashboard = () => {
    if (loading) return <p className="text-white text-center mt-8">Loading your tickets...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

    return (
      <div className="py-8">
        <PostLoginWelcome />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white" style={{ fontSize: '28px' }}>My Support Tickets</h1>
          <Link
            to="/create-ticket"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Create New Ticket
          </Link>
        </div>
        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <TicketItem key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-800 p-8 rounded-lg">
            <p className="text-white text-lg">You have not created any tickets yet.</p>
          </div>
        )}
      </div>
    );
  };

  // This is the content for guests
  const renderGuestView = () => (
    <div className="text-white text-center py-20">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
        Welcome to QuickDesk
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        The simplest way to manage support tickets.
      </p>
      <div>
        <Link
          to="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg mr-4"
        >
          Get Started
        </Link>
      </div>
    </div>
  );

  return user ? renderDashboard() : renderGuestView();
};

export default HomePage;