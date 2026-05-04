import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "technician", "client"],
    default: "client",
  },
},
  { timestamps: true }

);


// password hash
userSchema.pre('save', async function () {
    const user = this;

    if (!user.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        
    } catch (err) {
        throw new Error(err); 
    }
});



export default mongoose.model("User", userSchema);
