import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    teamSize: {
        type: Number,
        default: 1
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasks: [{
        title: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Todo', 'InProgress', 'Done'],
            default: 'Todo'
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
