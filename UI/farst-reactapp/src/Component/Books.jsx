import React, { useEffect, useState } from "react";
import axios from "axios";

function Books() {
 
const API_URL = "https://localhost:7169/api/Books";

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    title: "",
    author: "",
    isbn: "",
    genre: "",
    quantity: 0,
  });
  const [editing, setEditing] = useState(false);

  
  const fetchBooks = async () => {
    const res = await axios.get(API_URL);
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      await axios.put(`${API_URL}/${form.id}`, form);
      setEditing(false);
    } else {
      await axios.post(API_URL, form);
    }

    setForm({
      id: 0,
      title: "",
      author: "",
      isbn: "",
      genre: "",
      quantity: 0,
    });

    fetchBooks();
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditing(true);
  };

 
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchBooks();
    }
  };

  return (
    <div className="container" style={{ padding: 20 }}>
      <h2>Library Book Management</h2>

      {}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <button type="submit">
          {editing ? "Update Book" : "Add Book"}
        </button>
      </form>

      {}
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr style={{ background: "#ddd" }}>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Genre</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">
                No books found
              </td>
            </tr>
          ) : (
            books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.isbn}</td>
                <td>{b.genre}</td>
                <td>{b.quantity}</td>
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

export default Books;
