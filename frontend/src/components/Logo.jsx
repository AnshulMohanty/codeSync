import React from 'react'

const Logo = ({ onClick, className = "" }) => {
  return (
    <div 
      className={`flex items-center space-x-3 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Dark cS Icon with Purple Border and Unique Motion */}
      <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500 rounded-lg flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all duration-300 relative overflow-hidden group">
        {/* Animated purple glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-400/30 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        
        {/* Rotating border effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow"></div>
        
        {/* Text with subtle animation */}
        <span className="text-white font-bold text-lg relative z-10 group-hover:scale-110 transition-transform duration-300">cS</span>
      </div>
      
      {/* Logo Text */}
      <div>
        <h1 className="text-xl font-bold text-white">
          codeSync
        </h1>
        <p className="text-gray-400 text-xs">
          synctorized coding platform
        </p>
      </div>
    </div>
  )
}

export default Logo
