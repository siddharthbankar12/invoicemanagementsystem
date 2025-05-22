import React from "react";

const InvoiceDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Invoice Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Invoice Number"
          className="border p-2 rounded w-full sm:w-64"
        />
        <select className="border p-2 rounded w-full sm:w-48">
          <option>Filter by Financial Year</option>
          <option>2023-2024</option>
          <option>2024-2025</option>
        </select>
        <input type="date" className="border p-2 rounded w-full sm:w-48" />
        <input type="date" className="border p-2 rounded w-full sm:w-48" />
      </div>

      <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="p-3">Invoice No.</th>
            <th className="p-3">Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id} className="border-t">
              <td className="p-3">INV-{id}</td>
              <td className="p-3">2025-04-01</td>
              <td className="p-3">₹{id * 1000}</td>
              <td className="p-3 space-x-2">
                <button className="bg-yellow-400 px-3 py-1 rounded">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Create New Invoice</h2>
        <form className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Invoice Number"
          />
          <input type="date" className="w-full p-2 border rounded" />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Amount"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
