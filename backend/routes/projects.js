const express = require('express');
const router = express.Router();
const {
  createProject,
  getProject,
  updateProject,
  getRecentProjects,
  deleteProject,
  cleanupDummyProjects,
  cleanupUnsavedProjects,
  createFile,
  createFolder,
  updateFile,
  deleteFile
} = require('../controllers/projectController');

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects/recent - Get recent projects
router.get('/recent', getRecentProjects);

// DELETE /api/projects/cleanup - Clean up dummy projects
router.delete('/cleanup', cleanupDummyProjects);

// DELETE /api/projects/cleanup-unsaved - Clean up unsaved projects
router.delete('/cleanup-unsaved', cleanupUnsavedProjects);

// GET /api/projects/:projectId - Get project by ID
router.get('/:projectId', getProject);

// PUT /api/projects/:projectId - Update project
router.put('/:projectId', updateProject);

// DELETE /api/projects/:projectId - Delete project
router.delete('/:projectId', deleteProject);

// File system routes
// POST /api/projects/:projectId/files - Create new file
router.post('/:projectId/files', createFile);

// POST /api/projects/:projectId/folders - Create new folder
router.post('/:projectId/folders', createFolder);

// PUT /api/projects/:projectId/files/:filePath - Update file content
router.put('/:projectId/files/:filePath', updateFile);

// DELETE /api/projects/:projectId/files/:filePath - Delete file
router.delete('/:projectId/files/:filePath', deleteFile);

module.exports = router;
