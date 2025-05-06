import { useState } from 'react';
import './styles.css'
function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', course: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = () => {
    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = newStudent;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }
    setNewStudent({ name: '', age: '', course: '' });
  };

  const handleEdit = (index) => {
    setNewStudent(students[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
    setNewStudent({ name: '', age: '', course: '' });
    setEditingIndex(null);
  };

  return (
    <div className="container">
      <h1>Student Administration</h1>

      <div className="card">
        <div className="card-header">
          {editingIndex !== null ? 'Edit Student' : 'Add Student'}
        </div>
        <input
          className="input"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="age"
          placeholder="Age"
          value={newStudent.age}
          onChange={handleInputChange}
        />
        <input
          className="input"
          name="course"
          placeholder="Course"
          value={newStudent.course}
          onChange={handleInputChange}
        />
        <button className="button" onClick={handleAddOrUpdate}>
          {editingIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>

      {students.map((student, index) => (
        <div className="card" key={index}>
          <div><strong>Name:</strong> {student.name}</div>
          <div><strong>Age:</strong> {student.age}</div>
          <div><strong>Course:</strong> {student.course}</div>
          <div style={{ marginTop: '10px' }}>
            <button className="button" onClick={() => handleEdit(index)}>Edit</button>
            <button className="button delete" onClick={() => handleDelete(index)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
