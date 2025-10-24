import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const socketRef = useRef(null)

  useEffect(() => {
    console.log('Initializing socket connection to:', WS_URL)
    // Initialize socket connection
    const newSocket = io(WS_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling']
    })

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
      setConnectionStatus('connected')
    })

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
      setConnectionStatus('disconnected')
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        toast.error('Connection lost. Attempting to reconnect...')
      }
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setConnectionStatus('disconnected')
      toast.error('Failed to connect to server')
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
      setConnectionStatus('connected')
      toast.success('Reconnected successfully!')
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error)
      setConnectionStatus('disconnected')
    })

    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed')
      setConnectionStatus('disconnected')
      toast.error('Failed to reconnect. Please refresh the page.')
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const connect = () => {
    if (socketRef.current && !isConnected) {
      socketRef.current.connect()
    }
  }

  const disconnect = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.disconnect()
    }
  }

  return {
    socket,
    isConnected,
    connectionStatus,
    connect,
    disconnect
  }
}

export default useSocket
