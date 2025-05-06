import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', course: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch on load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: true });

    if (error) console.error(error);
    else setStudents(data);
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!newStudent.name || !newStudent.age || !newStudent.course) return;

    if (editingId) {
      const { error } = await supabase
        .from('students')
        .update(newStudent)
        .eq('id', editingId);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
        .from('students')
        .insert([newStudent]);
      if (error) console.error(error);
    }

    setNewStudent({ name: '', age: '', course: '' });
    setEditingId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setNewStudent({ name: student.name, age: student.age, course: student.course });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) console.error(error);
    else fetchStudents();
  };

  return (
    <div className="container">
      <h1>Student Administration</h1>

      <div className="card">
        <div className="card-header">
          {editingId ? 'Edit Student' : 'Add Student'}
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
          type="number"
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
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      {students.map((student) => (
        <div className="card" key={student.id}>
          <div><strong>Name:</strong> {student.name}</div>
          <div><strong>Age:</strong> {student.age}</div>
          <div><strong>Course:</strong> {student.course}</div>
          <div style={{ marginTop: '10px' }}>
            <button className="button" onClick={() => handleEdit(student)}>Edit</button>
            <button className="button delete" onClick={() => handleDelete(student.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
