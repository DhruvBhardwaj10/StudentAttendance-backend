const express=require('express');
const connectDB=require('./config/db');
const studentRoute=require('./routes/studentRoute');
const attendanceRoute=require('./routes/attendanceRoutes');
const app=express();
const cors=require('cors');

const allowedOrigins = [
    // Local development URL
   'http://localhost:5174', // Vercel deployment URL
   // Add more allowed origins if needed
 ];
 
 app.use(cors({
   origin: (origin, callback) => {
     // Allow requests with no origin (like mobile apps, curl requests, etc.)
     if (!origin) return callback(null, true);
     if (allowedOrigins.includes(origin)) {
       return callback(null, true);
     } else {
       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
       return callback(new Error(msg), false);
     }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true, // Allow credentials if required (e.g., cookies)
 }));

app.use(express.json());
connectDB();
//routes->

app.use('/api/students',studentRoute);
app.use('/api/attendance',attendanceRoute);
app.get('/',(req,res)=>{
    res.send('<h1>This is Homepage<h1>');
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
