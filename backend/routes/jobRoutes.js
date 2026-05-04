import express from 'express';
import { 
    createJob, 
    getJobs, 
    updateJob, 
    updateJobStatus 
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sabhi routes ke liye user ka login (protect) hona lazmi hai [cite: 42]
router.use(protect);

// POST /api/jobs -> Sirf Admin job create kar sakta hai [cite: 22, 78]
router.post('/job', authorize('admin'), createJob);

// GET /api/jobs -> Role-based logic controller ke andar handle hogi [cite: 25, 47]
router.get('/jobs', getJobs);

// PUT /api/jobs/:id -> Admin details update kar sakta hai [cite: 36, 37]
router.put('job/:id', authorize('admin'), updateJob);

// PUT /api/jobs/:id/status -> Admin aur Technician dono status update kar sakte hain 
router.put('job/:id/status', authorize('admin', 'technician'), updateJobStatus);

export default router;