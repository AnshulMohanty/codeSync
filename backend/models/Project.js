const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    default: 'Untitled Project'
  },
  ownerId: {
    type: String,
    default: null
  },
  content: {
    type: String,
    default: ''
  },
  files: {
    type: [{
      path: String,
      name: String,
      content: String,
      language: String,
      type: { type: String, enum: ['file', 'folder'], default: 'file' },
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
    }],
    default: []
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'typescript', 'go', 'rust'],
    default: 'javascript'
  },
  version: {
    type: Number,
    default: 1
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now,
    index: -1 // Descending index for recent projects query
  }
});

// Update lastModified on save
projectSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
