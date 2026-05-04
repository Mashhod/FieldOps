import JobModel from "../models/JobModel.js";
import NotificationModel from '../models/NotificationModel.js';



export const createJob = async(req, res) => {
    let reqBody = req.body;

    if(!reqBody.title || !reqBody.description  || !reqBody.status || !reqBody.client){
        res.status(400).send({message: "Required Parameters Missing"});
        return;
    }


    try {

        const job = await JobModel.create({
            ...req.body,
            adminId: req.user.id,
            status: req.body.status || "pending" 
        });
        res.status(201).send({message: "Job Created Successfully", job});


        
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({message: "Internal Server Error"});
        
    }

}    

export const getJobs = async(req, res) => {
    try {
        let query = {};
        if (req.user.role === 'client') query = { client: req.user.id };
        if (req.user.role === 'technician') query = { assignedTechnician: req.user.id };

        let jobs = await JobModel.find(query).populate('client assignedTechnician', 'name email');
        res.status(200).send({ Jobs: jobs });
    } catch (error) {
        console.log("Error", error)
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export const updateJob = async (req, res) => {
    const jobId = req.params.id;
    const updates = req.body; // Jo fields update karni hain sirf wahi aayengi

    try {
        // 1. Check if Job exists
        const job = await JobModel.findById(jobId);
        if (!job) return res.status(404).send({ message: "Job not found" });

        // 2. Role-based logic (Assumption justify karein README mein) [cite: 26, 36]
        // Example: Only Admin can change the Client or Technician
        if (req.user.role !== 'Admin' && (updates.client || updates.assignedTechnician)) {
            return res.status(403).send({ message: "Only Admins can reassign jobs" });
        }

        // 3. Handle Notes separately to avoid overwriting [cite: 35, 50]
        if (updates.newNote) {
            job.notes.push({ text: updates.newNote, addedBy: req.user.id });
            delete updates.newNote; // Note ko update object se hatayein
        }

        // 4. Update only provided fields
        Object.assign(job, updates);
        await job.save();

        res.status(200).send({ message: "Job Updated Successfully", updatedJob: job });

    } catch (error) {
        console.error("Error", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};


/**
 * Update Job Status & Notify Relevant Parties
 * Route: PUT /api/jobs/:id/status
 */
export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const job = await JobModel.findByIdAndUpdate(id, { status }, { new: true });

        // Notification Logic: Client aur wahi Admin jisne job banayi thi
        const notifyUsers = [job.client, job.adminId].filter(id => id);

        const notificationPromises = notifyUsers.map(userId => 
            NotificationModel.create({
                userId: userId,
                message: `Job "${job.title}" status changed to ${status}`,
                jobId: job._id
            })
        );
        await Promise.all(notificationPromises);

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
