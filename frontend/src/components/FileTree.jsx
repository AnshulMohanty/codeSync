import React, { useState } from 'react'
import { motion } from 'framer-motion'

const FileTree = ({ files, onFileSelect, onFileCreate, onFolderCreate, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']))
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [createMenuPosition, setCreateMenuPosition] = useState({ x: 0, y: 0 })

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const handleContextMenu = (e, path) => {
    e.preventDefault()
    setCreateMenuPosition({ x: e.clientX, y: e.clientY })
    setShowCreateMenu(true)
  }

  const renderFile = (file, depth = 0) => {
    const isSelected = selectedFile === file.path
    const isExpanded = expandedFolders.has(file.path)
    
    return (
      <div key={file.path} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer transition-colors ${
            isSelected ? 'bg-purple-900/30 border-r-2 border-purple-500' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => file.type === 'folder' ? toggleFolder(file.path) : onFileSelect(file.path)}
          onContextMenu={(e) => handleContextMenu(e, file.path)}
        >
          <span className="mr-2 text-gray-400">
            {file.type === 'folder' ? (isExpanded ? '📁' : '📂') : '📄'}
          </span>
          <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
            {file.name}
          </span>
          {file.type === 'file' && (
            <span className="ml-auto text-xs text-gray-500">
              {file.language || 'txt'}
            </span>
          )}
        </div>
        
        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFile(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Explorer</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onFileCreate()}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              title="New File"
            >
              📄
            </button>
            <button
              onClick={() => onFolderCreate()}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              title="New Folder"
            >
              📁
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto h-full">
        {files.map(file => renderFile(file))}
      </div>

      {/* Context Menu */}
      {showCreateMenu && (
        <motion.div
          className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50"
          style={{
            left: createMenuPosition.x,
            top: createMenuPosition.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onFileCreate()
                setShowCreateMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              📄 New File
            </button>
            <button
              onClick={() => {
                onFolderCreate()
                setShowCreateMenu(false)
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              📁 New Folder
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FileTree
