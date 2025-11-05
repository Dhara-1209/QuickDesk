// client/src/components/admin/RoleRequestManager.jsx
import React, { useState, useEffect } from 'react';

const RoleRequestManager = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/role-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch pending requests');
      
      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleRequest = async (userId, action) => {
    setProcessingId(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/role-requests/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) throw new Error('Failed to process request');
      
      const data = await response.json();
      
      // Show success message
      alert(data.message);
      
      // Refresh the list
      fetchPendingRequests();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading role requests...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🔍</span>
          Pending Role Requests
          <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
            {pendingRequests.length}
          </span>
        </h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-500">All role requests have been processed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div 
                key={request._id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">🛠️</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.displayName}</h3>
                        <p className="text-sm text-gray-500">{request.email}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Requesting: {request.requestedRole}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Requested on: {formatDate(request.roleRequestedAt)}
                      </span>
                    </div>

                    {request.agentJustification && (
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Justification:</p>
                        <p className="text-sm text-gray-600 italic">"{request.agentJustification}"</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      User ID: {request._id} • Joined: {formatDate(request.createdAt)}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleRoleRequest(request._id, 'approve')}
                      disabled={processingId === request._id}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === request._id ? '...' : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => handleRoleRequest(request._id, 'reject')}
                      disabled={processingId === request._id}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === request._id ? '...' : '❌ Reject'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingRequests.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Approved users will immediately gain Support Agent access. Rejected requests can be resubmitted.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleRequestManager;