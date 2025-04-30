import React from 'react';

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard content will be implemented later */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Bookings</h2>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Restaurant Stats</h2>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;