import express from 'express';
import Application from '../models/Application.js';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply to a project
router.post('/', auth, async (req, res) => {
    try {
        const { projectId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({ userId: req.user, projectId });
        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this project' });
        }

        // Check if user is already a member
        if (project.members.includes(req.user)) {
            return res.status(400).json({ message: 'You are already a member of this project' });
        }

        const newApplication = new Application({
            userId: req.user,
            projectId
        });

        const application = await newApplication.save();
        res.status(201).json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get applications for a specific project (Project Owner only)
router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ projectId: req.params.projectId })
            .populate('userId', 'name role skills experience');
        
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get my applications
router.get('/me', auth, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user })
            .populate('projectId', 'title status requiredSkills');
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Accept or Reject application
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const project = await Project.findById(application.projectId);
        if (project.createdBy.toString() !== req.user) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        if (status === 'Accepted') {
            // Add user to project members
            if (!project.members.includes(application.userId)) {
                project.members.push(application.userId);
                await project.save();
            }
        }

        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
