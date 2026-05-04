import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dotenv from 'dotenv';
dotenv.config();


connectDB();
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

const PORT = process.env.PORT || 5000;


// Routes //
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes);
app.use('/api/notifications', notificationRoutes);



  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });