import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThreeBackground from '../components/ThreeBackground'
import ShineButton from '../components/ShineButton'
import Logo from '../components/Logo'

const Landing = () => {
  const navigate = useNavigate()

  const handleStartCoding = () => {
    navigate('/dashboard')
  }

  const features = [
    {
      title: 'Real-Time Collaboration',
      description: 'Edit code simultaneously with up to 5 users. See live cursors and changes as they happen.'
    },
    {
      title: 'AI-Powered Debugging',
      description: 'Get instant feedback on code errors with our Gemini AI integration. Debug faster than ever.'
    },
    {
      title: 'Multi-Language Support',
      description: 'Write in JavaScript, Python, TypeScript, Go, and Rust with full syntax highlighting.'
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Network Background */}
      <ThreeBackground />
      
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/30" />

      {/* Header with Logo */}
      <header className="relative z-20 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo onClick={() => navigate('/')} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              CodeSync{' '}
              <span className="text-purple-400">
                AI
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The next-generation collaborative coding platform powered by AI. 
              <span className="text-purple-400 font-semibold"> Real-time sync</span>, 
              <span className="text-blue-400 font-semibold"> intelligent debugging</span>, and 
              <span className="text-green-400 font-semibold"> seamless collaboration</span>.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-green-400 text-sm font-mono">✓ WebSocket Real-time</span>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-blue-400 text-sm font-mono">✓ AI-Powered Debug</span>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-purple-400 text-sm font-mono">✓ Multi-Language</span>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
                <span className="text-yellow-400 text-sm font-mono">✓ Live Cursors</span>
              </div>
            </motion.div>
            <ShineButton
              onClick={handleStartCoding}
              color="purple"
              className="text-xl px-8 py-4"
            >
              <span className="mr-3">🚀</span>
              Start Coding Now
              <motion.span 
                className="ml-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </ShineButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to code together
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed for modern development workflows
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl">
                    {index === 0 ? '🤝' : index === 1 ? '🤖' : '⚡'}
                  </span>
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Built with React, Node.js, and Socket.io • Powered by Google Gemini AI
          </motion.p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
