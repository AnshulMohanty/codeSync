import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../utils/api'
import ShineButton from '../components/ShineButton'
import ThreeBackground from '../components/ThreeBackground'
import Logo from '../components/Logo'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentProjects()
  }, [])

  const fetchRecentProjects = async () => {
    try {
      const response = await apiClient.getRecentProjects()
      if (response.success) {
        setProjects(response.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load recent projects')
    } finally {
      setLoading(false)
    }
  }

  const createNewProject = async () => {
    try {
      toast.loading('Creating project...', { id: 'create-project' })
      const response = await apiClient.createProject({
        projectName: 'Untitled Project',
        language: 'javascript'
      })
      
      if (response.success) {
        toast.success('Project created successfully!', { id: 'create-project' })
        navigate(`/p/${response.projectId}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project', { id: 'create-project' })
    }
  }

  const deleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return
    }

    try {
      toast.loading('Deleting project...', { id: 'delete-project' })
      const response = await apiClient.deleteProject(projectId)
      
      if (response.success) {
        toast.success('Project deleted successfully!', { id: 'delete-project' })
        // Refresh the projects list
        fetchRecentProjects()
      } else {
        toast.error('Failed to delete project', { id: 'delete-project' })
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project', { id: 'delete-project' })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800',
      python: 'bg-green-100 text-green-800',
      typescript: 'bg-blue-100 text-blue-800',
      go: 'bg-cyan-100 text-cyan-800',
      rust: 'bg-orange-100 text-orange-800'
    }
    return colors[language] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Network Background */}
      <ThreeBackground />
      
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/30" />

      {/* Header */}
      <header className="relative z-20 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo onClick={() => navigate('/')} />
              <div className="h-8 w-px bg-gray-700" />
              <div>
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
                <p className="text-gray-400 text-sm">Manage your collaborative coding sessions</p>
              </div>
            </div>
            <ShineButton
              onClick={createNewProject}
              color="purple"
              className="px-6 py-3"
            >
              <span className="mr-2">+</span>
              New Project
            </ShineButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Welcome to CodeSync AI
            </h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg">
              Create your first project to start coding collaboratively with AI assistance. 
              Build amazing projects with real-time collaboration and AI-powered debugging.
            </p>
            <ShineButton
              onClick={createNewProject}
              color="purple"
              className="px-8 py-4 text-lg"
            >
              <span className="mr-2">🚀</span>
              Create Your First Project
            </ShineButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.projectId}
                className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6 hover:shadow-lg hover:border-gray-600 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 
                    className="text-lg font-semibold text-white truncate cursor-pointer hover:text-purple-400 transition-colors"
                    onClick={() => navigate(`/p/${project.projectId}`)}
                  >
                    {project.projectName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(project.language)}`}>
                      {project.language}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProject(project.projectId, project.projectName)
                      }}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-900/20 rounded"
                      title="Delete project"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <span className="mr-1">🕒</span>
                  {formatDate(project.lastModified)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Project ID: {project.projectId}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
