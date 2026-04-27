import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
    try {
        const { name, bio, role, experience, skills, availability, interests } = req.body;

        const profileFields = {};
        if (name) profileFields.name = name;
        if (bio !== undefined) profileFields.bio = bio;
        if (role) profileFields.role = role;
        if (experience) profileFields.experience = experience;
        if (skills) profileFields.skills = skills;
        if (availability) profileFields.availability = availability;
        if (interests) profileFields.interests = interests;

        let user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
