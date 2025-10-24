const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Project endpoints
  async createProject(projectData) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
  }

  async getProject(projectId) {
    return this.request(`/api/projects/${projectId}`)
  }

  async updateProject(projectId, updateData) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })
  }

  async getRecentProjects() {
    return this.request('/api/projects/recent')
  }

  async deleteProject(projectId) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'DELETE'
    })
  }

  // AI endpoints
  async debugCode(codeData) {
    return this.request('/api/ai/debug', {
      method: 'POST',
      body: JSON.stringify(codeData),
    })
  }

  async explainCode(codeData) {
    return this.request('/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify(codeData),
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health')
  }

  // File system operations
  async createFile(projectId, fileData) {
    return this.request(`/api/projects/${projectId}/files`, {
      method: 'POST',
      body: JSON.stringify(fileData),
    })
  }

  async createFolder(projectId, folderData) {
    return this.request(`/api/projects/${projectId}/folders`, {
      method: 'POST',
      body: JSON.stringify(folderData),
    })
  }

  async updateFile(projectId, filePath, fileData) {
    return this.request(`/api/projects/${projectId}/files/${filePath}`, {
      method: 'PUT',
      body: JSON.stringify(fileData),
    })
  }

  async deleteFile(projectId, filePath) {
    return this.request(`/api/projects/${projectId}/files/${filePath}`, {
      method: 'DELETE'
    })
  }

  // Cleanup operations
  async cleanupDummyProjects() {
    return this.request('/api/projects/cleanup', {
      method: 'DELETE'
    })
  }

  async cleanupUnsavedProjects() {
    return this.request('/api/projects/cleanup-unsaved', {
      method: 'DELETE'
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient
