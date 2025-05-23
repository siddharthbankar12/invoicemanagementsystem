import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const InvoiceDashboard = () => {
  const userData = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: "",
    amount: "",
    financialYear: "2024-2025",
    createdBy: userData?.id,
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchInvoices = async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
        search: searchTerm,
        financialYear: filterYear,
        startDate,
        endDate,
      };

      const response = await axiosInstance.get("/invoice/get-list", { params });
      setInvoices(response.data?.data || []);
    } catch (error) {
      setInvoices([]);
      toast.error("Failed to fetch invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, filterYear, startDate, endDate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInvoice) {
        const res = await axiosInstance.put(
          `/invoice/update/${formData.invoiceNumber}`,
          { date: formData.date, amount: formData.amount }
        );
        toast.success(res.data.message);
      } else {
        const res = await axiosInstance.post("/invoice/create", formData);
        toast.success(res.data.message);
      }

      setFormData({
        invoiceNumber: "",
        date: "",
        amount: "",
        financialYear: "2024-2025",
        createdBy: userData?.id,
      });
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (invoiceNumber) => {
    try {
      const res = await axiosInstance.delete("/invoice/delete", {
        data: { invoiceNumber },
      });
      toast.success(res.data.message);
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to delete invoice.");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.invoiceNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesYear = filterYear ? inv.financialYear === filterYear : true;
    const matchesStart = startDate
      ? new Date(inv.date) >= new Date(startDate)
      : true;
    const matchesEnd = endDate ? new Date(inv.date) <= new Date(endDate) : true;

    return matchesSearch && matchesYear && matchesStart && matchesEnd;
  });

  useEffect(() => {
    if (selectedInvoice) {
      setFormData({
        invoiceNumber: selectedInvoice.invoiceNumber,
        date: selectedInvoice.date.split("T")[0],
        amount: selectedInvoice.amount,
        financialYear: selectedInvoice.financialYear,
        createdBy: selectedInvoice.createdBy,
      });
    }
  }, [selectedInvoice]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Invoice Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Invoice Number"
          className="border p-2 rounded w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-48"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Financial Years</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded w-full sm:w-48"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <p className="mt-[10px]">To</p>
        <input
          type="date"
          className="border p-2 rounded w-full sm:w-48"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="p-3">Invoice No.</th>
            <th className="p-3">Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Financial Year</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">
                No invoices found
              </td>
            </tr>
          ) : (
            filteredInvoices.map((inv) => (
              <tr key={inv._id} className="border-t">
                <td className="p-3">{inv.invoiceNumber}</td>
                <td className="p-3">
                  {new Date(inv.date).toLocaleDateString()}
                </td>
                <td className="p-3">₹{inv.amount}</td>
                <td className="p-3">{inv.financialYear}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(inv.invoiceNumber)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Create New Invoice</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border rounded"
            placeholder="Invoice Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <select
            className="w-full p-2 border rounded"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
          >
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          {selectedInvoice && (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
              onClick={() => {
                setSelectedInvoice(null);
                setFormData({
                  invoiceNumber: "",
                  date: "",
                  amount: "",
                  financialYear: "2024-2025",
                  createdBy: userData?.id,
                });
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
