import { Request, Response } from 'express';
import User from '../models/User.js';

interface AuthRequest extends Request {
    user?: any;
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req: AuthRequest, res: Response) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400).json({ message: 'Cannot delete admin user' });
            return;
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { getUsers, deleteUser };
