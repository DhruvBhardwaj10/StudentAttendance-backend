const Attendance = require('../models/Attendance'); // Import the Attendance model
const Student = require('../models/Students'); // Import the Student model

// Controller function to create a new attendance record
const createAttendance = async (req, res) => {
    try {
        const {studentId}=req.params;
        console.log("Studentid",studentId);

        const {  present, day, date } = req.body;
        console.log("present",present);
        console.log("day",day);
        console.log("date",date);
  


        // Check if the studentId exists in the Student collection
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check if attendance already exists for this student on the given date
       

        // Create a new attendance entry
        const attendance = new Attendance({
            studentId, // Use the studentId directly from the request body
            present,
            day,
            date,
            // attendanceId is automatically generated by the schema
        });

        await attendance.save();

        // Update the attendanceDetails in the Student model
        student.attendanceDetails.push(attendance._id); // Add attendance reference
        await student.save();

        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Other controller functions...


// Controller function to retrieve all attendance records
const getAllAttendance = async (req, res) => {
    try {
        // Populate the student details for each attendance record
        const attendances = await Attendance.find().populate('studentId', 'name email studentId');
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to retrieve attendance records by studentId
const getAttendanceByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find attendance records associated with the studentId
        const attendances = await Attendance.find({ studentId }).populate('studentId', 'name email studentId');
        if (attendances.length === 0) {
            return res.status(404).json({ error: 'No attendance records found for this student' });
        }

        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller function to delete attendance record by studentId, day, and date
const deleteAttendanceByStudentIdAndDayAndDate = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { day, date } = req.body;

    // Check if the studentId exists in the Student collection
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find and delete the attendance record
    const deletedAttendance = await Attendance.findOneAndDelete({ studentId, day, date });
    if (!deletedAttendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Remove the attendance reference from the Student model
    student.attendanceDetails = student.attendanceDetails.filter(
      (attendanceId) => !attendanceId.equals(deletedAttendance._id)
    );
    await student.save();

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

 // controllers/attendanceController.js




// Controller to get present count for the first 7 days based on grade and month
// controllers/attendanceController.js


// Controller to get present count for the first 7 days based on grade and date
const getPresentCountForMonth = async (req, res) => {
    const { grade, date } = req.body; // Get grade and date from req.body
    console.log(grade);
    console.log(date);
  
    try {
      // Find all students for the given grade
      const students = await Student.find({ grade: grade }).select('studentId'); // Fetch student IDs for the given grade
      console.log(students);
      const studentIds = students.map(student => student.studentId); // Extract the student IDs
      console.log(studentIds);
  
      const firstSevenDays = [1, 2, 3, 4, 5, 6, 7]; // First 7 days of the month
      let presentCountByDay = [];
  
      // Loop through the first 7 days and calculate present count for each day
      for (let day of firstSevenDays) {
        // Format the start and end date of the specific day in the month
        const startOfDay = new Date(date);
        startOfDay.setDate(day);
        startOfDay.setHours(0, 0, 0, 0); // Start of the specific day
  
        const endOfDay = new Date(date);
        endOfDay.setDate(day + 1);
        endOfDay.setHours(23, 59, 59, 999); // End of the specific day
  
        // Find records for the specific day
        const presentCount = await Attendance.find({
          studentId: { $in: studentIds }, // Match student IDs (as Numbers)
          date: {
            $gte: startOfDay, // Match the start of the specific day
            $lt: endOfDay // Match the end of the specific day
          },
          present: true    // Match the 'present' field which is boolean
        }).countDocuments();
  
        // Push the day and present count to the array
        presentCountByDay.push({ day, presentCount });
      }
  
      // Send the result back to the frontend
      res.status(200).json(presentCountByDay);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the attendance data' });
    }
  };

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceByStudentId,
  deleteAttendanceByStudentIdAndDayAndDate, // Add this function
  getPresentCountForMonth
};




