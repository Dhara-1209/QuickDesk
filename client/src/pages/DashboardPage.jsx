import React, { useState, useEffect } from 'react';
import TicketItem from '../components/tickets/TicketItem';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const response = await fetch('/api/tickets', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets.');
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []); // The empty array means this effect runs once when the component mounts

  if (loading) {
    return <p className="text-black text-center mt-8">Loading your tickets...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{color: '#000000', fontWeight: 'bold'}}>My Support Tickets</h1>
        <Link
          to="/create-ticket"
          className="bg-indigo-500/90 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
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
        <div className="text-center bg-white border border-gray-200 p-8 rounded-lg">
          <p className="text-gray-700 text-lg">You have not created any tickets yet.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;