const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the v4 method to generate UUIDs

const attendanceSchema = new mongoose.Schema({
    attendanceId: {
        type: String,
        default: uuidv4, // Automatically generate a unique attendanceId
        unique: true,    // Ensure the attendanceId is unique
    },
    studentId: {
        type: Number, // Assuming studentId is a number and should match the Student model
        ref: 'Student',
        required: true,
    },
    present: {
        type: Boolean,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
    date: {
        type: String, // Assuming you want to use a string format for the date
        required: true,
    },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
