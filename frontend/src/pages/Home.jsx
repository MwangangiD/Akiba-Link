import React from 'react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Tools</h1>
        <p className="text-gray-500 mt-2">See what your neighbors are sharing today.</p>
      </div>
      
      {/* We will map your MongoDB tools here later! */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900">DeWalt Power Drill</h3>
          <p className="text-gray-600 mt-2">Perfect condition, comes with 2 batteries.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;