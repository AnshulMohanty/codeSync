import { create } from 'zustand'
import { nanoid } from 'nanoid'

const useUserStore = create((set, get) => ({
  // User state
  userId: null,
  userName: null,
  userColor: null,
  
  // Initialize user
  initializeUser: () => {
    const userId = nanoid(8)
    const userName = `User ${userId.slice(0, 4)}`
    const userColor = getRandomColor()
    
    set({ userId, userName, userColor })
    
    return { userId, userName, userColor }
  },
  
  setUserName: (userName) => set({ userName }),
  
  setUserColor: (userColor) => set({ userColor }),
  
  // Reset user
  reset: () => set({
    userId: null,
    userName: null,
    userColor: null
  })
}))

// Generate random color for user
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default useUserStore
