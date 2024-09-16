const Student = require('../models/Students'); // Adjust the path to your student model
const Attendance=require('../models/Attendance');
const mongoose=require('mongoose');
// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, grade, address, contact } = req.body;
    
    if (!name || !grade || !address || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Fetch the latest student and calculate the next student ID
    const latestStudent = await Student.findOne().sort({ studentId: -1 });
    const nextStudentId = latestStudent ? latestStudent.studentId + 1 : 1;

    const newStudent = new Student({
      studentId: nextStudentId,
      name,
      grade,
      address,
      contact
    });
    await newStudent.save();


      

   


    return res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .sort({ studentId: 1 })
            .populate('attendanceDetails'); // Populate attendance details

        return res.status(200).json({ students });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ student });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a student by ID


// Delete a student by ID
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
     console.log(id);
         try {
        // Convert id to number
        const studentId = parseInt(id, 10);
        console.log("Student Id",studentId)

        if (isNaN(studentId)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        // Find the student by studentId
        const student = await Student.findOne({ studentId });


        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
                                  
        // Delete the associated attendance records
        await Attendance.deleteMany({ _id: { $in: student.attendanceDetails } });

        // Delete the student
       const deleteStudent= await Student.findOneAndDelete({ studentId });
         console.log("Delete Student",deleteStudent);
        res.json({ message: 'Student and related attendance records deleted successfully',
            studentId

         });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getStudentsByGradeAndDate = async (req, res) => {
    try {
        const { grade, date } = req.params;
        console.log('Grade:', grade); // Add these logs for debugging
        console.log('Date:', date);   // Ensure you receive the correct values
        const students = await Student.find({ grade })
            .populate({
                path: 'attendanceDetails',
                match: { date }, // Filter attendance details by date
                select: 'present day date' // Select only required fields from attendance
            });

        

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


