import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MonacoEditor from '@monaco-editor/react'
import { apiClient } from '../utils/api'
import useEditorStore from '../store/editorStore'
import useUserStore from '../store/userStore'
import useCollaboration from '../hooks/useCollaboration'
import { useSocket } from '../hooks/useSocket'
import EditorLoadingScreen from '../components/EditorLoadingScreen'
import ShineButton from '../components/ShineButton'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'
import { CheckIcon } from '@heroicons/react/24/outline'

const Editor = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState('Untitled Project')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showAiDebuggerModal, setShowAiDebuggerModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  const { content, setContent, language, setLanguage, activeUsers, connectionStatus } = useEditorStore()
  const { userId, userName, userColor } = useUserStore()
  const { socket, isConnected } = useSocket()
  const { joinProject, leaveProject, sendCodeChange, sendLanguageChange } = useCollaboration()

  // Auto-save functionality
  useEffect(() => {
    if (!content || !projectId) return

    const timeoutId = setTimeout(() => {
      setIsAutoSaving(true)
      apiClient.updateProject(projectId, { content, projectName })
        .then(() => {
          setLastSaved(new Date())
          setIsAutoSaving(false)
        })
        .catch((error) => {
          console.error('Auto-save failed:', error)
          setIsAutoSaving(false)
        })
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [content, projectId, projectName])

  // Load project on mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await apiClient.getProject(projectId)
        if (response.success) {
          setContent(response.project.content || '')
          setLanguage(response.project.language || 'javascript')
          setProjectName(response.project.projectName || 'Untitled Project')
          setLastSaved(new Date(response.project.lastModified))
        } else {
          toast.error('Failed to load project')
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Error loading project:', error)
        toast.error('Failed to load project')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadProject()
    }
  }, [projectId, setContent, setLanguage, navigate])

  // Join project for collaboration
  useEffect(() => {
    if (projectId && isConnected) {
      joinProject(projectId)
    }

    return () => {
      if (projectId) {
        leaveProject(projectId)
      }
    }
  }, [projectId, isConnected, joinProject, leaveProject])

  // Handle editor changes
  const handleEditorChange = (value) => {
    setContent(value)
    if (isConnected) {
      sendCodeChange(value)
    }
  }

  // Handle language changes
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    if (isConnected) {
      sendLanguageChange(newLanguage)
    }
  }

  // Handle save project
  const handleSaveProject = () => {
    setNewProjectName(projectName)
    setShowSaveModal(true)
  }

  const handleConfirmSave = async () => {
    try {
      await apiClient.updateProject(projectId, { 
        content, 
        projectName: newProjectName,
        isSaved: true 
      })
      setProjectName(newProjectName)
      setShowSaveModal(false)
      toast.success('Project saved successfully!')
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    }
  }

  // Handle share
  const handleShare = () => {
    setShowShareModal(true)
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/p/${projectId}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard!')
  }

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  if (loading) {
    return <EditorLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo onClick={() => navigate('/')} />
              <div className="h-6 w-px bg-gray-700" />
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <span>←</span>
              </button>
              
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {projectName}
                </h2>
                <p className="text-sm text-gray-400">
                  Project ID: {projectId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ShineButton
                color="green"
                onClick={() => {}}
                className="px-4 py-2 text-sm"
              >
                <span className="mr-2">🟢</span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </ShineButton>

              <ShineButton color="green" className="px-3 py-2 text-sm">
                <span className="mr-2">👥</span>
                {activeUsers} {activeUsers === 1 ? 'user' : 'users'} online
              </ShineButton>

              <ShineButton
                color="purple"
                onClick={handleSaveProject}
                className="px-4 py-2 text-sm"
              >
                <span className="mr-2">💾</span>
                Save
              </ShineButton>

              <ShineButton
                color="purple"
                onClick={() => setShowAiDebuggerModal(true)}
                className="px-4 py-2 text-sm"
              >
                <span className="mr-2">🤖</span>
                AI Debugger
              </ShineButton>

              <ShineButton
                color="blue"
                onClick={handleShare}
                className="px-4 py-2 text-sm"
              >
                <span className="mr-2">🔗</span>
                Share
              </ShineButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="flex-1 h-[calc(100vh-80px)]">
        <div className="h-full flex flex-col">
          {/* Language Selector */}
          <div className="bg-black/50 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language}
              value={content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
                backgroundColor: '#000000',
                'editor.background': '#000000'
              }}
            />
          </div>

          {/* Status Bar */}
          <div className="bg-black/50 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              {isAutoSaving && (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-500 mr-2"></div>
                  Auto-saving...
                </span>
              )}
              {lastSaved && !isAutoSaving && (
                <span className="flex items-center text-green-400">
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Saved
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Lines: {content.split('\n').length}</span>
              <span>Characters: {content.length}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Share Project
            </h3>
            <p className="text-gray-300 mb-4">
              Share this link with others to collaborate in real-time:
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={`${window.location.origin}/p/${projectId}`}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm"
              />
              <ShineButton
                color="blue"
                onClick={copyShareLink}
                className="px-4 py-2 text-sm"
              >
                Copy
              </ShineButton>
            </div>
            <div className="flex justify-end">
              <ShineButton
                color="purple"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm"
              >
                Close
              </ShineButton>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowSaveModal(false)}
        >
          <div
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Save Project
            </h3>
            <p className="text-gray-300 mb-4">
              Enter a name for your project:
            </p>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg mb-4"
              placeholder="Project name"
            />
            <div className="flex justify-end space-x-2">
              <ShineButton
                color="purple"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </ShineButton>
              <ShineButton
                color="green"
                onClick={handleConfirmSave}
                className="px-4 py-2 text-sm"
              >
                Save
              </ShineButton>
            </div>
          </div>
        </div>
      )}

      {/* AI Debugger Coming Soon Modal */}
      {showAiDebuggerModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAiDebuggerModal(false)}
        >
          <div
            className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤖</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                AI Debugger
              </h3>
              
              <p className="text-gray-300 mb-6">
                Our AI-powered debugging assistant is coming soon! This feature will help you:
              </p>
              
              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Automatically detect code errors
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Suggest fixes and optimizations
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Explain complex code logic
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">✓</span>
                  Real-time code analysis
                </div>
              </div>
              
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
                <p className="text-purple-300 text-sm">
                  <span className="font-semibold">Stay tuned!</span> We're working hard to bring you the most advanced AI debugging experience.
                </p>
              </div>
              
              <ShineButton
                color="purple"
                onClick={() => setShowAiDebuggerModal(false)}
                className="px-6 py-3"
              >
                Got it!
              </ShineButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor