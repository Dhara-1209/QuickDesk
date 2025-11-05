// client/src/pages/TicketDetailPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  // Agent response state
  const [newResponse, setNewResponse] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);

  // Form state for updates
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    status: '',
    priority: ''
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Ticket not found');
          }
          throw new Error('Failed to fetch ticket details');
        }

        const data = await response.json();
        setTicket(data);
        // Initialize form data with current ticket data
        setFormData({
          subject: data.subject || '',
          description: data.description || '',
          category: data.category || '',
          status: data.status || '',
          priority: data.priority || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update ticket');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddResponse = async (e) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setResponseLoading(true);
    setResponseError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newResponse }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to add response');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setNewResponse('');
    } catch (err) {
      setResponseError(err.message);
    } finally {
      setResponseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-white text-lg">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Ticket not found</p>
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              to="/"
              className="text-indigo-400 hover:text-indigo-300 mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">{ticket.subject}</h1>
          </div>
          <div
            className={`text-sm font-semibold bg-white text-gray-900 px-4 py-2 rounded-full shadow-md`}
          >
            {ticket.status}
          </div>
        </div>

        {updateError && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {updateError}
          </div>
        )}

        {isEditing ? (
          // Edit Form
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Edit Ticket</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing">Billing</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Ticket'}
              </button>
            </div>
          </form>
        ) : (
          // View Mode
          <>
            {/* Ticket Details */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Ticket Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Category:</span>
                      <p className="text-white font-medium">{ticket.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Priority:</span>
                      <p className="text-white font-medium">{ticket.priority || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Created:</span>
                      <p className="text-white font-medium">
                        {new Date(ticket.createdAt).toLocaleString('en-US')}
                      </p>
                    </div>
                    {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                      <div>
                        <span className="text-gray-400 text-sm">Last Updated:</span>
                        <p className="text-white font-medium">
                          {new Date(ticket.updatedAt).toLocaleString('en-US')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Submitted by:</span>
                      <p className="text-white font-medium">{ticket.user?.displayName || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Email:</span>
                      <p className="text-white font-medium">{ticket.user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-white whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>

            {/* Responses/Comments Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Agent Responses</h3>
              
              {/* Display existing responses */}
              {ticket.responses && ticket.responses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {ticket.responses.map((response, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-indigo-400 font-medium">
                          {response.user?.displayName || 'Agent'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(response.createdAt).toLocaleString('en-US')}
                        </span>
                      </div>
                      <p className="text-white whitespace-pre-wrap">{response.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6">No responses yet.</p>
              )}

              {/* Add new response form - Only for agents/admins */}
              {(user?.role === 'Admin' || user?.role === 'Support Agent') && ticket.status !== 'Closed' && (
                <div>
                  <h4 className="text-white font-medium mb-3">Add Response</h4>
                  {responseError && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                      {responseError}
                    </div>
                  )}
                  <form onSubmit={handleAddResponse}>
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Type your response to the customer..."
                      rows="4"
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={responseLoading || !newResponse.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        {responseLoading ? 'Adding...' : 'Add Response'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <Link
                to="/"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Back to Dashboard
              </Link>
              {ticket.status !== 'Closed' && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Edit Ticket
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetailPage; 