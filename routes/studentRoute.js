const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController'); // Adjust the path

// Route to create a student
router.post('/create', studentController.createStudent);

// Route to get all students
router.get('/get', studentController.getStudents);

// Route to get a student by ID
router.get('/get/:id', studentController.getStudentById);
router.delete('/delete/:id', studentController.deleteStudent);
router.get('/grade/:grade/date/:date',studentController.getStudentsByGradeAndDate);
module.exports = router;
