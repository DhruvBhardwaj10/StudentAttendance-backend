// attendanceRoutes.js

const express = require('express');
const router = express.Router();
const {
    createAttendance,
    getAllAttendance,
    getAttendanceByStudentId,
    deleteAttendanceByStudentIdAndDayAndDate,
    getPresentCountForMonth
} = require('../controllers/attendanceController'); // Adjust the path as per your folder structure

// Route to create a new attendance record
router.post('/create/:studentId', createAttendance);

// Route to get all attendance records
router.get('/get', getAllAttendance);

// Route to get attendance by studentId
router.get('/get/:studentId', getAttendanceByStudentId);
router.delete('/delete/:studentId',deleteAttendanceByStudentIdAndDayAndDate);
router.post('/getPresentCountForMonth', getPresentCountForMonth);
module.exports = router;
