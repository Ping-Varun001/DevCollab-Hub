import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { calculateMatchPercentage } from '../services/matching.js';
import Chat from '../models/Chat.js';

const router = express.Router();

// Create a project
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, requiredSkills, teamSize, status } = req.body;
        
        const newProject = new Project({
            title,
            description,
            requiredSkills,
            teamSize,
            status,
            createdBy: req.user,
            members: [req.user] // Creator is a member
        });

        const project = await newProject.save();

        // Create a chat room for the project
        const chat = new Chat({
            projectId: project._id,
            messages: []
        });
        await chat.save();

        res.status(201).json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recommended projects for current user
router.get('/recommended', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const projects = await Project.find({ status: 'Open' }).populate('createdBy', 'name');

        const recommendedProjects = projects.map(project => {
            const matchPercentage = calculateMatchPercentage(user.skills, project.requiredSkills);
            return {
                ...project.toObject(),
                matchPercentage
            };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(recommendedProjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name email bio')
            .populate('members', 'name role skills');
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
