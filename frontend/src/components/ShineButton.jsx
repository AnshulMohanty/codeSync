import React from 'react'
import { motion } from 'framer-motion'

const ShineButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "", 
  color = "purple",
  ...props 
}) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-600/20',
          border: 'border-blue-400/30',
          glow: 'shadow-blue-500/20',
          shine: 'from-blue-400/20 via-blue-300/30 to-blue-400/20'
        }
      case 'green':
        return {
          bg: 'bg-green-600/20',
          border: 'border-green-400/30',
          glow: 'shadow-green-500/20',
          shine: 'from-green-400/20 via-green-300/30 to-green-400/20'
        }
      case 'purple':
      default:
        return {
          bg: 'bg-purple-600/20',
          border: 'border-purple-400/30',
          glow: 'shadow-purple-500/20',
          shine: 'from-purple-400/20 via-purple-300/30 to-purple-400/20'
        }
    }
  }

  const colors = getColorClasses(color)

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden px-6 py-3 rounded-lg
        ${colors.bg} ${colors.border} border
        ${colors.glow} shadow-lg
        text-white font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Shine animation */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${colors.shine} opacity-0`}
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut"
        }}
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.shine.split(' ')[0].split('/')[0]}, transparent)`
        }}
      />
      
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  )
}

export default ShineButton
