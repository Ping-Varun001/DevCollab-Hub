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

// Update project details
router.put('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description, requiredSkills, teamSize, status } = req.body;
        project.title = title || project.title;
        project.description = description || project.description;
        project.requiredSkills = requiredSkills || project.requiredSkills;
        project.teamSize = teamSize || project.teamSize;
        project.status = status || project.status;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove a member
router.delete('/:id/members/:memberId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (project.createdBy.toString() === req.params.memberId) {
            return res.status(400).json({ message: 'Cannot remove project creator' });
        }

        project.members = project.members.filter(m => m.toString() !== req.params.memberId);
        await project.save();

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a task
router.post('/:id/tasks', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (!project.members.includes(req.user)) {
            return res.status(403).json({ message: 'Only project members can add tasks' });
        }

        const { title, status, assignedTo } = req.body;
        project.tasks.push({ title, status, assignedTo });
        await project.save();

        res.json(project.tasks[project.tasks.length - 1]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a task
router.put('/:id/tasks/:taskId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (!project.members.includes(req.user)) {
            return res.status(403).json({ message: 'Only project members can update tasks' });
        }

        const task = project.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const { title, status, assignedTo } = req.body;
        if (title) task.title = title;
        if (status) task.status = status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;

        await project.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a task
router.delete('/:id/tasks/:taskId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (!project.members.includes(req.user)) {
            return res.status(403).json({ message: 'Only project members can delete tasks' });
        }

        project.tasks = project.tasks.filter(t => t._id.toString() !== req.params.taskId);
        await project.save();

        res.json({ message: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
