import { create } from 'zustand'

const useEditorStore = create((set, get) => ({
  // Project state
  currentProject: null,
  content: '',
  language: 'javascript',
  projectName: 'Untitled Project',
  
  // Collaboration state
  activeUsers: [],
  connectionStatus: 'disconnected', // 'connected', 'connecting', 'disconnected'
  
  // Editor state
  isAutoSaving: false,
  lastSaved: null,
  
  // Actions
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setContent: (content) => set({ content }),
  
  setLanguage: (language) => set({ language }),
  
  setProjectName: (projectName) => set({ projectName }),
  
  setActiveUsers: (users) => set({ activeUsers: users }),
  
  addUser: (user) => set((state) => ({
    activeUsers: [...state.activeUsers, user]
  })),
  
  removeUser: (userId) => set((state) => ({
    activeUsers: state.activeUsers.filter(user => user.userId !== userId)
  })),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setAutoSaving: (isAutoSaving) => set({ isAutoSaving }),
  
  setLastSaved: (timestamp) => set({ lastSaved: timestamp }),
  
  // Reset store
  reset: () => set({
    currentProject: null,
    content: '',
    language: 'javascript',
    projectName: 'Untitled Project',
    activeUsers: [],
    connectionStatus: 'disconnected',
    isAutoSaving: false,
    lastSaved: null
  })
}))

export default useEditorStore
