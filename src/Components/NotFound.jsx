'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Text, Sparkles } from '@react-three/drei'
import { Suspense, useRef } from 'react'

import {Link} from 'react-router-dom'

function AnimatedRobot() {
  const robot = useRef()
  const eyesRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    robot.current.rotation.y = Math.sin(t / 2) / 4
    robot.current.position.y = Math.sin(t) / 2
    eyesRef.current.position.x = Math.sin(t * 2) * 0.05
  })

  return (
    <group ref={robot} position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 1]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Eyes */}
      <group ref={eyesRef}>
        <mesh position={[-0.4, 2.1, 0.8]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.4, 2.1, 0.8]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} />
        </mesh>
      </group>
      {/* Antenna */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color="#60A5FA" />
      </mesh>
      {/* Arms */}
      <mesh position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 2, 0.4]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      <mesh position={[1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 2, 0.4]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
    </group>
  )
}

function FloatingText({ children, ...props }) {
  const textRef = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    textRef.current.position.y = Math.sin(t * 2) * 0.1
  })
  return (
    <group ref={textRef} {...props}>
      {children}
    </group>
  )
}

export default function NotFound() {
  return (
    <div className=" h-screen w-full bg-gradient-to-b from-black to-gray-900 overflow-hidden mt-[-3.5rem] mb-[-.3rem]">
      {/* Navigation */}
     

      {/* Main Content */}
      <div className="absolute top-[34%] left-28 -translate-y-1/2 z-10">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">404</h1>
        <p className="text-gray-400 mb-6 text-xl">
          The page you are looking for<br />
          doesn't exist or has been moved
        </p>
        <Link to="/">
          <button className="bg-gradient-to-r px-3 py-2 from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
            ← BACK TO HOME PAGE
          </button>
        </Link>
      </div>

      {/* 3D Scene */}
      <Canvas className="h-screen w-full" camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <AnimatedRobot />
          <Sparkles count={200} scale={10} size={4} speed={0.4} />
          <FloatingText position={[0, 2, 0]}>
            <Text
              fontSize={1}
              color="#00FFFF"
              anchorX="center"
              anchorY="middle"
            >
              404
            </Text>
          </FloatingText>
          <OrbitControls enableZoom={false} enablePan={false} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}