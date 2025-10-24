const { nanoid } = require('nanoid');
const Project = require('../models/Project');
const Session = require('../models/Session');

// Store active sessions in memory (in production, use Redis)
const activeSessions = new Map();
const userColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

let colorIndex = 0;

const getNextColor = () => {
  const color = userColors[colorIndex % userColors.length];
  colorIndex++;
  return color;
};

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join project room
    socket.on('join_project', async (data) => {
      try {
        const { projectId, userId, userName } = data;
        
        // Verify project exists
        const project = await Project.findOne({ projectId });
        if (!project) {
          socket.emit('connection_error', {
            message: 'Failed to join project. Project may not exist.',
            code: 'PROJECT_NOT_FOUND'
          });
          return;
        }

        // Generate session ID and user color
        const sessionId = nanoid();
        const userColor = getNextColor();

        // Create session record
        const session = new Session({
          projectId,
          sessionId,
          userId,
          userName,
          userColor
        });
        await session.save();

        // Join socket room
        socket.join(projectId);
        socket.projectId = projectId;
        socket.userId = userId;
        socket.userName = userName;
        socket.userColor = userColor;

        // Update active users count
        project.activeUsers += 1;
        await project.save();

        // Store session info
        if (!activeSessions.has(projectId)) {
          activeSessions.set(projectId, new Map());
        }
        activeSessions.get(projectId).set(userId, {
          userId,
          userName,
          userColor,
          socketId: socket.id
        });

        // Get current users in room
        const currentUsers = Array.from(activeSessions.get(projectId).values());

        // Notify all users in room about new user
        socket.to(projectId).emit('user_joined', {
          userId,
          userName,
          userColor,
          currentUsers
        });

        // Send current state to new user
        socket.emit('sync_state', {
          content: project.content,
          language: project.language,
          currentUsers
        });

        console.log(`User ${userName} joined project ${projectId}`);
      } catch (error) {
        console.error('Error joining project:', error);
        socket.emit('connection_error', {
          message: 'Failed to join project',
          code: 'JOIN_ERROR'
        });
      }
    });

    // Handle code changes
    socket.on('code_change', async (data) => {
      try {
        const { projectId, operation, userId } = data;
        
        if (socket.projectId !== projectId) {
          return; // Security check
        }

        // Broadcast to other users in room
        socket.to(projectId).emit('code_broadcast', {
          operation,
          userId
        });

        // Update project content in database (debounced)
        clearTimeout(socket.saveTimeout);
        socket.saveTimeout = setTimeout(async () => {
          try {
            await Project.findOneAndUpdate(
              { projectId },
              { 
                content: operation.content || '',
                lastModified: new Date()
              }
            );
          } catch (error) {
            console.error('Error saving project:', error);
          }
        }, 2000); // Save after 2 seconds of inactivity

      } catch (error) {
        console.error('Error handling code change:', error);
      }
    });

    // Handle cursor movements
    socket.on('cursor_move', (data) => {
      const { projectId, position, selection } = data;
      
      if (socket.projectId !== projectId) {
        return;
      }

      // Broadcast cursor position to other users
      socket.to(projectId).emit('cursor_broadcast', {
        userId: socket.userId,
        position,
        selection
      });
    });

    // Handle language changes
    socket.on('language_change', async (data) => {
      try {
        const { projectId, language } = data;
        
        if (socket.projectId !== projectId) {
          return;
        }

        // Update project language
        await Project.findOneAndUpdate(
          { projectId },
          { language, lastModified: new Date() }
        );

        // Broadcast language change
        socket.to(projectId).emit('language_broadcast', {
          language,
          userId: socket.userId
        });

      } catch (error) {
        console.error('Error handling language change:', error);
      }
    });

    // Handle user leaving
    socket.on('leave_project', async (data) => {
      try {
        const { projectId, userId } = data;
        
        if (socket.projectId !== projectId) {
          return;
        }

        // Update session
        await Session.findOneAndUpdate(
          { projectId, userId },
          { leftAt: new Date() }
        );

        // Update active users count
        const project = await Project.findOne({ projectId });
        if (project && project.activeUsers > 0) {
          project.activeUsers -= 1;
          await project.save();
        }

        // Remove from active sessions
        if (activeSessions.has(projectId)) {
          activeSessions.get(projectId).delete(userId);
        }

        // Get updated user list
        const currentUsers = activeSessions.has(projectId) 
          ? Array.from(activeSessions.get(projectId).values())
          : [];

        // Notify other users
        socket.to(projectId).emit('user_left', {
          userId,
          currentUsers
        });

        console.log(`User ${userId} left project ${projectId}`);
      } catch (error) {
        console.error('Error handling user leave:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.projectId && socket.userId) {
          const { projectId, userId } = socket;

          // Update session
          await Session.findOneAndUpdate(
            { projectId, userId },
            { leftAt: new Date() }
          );

          // Update active users count
          const project = await Project.findOne({ projectId });
          if (project && project.activeUsers > 0) {
            project.activeUsers -= 1;
            await project.save();
          }

          // Remove from active sessions
          if (activeSessions.has(projectId)) {
            activeSessions.get(projectId).delete(userId);
          }

          // Get updated user list
          const currentUsers = activeSessions.has(projectId) 
            ? Array.from(activeSessions.get(projectId).values())
            : [];

          // Notify other users
          socket.to(projectId).emit('user_left', {
            userId,
            currentUsers
          });

          console.log(`User ${userId} disconnected from project ${projectId}`);
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
};

module.exports = setupSocketHandlers;
