import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students'

function App() {

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', age: '', course: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(API_URL);
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: '', email: '', age: '', course: '' });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm(student);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchStudents();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Student Management System</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
        <input placeholder="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
      </form>

      <h3>Student List</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id} style={{ marginBottom: '10px' }}>
            <strong>{student.name}</strong> ({student.email}) - Age: {student.age}, Course: {student.course}
            <button onClick={() => handleEdit(student)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => handleDelete(student.id)} style={{ marginLeft: '5px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
