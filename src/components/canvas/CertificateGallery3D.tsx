import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { CertificateItem } from '../../types';
import { sound } from '../../utils/audio';

interface CertificateGallery3DProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: CertificateItem[];
  activeCertId?: string | null;
  onRoomChange?: (certId: string | null) => void;
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

// Procedural texture generator for sketch wood plank flooring
function createSketchWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm white / light paper base
  ctx.fillStyle = '#f3f2ee';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle wood tint variation across planks
  const numPlanks = 8;
  const plankWidth = 1024 / numPlanks;

  for (let i = 0; i < numPlanks; i++) {
    const x = i * plankWidth;
    // Slight warm tint variation per plank
    const tintAlpha = (i % 2 === 0) ? 0.04 : 0.08;
    ctx.fillStyle = `rgba(180, 160, 140, ${tintAlpha})`;
    ctx.fillRect(x, 0, plankWidth, 1024);

    // Black ink plank divider line
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();

    // Plank end joints (staggered horizontal cuts)
    const cutY = ((i * 380) % 800) + 120;
    ctx.beginPath();
    ctx.moveTo(x, cutY);
    ctx.lineTo(x + plankWidth, cutY);
    ctx.stroke();

    // Hand-drawn sketch wood grain curves inside each plank
    ctx.strokeStyle = 'rgba(24, 24, 27, 0.45)';
    ctx.lineWidth = 1.6;
    for (let g = 0; g < 6; g++) {
      const gx = x + 10 + g * (plankWidth / 6.5);
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.bezierCurveTo(
        gx + (Math.sin(g + i) * 12),
        340,
        gx - (Math.cos(g + i) * 12),
        680,
        gx + (Math.sin(g * 2) * 6),
        1024
      );
      ctx.stroke();
    }

    // Sketch nail dots near cuts
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(x + 12, cutY - 14, 2.5, 0, Math.PI * 2);
    ctx.arc(x + plankWidth - 12, cutY - 14, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 12, cutY + 14, 2.5, 0, Math.PI * 2);
    ctx.arc(x + plankWidth - 12, cutY + 14, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

// Procedural sketch door plaque texture
function createSketchPlaqueTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // White placard background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 160);

  // Black sketch border
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 492, 140);

  // Corner sketch screws
  ctx.fillStyle = '#18181b';
  [
    [22, 22],
    [490, 22],
    [22, 138],
    [490, 138],
  ].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Text
  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), 256, 82);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural colorful badges texture on door panel (Instagram / YouTube / TikTok / WebGL style)
// Procedural colorful badges texture on door panel (Instagram / YouTube / TikTok / WebGL style)
function createDoorBadgesTexture(cert: CertificateItem, doorNum: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm honey wood base
  ctx.fillStyle = '#d9822b';
  ctx.fillRect(0, 0, 512, 1024);

  // Wood grain strokes
  ctx.strokeStyle = 'rgba(100, 45, 10, 0.22)';
  ctx.lineWidth = 3;
  for (let y = 0; y < 1024; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(150, y + 20, 350, y - 20, 512, y);
    ctx.stroke();
  }

  // Black panel inner borders
  ctx.strokeStyle = '#3a1e05';
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 40, 452, 430);
  ctx.strokeRect(30, 510, 452, 460);

  // Top badge: Door Number Badge
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.roundRect(146, 90, 220, 95, [24]);
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 44px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`#${doorNum}`, 256, 138);

  // Middle badge: Icon Circle
  const icon = cert.badgeIcon || '📜';
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(256, 290, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.font = '65px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 256, 295);

  // Bottom section: Category Ribbon / Name
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(46, 620, 420, 130, [22]);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('EXHIBITION ROOM', 256, 658);

  ctx.fillStyle = '#ffffff';
  const cat = cert?.category || 'Certificate';
  const catShort = cat.length > 22 ? cat.slice(0, 20) + '..' : cat;
  ctx.fillText(catShort.toUpperCase(), 256, 705);

  // Gold Star Stamp
  ctx.fillStyle = '#f59e0b';
  ctx.font = '32px sans-serif';
  ctx.fillText('★ ★ ★', 256, 820);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural high-resolution parchment certificate for the 3D room wall
function createCertificateWallTexture(cert: CertificateItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Parchment paper background
  ctx.fillStyle = '#fffdfa';
  ctx.fillRect(0, 0, 1024, 768);

  // Elegant gold & dark slate borders
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 10;
  ctx.strokeRect(28, 28, 968, 712);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.strokeRect(44, 44, 936, 680);

  // Corner decorative flourishes
  ctx.fillStyle = '#d97706';
  [[52, 52], [972, 52], [52, 716], [972, 716]].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top header
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF MASTERY', 512, 115);

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 38px sans-serif';
  const title = cert.title.length > 34 ? cert.title.slice(0, 34) + '...' : cert.title;
  ctx.fillText(title, 512, 205);

  // Recipient
  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 24px serif';
  ctx.fillText('Presented with distinction to', 512, 275);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('DEVAROOPA', 512, 345);

  // Underline
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 370);
  ctx.lineTo(724, 370);
  ctx.stroke();

  // Category & Issuer
  ctx.fillStyle = '#334155';
  ctx.font = '22px sans-serif';
  ctx.fillText(`Verified expertise in ${cert.category}`, 512, 435);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`Issued by: ${cert.issuer}`, 512, 500);

  // Gold Seal on bottom right
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(820, 600, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('VERIFIED', 820, 605);

  // Date on bottom left
  ctx.fillStyle = '#64748b';
  ctx.font = '20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Date: ${cert.issueDate}`, 120, 620);

  return new THREE.CanvasTexture(canvas);
}

