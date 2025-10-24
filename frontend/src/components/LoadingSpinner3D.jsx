import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

// 3D Crystal/Cube spinner
function CrystalSpinner() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial
        color="#8B5CF6"
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </Box>
  )
}

// Orbiting particles around the crystal
function OrbitingParticles() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => (
        <Sphere
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 2,
            Math.sin((i / 8) * Math.PI * 2) * 2,
            0
          ]}
          args={[0.1]}
        >
          <meshStandardMaterial
            color="#3B82F6"
            transparent
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Main 3D loading spinner
const LoadingSpinner3D = ({ size = 100 }) => {
  return (
    <div 
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        
        <CrystalSpinner />
        <OrbitingParticles />
      </Canvas>
    </div>
  )
}

export default LoadingSpinner3D
