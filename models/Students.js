const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    // date: {
    //     type: String,
    //     required: false, // This field will store the latest attendance date
    // },
    attendanceDetails: [{
        type: mongoose.Schema.Types.ObjectId, // Link to Attendance model
        ref: 'Attendance', // Reference to the Attendance model
        
    }]
});

module.exports = mongoose.model('Students', studentSchema);
