const Project = require('../models/Project');
const { nanoid } = require('nanoid');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { projectName = 'Untitled Project', language = 'javascript' } = req.body;
    
    const projectId = nanoid(9);
    
    const project = new Project({
      projectId,
      projectName,
      language,
      content: ''
    });

    await project.save();

    res.status(201).json({
      success: true,
      projectId,
      shareUrl: `${process.env.CORS_ORIGIN}/p/${projectId}`
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
};

// Get project by ID
const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({ projectId });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      project: {
        projectId: project.projectId,
        projectName: project.projectName,
        content: project.content,
        language: project.language,
        activeUsers: project.activeUsers,
        lastModified: project.lastModified
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, projectName } = req.body;

    const project = await Project.findOne({ projectId });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (content !== undefined) {
      project.content = content;
      project.version += 1;
    }
    
    if (projectName !== undefined) {
      project.projectName = projectName;
    }

    // Mark as saved when user explicitly saves
    project.isSaved = true;

    await project.save();

    res.json({
      success: true,
      message: 'Project saved',
      version: project.version
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
};

// Get recent projects
const getRecentProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isSaved: true })
      .sort({ lastModified: -1 })
      .limit(10)
      .select('projectId projectName language lastModified');

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching recent projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent projects'
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOneAndDelete({ projectId });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
};

// Clean up dummy projects (delete all projects with default names)
const cleanupDummyProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({
      projectName: { $in: ['Untitled Project', 'New Project', 'My Project'] }
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} dummy projects`
    });
  } catch (error) {
    console.error('Error cleaning up dummy projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clean up dummy projects'
    });
  }
};

// Clean up unsaved projects (delete projects that haven't been explicitly saved)
const cleanupUnsavedProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({
      isSaved: false
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} unsaved projects`
    });
  } catch (error) {
    console.error('Error cleaning up unsaved projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clean up unsaved projects'
    });
  }
};

// File system operations
const createFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { path, name, content = '', language = 'javascript' } = req.body;

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Add new file to files array
    const newFile = {
      path,
      name,
      content,
      language,
      type: 'file'
    };

    project.files.push(newFile);
    await project.save();

    res.json({
      success: true,
      file: newFile,
      message: 'File created successfully'
    });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create file'
    });
  }
};

const createFolder = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { path, name } = req.body;

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Add new folder to files array
    const newFolder = {
      path,
      name,
      content: '',
      language: '',
      type: 'folder',
      children: []
    };

    project.files.push(newFolder);
    await project.save();

    res.json({
      success: true,
      folder: newFolder,
      message: 'Folder created successfully'
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create folder'
    });
  }
};

const updateFile = async (req, res) => {
  try {
    const { projectId, filePath } = req.params;
    const { content, language } = req.body;

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const file = project.files.find(f => f.path === filePath);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    file.content = content;
    if (language) file.language = language;
    
    await project.save();

    res.json({
      success: true,
      message: 'File updated successfully'
    });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update file'
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { projectId, filePath } = req.params;

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    project.files = project.files.filter(f => f.path !== filePath);
    await project.save();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    });
  }
};

module.exports = {
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
};
