// client/src/components/tickets/TicketItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const TicketItem = ({ ticket }) => {
  // Status button styling is now uniform white

  return (
    <Link to={`/ticket/${ticket._id}`} className="block">
      <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <p className="text-sm text-gray-500">
              {new Date(ticket.createdAt).toLocaleString('en-US')}
            </p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{ticket.subject}</h3>
            <p className="text-sm text-gray-600 mt-1">Category: {ticket.category}</p>
          </div>
          <div className="flex items-center ml-4">
            <div
              className={`text-sm font-semibold bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full border border-indigo-200`}
            >
              {ticket.status}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <span className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            Click to view details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TicketItem;