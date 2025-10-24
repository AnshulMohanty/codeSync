import React, { useState } from 'react'
import { apiClient } from '../utils/api'
import toast from 'react-hot-toast'

// Mock analysis function for demo purposes
const generateMockAnalysis = (code, language) => {
  const issues = []
  
  // Check for common JavaScript issues
  if (language === 'javascript') {
    if (code.includes('const data = {}') && code.includes('data.map')) {
      issues.push({
        issue: 'TypeError: data.map is not a function',
        explanation: 'The variable "data" is an object, not an array. The map() method only works on arrays.',
        suggestedFix: 'const data = []; // Change to array\n// or use Object.keys(data).map(...)',
        severity: 'error'
      })
    }
    
    if (code.includes('undefined') && code.includes('.')) {
      issues.push({
        issue: 'Potential undefined reference',
        explanation: 'Accessing properties on undefined values can cause runtime errors.',
        suggestedFix: '// Add null checks: if (variable && variable.property)',
        severity: 'warning'
      })
    }
    
    if (code.includes('==') && !code.includes('===')) {
      issues.push({
        issue: 'Use strict equality',
        explanation: 'Using == can cause unexpected type coercion. Use === for strict comparison.',
        suggestedFix: code.replace(/==/g, '==='),
        severity: 'warning'
      })
    }
  }
  
  // If no specific issues found, provide general feedback
  if (issues.length === 0) {
    return {
      issue: 'Code looks good!',
      explanation: 'No obvious issues detected in the selected code.',
      suggestedFix: code,
      severity: 'info'
    }
  }
  
  return issues[0] // Return the first issue found
}

// Mock explanation function for demo purposes
const generateMockExplanation = (code, language) => {
  if (language === 'javascript') {
    if (code.includes('const') && code.includes('=')) {
      return `This code declares a constant variable using the 'const' keyword in JavaScript.

Key points:
• 'const' creates a variable that cannot be reassigned
• The variable is block-scoped (only accessible within the current block)
• Unlike 'var', 'const' is not hoisted and cannot be redeclared
• This is the preferred way to declare variables in modern JavaScript

The assignment operator '=' assigns a value to the variable.`
    }
    
    if (code.includes('function') || code.includes('=>')) {
      return `This code defines a function in JavaScript.

Key concepts:
• Functions are reusable blocks of code that perform specific tasks
• They can accept parameters and return values
• Arrow functions (=>) are a shorter syntax for function expressions
• Functions help organize code and avoid repetition`
    }
    
    if (code.includes('if') || code.includes('else')) {
      return `This code uses conditional logic to make decisions.

How it works:
• 'if' statements check if a condition is true
• 'else' provides an alternative path when the condition is false
• Conditions are evaluated as boolean values (true/false)
• This allows your code to behave differently based on different situations`
    }
  }
  
  return `This ${language} code appears to be well-structured. 

General explanation:
• The code follows good programming practices
• It's readable and maintainable
• Consider adding comments for complex logic
• Make sure to handle edge cases and error conditions`
}

const AIPanel = ({ isOpen, onClose, selectedCode, language, onApplyFix }) => {
  const [activeTab, setActiveTab] = useState('debug')
  const [loading, setLoading] = useState(false)
  const [debugResult, setDebugResult] = useState(null)
  const [explanation, setExplanation] = useState('')

  const handleDebug = async () => {
    if (!selectedCode.trim()) {
      toast.error('Please select some code to debug')
      return
    }

    console.log('Debugging code:', selectedCode.substring(0, 100) + '...')

    setLoading(true)
    try {
      const response = await apiClient.debugCode({
        codeSnippet: selectedCode,
        language,
        context: 'User is debugging this code'
      })

      if (response.success) {
        setDebugResult(response.feedback)
        toast.success('Code analysis completed!')
      } else {
        toast.error(response.error || 'Failed to analyze code')
      }
    } catch (error) {
      console.error('Debug error:', error)
      
      // Fallback: Show mock analysis for demo purposes
      if (error.message.includes('AI service temporarily unavailable') || 
          error.message.includes('Failed to analyze code')) {
        
        // Create a mock analysis based on common issues
        const mockAnalysis = generateMockAnalysis(selectedCode, language)
        setDebugResult(mockAnalysis)
        toast.success('Code analysis completed (Demo Mode)!')
      } else if (error.message.includes('Rate limit')) {
        toast.error('Too many requests. Please wait 60 seconds.')
      } else if (error.message.includes('timeout')) {
        toast.error('Request timed out. Please try again.')
      } else {
        toast.error('Failed to analyze code. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExplain = async () => {
    if (!selectedCode.trim()) {
      toast.error('Please select some code to explain')
      return
    }

    setLoading(true)
    try {
      const response = await apiClient.explainCode({
        codeSnippet: selectedCode,
        language
      })

      if (response.success) {
        setExplanation(response.explanation)
        toast.success('Code explanation generated!')
      } else {
        toast.error(response.error || 'Failed to explain code')
      }
    } catch (error) {
      console.error('Explain error:', error)
      
      // Fallback: Show mock explanation for demo purposes
      if (error.message.includes('AI service temporarily unavailable') || 
          error.message.includes('Failed to explain code')) {
        
        const mockExplanation = generateMockExplanation(selectedCode, language)
        setExplanation(mockExplanation)
        toast.success('Code explanation generated (Demo Mode)!')
      } else if (error.message.includes('Rate limit')) {
        toast.error('Too many requests. Please wait 60 seconds.')
      } else if (error.message.includes('timeout')) {
        toast.error('Request timed out. Please try again.')
      } else {
        toast.error('Failed to explain code. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFix = () => {
    if (debugResult?.suggestedFix) {
      onApplyFix(debugResult.suggestedFix)
      toast.success('Fix applied to editor!')
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-96 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'debug'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🐛 Debug
          </button>
          <button
            onClick={() => setActiveTab('explain')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'explain'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            💡 Explain
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'debug' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Code:</h4>
                <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono text-gray-800 max-h-32 overflow-y-auto">
                  {selectedCode || 'No code selected'}
                </div>
              </div>

              <button
                onClick={handleDebug}
                disabled={loading || !selectedCode.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Analyzing...' : 'Analyze Code'}
              </button>

              {debugResult && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border ${getSeverityColor(debugResult.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {debugResult.severity || 'info'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {debugResult.severity === 'error' ? '🔴' : 
                         debugResult.severity === 'warning' ? '🟡' : '🔵'}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">{debugResult.issue}</p>
                    <p className="text-sm text-gray-700">{debugResult.explanation}</p>
                  </div>

                  {debugResult.suggestedFix && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Suggested Fix:</h5>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <pre className="text-sm font-mono text-green-800 whitespace-pre-wrap">
                          {debugResult.suggestedFix}
                        </pre>
                        <button
                          onClick={handleApplyFix}
                          className="mt-2 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors duration-200"
                        >
                          Apply Fix
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'explain' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Code:</h4>
                <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono text-gray-800 max-h-32 overflow-y-auto">
                  {selectedCode || 'No code selected'}
                </div>
              </div>

              <button
                onClick={handleExplain}
                disabled={loading || !selectedCode.trim()}
                className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Explaining...' : 'Explain Code'}
              </button>

              {explanation && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-purple-900 mb-2">Explanation:</h5>
                  <div className="text-sm text-purple-800 whitespace-pre-wrap">
                    {explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIPanel
