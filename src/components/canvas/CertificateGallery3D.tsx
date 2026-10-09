import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { CertificateItem } from '../../types';
import { sound } from '../../utils/audio';
import { createCertificate } from '../../services/api';

interface CertificateGallery3DProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: CertificateItem[];
  onCertificateAdded?: (newCert: CertificateItem) => void;
}

interface DoorObjectRef {
  id: string;
  doorIndex: number;
  doorPanel: THREE.Group;
  doorHandle: THREE.Mesh;
  doorFrame: THREE.Mesh;
  plaqueMesh: THREE.Mesh;
  roomLight: THREE.PointLight;
  doorPos: THREE.Vector3;
  roomCamPos: THREE.Vector3;
  roomCamTarget: THREE.Vector3;
  hallCamPos: THREE.Vector3;
  hallCamTarget: THREE.Vector3;
  isOpenState: boolean;
  side: 'left' | 'right';
}

export const CertificateGallery3D: React.FC<CertificateGallery3DProps> = ({
  isOpen,
  onClose,
  certificates,
  onCertificateAdded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Gallery Navigation State
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number | null>(null);
  const [galleryMode, setGalleryMode] = useState<'hallway' | 'entering' | 'inside_room' | 'exiting'>('hallway');
  const [hoveredCert, setHoveredCert] = useState<CertificateItem | null>(null);
  const [isZoomedInCert, setIsZoomedInCert] = useState(false);

  // Add Certificate Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');
  const [newCategory, setNewCategory] = useState('3D Graphics & Spatial');
  const [newDate, setNewDate] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const doorsListRef = useRef<DoorObjectRef[]>([]);
  const clickableMeshesRef = useRef<{ mesh: THREE.Object3D; certId: string; index: number }[]>([]);

  // Camera Animation Controller
  const camAnimRef = useRef<{
    active: boolean;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    progress: number;
    duration: number;
    onComplete?: () => void;
  }>({
    active: false,
    startPos: new THREE.Vector3(0, 1.7, 4),
    endPos: new THREE.Vector3(0, 1.7, 4),
    startTarget: new THREE.Vector3(0, 1.7, -10),
    endTarget: new THREE.Vector3(0, 1.7, -10),
    progress: 1,
    duration: 1.2,
  });

  const currentCamTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.7, -10));

  // Hallway walk / scroll position
  const scrollZRef = useRef<number>(4);
  const targetScrollZRef = useRef<number>(4);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseYRef = useRef<number>(0);

  // Helper to animate camera
  const animateCameraTo = useCallback(
    (pos: THREE.Vector3, target: THREE.Vector3, duration: number = 1.3, onComplete?: () => void) => {
      if (!cameraRef.current) return;
      camAnimRef.current = {
        active: true,
        startPos: cameraRef.current.position.clone(),
        endPos: pos.clone(),
        startTarget: currentCamTarget.current.clone(),
        endTarget: target.clone(),
        progress: 0,
        duration: duration,
        onComplete: onComplete,
      };
    },
    []
  );

  // Enter a Door & Room
  const enterRoom = useCallback(
    (index: number) => {
      if (index < 0 || index >= certificates.length) return;
      const doorObj = doorsListRef.current[index];
      if (!doorObj) return;

      const cert = certificates[index];
      setSelectedCert(cert);
      setActiveRoomIndex(index);
      setGalleryMode('entering');
      sound.playZoom();

      // Swing door open
      doorObj.isOpenState = true;

      // Camera moves inside the room
      animateCameraTo(doorObj.roomCamPos, doorObj.roomCamTarget, 1.4, () => {
        setGalleryMode('inside_room');
      });
    },
    [certificates, animateCameraTo]
  );

  // Exit Room back to Hallway
  const exitRoom = useCallback(() => {
    if (activeRoomIndex === null) return;
    const doorObj = doorsListRef.current[activeRoomIndex];
    setGalleryMode('exiting');
    sound.playClick();

    if (doorObj) {
      // Swing door back to closed position as camera pulls back
      doorObj.isOpenState = false;
      animateCameraTo(doorObj.hallCamPos, doorObj.hallCamTarget, 1.2, () => {
        setGalleryMode('hallway');
        setSelectedCert(null);
        setActiveRoomIndex(null);
        setIsZoomedInCert(false);
      });
    } else {
      setGalleryMode('hallway');
      setSelectedCert(null);
      setActiveRoomIndex(null);
    }
  }, [activeRoomIndex, animateCameraTo]);

  // Navigate to Next / Previous Room
  const navigateRoom = useCallback(
    (direction: 'next' | 'prev') => {
      if (activeRoomIndex === null) return;
      const newIndex = direction === 'next' ? activeRoomIndex + 1 : activeRoomIndex - 1;
      if (newIndex >= 0 && newIndex < certificates.length) {
        // Close previous door
        const prevDoor = doorsListRef.current[activeRoomIndex];
        if (prevDoor) prevDoor.isOpenState = false;

        enterRoom(newIndex);
      }
    },
    [activeRoomIndex, certificates.length, enterRoom]
  );

  // Handle Adding New Certificate
  const handleAddNewCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newIssuer) return;
    try {
      setIsSubmitting(true);
      const created = await createCertificate({
        title: newTitle,
        issuer: newIssuer,
        category: newCategory,
        issueDate: newDate || 'October 2024',
        skills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
        description: newDesc || 'Verified technical certification and verified project competence.',
      });

      sound.playChime();
      if (onCertificateAdded) {
        onCertificateAdded(created);
      }
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewIssuer('');
      setNewSkills('');
      setNewDesc('');
    } catch (err) {
      console.error('Error adding certificate:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- THREE.JS INITIALIZATION & SCENE SETUP ---
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d); // Atmospheric midnight gallery ambience
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 1.7, 4);
    camera.lookAt(0, 1.7, -10);
    cameraRef.current = camera;
    currentCamTarget.current.set(0, 1.7, -10);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Ambient & Corridor Lighting
    const ambient = new THREE.AmbientLight(0xfef08a, 0.6);
    scene.add(ambient);

    // 4. Hallway Architecture Materials
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.35,
    });
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.9,
    });
    const woodDoorMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e, // Warm mahogany wood door
      roughness: 0.45,
      metalness: 0.15,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xca8a04,
      emissiveIntensity: 0.2,
    });
    const glowingPlaqueMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    });

    // Hallway geometry calculation
    const doorSpacing = 4.8;
    const numDoors = Math.max(certificates.length, 4);
    const hallwayLength = (numDoors / 2 + 1) * doorSpacing + 8;
    const hallwayWidth = 4.2;
    const hallwayHeight = 4.0;

    // Floor
    const floorGeo = new THREE.PlaneGeometry(hallwayWidth, hallwayLength);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -hallwayLength / 2 + 6);
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, hallwayHeight, -hallwayLength / 2 + 6);
    scene.add(ceiling);

    // Left & Right Walls
    const wallGeo = new THREE.PlaneGeometry(hallwayLength, hallwayHeight);

    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2 + 6);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2 + 6);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Back end wall
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayWidth, hallwayHeight), wallMat);
    endWall.position.set(0, hallwayHeight / 2, -hallwayLength + 6);
    scene.add(endWall);

    // Archway moldings along corridor ceiling
    for (let az = 2; az > -hallwayLength + 8; az -= doorSpacing) {
      const archGeo = new THREE.TorusGeometry(hallwayWidth / 2, 0.08, 8, 24, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, wallMat);
      archMesh.position.set(0, hallwayHeight - 0.4, az);
      scene.add(archMesh);

      // Warm Sconce Light at each arch
      const sconceLight = new THREE.PointLight(0xfef08a, 1.2, 7);
      sconceLight.position.set(0, hallwayHeight - 0.5, az);
      scene.add(sconceLight);
    }

    // 5. Dynamic Doors Generation for Certificates
    const doorsList: DoorObjectRef[] = [];
    const clickableList: { mesh: THREE.Object3D; certId: string; index: number }[] = [];

    certificates.forEach((cert, idx) => {
      const isLeft = idx % 2 === 0;
      const pairIndex = Math.floor(idx / 2);
      const doorZ = 1.0 - pairIndex * doorSpacing;
      const doorX = isLeft ? -hallwayWidth / 2 : hallwayWidth / 2;
      const doorRotY = isLeft ? Math.PI / 2 : -Math.PI / 2;

      const doorRoot = new THREE.Group();
      doorRoot.position.set(doorX, 0, doorZ);
      doorRoot.rotation.y = doorRotY;
      scene.add(doorRoot);

      // Door Frame Arch
      const frameGeo = new THREE.BoxGeometry(1.6, 2.6, 0.2);
      const doorFrame = new THREE.Mesh(frameGeo, wallMat);
      doorFrame.position.set(0, 1.3, 0);
      doorFrame.castShadow = true;
      doorRoot.add(doorFrame);

      // Door Cutout Inner Opening
      const doorwayOpening = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 2.4, 0.25),
        new THREE.MeshBasicMaterial({ color: 0x020617 })
      );
      doorwayOpening.position.set(0, 1.2, 0);
      doorRoot.add(doorwayOpening);

      // Pivoting Door Panel (Hinged at left edge of door frame)
      const doorPanelGroup = new THREE.Group();
      doorPanelGroup.position.set(-0.6, 0, 0); // Hinge pivot point
      doorRoot.add(doorPanelGroup);

      const panelMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.36, 0.08),
        woodDoorMat
      );
      panelMesh.position.set(0.6, 1.18, 0);
      panelMesh.castShadow = true;
      doorPanelGroup.add(panelMesh);

      // Brass moldings on door panels
      [-0.3, 0.3].forEach((mx) => {
        [-0.4, 0.4].forEach((my) => {
          const molding = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.7, 0.02),
            woodDoorMat
          );
          molding.position.set(0.6 + mx, 1.18 + my, 0.05);
          doorPanelGroup.add(molding);
        });
      });

      // Brass Door Handle Lever
      const handleMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8),
        brassMat
      );
      handleMesh.rotation.z = Math.PI / 2;
      handleMesh.position.set(1.05, 1.1, 0.08);
      doorPanelGroup.add(handleMesh);

      // Brass Door Number Plaque above door
      const plaqueMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.18, 0.04),
        glowingPlaqueMat
      );
      plaqueMesh.position.set(0, 2.65, 0.1);
      doorRoot.add(plaqueMesh);

      // Warm Room Light Inside the Exhibition Room
      const roomLight = new THREE.PointLight(0x38bdf8, 2.2, 10);
      const roomDepth = isLeft ? -3.5 : 3.5;
      roomLight.position.set(doorX + (isLeft ? -2.2 : 2.2), 2.2, doorZ);
      scene.add(roomLight);

      // Framed Certificate on the Exhibition Room Wall
      const frameWallGroup = new THREE.Group();
      frameWallGroup.position.set(doorX + (isLeft ? -3.8 : 3.8), 1.7, doorZ);
      frameWallGroup.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      scene.add(frameWallGroup);

      // Elegant Picture Frame
      const picFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.7, 0.1),
        brassMat
      );
      frameWallGroup.add(picFrame);

      // Certificate Paper Canvas
      const certPaper = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.5),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.3,
          metalness: 0.1,
        })
      );
      certPaper.position.z = 0.06;
      frameWallGroup.add(certPaper);

      // Register door click targets
      clickableList.push({ mesh: panelMesh, certId: cert.id, index: idx });
      clickableList.push({ mesh: doorFrame, certId: cert.id, index: idx });
      clickableList.push({ mesh: plaqueMesh, certId: cert.id, index: idx });

      // Calculate camera coordinates for room entry
      const hallCamPos = new THREE.Vector3(
        isLeft ? -0.8 : 0.8,
        1.7,
        doorZ + 0.2
      );
      const hallCamTarget = new THREE.Vector3(
        isLeft ? -2.0 : 2.0,
        1.7,
        doorZ
      );

      const roomCamPos = new THREE.Vector3(
        doorX + (isLeft ? -1.8 : 1.8),
        1.7,
        doorZ
      );
      const roomCamTarget = new THREE.Vector3(
        doorX + (isLeft ? -3.8 : 3.8),
        1.7,
        doorZ
      );

      doorsList.push({
        id: cert.id,
        doorIndex: idx,
        doorPanel: doorPanelGroup,
        doorHandle: handleMesh,
        doorFrame: doorFrame,
        plaqueMesh: plaqueMesh,
        roomLight: roomLight,
        doorPos: new THREE.Vector3(doorX, 0, doorZ),
        roomCamPos: roomCamPos,
        roomCamTarget: roomCamTarget,
        hallCamPos: hallCamPos,
        hallCamTarget: hallCamTarget,
        isOpenState: false,
        side: isLeft ? 'left' : 'right',
      });
    });

    doorsListRef.current = doorsList;
    clickableMeshesRef.current = clickableList;

    // 6. Raycasting & Mouse Navigation Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseYRef.current = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Drag to scroll along corridor when in hallway mode
      if (isDraggingRef.current && galleryMode === 'hallway') {
        const deltaY = e.clientY - lastMouseYRef.current;
        targetScrollZRef.current += deltaY * 0.015;
        // Clamp to hallway length
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(5, targetScrollZRef.current));
        lastMouseYRef.current = e.clientY;
      }

      // Raycasting for door hovering
      if (galleryMode === 'hallway') {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          clickableMeshesRef.current.map((c) => c.mesh)
        );

        if (intersects.length > 0) {
          const hit = intersects[0];
          const match = clickableMeshesRef.current.find((c) => c.mesh === hit.object);
          if (match) {
            const cert = certificates[match.index];
            setHoveredCert(cert || null);
            container.style.cursor = 'pointer';
            return;
          }
        }
        setHoveredCert(null);
        container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      // Click to enter door
      if (galleryMode === 'hallway') {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          clickableMeshesRef.current.map((c) => c.mesh)
        );

        if (intersects.length > 0) {
          const hit = intersects[0];
          const match = clickableMeshesRef.current.find((c) => c.mesh === hit.object);
          if (match) {
            enterRoom(match.index);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (galleryMode === 'hallway') {
        targetScrollZRef.current -= e.deltaY * 0.008;
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(5, targetScrollZRef.current));
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 7. Render Loop with Door Physics & Camera Lerp
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Camera lerp animation during room transitions
      const anim = camAnimRef.current;
      if (anim.active) {
        anim.progress += 0.024;
        const t = Math.min(1, anim.progress);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
        currentCamTarget.current.lerpVectors(anim.startTarget, anim.endTarget, ease);
        camera.lookAt(currentCamTarget.current);

        if (t >= 1) {
          anim.active = false;
          camera.position.copy(anim.endPos);
          currentCamTarget.current.copy(anim.endTarget);
          camera.lookAt(currentCamTarget.current);
          if (anim.onComplete) anim.onComplete();
        }
      } else if (galleryMode === 'hallway') {
        // Smooth scroll damping in hallway
        scrollZRef.current = THREE.MathUtils.lerp(scrollZRef.current, targetScrollZRef.current, 0.08);
        camera.position.set(0, 1.7, scrollZRef.current);
        currentCamTarget.current.set(0, 1.7, scrollZRef.current - 10);
        camera.lookAt(currentCamTarget.current);
      }

      // Smooth door swing open/close animation
      doorsListRef.current.forEach((door) => {
        const targetAngle = door.isOpenState ? (door.side === 'left' ? -Math.PI * 0.48 : Math.PI * 0.48) : 0;
        door.doorPanel.rotation.y = THREE.MathUtils.lerp(door.doorPanel.rotation.y, targetAngle, 0.09);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen, certificates, galleryMode, enterRoom]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col select-none overflow-hidden"
      >
        {/* Top Header Bar */}
        <header className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
          {/* Left: Back Navigation */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700/80 shadow-lg backdrop-blur-md transition-all hover:-translate-x-0.5 cursor-pointer"
            >
              <span>←</span>
              <span>Back to 3D Globe</span>
              <span className="text-sm">🌍</span>
            </button>

            {galleryMode === 'inside_room' && (
              <button
                onClick={exitRoom}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border border-amber-500 shadow-lg transition-all cursor-pointer"
              >
                <span>🚪</span>
                <span>Back to Hallway</span>
              </button>
            )}
          </div>

          {/* Right: Hallway / Dynamic Certificate Tools */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <span>+</span>
              <span>Add Certificate</span>
            </button>
          </div>
        </header>

        {/* Three.js 3D Viewport */}
        <div ref={containerRef} className="w-full h-full cursor-grab" />

        {/* Hallway Exploration Guide Tooltip */}
        {galleryMode === 'hallway' && (
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center pointer-events-none z-20">
            <div className="bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/60 shadow-xl text-xs text-slate-200 flex items-center gap-2 font-medium">
              <span>💡 Scroll or drag to walk through the 3D hallway · Click on any door to enter room</span>
            </div>
            {hoveredCert && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-amber-400 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs shadow-md border border-amber-500"
              >
                Door #{hoveredCert.doorNumber || 101}: {hoveredCert.title}
              </motion.div>
            )}
          </div>
        )}

        {/* Inside Certificate Room: Full Details & Certificate Display */}
        {galleryMode === 'inside_room' && selectedCert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 inset-x-4 sm:inset-x-12 max-w-4xl mx-auto z-30 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6"
          >
            {/* Header / Room Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider">
                  <span>ROOM #{selectedCert.doorNumber || 101}</span>
                  <span>·</span>
                  <span>{selectedCert.category}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedCert.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>Issued by: <strong className="text-slate-200">{selectedCert.issuer}</strong></span>
                  <span>·</span>
                  <span>{selectedCert.issueDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomedInCert(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  🔍 Zoom In
                </button>
                {selectedCert.verificationUrl && (
                  <a
                    href={selectedCert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    Verify Credential ↗
                  </a>
                )}
              </div>
            </div>

            {/* Description & Competencies */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedCert.description}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Validated Skills:</span>
                {selectedCert.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Between Rooms */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <button
                onClick={() => navigateRoom('prev')}
                disabled={activeRoomIndex === 0}
                className="hover:text-white disabled:opacity-30 flex items-center gap-1 font-bold cursor-pointer"
              >
                ← Previous Room
              </button>

              <span className="font-mono text-[11px] text-slate-500">
                Credential ID: {selectedCert.credentialId}
              </span>

              <button
                onClick={() => navigateRoom('next')}
                disabled={activeRoomIndex === certificates.length - 1}
                className="hover:text-white disabled:opacity-30 flex items-center gap-1 font-bold cursor-pointer"
              >
                Next Room →
              </button>
            </div>
          </motion.div>
        )}

        {/* High-Resolution Fullscreen Certificate Document Zoom Modal */}
        {isZoomedInCert && selectedCert && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 border-4 border-amber-400 space-y-6"
            >
              <button
                onClick={() => setIsZoomedInCert(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 font-bold"
              >
                ✕
              </button>

              <div className="text-center space-y-2 border-b border-slate-200 pb-6">
                <div className="text-xs font-mono font-bold tracking-widest text-teal-800 uppercase">
                  OFFICIAL CERTIFICATE OF MASTERY
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Presented to <strong className="text-slate-900 font-bold">devaroopa</strong> for verified technical execution
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed text-center max-w-lg mx-auto">
                <p>{selectedCert.description}</p>
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {selectedCert.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{selectedCert.issuer}</div>
                  <div className="text-slate-500 text-[11px] font-mono">{selectedCert.issueDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-700 font-bold font-mono">VERIFIED</div>
                  <div className="text-slate-500 text-[11px] font-mono">{selectedCert.credentialId}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Certificate Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">Add Dynamic Certificate</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddNewCert} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Certified WebGL Shader Engineer"
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    placeholder="e.g. Khronos Group / Google"
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                    >
                      <option value="3D Graphics & Spatial">3D Graphics & Spatial</option>
                      <option value="Frontend Engineering">Frontend Engineering</option>
                      <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                      <option value="UI/UX & Design">UI/UX & Design</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Issue Date</label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      placeholder="e.g. November 2024"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                    >
                    </input>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Key Skills (comma separated)</label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="GLSL, WebGL, Shader Optimization"
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief description of verified abilities..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all"
                  >
                    {isSubmitting ? 'Creating Door...' : 'Create 3D Door & Room →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
