import express from 'express';
import Chat from '../models/Chat.js';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get chat history for a project
router.get('/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is a member of the project
        if (!project.members.includes(req.user)) {
            return res.status(403).json({ message: 'Not authorized to view this chat' });
        }

        let chat = await Chat.findOne({ projectId: req.params.projectId })
            .populate('messages.sender', 'name');

        if (!chat) {
            chat = new Chat({ projectId: req.params.projectId, messages: [] });
            await chat.save();
        }

        res.json(chat);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Post a message (can also be done via Socket.io directly, but good to have REST fallback or specific save endpoint)
router.post('/:projectId', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.members.includes(req.user)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const chat = await Chat.findOne({ projectId: req.params.projectId });
        
        const newMessage = {
            sender: req.user,
            text
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Populate sender before returning
        await chat.populate('messages.sender', 'name');

        const savedMessage = chat.messages[chat.messages.length - 1];
        res.status(201).json(savedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
