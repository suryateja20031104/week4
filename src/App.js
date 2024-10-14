import React, { useState } from "react";
import axios from "axios";
import './App.css'; 

function App() {
  const [studentDetails, setStudentDetails] = useState({
    studentName: "",
    school: "",
    college: "",
    degree: "",
    yearOfGraduation: ""
  });

  const [viewedStudent, setViewedStudent] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/addOrUpdateStudent", studentDetails);
      alert("Student details saved successfully!");
      setStudentDetails({
        studentName: "",
        school: "",
        college: "",
        degree: "",
        yearOfGraduation: ""
      });
    } catch (error) {
      console.error("Error saving student details:", error);
      alert("Error saving student details.");
    }
  };

  const handleViewClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getStudentByName/${searchName}`);
      if (response.data) {
        setViewedStudent(response.data);
        setIsSearchMode(true); 
      } else {
        alert("No details found for this name.");
        setViewedStudent(null);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Error fetching student details.");
    }
  };

  return (
    <div className="App">
      <header>
        <h1 >Student Management Portal</h1>
        <div className="search-section">
          <input
            type="text"
            placeholder="Enter student name to search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={handleViewClick}>Search</button>
        </div>
      </header>
      
      {!isSearchMode && ( 
        <>
          <h2 className="heading">Student Registration Form</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Student Name:</label>
              <input
                type="text"
                name="studentName"
                value={studentDetails.studentName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>School:</label>
              <input
                type="text"
                name="school"
                value={studentDetails.school}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>College:</label>
              <input
                type="text"
                name="college"
                value={studentDetails.college}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Degree:</label>
              <input
                type="text"
                name="degree"
                value={studentDetails.degree}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Year of Graduation:</label>
              <input
                type="number"
                name="yearOfGraduation"
                value={studentDetails.yearOfGraduation}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      )}
      {viewedStudent && (
          <div className="viewed-student-details">
            <h2>Viewed Student Details</h2>
            <div className="student-info">
              <div className="info-row">
                <strong>Student Name</strong> <span>:</span><span>{viewedStudent.studentName}</span>
              </div>
              <div className="info-row">
                <strong>School</strong>  <span>:</span><span>{viewedStudent.school}</span>
              </div>
              <div className="info-row">
                <strong>College</strong> <span>:</span> <span>{viewedStudent.college}</span>
              </div>
              <div className="info-row">
                <strong>Degree</strong> <span>:</span><span>{viewedStudent.degree}</span>
              </div>
              <div className="info-row">
                <strong>Year of Graduation</strong> <span>:</span> <span>{viewedStudent.yearOfGraduation}</span>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
