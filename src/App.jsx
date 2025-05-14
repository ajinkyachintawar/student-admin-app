import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', course: '', aadhar_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // NEW

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

      return publicURLData.publicUrl;
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      return null;
    }
  };

const handleAddOrUpdate = async () => {
  // Validate required fields
  const requiredFields = [
    'name',
    'dob',
    'age',
    'religion',
    'caste',
    'mother_tongue',
    'father_name',
    'mother_name',
    'parent_mobile',
    'target_class'
  ];

  const isEmpty = requiredFields.some(field => !newStudent[field]);

  if (isEmpty) {
    toast.warn("⚠️ Please fill in all required fields.");
    return;
  }

  let uploadedUrl = newStudent.aadhar_url;

  if (file) {
    uploadedUrl = await uploadAadharFile(file, newStudent.name);

    if (!uploadedUrl) {
      toast.error("📎 Aadhar file upload failed. Record not saved.");
      return;
    }
  }

  const studentData = { ...newStudent, aadhar_url: uploadedUrl };

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
    toast.error("❌ Failed to save student: " + error.message);
  } else {
    toast.success(editingId ? "✅ Student updated successfully!" : "🎉 Student added successfully!");
    setNewStudent({
      name: '',
      dob: '',
      age: '',
      religion: '',
      caste: '',
      mother_tongue: '',
      father_name: '',
      mother_name: '',
      parent_mobile: '',
      target_class: '',
      aadhar_url: ''
    });
    setFile(null);
    setEditingId(null);
    fetchStudents();
    setActiveTab('records');
  }
};

const handleEdit = (student) => {
  setNewStudent({
    name: student.name,
    dob: student.dob || '',
    age: student.age,
    religion: student.religion || '',
    caste: student.caste || '',
    mother_tongue: student.mother_tongue || '',
    father_name: student.father_name || '',
    mother_name: student.mother_name || '',
    parent_mobile: student.parent_mobile || '',
    target_class: student.target_class || '',
    aadhar_url: student.aadhar_url || ''
  });
  setEditingId(student.id);
  setActiveTab('form');
};

const handleDelete = async (id) => {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) {
    toast.error("🗑️ Failed to delete student.");
  } else {
    toast.success("🗑️ Student deleted successfully.");
    fetchStudents();
  }
};

return (
  <div className="container">
    <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
    <h1>Student Administration</h1>

    {/* Tab Switcher */}
    <div className="tabs">
      <button className={`tab-button ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
        Addmission Form
      </button>
      <button className={`tab-button ${activeTab === 'records' ? 'active' : ''}`} onClick={() => { fetchStudents(); setActiveTab('records'); }}>
        View Records
      </button>
    </div>

    {/* Admission Form Tab */}
    {activeTab === 'form' && (
      <div className="card">
        <div className="card-header">
          {editingId ? 'Edit Student' : 'Add Student'}
        </div>

        {/* Student Info */}
        <input className="input" name="name" placeholder="Full Name" value={newStudent.name} onChange={handleInputChange} />
        <input className="input" name="dob" type="date" placeholder="Date of Birth" value={newStudent.dob || ''} onChange={handleInputChange} />
        <input className="input" name="age" type="number" placeholder="Age" value={newStudent.age} onChange={handleInputChange} />
        <input className="input" name="religion" placeholder="Religion" value={newStudent.religion || ''} onChange={handleInputChange} />
        <input className="input" name="caste" placeholder="Caste" value={newStudent.caste || ''} onChange={handleInputChange} />
        <input className="input" name="mother_tongue" placeholder="Mother Tongue" value={newStudent.mother_tongue || ''} onChange={handleInputChange} />

        {/* Parent Info */}
        <input className="input" name="father_name" placeholder="Father's Name" value={newStudent.father_name || ''} onChange={handleInputChange} />
        <input className="input" name="mother_name" placeholder="Mother's Name" value={newStudent.mother_name || ''} onChange={handleInputChange} />
        <input className="input" name="parent_mobile" placeholder="Parent Mobile Number" value={newStudent.parent_mobile || ''} onChange={handleInputChange} />

        {/* Academic Info */}
        <input className="input" name="target_class" placeholder="Class Applying For" value={newStudent.target_class || ''} onChange={handleInputChange} />

        {/* File Upload */}
        <input className="input" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />

        <button className="button" onClick={handleAddOrUpdate}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
    )}

    {/* Record View Tab */}
{activeTab === 'records' && (
  <>
    {students.map((student) => (
      <div className="card" key={student.id}>
        {/* Student Info */}
        <div><strong>Name:</strong> {student.name}</div>
        <div><strong>Date of Birth:</strong> {student.dob}</div>
        <div><strong>Age:</strong> {student.age}</div>
        <div><strong>Religion:</strong> {student.religion}</div>
        <div><strong>Caste:</strong> {student.caste}</div>
        <div><strong>Mother Tongue:</strong> {student.mother_tongue}</div>

        {/* Parent Info */}
        <div><strong>Father's Name:</strong> {student.father_name}</div>
        <div><strong>Mother's Name:</strong> {student.mother_name}</div>
        <div><strong>Parent Mobile:</strong> {student.parent_mobile}</div>

        {/* Academic Info */}
        <div><strong>Class Applying For:</strong> {student.target_class}</div>

        {/* Aadhar */}
        {student.aadhar_url && (
          <div>
            <strong>Aadhar:</strong>{' '}
            <a href={student.aadhar_url} target="_blank" rel="noreferrer">View Aadhar</a>
          </div>
        )}

        <div style={{ marginTop: '10px' }}>
          <button className="button" onClick={() => handleEdit(student)}>Edit</button>
          <button className="button delete" onClick={() => handleDelete(student.id)}>Delete</button>
        </div>
      </div>
    ))}
  </>
)}

  </div>
);

}

export default App;
