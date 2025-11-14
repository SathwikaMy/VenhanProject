import React, { useState, useEffect } from "react";
import axios from "axios";

function Borrowers() {
  const API_URL = "https://localhost:7169/api/Borrowers";

  const [borrowers, setBorrowers] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    contact: "",
    membershipId: ""
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const res = await axios.get(API_URL);
      setBorrowers(res.data);
    } catch (err) {
      console.error("Error fetching borrowers:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API_URL}/${form.id}`, form);
        setEditing(false);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ id: 0, name: "", contact: "", membershipId: "" });
      fetchBorrowers();
    } catch (err) {
      console.error("Error saving borrower:", err);
    }
  };

  const handleEdit = (b) => {
    setForm(b);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this borrower?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBorrowers();
      } catch (err) {
        console.error("Error deleting borrower:", err);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Library Borrowers Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={form.contact}
          onChange={handleChange}
        />
        <input
          type="text"
          name="membershipId"
          placeholder="Membership ID"
          value={form.membershipId}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? "Update" : "Add Borrower"}</button>
      </form>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Membership ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowers.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No Borrowers Found
              </td>
            </tr>
          ) : (
            borrowers.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.contact}</td>
                <td>{b.membershipId}</td>
                <td>
                  <button onClick={() => handleEdit(b)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Borrowers;
