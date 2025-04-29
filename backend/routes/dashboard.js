const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get basic dashboard data (accessible to all logged-in users)
// @route   GET /api/dashboard/data
// @access  Private
router.get('/data', protect, (req, res) => {
    // req.user is available here due to 'protect' middleware
    res.json({ message: `Welcome user ${req.user.id}, you have role ${req.user.role}. Here is basic data.`});
});

// @desc    Get admin-only data
// @route   GET /api/dashboard/admin-data
// @access  Private/Admin
router.get('/admin-data', protect, authorize('admin'), (req, res) => {
     res.json({ message: `Welcome admin ${req.user.id}! Here is sensitive admin data.`});
});

// @desc    Get data for admins or editors
// @route   GET /api/dashboard/content-data
// @access  Private/Admin or Private/Editor
router.get('/content-data', protect, authorize('admin', 'editor'), (req, res) => {
     res.json({ message: `Welcome ${req.user.role} ${req.user.id}! You can access content editing data.`});
});


module.exports = router;