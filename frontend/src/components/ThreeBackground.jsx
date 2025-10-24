import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

// Animated network nodes
function NetworkNodes({ count = 100, nodes, setNodes }) {
  const mesh = useRef()
  
  useFrame((state) => {
    if (nodes.length > 0) {
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          x: node.x + node.vx * 1.2,
          y: node.y + node.vy * 1.2,
          z: node.z + node.vz * 1.2,
          opacity: 0.5 + Math.sin(state.clock.elapsedTime * 1.5 + node.id) * 0.3
        }))
      )
    }
  })

  const positions = useMemo(() => {
    const pos = new Float32Array(nodes.length * 3)
    nodes.forEach((node, i) => {
      pos[i * 3] = node.x
      pos[i * 3 + 1] = node.y
      pos[i * 3 + 2] = node.z
    })
    return pos
  }, [nodes])

  return (
    <Points ref={mesh} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={1.0}
      />
    </Points>
  )
}

// Animated network connections
function NetworkConnections({ nodes }) {
  const [connections, setConnections] = useState([])
  
  useEffect(() => {
    if (nodes.length === 0) return
    
    const newConnections = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2)
        )
        
        if (distance < 5) {
          newConnections.push({
            start: [nodes[i].x, nodes[i].y, nodes[i].z],
            end: [nodes[j].x, nodes[j].y, nodes[j].z],
            opacity: Math.max(0, 1 - distance / 5)
          })
        }
      }
    }
    setConnections(newConnections)
  }, [nodes])

  return (
    <group>
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#a855f7"
          opacity={connection.opacity * 0.6}
          transparent
          lineWidth={1.5}
        />
      ))}
    </group>
  )
}

// Main 3D background component
const ThreeBackground = () => {
  const [nodes, setNodes] = useState([])
  
  useEffect(() => {
    const newNodes = []
    for (let i = 0; i < 150; i++) {
      newNodes.push({
        id: i,
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
        vz: (Math.random() - 0.5) * 0.015,
        opacity: Math.random() * 0.6 + 0.4
      })
    }
    setNodes(newNodes)
  }, [])
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#a855f7" />
        <pointLight position={[0, 0, 10]} intensity={0.3} color="#8b5cf6" />
        
        <NetworkNodes count={150} nodes={nodes} setNodes={setNodes} />
        <NetworkConnections nodes={nodes} />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
