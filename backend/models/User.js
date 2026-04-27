import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['Student', 'Developer', 'Founder'],
        default: 'Developer'
    },
    experience: {
        type: String,
        default: 'Beginner'
    },
    skills: {
        type: [String],
        default: []
    },
    availability: {
        type: String,
        default: 'Part-time'
    },
    interests: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
