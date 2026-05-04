import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/UserModel.js'; // Apne path ke hisab se check karein
import Job from './models/JobModel.js';
import Notification from './models/NotificationModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    // 1. Database Connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");

    // 2. Purana data delete karein (taaki duplicates na hon)
    await User.deleteMany();
    await Job.deleteMany();
    await Notification.deleteMany();

    // 3. Password Hash karein
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 4. Create Users (Admin, Technician, Client)
    const users = await User.insertMany([
      {
        name: 'Super Admin',
        email: 'admin@fieldops.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'John Tech',
        email: 'tech@fieldops.com',
        password: hashedPassword,
        role: 'technician'
      },
      {
        name: 'Client Corp',
        email: 'client@fieldops.com',
        password: hashedPassword,
        role: 'client'
      }
    ]);

    const admin = users[0];
    const tech = users[1];
    const client = users[2];

    // 5. Create Jobs
    const jobs = await Job.insertMany([
      {
        title: 'AC Repair - Room 102',
        description: 'Compressor is making loud noise and cooling is low.',
        status: 'pending',
        client: client._id,
        adminId: admin._id,
        scheduledAt: new Date()
      },
      {
        title: 'Network Inspection',
        description: 'Inspect all server racks for cabling issues.',
        status: 'in-progress',
        client: client._id,
        adminId: admin._id,
        assignedTechnician: tech._id,
        scheduledAt: new Date()
      }
    ]);

    // 6. Create Notifications
    await Notification.insertMany([
      {
        userId: admin._id,
        message: 'Welcome to FieldOps! Start by assigning jobs.',
        read: false
      },
      {
        userId: tech._id,
        message: 'New job assigned: Network Inspection',
        jobId: jobs[1]._id,
        read: false
      }
    ]);

    console.log("Data Seeded Successfully! 🌱");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();