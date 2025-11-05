// client/src/pages/admin/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoleRequestManager from '../../components/admin/RoleRequestManager';

const AdminDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets', 'users', or 'requests'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        console.log('Fetching admin data...'); // Debug log

        // Fetch tickets and users in parallel
        const [ticketsResponse, usersResponse] = await Promise.all([
          fetch('/api/tickets/all', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
        ]);

        console.log('Tickets response status:', ticketsResponse.status); // Debug log
        console.log('Users response status:', usersResponse.status); // Debug log

        if (!ticketsResponse.ok) {
          const data = await ticketsResponse.json();
          console.error('Tickets error:', data); // Debug log
          throw new Error(data.msg || 'Failed to fetch tickets.');
        }

        if (!usersResponse.ok) {
          const data = await usersResponse.json();
          console.error('Users error:', data); // Debug log
          throw new Error(data.msg || 'Failed to fetch users.');
        }

        const ticketsData = await ticketsResponse.json();
        const usersData = await usersResponse.json();

        console.log('Tickets data:', ticketsData); // Debug log
        console.log('Users data:', usersData); // Debug log

        setTickets(ticketsData);
        setUsers(usersData);
      } catch (err) {
        console.error('Admin dashboard error:', err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    closed: tickets.filter(t => t.status === 'Closed').length,
    totalUsers: users.length,
    endUsers: users.filter(u => u.role === 'End User').length,
    agents: users.filter(u => u.role === 'Support Agent').length,
    admins: users.filter(u => u.role === 'Admin').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-blue-500';
      case 'Closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-600';
      case 'Support Agent': return 'bg-blue-600';
      case 'End User': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !assignedAgent) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/tickets/${selectedTicket._id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedAgent }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign ticket');
      }

      // Update the ticket in the local state
      const updatedTicket = await response.json();
      setTickets(tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t));
      setShowAssignmentModal(false);
      setSelectedTicket(null);
      setAssignedAgent('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-gray-700 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
        <div className="text-gray-700 text-sm">
          Total Tickets: <span className="font-bold">{stats.total}</span> | 
          Total Users: <span className="font-bold">{stats.totalUsers}</span>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 mb-8">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-gray-500 text-sm">Total Tickets</div>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{stats.open}</div>
          <div className="text-green-600 text-sm">Open</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
          <div className="text-yellow-700 text-sm">In Progress</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-700">{stats.resolved}</div>
          <div className="text-indigo-700 text-sm">Resolved</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">{stats.closed}</div>
          <div className="text-gray-600 text-sm">Closed</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{stats.endUsers}</div>
          <div className="text-purple-700 text-sm">End Users</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-700">{stats.agents}</div>
          <div className="text-indigo-700 text-sm">Agents</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-rose-700">{stats.admins}</div>
          <div className="text-rose-700 text-sm">Admins</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-700">{stats.totalUsers}</div>
          <div className="text-orange-700 text-sm">Total Users</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'tickets'
              ? 'bg-white text-gray-900 border-b-2 border-indigo-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          🎫 Ticket Management
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-gray-900 border-b-2 border-indigo-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-gray-900 border-b-2 border-indigo-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          🔍 Role Requests
        </button>
      </div>

      {activeTab === 'tickets' && (
        <>
          {/* Filters and Sorting */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-gray-700 text-sm">Filter by Status:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1 bg-white text-gray-900 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="all">All</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-gray-700 text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 bg-white text-gray-900 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="subject">Subject</option>
                  <option value="status">Status</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-gray-700 text-sm">Order:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-1 bg-white text-gray-900 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          {sortedTickets.length > 0 ? (
            <div className="space-y-4">
              {sortedTickets.map((ticket) => (
                <div key={ticket._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          <Link to={`/ticket/${ticket._id}`} className="hover:text-indigo-600">
                            {ticket.subject}
                          </Link>
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        {ticket.priority && (
                          <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{ticket.description.substring(0, 150)}...</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Category: {ticket.category}</span>
                        <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                        {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                          <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* User Information and Actions */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">Submitted by:</span>
                        <span className="text-gray-900 font-medium">{ticket.user?.displayName || 'Unknown'}</span>
                        <span className="text-gray-600">({ticket.user?.email || 'No email'})</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/ticket/${ticket._id}`}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          View Details
                        </Link>
                        {ticket.status === 'Open' && (
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowAssignmentModal(true);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                          >
                            Assign to Agent
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-gray-200 p-8 rounded-lg">
              <p className="text-gray-700 text-lg">
                {filter === 'all' ? 'There are no tickets in the system.' : `No ${filter.toLowerCase()} tickets found.`}
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
                    <span className="text-indigo-800 font-bold text-lg">
                      {user.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.displayName}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                    className="px-3 py-1 bg-white text-gray-900 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  >
                    <option value="End User">End User</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <RoleRequestManager />
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Ticket to Agent</h3>
            <p className="text-gray-600 mb-4">
              Assigning: <span className="font-medium">{selectedTicket?.subject}</span>
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Select Agent:</label>
              <select
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">Select an agent...</option>
                {users
                  .filter(user => user.role === 'Support Agent')
                  .map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.displayName} ({agent.email})
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAssignTicket}
                disabled={!assignedAgent}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignmentModal(false);
                  setSelectedTicket(null);
                  setAssignedAgent('');
                }}
                className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage; 