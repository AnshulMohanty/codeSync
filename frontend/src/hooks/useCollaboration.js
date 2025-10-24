import { useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import useEditorStore from '../store/editorStore'
import useUserStore from '../store/userStore'
import toast from 'react-hot-toast'

export const useCollaboration = (projectId) => {
  const { socket, isConnected } = useSocket()
  const { 
    setActiveUsers, 
    addUser, 
    removeUser, 
    setConnectionStatus,
    setContent,
    setLanguage 
  } = useEditorStore()
  const { userId, userName, userColor } = useUserStore()

  // Join project room
  const joinProject = useCallback(() => {
    if (socket && projectId && userId && userName && userColor) {
      console.log('Joining project:', projectId)
      socket.emit('join_project', {
        projectId,
        userId,
        userName,
        userColor
      })
    }
  }, [socket, projectId, userId, userName, userColor])

  // Leave project room
  const leaveProject = useCallback(() => {
    if (socket && projectId && userId) {
      console.log('Leaving project:', projectId)
      socket.emit('leave_project', {
        projectId,
        userId
      })
    }
  }, [socket, projectId, userId])

  // Send code changes
  const sendCodeChange = useCallback((operation) => {
    if (socket && projectId && userId) {
      console.log('Sending code change:', { projectId, operation, userId })
      socket.emit('code_change', {
        projectId,
        operation,
        userId
      })
    } else {
      console.log('Cannot send code change - missing requirements:', { socket: !!socket, projectId, userId })
    }
  }, [socket, projectId, userId])

  // Send cursor movements
  const sendCursorMove = useCallback((position, selection) => {
    if (socket && projectId && userId) {
      socket.emit('cursor_move', {
        projectId,
        position,
        selection,
        userId
      })
    }
  }, [socket, projectId, userId])

  // Send language changes
  const sendLanguageChange = useCallback((language) => {
    if (socket && projectId && userId) {
      socket.emit('language_change', {
        projectId,
        language,
        userId
      })
    }
  }, [socket, projectId, userId])

  // Socket event handlers
  useEffect(() => {
    if (!socket) return

    // Handle successful project join
    const handleUserJoined = (data) => {
      console.log('User joined:', data)
      addUser(data)
      toast.success(`${data.userName} joined the session`)
    }

    // Handle user leaving
    const handleUserLeft = (data) => {
      console.log('User left:', data)
      removeUser(data.userId)
      toast.info(`${data.userName || 'A user'} left the session`)
    }

    // Handle code broadcasts
    const handleCodeBroadcast = (data) => {
      console.log('Code broadcast received:', data)
      console.log('Current userId:', userId, 'Broadcast userId:', data.userId)
      // Only update if the change is from another user
      if (data.userId !== userId) {
        console.log('Updating content from another user:', data.operation.content)
        setContent(data.operation.content || '')
      } else {
        console.log('Ignoring own change')
      }
    }

    // Handle cursor broadcasts
    const handleCursorBroadcast = (data) => {
      console.log('Cursor broadcast received:', data)
      // This will be handled by the editor component
    }

    // Handle language broadcasts
    const handleLanguageBroadcast = (data) => {
      console.log('Language broadcast received:', data)
      setLanguage(data.language)
    }

    // Handle sync state (when joining)
    const handleSyncState = (data) => {
      console.log('Sync state received:', data)
      setContent(data.content)
      setLanguage(data.language)
      setActiveUsers(data.currentUsers)
    }

    // Handle connection errors
    const handleConnectionError = (data) => {
      console.error('Connection error:', data)
      toast.error(data.message)
      setConnectionStatus('disconnected')
    }

    // Register event listeners
    socket.on('user_joined', handleUserJoined)
    socket.on('user_left', handleUserLeft)
    socket.on('code_broadcast', handleCodeBroadcast)
    socket.on('cursor_broadcast', handleCursorBroadcast)
    socket.on('language_broadcast', handleLanguageBroadcast)
    socket.on('sync_state', handleSyncState)
    socket.on('connection_error', handleConnectionError)

    // Cleanup
    return () => {
      socket.off('user_joined', handleUserJoined)
      socket.off('user_left', handleUserLeft)
      socket.off('code_broadcast', handleCodeBroadcast)
      socket.off('cursor_broadcast', handleCursorBroadcast)
      socket.off('language_broadcast', handleLanguageBroadcast)
      socket.off('sync_state', handleSyncState)
      socket.off('connection_error', handleConnectionError)
    }
  }, [socket, addUser, removeUser, setContent, setLanguage, setActiveUsers, setConnectionStatus])

  // Auto-join when connected
  useEffect(() => {
    if (isConnected && projectId) {
      joinProject()
    }
  }, [isConnected, projectId, joinProject])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (projectId) {
        leaveProject()
      }
    }
  }, [projectId, leaveProject])

  return {
    joinProject,
    leaveProject,
    sendCodeChange,
    sendCursorMove,
    sendLanguageChange,
    isConnected
  }
}

export default useCollaboration
