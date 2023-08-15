import { OrbitControls } from '@react-three/drei';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// 創建一個自定義的著色器材質，用於渲染一個從底部到頂部的漸層背景
const GradientBackgroundMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide, // 只渲染幾何體的背面，這對於天空盒等效果很有用

  // 定義傳遞給shaders的變量
  uniforms: {
    topColor: { value: new THREE.Color(0x000000) }, // 上部的顏色，初始化為黑色
    bottomColor: { value: new THREE.Color(0x0000ff) }, // 底部的顏色，初始化為藍色
    offset: { value: 1 }, // 漸變的位移量
    exponent: { value: 1.5 }, // 用於調整漸變的指數
  },

  // 頂點著色器：描述如何處理每個頂點
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  // 片段著色器：描述如何計算每個像素的顏色
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition + offset).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
  `,
});

// 擴展自定義的ShaderMaterial以便在React中使用
extend({ GradientBackgroundMaterial });

function Box(props: any) {
  const ref = useRef<any>(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(e) => setClicked(!clicked)}
      onPointerOver={(e) => setHovered(true)}
      onPointerOut={(e) => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

function GradientBackground() {
  const { scene, camera } = useThree();

  useEffect(() => {
    const background = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      GradientBackgroundMaterial,
    );

    background.scale.set(1000, 1000, 1000); // 根據需要調整大小
    scene.add(background);

    return () => {
      scene.remove(background); // 清理時移除背景
    };
  }, [scene]);
  // 這裡要 return null，因為我們不需要在畫面上渲染任何東西
  return null;
}

const Test = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <GradientBackground />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};

export default Test;
