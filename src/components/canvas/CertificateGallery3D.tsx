import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { CertificateItem } from '../../types';
import { sound } from '../../utils/audio';

interface CertificateGallery3DProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: CertificateItem[];
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
function createDoorBadgesTexture(category: string, doorNum: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Warm honey wood base
  ctx.fillStyle = '#d9822b';
  ctx.fillRect(0, 0, 512, 1024);

  // Wood grain strokes
  ctx.strokeStyle = 'rgba(100, 45, 10, 0.25)';
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

  // Top badge: Instagram/Gradient pink badge
  const g1 = ctx.createLinearGradient(180, 100, 330, 250);
  g1.addColorStop(0, '#f58529');
  g1.addColorStop(0.5, '#dd2a7b');
  g1.addColorStop(1, '#8134af');
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.roundRect(196, 120, 120, 120, [26]);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.strokeRect(226, 150, 60, 60);
  ctx.beginPath();
  ctx.arc(256, 180, 15, 0, Math.PI * 2);
  ctx.stroke();

  // Middle badge: TikTok / Spatial badge
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(196, 270, 120, 120, [26]);
  ctx.fill();
  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 65px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡', 256, 330);

  // Bottom badge: YouTube red / Certification play badge
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(166, 620, 180, 120, [28]);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(240, 655);
  ctx.lineTo(285, 680);
  ctx.lineTo(240, 705);
  ctx.closePath();
  ctx.fill();

  // Category Tag badge
  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(category.slice(0, 18), 256, 820);

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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Gallery Navigation State
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number | null>(null);
  const [galleryMode, setGalleryMode] = useState<'hallway' | 'entering' | 'inside_room'>('hallway');
  const [hoveredCert, setHoveredCert] = useState<CertificateItem | null>(null);

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
    duration: 1.0,
  });

  const currentCamTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.7, -10));

  // Hallway walk / scroll position
  const scrollZRef = useRef<number>(4);
  const targetScrollZRef = useRef<number>(4);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseYRef = useRef<number>(0);

  // Helper to animate camera
  const animateCameraTo = useCallback(
    (pos: THREE.Vector3, target: THREE.Vector3, duration: number = 2.0, onComplete?: () => void) => {
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

  // Enter a Door & Room (Glide camera into doorway, swing door open wide, then show certificate)
  const enterRoom = useCallback(
    (index: number) => {
      if (index < 0 || index >= certificates.length) return;
      const doorObj = doorsListRef.current[index];
      if (!doorObj) return;

      const cert = certificates[index];
      setActiveRoomIndex(index);
      setGalleryMode('entering');
      setSelectedCert(null);
      sound.playClick();
      sound.playZoom();

      // Swing door open wide immediately
      doorObj.isOpenState = true;

      // Animate camera smoothly towards the room doorway (1.1s glide)
      animateCameraTo(doorObj.hallCamPos, doorObj.hallCamTarget, 1.1, () => {
        // Reached the room doorway: trigger certificate popup with chime
        setSelectedCert(cert);
        setGalleryMode('inside_room');
        sound.playChime();
      });
    },
    [certificates, animateCameraTo]
  );

  // Exit Room back to Hallway (Close popup & door, reset camera)
  const exitRoom = useCallback(() => {
    if (activeRoomIndex !== null) {
      const doorObj = doorsListRef.current[activeRoomIndex];
      if (doorObj) {
        doorObj.isOpenState = false;
      }
    }
    sound.playClick();
    setSelectedCert(null);
    setActiveRoomIndex(null);
    setGalleryMode('hallway');
    if (cameraRef.current) {
      animateCameraTo(
        new THREE.Vector3(0, 1.7, scrollZRef.current),
        new THREE.Vector3(0, 1.7, scrollZRef.current - 10),
        0.8
      );
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
    const hallwayLength = (numDoors / 2 + 1) * doorSpacing + 10;
    const hallwayWidth = 4.6;
    const hallwayHeight = 4.2;

    // Floor Plane
    const floorGeo = new THREE.PlaneGeometry(hallwayWidth, hallwayLength);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -hallwayLength / 2 + 6);
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling Plane
    const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, hallwayHeight, -hallwayLength / 2 + 6);
    scene.add(ceiling);

    // Left & Right Off-White Walls
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

    // End Wall (Bright warm glow at end of hallway)
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(hallwayWidth, hallwayHeight), wallMat);
    endWall.position.set(0, hallwayHeight / 2, -hallwayLength + 6);
    scene.add(endWall);

    // End Wall Sketched Window/Arch
    const archEnd = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 3.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    archEnd.position.set(0, 2.0, -hallwayLength + 6.02);
    scene.add(archEnd);

    // Sketched Black Baseboards along hallway edges
    [-hallwayWidth / 2 + 0.04, hallwayWidth / 2 - 0.04].forEach((bx) => {
      const baseboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.15, hallwayLength),
        blackTrimMat
      );
      baseboard.position.set(bx, 0.075, -hallwayLength / 2 + 6);
      scene.add(baseboard);

      // Crown molding at top
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.12, hallwayLength),
        blackTrimMat
      );
      crown.position.set(bx, hallwayHeight - 0.06, -hallwayLength / 2 + 6);
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
      const doorBadgeTex = createDoorBadgesTexture(cert.category, cert.doorNumber || (101 + idx));
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

      // Sketched Plaque above door ("THE STUDIO" / "ROOM 101")
      const plaqueTitle = idx === 0 ? 'THE STUDIO' : `ROOM ${cert.doorNumber || (101 + idx)}`;
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
        new THREE.BoxGeometry(2.3, 1.6, 0.08),
        blackTrimMat
      );
      frameGroup.add(frameMesh);

      const certWallTex = createCertificateWallTexture(cert);
      const certWallMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.15, 1.45),
        new THREE.MeshStandardMaterial({
          map: certWallTex,
          roughness: 0.3,
          metalness: 0.05,
        })
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
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(5, targetScrollZRef.current));
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
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(5, targetScrollZRef.current));
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
        targetScrollZRef.current = Math.max(-hallwayLength + 10, Math.min(5, targetScrollZRef.current));
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

      // Smooth camera lerp animation during room transitions
      const anim = camAnimRef.current;
      if (anim.active) {
        const frameStep = 1 / (Math.max(anim.duration, 0.4) * 60);
        anim.progress += frameStep;
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
      } else if (galleryModeRef.current === 'hallway') {
        // Smooth scroll damping in hallway
        scrollZRef.current = THREE.MathUtils.lerp(scrollZRef.current, targetScrollZRef.current, 0.08);
        camera.position.set(0, 1.7, scrollZRef.current);
        currentCamTarget.current.set(0, 1.7, scrollZRef.current - 10);
        camera.lookAt(currentCamTarget.current);
      }

      // Smooth gentle door swing open/close animation
      doorsListRef.current.forEach((door) => {
        const targetAngle = door.isOpenState ? (door.side === 'left' ? -Math.PI * 0.52 : Math.PI * 0.52) : 0;
        door.doorPanel.rotation.y = THREE.MathUtils.lerp(door.doorPanel.rotation.y, targetAngle, 0.085);
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
              <button
                onClick={exitRoom}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                <span>🚪</span>
                <span>Back to Hallway</span>
              </button>
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

        {/* Certificate Popup Modal (Opens with spring animation only after reaching the room doorway) */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
              onClick={exitRoom}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 25 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl bg-white text-slate-950 rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-slate-900 space-y-6"
              >
                {/* Close Button */}
                <button
                  onClick={exitRoom}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-950 transition-colors text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>

                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="text-[11px] font-mono font-bold tracking-widest text-amber-700 uppercase">
                    OFFICIAL CERTIFICATE OF MASTERY
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                    {selectedCert.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-mono">
                    Presented to <strong className="text-slate-950 font-bold">devaroopa</strong> for verified technical execution
                  </p>
                </div>

                {/* Top Divider */}
                <div className="border-t border-slate-900/90" />

                {/* Description & Skill Badges */}
                <div className="space-y-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
                    {selectedCert.description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {selectedCert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 bg-white text-slate-900 text-[11px] font-bold rounded-md border border-slate-800 shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Divider */}
                <div className="border-t border-slate-900/90" />

                {/* Footer: Issuer & Verification */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <div className="font-black text-slate-950">{selectedCert.issuer}</div>
                    <div className="text-slate-600 text-[11px] font-mono">{selectedCert.issueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-700 font-bold text-xs tracking-wider">VERIFIED</div>
                    <div className="text-slate-600 text-[11px] font-mono">{selectedCert.credentialId}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

