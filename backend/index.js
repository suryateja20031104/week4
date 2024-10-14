const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const url = "mongodb+srv://suryateja1938102074:suryaamazonintern@cluster0.ldxadbe.mongodb.net/";
const dbName = "nxttrendz";

async function connectToMongoDB_students() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("MongoDB connected successfully.");
    return client.db(dbName).collection("students1");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

app.post("/addOrUpdateStudent", async (req, res) => {
  const { studentName, school, college, degree, yearOfGraduation } = req.body;

  if (!studentName || !school || !college || !degree || !yearOfGraduation) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const collection = await connectToMongoDB_students();
    const existingStudent = await collection.findOne({ studentName });

    if (existingStudent) {
      await collection.updateOne(
        { studentName },
        { $set: { school, college, degree, yearOfGraduation } }
      );
      res.status(200).json({ message: "Student details updated successfully." });
    } else {
      await collection.insertOne({ studentName, school, college, degree, yearOfGraduation });
      res.status(201).json({ message: "Student details added successfully." });
    }
  } catch (error) {
    console.error("Error updating student details:", error);
    res.status(500).json({ error: "An error occurred while updating student details." });
  }
});

app.get("/getStudentByName/:studentName", async (req, res) => {
  const { studentName } = req.params;
  try {
    const collection = await connectToMongoDB_students();
    const student = await collection.findOne({ studentName });

    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "An error occurred while retrieving student details." });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