export const CertificateGallery3D: React.FC<CertificateGallery3DProps> = ({
  isOpen,
  onClose,
  certificates,
  activeCertId,
  onRoomChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Gallery Navigation State
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number | null>(null);
  const activeRoomIndexRef = useRef<number | null>(null);
  activeRoomIndexRef.current = activeRoomIndex;
  const [galleryMode, setGalleryMode] = useState<'hallway' | 'entering' | 'inside_room'>('hallway');
  const [hoveredCert, setHoveredCert] = useState<CertificateItem | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  const galleryModeRef = useRef(galleryMode);
  galleryModeRef.current = galleryMode;

  const certificatesRef = useRef(certificates);
  certificatesRef.current = certificates;

  const hoveredCertIdRef = useRef<string | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const doorsListRef = useRef<DoorObjectRef[]>([]);
  const clickableMeshesRef = useRef<{ mesh: THREE.Object3D; certId: string; index: number }[]>([]);

  // Camera Animation Controller (supports direct glides and cinematic hallway walks)
  interface CameraAnimation {
    active: boolean;
    type: 'direct' | 'walk';
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    fromDoorZ?: number;
    toDoorZ?: number;
    targetDoorIndex?: number;
    doorOpenTriggered?: boolean;
    walkDir?: number;
    progress: number;
    duration: number;
    onComplete?: () => void;
  }

  const camAnimRef = useRef<CameraAnimation>({
    active: false,
    type: 'direct',
    startPos: new THREE.Vector3(0, 1.7, 7.2),
    endPos: new THREE.Vector3(0, 1.7, 7.2),
    startTarget: new THREE.Vector3(0, 1.7, -10),
    endTarget: new THREE.Vector3(0, 1.7, -10),
    progress: 1,
    duration: 1.0,
  });

  const currentCamTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.7, -10));

  // Hallway walk / scroll position (starts zoomed out at 7.2 for an open, comfortable perspective)
  const scrollZRef = useRef<number>(7.2);
  const targetScrollZRef = useRef<number>(7.2);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseYRef = useRef<number>(0);

  // Helper for simple direct camera glide (e.g. exiting room)
  const animateCameraTo = useCallback(
    (pos: THREE.Vector3, target: THREE.Vector3, duration: number = 1.0, onComplete?: () => void) => {
      if (!cameraRef.current) return;
      camAnimRef.current = {
        active: true,
        type: 'direct',
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

  // Enter a Door & Room with realistic walking motion and sequential door opening
  const enterRoom = useCallback(
    (index: number) => {
      if (index < 0 || index >= certificates.length) return;
      const targetDoor = doorsListRef.current[index];
      if (!targetDoor) return;

      const cert = certificates[index];
      const prevIdx = activeRoomIndexRef.current;
      setActiveRoomIndex(index);
      activeRoomIndexRef.current = index;
      setGalleryMode('entering');
      setSelectedCert(null);
      sound.playClick();
      sound.playZoom();

      // If moving from a previously open door, start closing it immediately as we leave
      if (prevIdx !== null && prevIdx !== index && doorsListRef.current[prevIdx]) {
        doorsListRef.current[prevIdx].isOpenState = false;
      }

      onRoomChange?.(cert.id);

      if (!cameraRef.current) return;

      const prevDoor = prevIdx !== null && prevIdx !== index ? doorsListRef.current[prevIdx] : null;
      const fromZ = prevDoor ? prevDoor.doorPos.z : cameraRef.current.position.z;
      const toZ = targetDoor.doorPos.z;
      const walkDir = toZ >= fromZ ? 1 : -1;

      // Keep hallway scroll position updated with destination door
      scrollZRef.current = targetDoor.doorPos.z + 1.6;
      targetScrollZRef.current = targetDoor.doorPos.z + 1.6;

      // Start realistic walking camera transition (1.35s cinematic hallway walk)
      camAnimRef.current = {
        active: true,
        type: 'walk',
        startPos: cameraRef.current.position.clone(),
        endPos: targetDoor.hallCamPos.clone(),
        startTarget: currentCamTarget.current.clone(),
        endTarget: targetDoor.hallCamTarget.clone(),
        fromDoorZ: fromZ,
        toDoorZ: toZ,
        walkDir: walkDir,
        targetDoorIndex: index,
        doorOpenTriggered: false,
        progress: 0,
        duration: 1.35,
        onComplete: () => {
          setSelectedCert(cert);
          setGalleryMode('inside_room');
          sound.playChime();
        },
      };
    },
    [certificates, onRoomChange]
  );

  // Exit Room back to Hallway (Close popup & door, reset camera)
  const exitRoom = useCallback(() => {
    const curIdx = activeRoomIndexRef.current;
    if (curIdx !== null) {
      const doorObj = doorsListRef.current[curIdx];
      if (doorObj) {
        doorObj.isOpenState = false;
      }
    }
    sound.playClick();
    setSelectedCert(null);
    setIsImageZoomed(false);
    setActiveRoomIndex(null);
    activeRoomIndexRef.current = null;
    setGalleryMode('hallway');
    onRoomChange?.(null);

    if (cameraRef.current) {
      const hallZ = curIdx !== null && doorsListRef.current[curIdx]
        ? doorsListRef.current[curIdx].doorPos.z + 1.6
        : scrollZRef.current;
      scrollZRef.current = hallZ;
      targetScrollZRef.current = hallZ;

      animateCameraTo(
        new THREE.Vector3(0, 1.7, hallZ),
        new THREE.Vector3(0, 1.7, hallZ - 10),
        0.85
      );
    }
  }, [animateCameraTo, onRoomChange]);

  // Navigate to Next / Previous Room
  const navigateRoom = useCallback(
    (direction: 'next' | 'prev') => {
      const curIdx = activeRoomIndexRef.current;
      if (curIdx === null) return;
      const newIndex = direction === 'next' ? curIdx + 1 : curIdx - 1;
      if (newIndex >= 0 && newIndex < certificates.length) {
        enterRoom(newIndex);
      }
    },
    [certificates.length, enterRoom]
  );

  // Sync activeCertId from external URL prop
  useEffect(() => {
    if (!isOpen) return;
    if (activeCertId) {
      const idx = certificates.findIndex(
        (c) => c.id === activeCertId || String(c.doorNumber) === activeCertId
      );
      if (idx !== -1 && idx !== activeRoomIndexRef.current) {
        let attempts = 0;
        let timer: any = null;
        const checkAndEnter = () => {
          if (doorsListRef.current[idx]) {
            enterRoom(idx);
          } else if (attempts < 20) {
            attempts++;
            timer = setTimeout(checkAndEnter, 100);
          }
        };
        timer = setTimeout(checkAndEnter, 350);
        return () => {
          if (timer) clearTimeout(timer);
        };
      }
    } else if (!activeCertId && activeRoomIndexRef.current !== null) {
      exitRoom();
    }
  }, [activeCertId, isOpen, certificates, enterRoom, exitRoom]);

  // Keyboard navigation: Escape to close/back, Left/Right arrows to browse certificates
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isImageZoomed) {
          setIsImageZoomed(false);
        } else if (selectedCert || activeRoomIndexRef.current !== null) {
          exitRoom();
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && selectedCert) {
        navigateRoom('next');
      } else if (e.key === 'ArrowLeft' && selectedCert) {
        navigateRoom('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isImageZoomed, selectedCert, exitRoom, onClose, navigateRoom]);

  const enterRoomRef = useRef(enterRoom);
  enterRoomRef.current = enterRoom;



  // --- THREE.JS INITIALIZATION & SCENE SETUP ---
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera (Warm White and Black Sketch Aesthetic)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf5f5f4); // Bright warm white / sketch paper
    scene.fog = new THREE.FogExp2(0xf5f5f4, 0.022);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.7, 7.2);
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Bright Warm White Ambient & Key Lights
    const ambient = new THREE.AmbientLight(0xfffefb, 1.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 0.8);
    dirLight.position.set(0, 6, 4);
    scene.add(dirLight);

    // 4. Materials (Black & Warm White Sketch Theme)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfafaf9, // Warm off-white wall
      roughness: 0.95,
      metalness: 0.0,
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5f4,
      roughness: 0.95,
    });

    // Floor texture: procedural hand-sketched wood plank perspective
    const floorTexture = createSketchWoodFloorTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.5,
      metalness: 0.05,
    });

    // Black ink line materials
    const blackInkMat = new THREE.MeshBasicMaterial({
      color: 0x18181b,
    });

    const blackTrimMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8,
    });

    const brassHandleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.8,
      roughness: 0.3,
    });

    // Hallway geometry calculation
    const doorSpacing = 5.2;
    const numDoors = Math.max(certificates.length, 4);
    const hallwayLength = (numDoors / 2 + 1) * doorSpacing + 16;
    const hallwayWidth = 4.6;
    const hallwayHeight = 4.2;

    const hallwayStartZ = 10.0;
    const hallwayEndZ = -hallwayLength + 6.0;
    const totalHallwayLen = hallwayStartZ - hallwayEndZ;
    const hallwayMidZ = (hallwayStartZ + hallwayEndZ) / 2;

    // Floor Plane
    const floorGeo = new THREE.PlaneGeometry(hallwayWidth, totalHallwayLen);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, hallwayMidZ);
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling Plane
    const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, hallwayHeight, hallwayMidZ);
    scene.add(ceiling);

    // Left & Right Walls with Clean Openings for Doors (prevents walls from blocking door interiors)
    const numPairs = Math.ceil(certificates.length / 2);
    const firstDoorZ = 1.0;
    const lastPairIdx = Math.max(0, numPairs - 1);
    const lastDoorZ = firstDoorZ - lastPairIdx * doorSpacing;

    [-hallwayWidth / 2, hallwayWidth / 2].forEach((sideX) => {
      const isLeftWall = sideX < 0;
      const rotY = isLeftWall ? Math.PI / 2 : -Math.PI / 2;

      // 1. Front wall section (from z = firstDoorZ + 0.8 to hallwayStartZ)
      const frontLen = hallwayStartZ - (firstDoorZ + 0.8);
      if (frontLen > 0.1) {
        const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(frontLen, hallwayHeight), wallMat);
        frontWall.rotation.y = rotY;
        frontWall.position.set(sideX, hallwayHeight / 2, (hallwayStartZ + firstDoorZ + 0.8) / 2);
        frontWall.receiveShadow = true;
        scene.add(frontWall);
      }

      // 2. Doorway lintels (above each door) and wall piers (between doors)
      for (let p = 0; p < numPairs; p++) {
        const pairDoorZ = firstDoorZ - p * doorSpacing;

        // Top lintel wall above door opening (from y = 2.65 to hallwayHeight)
        const lintelHeight = hallwayHeight - 2.65;
        const lintelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, lintelHeight), wallMat);
        lintelMesh.rotation.y = rotY;
        lintelMesh.position.set(sideX, 2.65 + lintelHeight / 2, pairDoorZ);
        lintelMesh.receiveShadow = true;
        scene.add(lintelMesh);

        // Wall segment between this door and next door
        if (p < numPairs - 1) {
          const midLen = doorSpacing - 1.6;
          const midZ = pairDoorZ - doorSpacing / 2;
          const midWall = new THREE.Mesh(new THREE.PlaneGeometry(midLen, hallwayHeight), wallMat);
          midWall.rotation.y = rotY;
          midWall.position.set(sideX, hallwayHeight / 2, midZ);
          midWall.receiveShadow = true;
          scene.add(midWall);
        }
      }

      // 3. Back wall section (from lastDoorZ - 0.8 to hallwayEndZ)
      const backLen = (lastDoorZ - 0.8) - hallwayEndZ;
      if (backLen > 0.1) {
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(backLen, hallwayHeight), wallMat);
        backWall.rotation.y = rotY;
        backWall.position.set(sideX, hallwayHeight / 2, (lastDoorZ - 0.8 + hallwayEndZ) / 2);
        backWall.receiveShadow = true;
        scene.add(backWall);
      }
    });

    // End Wall (Bright warm glow at end of hallway)
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayWidth, hallwayHeight), wallMat);
    endWall.position.set(0, hallwayHeight / 2, hallwayEndZ);
    scene.add(endWall);

    // End Wall Sketched Window/Arch
    const archEnd = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 3.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    archEnd.position.set(0, 2.0, hallwayEndZ + 0.02);
    scene.add(archEnd);

    // Sketched Black Baseboards along hallway edges
    [-hallwayWidth / 2 + 0.04, hallwayWidth / 2 - 0.04].forEach((bx) => {
      const baseboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.15, totalHallwayLen),
        blackTrimMat
      );
      baseboard.position.set(bx, 0.075, hallwayMidZ);
      scene.add(baseboard);

      // Crown molding at top
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.12, totalHallwayLen),
        blackTrimMat
      );
      crown.position.set(bx, hallwayHeight - 0.06, hallwayMidZ);
      scene.add(crown);
    });

    // Hallway Decor: Sketched Console Table with Plant (on the left side like in reference image)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(-hallwayWidth / 2 + 0.4, 0, -1.0);
    scene.add(tableGroup);

    // Table Top
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 1.4), blackTrimMat);
    tableTop.position.set(0, 1.1, 0);
    tableGroup.add(tableTop);

    // Table Legs
    [
      [-0.22, -0.6],
      [0.22, -0.6],
      [-0.22, 0.6],
      [0.22, 0.6],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.1, 0.04), blackTrimMat);
      leg.position.set(lx, 0.55, lz);
      tableGroup.add(leg);
    });

    // Potted plant on table (Sketch wireframe vase & plant)
    const vaseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.08, 0.25, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    );
    vaseMesh.position.set(0, 1.25, 0);
    tableGroup.add(vaseMesh);

    const plantMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.18),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 })
    );
    plantMesh.position.set(0, 1.45, 0);
    tableGroup.add(plantMesh);

    // 5. Dynamic Doors Generation for Certificates (with Colored Panels & Sketch Badges)
    const doorsList: DoorObjectRef[] = [];
    const clickableList: { mesh: THREE.Object3D; certId: string; index: number }[] = [];

    // Distinct warm rich door colors
    const doorColorPalette = [
      0xd97706, // Warm Honey Amber (like screenshot)
      0xc2410c, // Rich Terracotta
      0x0284c7, // Vibrant Ocean Blue
      0x059669, // Emerald Jade
      0x7c3aed, // Royal Violet
      0xdb2777, // Vibrant Rose
    ];

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

      // Black Sketched Door Frame Arch
      const frameGeo = new THREE.BoxGeometry(1.6, 2.65, 0.16);
      const doorFrame = new THREE.Mesh(frameGeo, blackTrimMat);
      doorFrame.position.set(0, 1.325, 0);
      doorFrame.castShadow = true;
      doorRoot.add(doorFrame);

      // Pivoting Door Panel (Hinged at left edge of door frame)
      const doorPanelGroup = new THREE.Group();
      doorPanelGroup.position.set(-0.6, 0, 0); // Hinge pivot point
      doorRoot.add(doorPanelGroup);

      // Door Badge Canvas Texture (social & skill icons like in user reference image)
      const doorBadgeTex = createDoorBadgesTexture(cert, cert.doorNumber || (101 + idx));
      const coloredDoorMat = new THREE.MeshStandardMaterial({
        map: doorBadgeTex,
        color: doorColorPalette[idx % doorColorPalette.length],
        roughness: 0.4,
        metalness: 0.1,
      });

      const panelMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.4, 0.08),
        coloredDoorMat
      );
      panelMesh.position.set(0.6, 1.2, 0);
      panelMesh.castShadow = true;
      doorPanelGroup.add(panelMesh);

      // Black Outlines on Door Panels
      [-0.3, 0.3].forEach((mx) => {
        [-0.45, 0.45].forEach((my) => {
          const moldingLine = new THREE.Mesh(
            new THREE.BoxGeometry(0.44, 0.72, 0.01),
            blackInkMat
          );
          moldingLine.position.set(0.6 + mx, 1.2 + my, 0.045);
          doorPanelGroup.add(moldingLine);
        });
      });

      // Brass Door Handle Lever
      const handleMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8),
        brassHandleMat
      );
      handleMesh.rotation.z = Math.PI / 2;
      handleMesh.position.set(1.05, 1.1, 0.08);
      doorPanelGroup.add(handleMesh);

      // Sketched Plaque above door ("DOOR 101" / "DOOR 102")
      const plaqueTitle = `DOOR ${cert.doorNumber || (101 + idx)}`;
      const plaqueTexture = createSketchPlaqueTexture(plaqueTitle);
      const plaqueMat = new THREE.MeshBasicMaterial({
        map: plaqueTexture,
      });

      const plaqueMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.28),
        plaqueMat
      );
      plaqueMesh.position.set(0, 2.85, 0.1);
      doorRoot.add(plaqueMesh);

      // --- EXHIBITION ROOM INTERIOR BEHIND THE DOOR ---
      const roomDepth = 3.2;
      const roomWidth = 3.2;
      const roomHeight = 3.6;

      const roomGroup = new THREE.Group();
      doorRoot.add(roomGroup);

      // Room Floor
      const roomFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 })
      );
      roomFloor.rotation.x = -Math.PI / 2;
      roomFloor.position.set(0, 0, -roomDepth / 2);
      roomGroup.add(roomFloor);

      // Room Ceiling
      const roomCeiling = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomDepth),
        ceilingMat
      );
      roomCeiling.rotation.x = Math.PI / 2;
      roomCeiling.position.set(0, roomHeight, -roomDepth / 2);
      roomGroup.add(roomCeiling);

      // Room Back Wall (facing doorway)
      const roomBackWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomWidth, roomHeight),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 })
      );
      roomBackWall.position.set(0, roomHeight / 2, -roomDepth);
      roomGroup.add(roomBackWall);

      // Room Left Wall
      const roomLeftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, roomHeight),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 })
      );
      roomLeftWall.rotation.y = Math.PI / 2;
      roomLeftWall.position.set(-roomWidth / 2, roomHeight / 2, -roomDepth / 2);
      roomGroup.add(roomLeftWall);

      // Room Right Wall
      const roomRightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, roomHeight),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 })
      );
      roomRightWall.rotation.y = -Math.PI / 2;
      roomRightWall.position.set(roomWidth / 2, roomHeight / 2, -roomDepth / 2);
      roomGroup.add(roomRightWall);

      // Warm Room Spotlight inside room
      const roomSpot = new THREE.PointLight(0xfef08a, 2.8, 8, 1.2);
      roomSpot.position.set(0, 2.9, -1.6);
      roomGroup.add(roomSpot);

      // Framed Certificate on Room Back Wall!
      const frameGroup = new THREE.Group();
      frameGroup.position.set(0, 1.7, -roomDepth + 0.08);
      roomGroup.add(frameGroup);

      const frameMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.36, 1.68, 0.08),
        blackTrimMat
      );
      frameGroup.add(frameMesh);

      // Backing mat for paper look
      const matMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.26, 1.58),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
      );
      matMesh.position.z = 0.045;
      frameGroup.add(matMesh);

      const certMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.02,
      });

      if (cert.imageUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(cert.imageUrl, (loadedTex) => {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          loadedTex.minFilter = THREE.LinearFilter;
          loadedTex.magFilter = THREE.LinearFilter;
          certMat.map = loadedTex;
          certMat.needsUpdate = true;
        });
      } else {
        const certWallTex = createCertificateWallTexture(cert);
        certMat.map = certWallTex;
      }

      const certWallMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.18, 1.5),
        certMat
      );
      certWallMesh.position.z = 0.05;
      frameGroup.add(certWallMesh);

      // Tag all meshes with certIndex for instant raycasting
      doorRoot.userData = { certIndex: idx, certId: cert.id };
      doorRoot.traverse((child) => {
        child.userData = { certIndex: idx, certId: cert.id };
      });

      // Calculate camera coordinates for room entry
      const hallCamPos = new THREE.Vector3(
        isLeft ? -0.9 : 0.9,
        1.7,
        doorZ
      );
      const hallCamTarget = new THREE.Vector3(
        doorX + (isLeft ? -3.0 : 3.0),
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
        roomLight: roomSpot,
        doorPos: new THREE.Vector3(doorX, 0, doorZ),
        roomCamPos: roomCamPos,
        roomCamTarget: roomCamTarget,
        hallCamPos: hallCamPos,
        hallCamTarget: hallCamTarget,
        isOpenState: false,
        side: isLeft ? 'left' : 'right',
      });

      clickableList.push({ mesh: doorRoot, certId: cert.id, index: idx });
    });

    doorsListRef.current = doorsList;
    clickableMeshesRef.current = clickableList;
    const cachedClickableMeshes = clickableList.map((c) => c.mesh);

    // 6. Raycasting & Mouse / Touch Navigation Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastRaycastTime = 0;
    const pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseYRef.current = e.clientY;
      pointerDownPos.x = e.clientX;
      pointerDownPos.y = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Drag to scroll along corridor when in hallway mode
      if (isDraggingRef.current && galleryModeRef.current === 'hallway') {
        const deltaY = e.clientY - lastMouseYRef.current;
        targetScrollZRef.current += deltaY * 0.015;
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(8.0, targetScrollZRef.current));
        lastMouseYRef.current = e.clientY;
      }

      // Raycasting for door hovering
      if (galleryModeRef.current === 'hallway') {
        const now = performance.now();
        if (now - lastRaycastTime > 40 && camera) {
          lastRaycastTime = now;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(cachedClickableMeshes, true);

          let matchedIdx: number | null = null;
          if (intersects.length > 0) {
            for (const hit of intersects) {
              let curr: THREE.Object3D | null = hit.object;
              while (curr) {
                if (curr.userData && typeof curr.userData.certIndex === 'number') {
                  matchedIdx = curr.userData.certIndex;
                  break;
                }
                curr = curr.parent;
              }
              if (matchedIdx !== null) break;
            }
          }

          if (matchedIdx !== null) {
            const cert = certificatesRef.current[matchedIdx];
            if (hoveredCertIdRef.current !== cert?.id) {
              hoveredCertIdRef.current = cert?.id || null;
              setHoveredCert(cert || null);
            }
            container.style.cursor = 'pointer';
            return;
          }

          if (hoveredCertIdRef.current !== null) {
            hoveredCertIdRef.current = null;
            setHoveredCert(null);
          }
          container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
        }
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);

      // Click to enter door
      if (moveDist < 10 && galleryModeRef.current === 'hallway') {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cachedClickableMeshes, true);

        if (intersects.length > 0) {
          let matchedIdx: number | null = null;
          for (const hit of intersects) {
            let curr: THREE.Object3D | null = hit.object;
            while (curr) {
              if (curr.userData && typeof curr.userData.certIndex === 'number') {
                matchedIdx = curr.userData.certIndex;
                break;
              }
              curr = curr.parent;
            }
            if (matchedIdx !== null) break;
          }

          if (matchedIdx !== null) {
            enterRoomRef.current(matchedIdx);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (galleryModeRef.current === 'hallway') {
        targetScrollZRef.current -= e.deltaY * 0.008;
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(8.0, targetScrollZRef.current));
      }
    };

    // Mobile touch controls
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastMouseYRef.current = e.touches[0].clientY;
        isDraggingRef.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current && galleryModeRef.current === 'hallway') {
        const deltaY = e.touches[0].clientY - lastMouseYRef.current;
        targetScrollZRef.current += deltaY * 0.015;
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(8.0, targetScrollZRef.current));
        lastMouseYRef.current = e.touches[0].clientY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      isDraggingRef.current = false;
      if (e.changedTouches.length === 1 && galleryModeRef.current === 'hallway') {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.hypot(dx, dy) < 12) {
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.changedTouches[0].clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.changedTouches[0].clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(cachedClickableMeshes, true);
          if (intersects.length > 0) {
            let matchedIdx: number | null = null;
            for (const hit of intersects) {
              let curr: THREE.Object3D | null = hit.object;
              while (curr) {
                if (curr.userData && typeof curr.userData.certIndex === 'number') {
                  matchedIdx = curr.userData.certIndex;
                  break;
                }
                curr = curr.parent;
              }
              if (matchedIdx !== null) break;
            }
            if (matchedIdx !== null) {
              enterRoomRef.current(matchedIdx);
            }
          }
        }
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

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

      // Smooth camera lerp / walk animation during room transitions
      const anim = camAnimRef.current;
      if (anim.active) {
        const frameStep = 1 / (Math.max(anim.duration, 0.4) * 60);
        anim.progress += frameStep;
        const t = Math.min(1, anim.progress);

        if (anim.type === 'walk') {
          // Cinematic 3-stage walking transition between doors
          const fromZ = anim.fromDoorZ ?? anim.startPos.z;
          const toZ = anim.toDoorZ ?? anim.endPos.z;
          const isSameZ = Math.abs(toZ - fromZ) < 0.1;
          const walkDir = anim.walkDir ?? (toZ >= fromZ ? 1 : -1);

          // Sub-stage 1: Step out of current doorway into the hallway center (0 to 0.28)
          if (t < 0.28) {
            const s1 = t / 0.28;
            const e1 = s1 * s1 * (3 - 2 * s1); // smoothstep
            const midStepZ = fromZ + (isSameZ ? 1.4 : walkDir * 0.4);

            camera.position.x = THREE.MathUtils.lerp(anim.startPos.x, 0, e1);
            camera.position.y = 1.7;
            camera.position.z = THREE.MathUtils.lerp(anim.startPos.z, midStepZ, e1);

            // Turn look target from doorway to facing down the hallway towards target door
            const hallLookZ = midStepZ + (isSameZ ? -8 : walkDir * 8);
            currentCamTarget.current.lerpVectors(
              anim.startTarget,
              new THREE.Vector3(0, 1.7, hallLookZ),
              e1
            );
          }
          // Sub-stage 2: Walk down the center corridor with rhythmic head-bob (0.28 to 0.72)
          else if (t < 0.72) {
            const s2 = (t - 0.28) / 0.44;
            const e2 = s2 < 0.5 ? 2 * s2 * s2 : 1 - Math.pow(-2 * s2 + 2, 2) / 2; // smooth easeInOut
            const midStartZ = fromZ + (isSameZ ? 1.4 : walkDir * 0.4);

            camera.position.x = 0;
            // Rhythmic natural walking head-bob
            camera.position.y = 1.7 + Math.sin(s2 * Math.PI * 4) * 0.038;
            camera.position.z = THREE.MathUtils.lerp(midStartZ, toZ, e2);

            // Look forward down the hallway
            const hallLookZ = camera.position.z + (isSameZ ? (anim.endPos.x > 0 ? 3 : -3) : walkDir * 8);
            currentCamTarget.current.set(0, 1.7, hallLookZ);

            // Open destination door ahead as we approach!
            if (s2 > 0.5 && !anim.doorOpenTriggered) {
              anim.doorOpenTriggered = true;
              if (anim.targetDoorIndex !== undefined && doorsListRef.current[anim.targetDoorIndex]) {
                doorsListRef.current[anim.targetDoorIndex].isOpenState = true;
                sound.playClick();
              }
            }
          }
          // Sub-stage 3: Turn and approach destination door (0.72 to 1.0)
          else {
            const s3 = (t - 0.72) / 0.28;
            const e3 = s3 * s3 * (3 - 2 * s3);

            camera.position.x = THREE.MathUtils.lerp(0, anim.endPos.x, e3);
            camera.position.y = 1.7;
            camera.position.z = THREE.MathUtils.lerp(toZ, anim.endPos.z, e3);

            // Smoothly turn look target directly into the open room
            const hallLookZ = toZ + (isSameZ ? (anim.endPos.x > 0 ? 3 : -3) : walkDir * 8);
            currentCamTarget.current.lerpVectors(
              new THREE.Vector3(0, 1.7, hallLookZ),
              anim.endTarget,
              e3
            );

            // Ensure destination door is open
            if (anim.targetDoorIndex !== undefined && doorsListRef.current[anim.targetDoorIndex]) {
              doorsListRef.current[anim.targetDoorIndex].isOpenState = true;
            }
          }

          camera.lookAt(currentCamTarget.current);
        } else {
          // Direct linear ease transition (used for exitRoom)
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
          currentCamTarget.current.lerpVectors(anim.startTarget, anim.endTarget, ease);
          camera.lookAt(currentCamTarget.current);
        }

        if (t >= 1) {
          anim.active = false;
          camera.position.copy(anim.endPos);
          currentCamTarget.current.copy(anim.endTarget);
          camera.lookAt(currentCamTarget.current);
          scrollZRef.current = anim.endPos.z;
          targetScrollZRef.current = anim.endPos.z;
          if (anim.onComplete) anim.onComplete();
        }
      } else if (galleryModeRef.current === 'hallway') {
        // Smooth scroll damping in hallway
        scrollZRef.current = THREE.MathUtils.lerp(scrollZRef.current, targetScrollZRef.current, 0.08);
        camera.position.set(0, 1.7, scrollZRef.current);
        currentCamTarget.current.set(0, 1.7, scrollZRef.current - 10);
        camera.lookAt(currentCamTarget.current);
      }

      // Smooth door swing open/close animation (swings inward into exhibition room for both sides)
      doorsListRef.current.forEach((door) => {
        const targetAngle = door.isOpenState ? Math.PI * 0.48 : 0;
        door.doorPanel.rotation.y = THREE.MathUtils.lerp(door.doorPanel.rotation.y, targetAngle, 0.095);
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
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-stone-100 text-slate-900 flex flex-col select-none overflow-hidden"
      >
        {/* Top Header Bar */}
        <header className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
          {/* Left: Back Navigation (Warm White with Black Outline) */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/95 hover:bg-stone-50 text-slate-950 text-xs font-bold rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-0.5 cursor-pointer"
            >
              <span>←</span>
              <span>Back to 3D Globe</span>
              <span className="text-sm">🌍</span>
            </button>

            {galleryMode === 'inside_room' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={exitRoom}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  <span>🚪</span>
                  <span>Back to Hallway</span>
                </button>
                {!selectedCert && activeRoomIndex !== null && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedCert(certificates[activeRoomIndex]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <span>📜</span>
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Three.js 3D Viewport */}
        <div ref={containerRef} className="w-full h-full cursor-grab" />

        {/* Hallway Exploration Guide Tooltip */}
        {galleryMode === 'hallway' && (
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center pointer-events-none z-20">
            <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs text-slate-900 flex items-center gap-2 font-bold pointer-events-auto">
              <span>💡 Drag / scroll hallway · Click any door to open & view certificate</span>
            </div>
            {hoveredCert && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  const idx = certificates.findIndex((c) => c.id === hoveredCert.id);
                  if (idx !== -1) enterRoom(idx);
                }}
                className="mt-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 px-5 py-2 rounded-xl font-black text-xs shadow-md border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] pointer-events-auto cursor-pointer transition-transform flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Open Door #{hoveredCert.doorNumber || 101}: {hoveredCert.title} →</span>
              </motion.button>
            )}
          </div>
        )}

        {/* Walking Transition Badge */}
        <AnimatePresence>
          {galleryMode === 'entering' && activeRoomIndex !== null && certificates[activeRoomIndex] && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none z-30"
            >
              <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-slate-950 flex items-center gap-3 pointer-events-auto">
                <span className="text-base select-none animate-bounce">🚶</span>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded-md font-mono text-[11px] border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  DOOR #{certificates[activeRoomIndex].doorNumber || (101 + activeRoomIndex)}
                </span>
                <span className="truncate max-w-[260px] sm:max-w-[420px] text-slate-900 font-bold">
                  {certificates[activeRoomIndex].title}
                </span>
                <span className="text-amber-500 font-mono text-sm animate-pulse">→</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Popup Modal (Opens with spring animation only after reaching the room doorway) */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
              onClick={exitRoom}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-white text-slate-950 rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-slate-900 space-y-3.5 my-auto max-h-[94vh] flex flex-col justify-between"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="px-3 py-1 bg-amber-400 text-slate-950 font-mono font-black text-xs rounded-lg border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      DOOR #{selectedCert.doorNumber || 101}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 truncate">
                      {selectedCert.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={exitRoom}
                      title="Back to hallway"
                      className="p-1.5 text-slate-400 hover:text-slate-950 transition-colors text-lg font-black cursor-pointer leading-none"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Real Certificate Image Preview Container */}
                {selectedCert.imageUrl && (
                  <div className="relative group rounded-xl overflow-hidden border-2 border-slate-900 bg-stone-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-1 flex items-center justify-center min-h-0">
                    <img
                      src={selectedCert.imageUrl}
                      alt={selectedCert.title}
                      className="w-full h-auto max-h-[68vh] sm:max-h-[72vh] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01] cursor-zoom-in"
                      onClick={() => setIsImageZoomed(true)}
                    />
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsImageZoomed(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold rounded-lg backdrop-blur-xs border border-white/20 shadow-md cursor-pointer transition-all hover:scale-105"
                      >
                        <span>🔍</span>
                        <span>Expand View</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Toolbar */}
                <div className="pt-2 border-t-2 border-slate-900 flex items-center justify-between text-xs">
                  <button
                    disabled={activeRoomIndex === null || activeRoomIndex <= 0}
                    onClick={() => navigateRoom('prev')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
                  >
                    <span>←</span>
                    <span>Prev Door</span>
                  </button>

                  <div className="font-mono text-slate-600 font-bold text-center">
                    Door {(activeRoomIndex ?? 0) + 1} of {certificates.length}
                  </div>

                  <button
                    disabled={activeRoomIndex === null || activeRoomIndex >= certificates.length - 1}
                    onClick={() => navigateRoom('next')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
                  >
                    <span>Next Door</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Lightbox for In-Depth Certificate Inspection */}
        <AnimatePresence>
          {isImageZoomed && selectedCert && selectedCert.imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6"
              onClick={() => setIsImageZoomed(false)}
            >
              <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3 pointer-events-auto">
                <div className="flex items-center gap-2 truncate">
                  <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-mono font-black text-xs rounded-md">
                    DOOR #{selectedCert.doorNumber || 101}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base truncate">
                    {selectedCert.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsImageZoomed(false)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg transition-all cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[85vh] max-w-full flex items-center justify-center overflow-auto"
              >
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/20"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

