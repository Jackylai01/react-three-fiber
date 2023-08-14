import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

extend({ OrbitControls });
const OrbitRefContext = createContext<any>(null);

const ModelCenterContext = createContext<THREE.Vector3 | null>(null);

function Indicator({ position }: { position: THREE.Vector3 }) {
  const characterSize = 1;
  const topSize = characterSize / 8;
  const bottomRadius = characterSize / 4;

  return (
    <>
      <mesh
        position={[position.x, topSize / 2, position.z]} // Adjust the y position based on half the height of the tetrahedron
        rotation={[-0.97, Math.PI / 4, 0]}
        name='indicator_top'
      >
        <tetrahedronGeometry args={[topSize, 0]} />
        <meshToonMaterial color={0x00ccff} emissive={0x00ccff} />
      </mesh>

      <mesh
        position={[position.x, bottomRadius * 0.25, position.z]} // Adjust the y position based on the radius of the torus
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[bottomRadius, bottomRadius * 0.25, 2, 12]} />
        <meshToonMaterial color={0x00ccff} emissive={0x00ccff} />
      </mesh>
    </>
  );
}

// 地面移動攝影機
function PlaneAndCameraController() {
  const orbitRef = useContext(OrbitRefContext);
  const [modelCenter, setModelCenter] = useState<THREE.Vector3 | null>(null);
  const gltf = useGLTF('/glb/court.glb');
  const floorRef = useRef<THREE.Mesh | null>(null);

  const { camera, raycaster, scene, gl } = useThree();
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(
    null,
  );

  useEffect(() => {
    if (gltf.scene) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());

      // 保存模型的中心，以便稍後使用
      setModelCenter(center);
    }
  }, [gltf]);

  useEffect(() => {
    const handleMouseDown = (e: any) => {
      let mouse = new THREE.Vector2();
      mouse.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(floorRef.current!);
      if (intersects.length > 0) {
        setTargetPosition(intersects[0].point);
        if (orbitRef.current) {
          orbitRef.current.enabled = false;
        }
      }
    };

    gl.domElement.addEventListener('mousedown', handleMouseDown);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
    };
  }, [gl.domElement, raycaster, camera]);

  useFrame(() => {
    if (targetPosition) {
      const newPos = new THREE.Vector3().lerpVectors(
        camera.position,
        new THREE.Vector3(
          targetPosition.x,
          camera.position.y,
          targetPosition.z,
        ),
        0.05,
      );

      if (
        newPos.distanceTo(
          new THREE.Vector3(
            targetPosition.x,
            camera.position.y,
            targetPosition.z,
          ),
        ) < 0.1
      ) {
        camera.position.set(
          targetPosition.x,
          camera.position.y,
          targetPosition.z,
        );
        setTargetPosition(null);

        if (orbitRef.current) {
          orbitRef.current.enabled = true;

          // Update the target of the OrbitControls to the camera's new position
          orbitRef.current.target.set(
            camera.position.x,
            camera.position.y,
            camera.position.z,
          );
          orbitRef.current.update();
        }
      } else {
        camera.position.set(newPos.x, newPos.y, newPos.z);
      }
    }
  });

  // const planeGeometry = new PlaneGeometry(100, 100);

  return (
    <ModelCenterContext.Provider value={modelCenter}>
      <mesh
        ref={floorRef}
        rotation={[0, 0, 0]} // 將模型翻轉180度
        position={[0, -1, 0]}
        receiveShadow
      >
        <primitive object={gltf.scene} />
        <meshStandardMaterial attach='material' color='lightgray' />
        {targetPosition && <Indicator position={targetPosition} />}
      </mesh>
      <OrbitControls ref={orbitRef} enablePan={false} />
    </ModelCenterContext.Provider>
  );
}

// function CameraControls() {
//   const orbitRef = useRef<any>(null);
//   const modelCenter = useContext(ModelCenterContext);

//   useFrame(() => {
//     if (orbitRef.current && modelCenter) {
//       orbitRef.current.target.set(modelCenter.x, modelCenter.y, modelCenter.z);
//       orbitRef.current.update();
//     }
//   });

//   useEffect(() => {
//     if (orbitRef.current) {
//       orbitRef.current.minPolarAngle = Math.PI / 6;
//       orbitRef.current.maxPolarAngle = Math.PI / 2;
//     }
//   }, []);

//   return <OrbitControls ref={orbitRef} enablePan={false} />;
// }

function ThreeDScene() {
  const orbitRef = useRef<any>(null);

  return (
    <OrbitRefContext.Provider value={orbitRef}>
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 0, 20], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <PlaneAndCameraController />
      </Canvas>
    </OrbitRefContext.Provider>
  );
}

export default ThreeDScene;
