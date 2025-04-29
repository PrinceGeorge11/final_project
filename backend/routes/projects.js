// routes/projects.js
const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Apply protect middleware to all project routes
router.use(protect);

// Define routes
router.route('/')
    .get(getProjects)

    .post(createProject);

router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;