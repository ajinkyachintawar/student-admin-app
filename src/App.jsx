import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', course: '', aadhar_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);


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

  const uploadAadharFile = async (file, studentName) => {
    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
  
      if (fileExt !== 'pdf') {
        alert("Only PDF files are allowed.");
        return null;
      }
  
      const filePath = `public/${studentName}_${Date.now()}.pdf`;
  
      console.log("Uploading file to:", filePath);
  
      const { data, error } = await supabase.storage
        .from('student-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
  
      if (error) {
        console.error("Upload error:", error.message);
        alert("Upload failed: " + error.message);
        return null;
      }
  
      const { data: publicURLData } = supabase.storage
        .from('student-documents')
        .getPublicUrl(filePath);
  
      console.log("Public URL:", publicURLData.publicUrl);
      return publicURLData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      return null;
    }
  };
  
  

  const handleAddOrUpdate = async () => {
    if (!newStudent.name || !newStudent.age || !newStudent.course) {
      alert("All fields are required.");
      return;
    }
  
    let uploadedUrl = newStudent.aadhar_url;
  
    if (file) {
      uploadedUrl = await uploadAadharFile(file, newStudent.name);
  
      if (!uploadedUrl) {
        alert("Aadhar file upload failed. Record not saved.");
        return;
      }
    }
  
    const studentData = { ...newStudent, aadhar_url: uploadedUrl };
    console.log("Saving to Supabase students table:", studentData);
  
    let error;
    if (editingId) {
      ({ error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase
        .from('students')
        .insert([studentData]));
    }
  
    if (error) {
      console.error("Database insert/update error:", error.message);
      alert("Failed to save student. " + error.message);
    } else {
      console.log("Student record saved successfully.");
      setNewStudent({ name: '', age: '', course: '', aadhar_url: '' });
      setFile(null);
      setEditingId(null);
      fetchStudents();
    }
  };
  

  const handleEdit = (student) => {
    setNewStudent({
      name: student.name,
      age: student.age,
      course: student.course,
      aadhar_url: student.aadhar_url || ''
    });
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
        <input
          className="input"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
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
          {student.aadhar_url && (
            <div>
              <strong>Aadhar:</strong>{' '}
              <a href={student.aadhar_url} target="_blank" rel="noreferrer">
                View Aadhar
              </a>
            </div>
          )}
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
