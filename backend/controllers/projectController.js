// controllers/projectController.js
const Project = require('../models/Project');
const User = require('../models/User'); // Optional: if you need user details beyond ID

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    // Find projects created by the logged-in user
    const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 }); // Sort by newest first
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Ensure user owns the project (or is admin - add role check if needed)
        if (project.createdBy.toString() !== req.user.id) {
             // Optional: Add admin check || req.user.role === 'admin'
             return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(project);
    } catch (err) {
        console.error(err.message);
         if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};


// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      status,
      dueDate,
      createdBy: req.user.id, // Assign logged-in user as creator
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    // Handle validation errors specifically if desired
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  // Build project object based on fields submitted
  const projectFields = {};
  if (title) projectFields.title = title;
  if (description) projectFields.description = description;
  if (status) projectFields.status = status;
  if (dueDate !== undefined) projectFields.dueDate = dueDate; // Allow setting null/clearing date

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if the logged-in user created the project (Authorization)
    // Optional: Allow admins to update any project: || req.user.role === 'admin'
    if (project.createdBy.toString() !== req.user.id ) {
      return res.status(401).json({ msg: 'User not authorized to update this project' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true, runValidators: true } // Return the updated doc, run schema validators
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
     if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
     if (err.kind === 'ObjectId') {
         return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if the logged-in user created the project (Authorization)
    // Optional: Allow admins to delete any project: || req.user.role === 'admin'
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this project' });
    }

    await project.deleteOne(); // Use deleteOne() on the document

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
         return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
};