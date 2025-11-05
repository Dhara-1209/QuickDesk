// client/src/pages/agent/AgentDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import TicketItem from '../../components/tickets/TicketItem'; // Reusing our component

const AgentDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        // Fetch from the new endpoint for all tickets
        const response = await fetch('http://localhost:5000/api/tickets/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.msg || 'Failed to fetch tickets.');
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, []);

  if (loading) {
    return <p className="text-black text-center mt-8">Loading all tickets...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-black mb-8">All Support Tickets</h1>
      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketItem key={ticket._id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-800 p-8 rounded-lg">
          <p className="text-black text-lg">There are no tickets in the system.</p>
        </div>
      )}
    </div>
  );
};

export default AgentDashboardPage;