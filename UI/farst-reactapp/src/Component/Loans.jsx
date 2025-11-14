import React, { useEffect, useState } from "react";
import axios from "axios";

function Loans() {
  const API_URL = "https://localhost:7169/api/Loans";
  const BOOKS_URL = "https://localhost:7169/api/Books";
  const BORROWERS_URL = "https://localhost:7169/api/Borrowers";

  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [form, setForm] = useState({
    bookId: "",
    borrowerId: "",
    dueDate: "",
  });
  const [showOverdue, setShowOverdue] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loanRes, bookRes, borrowerRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(BOOKS_URL),
        axios.get(BORROWERS_URL),
      ]);
      setLoans(loanRes.data);
      setBooks(bookRes.data);
      setBorrowers(borrowerRes.data);
    } catch (error) {
      console.error(" Error loading data:", error);
      alert("Failed to load data. Check backend connection.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!form.bookId || !form.borrowerId || !form.dueDate) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(`${API_URL}/borrow`, {
        bookId: parseInt(form.bookId),
        borrowerId: parseInt(form.borrowerId),
        dueDate: form.dueDate,
      });
      alert("Book borrowed successfully!");
      setForm({ bookId: "", borrowerId: "", dueDate: "" });
      fetchData();
    } catch (error) {
      console.error(" Error borrowing book:", error);
      alert("Error borrowing book. Check backend API.");
    }
  };

  const handleReturn = async (loanId) => {
    if (window.confirm("Mark this loan as returned?")) {
      try {
        await axios.post(`${API_URL}/return/${loanId}`);
        fetchData();
      } catch (error) {
        console.error(" Error returning book:", error);
        alert("Error returning book.");
      }
    }
  };

  const handleShowOverdue = async () => {
    try {
      if (showOverdue) {
        fetchData();
      } else {
        const res = await axios.get(`${API_URL}/overdue`);
        setLoans(res.data);
      }
      setShowOverdue(!showOverdue);
    } catch (error) {
      console.error(" Error loading overdue loans:", error);
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h2 style={{ }
    }>
         Loan Management
      </h2>

      {} 
      <form
        onSubmit={handleBorrow}
        style={{
          marginBottom: 20,
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          name="bookId"
          value={form.bookId}
          onChange={handleChange}
          required
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <select
          name="borrowerId"
          value={form.borrowerId}
          onChange={handleChange}
          required
        >
          <option value="">Select Borrower</option>
          {borrowers.map((br) => (
            <option key={br.id} value={br.id}>
              {br.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          required
        />

        <button type="submit" style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
          Borrow Book
        </button>
      </form>

      <button
        onClick={handleShowOverdue}
        style={{
          marginBottom: 10,
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        {showOverdue ? "Show All Loans" : "Show Overdue Loans"}
      </button>

      {}
      <table
        width="100%"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          textAlign: "center",
          border: "1px solid #ccc",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#333", color: "#fff" }}>
            <th><b>ID</b></th>
            <th><b>Book</b></th>
            <th><b>Borrower</b></th>
            <th><b>Borrowed At</b></th>
            <th><b>Due Date</b></th>
            <th><b>Returned At</b></th>
            <th><b>Status</b></th>
            <th><b>Action</b></th>
          </tr>
        </thead>
        <tbody>
          {loans.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ padding: "20px" }}>
                No Loans Found
              </td>
            </tr>
          ) : (
            loans.map((loan, index) => {
              const isOverdue = !loan.returnedAt && new Date(loan.dueDate) < new Date();
              const bgColor =
                isOverdue
                  ? "#f8f4f4ff"
                  : loan.returnedAt
                  ? "#e0ffe0"
                  : index % 2 === 0
                  ? "#f9f9f9"
                  : "#ffffff";

              return (
                <tr key={loan.id} style={{ backgroundColor: bgColor }}>
                  <td>{loan.id}</td>
                  <td>{loan.book?.title}</td>
                  <td>{loan.borrower?.name}</td>
                  <td>{new Date(loan.borrowedAt).toLocaleDateString()}</td>
                  <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                  <td>
                    {loan.returnedAt
                      ? new Date(loan.returnedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {loan.returnedAt
                      ? " Returned"
                      : isOverdue
                      ? " Overdue"
                      : " Active"}
                  </td>
                  <td>
                    {!loan.returnedAt && (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        style={{
                          backgroundColor: "#ff9800",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Loans;
