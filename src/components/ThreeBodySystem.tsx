
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeBodySystemProps {
  characterMode: string;
  isTyping: boolean;
}

const ThreeBodySystem: React.FC<ThreeBodySystemProps> = ({ characterMode, isTyping }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bodiesRef = useRef<THREE.Mesh[]>([]);
  const frameIdRef = useRef<number>(0);

  // Character-specific configurations
  const configs = {
    'Ye Wenjie': {
      colors: [0x64ffda, 0xff6464, 0x4d91ff],
      speed: 0.4,
      size: [0.8, 0.6, 0.7],
      pattern: 'chaotic'
    },
    'Wang Miao': {
      colors: [0x9c4dff, 0x3259ba, 0xff9d4d],
      speed: 0.3,
      size: [0.7, 0.7, 0.7],
      pattern: 'stable'
    },
    'Da Shi': {
      colors: [0xff4d4d, 0xff9d4d, 0x4dffff],
      speed: 0.5,
      size: [0.9, 0.5, 0.6],
      pattern: 'aggressive'
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create the three bodies
    const selectedConfig = configs[characterMode as keyof typeof configs] || configs['Ye Wenjie'];
    const bodies: THREE.Mesh[] = [];

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.SphereGeometry(selectedConfig.size[i], 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: selectedConfig.colors[i],
        emissive: selectedConfig.colors[i],
        emissiveIntensity: 0.3,
        specular: 0xffffff
      });

      const body = new THREE.Mesh(geometry, material);
      
      // Position each body at different points
      const angle = (i * Math.PI * 2) / 3;
      const radius = 2;
      body.position.x = Math.cos(angle) * radius;
      body.position.y = Math.sin(angle) * radius;
      
      scene.add(body);
      bodies.push(body);
    }

    bodiesRef.current = bodies;

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.01;
      
      // Apply different animation based on character and state
      const baseSpeed = selectedConfig.speed * (isTyping ? 1.5 : 1);
      
      bodies.forEach((body, index) => {
        let x, y, z;
        
        switch(selectedConfig.pattern) {
          case 'chaotic':
            x = Math.cos(time * baseSpeed + index * 2) * 2;
            y = Math.sin(time * baseSpeed + index) * 2;
            z = Math.sin(time * baseSpeed * 0.5 + index * 3) * 0.5;
            break;
          case 'stable':
            x = Math.cos(time * baseSpeed + (index * Math.PI * 2) / 3) * 2;
            y = Math.sin(time * baseSpeed + (index * Math.PI * 2) / 3) * 2;
            z = Math.sin(time * baseSpeed * 0.3) * 0.3;
            break;
          case 'aggressive':
            x = Math.cos(time * baseSpeed * (index + 1)) * 2.2;
            y = Math.sin(time * baseSpeed * (index + 1)) * 1.8;
            z = Math.cos(time * baseSpeed * 0.7 + index) * 0.7;
            break;
          default:
            x = Math.cos(time * baseSpeed + index) * 2;
            y = Math.sin(time * baseSpeed + index) * 2;
            z = 0;
        }
        
        body.position.set(x, y, z);
        
        // Pulse effect when typing
        if (isTyping) {
          const scale = 1 + Math.sin(time * 5) * 0.05;
          body.scale.set(scale, scale, scale);
        } else {
          body.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of geometries and materials
      bodiesRef.current.forEach(body => {
        body.geometry.dispose();
        (body.material as THREE.Material).dispose();
      });
    };
  }, [characterMode, isTyping]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ThreeBodySystem;
