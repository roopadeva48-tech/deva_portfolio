import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Landmark, LandmarkId } from '../../types';
import { sound } from '../../utils/audio';

interface EarthGlobeSceneProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onSelectLandmark: (landmark: Landmark) => void;
  isAntiGravity: boolean;
  isAutoRotate: boolean;
  introPhase: 'loading' | 'zooming_in' | 'ready';
  onIntroZoomComplete?: () => void;
  onResetView?: () => void;
  zoomFovOffset?: number;
  isPaused?: boolean;
}

// Default camera overview matching reference image framing (declared outside component to keep stable references)
const DEFAULT_CAM_POS = new THREE.Vector3(0, 0.35, 14.8);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_FOV = 36;

export const EarthGlobeScene: React.FC<EarthGlobeSceneProps> = ({
  landmarks,
  selectedLandmark,
  onSelectLandmark,
  isAntiGravity,
  isAutoRotate,
  introPhase,
  onIntroZoomComplete,
  zoomFovOffset = 0,
  isPaused = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<Landmark | null>(null);
  const hoveredLandmarkIdRef = useRef<string | null>(null);
  const cursorPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Sync props to refs to avoid tearing down the 3D scene on prop changes
  const isAntiGravityRef = useRef(isAntiGravity);
  isAntiGravityRef.current = isAntiGravity;

  const isAutoRotateRef = useRef(isAutoRotate);
  isAutoRotateRef.current = isAutoRotate;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const introPhaseRef = useRef(introPhase);
  introPhaseRef.current = introPhase;

  const landmarksRef = useRef(landmarks);
  landmarksRef.current = landmarks;

  const onSelectLandmarkRef = useRef(onSelectLandmark);
  onSelectLandmarkRef.current = onSelectLandmark;

  const onIntroZoomCompleteRef = useRef(onIntroZoomComplete);
  onIntroZoomCompleteRef.current = onIntroZoomComplete;

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const girlGroupRef = useRef<THREE.Group | null>(null);
  const skyscrapersGroupRef = useRef<THREE.Group | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const craneGroupRef = useRef<THREE.Group | null>(null);
  const rocketGroupRef = useRef<THREE.Group | null>(null);
  const smokeTrailRef = useRef<THREE.Mesh | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const balloonsGroupRef = useRef<THREE.Group | null>(null);
  const interactiveObjectsRef = useRef<{ object: THREE.Object3D; landmarkId: LandmarkId }[]>([]);

  // Camera interpolation state
  const cameraAnimRef = useRef<{
    active: boolean;
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startFov: number;
    endFov: number;
    progress: number;
    duration: number;
  }>({
    active: false,
    startPos: new THREE.Vector3(0, 1.2, 8.2),
    endPos: new THREE.Vector3(0, 1.2, 8.2),
    startTarget: new THREE.Vector3(0, 0, 0),
    endTarget: new THREE.Vector3(0, 0, 0),
    startFov: 45,
    endFov: 45,
    progress: 1,
    duration: 1.5,
  });

  const currentTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Mouse orbit dragging state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);

  // Intro zoom animation ref (Matching the video: globe starts small and zooms up into screen)
  const introAnimProgressRef = useRef<number>(0);
  const introFinishedRef = useRef<boolean>(false);

  const animateCameraTo = useCallback(
    (pos: [number, number, number], target: [number, number, number], fov: number, duration: number = 1.4) => {
      if (!cameraRef.current) return;
      sound.playZoom();
      const cam = cameraRef.current;
      cameraAnimRef.current = {
        active: true,
        startPos: cam.position.clone(),
        endPos: new THREE.Vector3(...pos),
        startTarget: currentTargetRef.current.clone(),
        endTarget: new THREE.Vector3(...target),
        startFov: cam.fov,
        endFov: fov,
        progress: 0,
        duration: duration,
      };
    },
    []
  );

  // When selected landmark changes, move camera
  useEffect(() => {
    if (selectedLandmark) {
      animateCameraTo(selectedLandmark.cameraPosition, selectedLandmark.cameraTarget, selectedLandmark.fov + zoomFovOffset, 1.5);
    } else {
      animateCameraTo([DEFAULT_CAM_POS.x, DEFAULT_CAM_POS.y, DEFAULT_CAM_POS.z], [DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z], DEFAULT_FOV + zoomFovOffset, 1.2);
    }
  }, [selectedLandmark, animateCameraTo, zoomFovOffset]);

  // Dynamic zoom adjustments
  useEffect(() => {
    if (cameraRef.current) {
      const baseFov = selectedLandmark ? selectedLandmark.fov : DEFAULT_FOV;
      cameraRef.current.fov = Math.max(18, Math.min(62, baseFov + zoomFovOffset));
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoomFovOffset, selectedLandmark]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Vibrant sky blue background matching the reference image
    scene.background = new THREE.Color(0x38bdf8);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, width / height, 0.1, 100);
    camera.position.copy(DEFAULT_CAM_POS);
    camera.lookAt(DEFAULT_TARGET);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    interactiveObjectsRef.current = [];

    // --- 2. LIGHTING (Bright, Crisp Sun & Ambient Glow) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.3);
    sunLight.position.set(6, 9, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 0.85);
    fillLight.position.set(-6, -4, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 0.7);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // --- 3. ROOT GLOBE GROUP ---
    const globeRoot = new THREE.Group();
    // Video entrance: starts scaled down only if currently actively in zooming_in intro phase!
    if (introPhaseRef.current === 'zooming_in') {
      globeRoot.scale.setScalar(0.08);
      globeRoot.rotation.y = -Math.PI;
    } else {
      globeRoot.scale.setScalar(1.0);
    }
    scene.add(globeRoot);
    globeGroupRef.current = globeRoot;

    // --- 4. THE REALISTIC EARTH GLOBE (ORIGINAL HIGH FIDELITY GEOMETRY) ---
    const globeRadius = 2.4;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Canvas procedural earth texture with accurate continents, ocean gradients & shallow shelves
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Deep ocean blue gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#0369a1');
    oceanGrad.addColorStop(0.5, '#0284c7');
    oceanGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coastal turquoise shelves
    ctx.fillStyle = '#38bdf8';
    function drawContinents(isShelf: boolean) {
      ctx.beginPath();
      // North America
      ctx.ellipse(540, 360, isShelf ? 215 : 190, isShelf ? 150 : 130, -0.2, 0, Math.PI * 2);
      ctx.ellipse(460, 480, isShelf ? 130 : 110, isShelf ? 90 : 80, 0.3, 0, Math.PI * 2);
      // South America
      ctx.ellipse(680, 680, isShelf ? 165 : 140, isShelf ? 225 : 200, 0.35, 0, Math.PI * 2);
      // Europe
      ctx.ellipse(1120, 360, isShelf ? 160 : 140, isShelf ? 120 : 100, 0, 0, Math.PI * 2);
      // Africa
      ctx.ellipse(1140, 580, isShelf ? 190 : 170, isShelf ? 225 : 200, 0.1, 0, Math.PI * 2);
      // Asia
      ctx.ellipse(1480, 380, isShelf ? 285 : 260, isShelf ? 185 : 160, 0.15, 0, Math.PI * 2);
      // India & SE Asia
      ctx.ellipse(1390, 490, isShelf ? 90 : 75, isShelf ? 115 : 95, 0.2, 0, Math.PI * 2);
      // Australia
      ctx.ellipse(1680, 720, isShelf ? 130 : 110, isShelf ? 110 : 90, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    drawContinents(true);

    // Landmass lush green and savannah
    ctx.fillStyle = '#22c55e';
    drawContinents(false);

    // Mountain relief accents
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(510, 370, 70, 90, -0.4, 0, Math.PI * 2);
    ctx.ellipse(660, 640, 50, 110, 0.3, 0, Math.PI * 2);
    ctx.ellipse(1450, 360, 130, 70, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, 50);
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.08,
      bumpScale: 0.04,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeMesh.receiveShadow = true;
    globeMesh.castShadow = true;
    globeRoot.add(globeMesh);

    // Atmospheric Fresnel Glow
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.05, 48, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeRoot.add(atmosphereMesh);

    // --- 5. TOP NORTH POLE: THE SUITCASE & THE GIRL (REPLACING THE BOY IN THE IMAGE!) ---
    const girlRoot = new THREE.Group();
    girlRoot.position.set(0, globeRadius, 0);
    globeRoot.add(girlRoot);
    girlGroupRef.current = girlRoot;

    // The Vintage Travel Trunk / Suitcase from the image (warm orange-amber leather)
    const suitcaseWidth = 1.25;
    const suitcaseHeight = 0.72;
    const suitcaseDepth = 0.62;
    const suitcaseGeo = new THREE.BoxGeometry(suitcaseWidth, suitcaseHeight, suitcaseDepth);
    const suitcaseMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm Orange Leather matching the reference photo
      roughness: 0.42,
      metalness: 0.12,
    });
    const suitcase = new THREE.Mesh(suitcaseGeo, suitcaseMat);
    suitcase.position.set(0, suitcaseHeight / 2, 0);
    suitcase.castShadow = true;
    suitcase.receiveShadow = true;
    girlRoot.add(suitcase);

    // Brass corner guards
    const cornerMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.88,
      roughness: 0.22,
    });
    const cornerPositions = [
      [-suitcaseWidth / 2, -suitcaseHeight / 2, -suitcaseDepth / 2],
      [suitcaseWidth / 2, -suitcaseHeight / 2, -suitcaseDepth / 2],
      [-suitcaseWidth / 2, suitcaseHeight / 2, -suitcaseDepth / 2],
      [suitcaseWidth / 2, suitcaseHeight / 2, -suitcaseDepth / 2],
      [-suitcaseWidth / 2, -suitcaseHeight / 2, suitcaseDepth / 2],
      [suitcaseWidth / 2, -suitcaseHeight / 2, suitcaseDepth / 2],
      [-suitcaseWidth / 2, suitcaseHeight / 2, suitcaseDepth / 2],
      [suitcaseWidth / 2, suitcaseHeight / 2, suitcaseDepth / 2],
    ];
    cornerPositions.forEach(([cx, cy, cz]) => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), cornerMat);
      corner.position.set(cx, cy + suitcaseHeight / 2, cz);
      girlRoot.add(corner);
    });

    // Suitcase handle
    const handleGeo = new THREE.TorusGeometry(0.13, 0.035, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeo, cornerMat);
    handle.rotation.z = Math.PI;
    handle.position.set(0, suitcaseHeight + 0.02, 0);
    girlRoot.add(handle);

    // The Girl Figure (Roopa Deva) seated on top of the suitcase
    const girlFigure = new THREE.Group();
    girlFigure.position.set(0, suitcaseHeight, 0.06);
    girlRoot.add(girlFigure);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.55 });
    const sweaterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 }); // Chic slate-charcoal knit sweater
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.7 }); // Classic blue denim
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.35 }); // Long dark hair
    const shoeUpperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }); // White sneaker soles

    // Hips & Pelvis
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.28), pantsMat);
    hips.position.set(0, 0.1, 0);
    hips.castShadow = true;
    girlFigure.add(hips);

    // Upper Thighs (extending forward naturally over suitcase edge)
    const thighGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.42);
    const leftThigh = new THREE.Mesh(thighGeo, pantsMat);
    leftThigh.rotation.x = Math.PI / 2;
    leftThigh.position.set(-0.14, 0.1, 0.2);
    leftThigh.castShadow = true;
    girlFigure.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, pantsMat);
    rightThigh.rotation.x = Math.PI / 2;
    rightThigh.position.set(0.14, 0.1, 0.2);
    rightThigh.castShadow = true;
    girlFigure.add(rightThigh);

    // Lower Legs (Dangling straight down over the front of the suitcase like in the photo)
    const shinGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.44);
    const leftShin = new THREE.Mesh(shinGeo, pantsMat);
    leftShin.position.set(-0.14, -0.14, 0.39);
    leftShin.castShadow = true;
    girlFigure.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, pantsMat);
    rightShin.position.set(0.14, -0.14, 0.39);
    rightShin.castShadow = true;
    girlFigure.add(rightShin);

    // Sneakers with white rubber soles (matching casual footwear in the photo)
    function createSneaker(x: number) {
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(x, -0.38, 0.43);

      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.11, 0.24), shoeUpperMat);
      upper.position.y = 0.05;
      upper.castShadow = true;
      shoeGroup.add(upper);

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.25), shoeSoleMat);
      sole.position.y = -0.01;
      shoeGroup.add(sole);

      return shoeGroup;
    }

    girlFigure.add(createSneaker(-0.14));
    girlFigure.add(createSneaker(0.14));

    // Torso / Sweater
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.26), sweaterMat);
    torso.position.set(0, 0.4, -0.02);
    torso.castShadow = true;
    girlFigure.add(torso);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1), skinMat);
    neck.position.set(0, 0.66, -0.02);
    girlFigure.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), skinMat);
    head.position.set(0, 0.83, -0.01);
    head.castShadow = true;
    girlFigure.add(head);

    // Long stylish hair with back flow
    const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(0.205, 20, 20), hairMat);
    hairCrown.position.set(0, 0.86, -0.03);
    hairCrown.scale.set(1.02, 1.05, 1.15);
    girlFigure.add(hairCrown);

    // Flowing hair strands down the back and shoulders
    const hairFlowBack = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.52, 12), hairMat);
    hairFlowBack.position.set(0, 0.65, -0.15);
    hairFlowBack.rotation.x = -0.1;
    girlFigure.add(hairFlowBack);

    const hairSideLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.16), hairMat);
    hairSideLeft.position.set(-0.16, 0.72, 0.02);
    girlFigure.add(hairSideLeft);

    const hairSideRight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.16), hairMat);
    hairSideRight.position.set(0.16, 0.72, 0.02);
    girlFigure.add(hairSideRight);

    // Arms resting on thighs / suitcase edge (matching the casual posture in the photo)
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.46);
    const leftArm = new THREE.Mesh(armGeo, sweaterMat);
    leftArm.position.set(-0.25, 0.36, 0.06);
    leftArm.rotation.z = 0.18;
    leftArm.rotation.x = -0.22;
    leftArm.castShadow = true;
    girlFigure.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, sweaterMat);
    rightArm.position.set(0.25, 0.36, 0.06);
    rightArm.rotation.z = -0.18;
    rightArm.rotation.x = -0.22;
    rightArm.castShadow = true;
    girlFigure.add(rightArm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-0.22, 0.15, 0.22);
    girlFigure.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(0.22, 0.15, 0.22);
    girlFigure.add(rightHand);

    // Golden Floating Beacon Crystal above her head
    const beaconGeo = new THREE.OctahedronGeometry(0.13);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 1.25, 0);
    girlFigure.add(beacon);

    // Halo pulse ring
    const haloRingGeo = new THREE.RingGeometry(0.7, 0.78, 32);
    const haloRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    haloRing.rotation.x = -Math.PI / 2;
    haloRing.position.set(0, 0.02, 0);
    girlRoot.add(haloRing);

    // Register interactive targets for the girl
    interactiveObjectsRef.current.push({ object: suitcase, landmarkId: 'girl_me' });
    interactiveObjectsRef.current.push({ object: torso, landmarkId: 'girl_me' });
    interactiveObjectsRef.current.push({ object: head, landmarkId: 'girl_me' });
    interactiveObjectsRef.current.push({ object: beacon, landmarkId: 'girl_me' });

    // --- 6. LEFT SIDE: MODERN CITY SKYSCRAPERS CLUSTER (MATCHING REFERENCE IMAGE) ---
    const skyscrapersRoot = new THREE.Group();
    // Position on the left flank of the globe between 8:00 and 10:00
    const skyPos = new THREE.Vector3(-globeRadius * 0.94, globeRadius * 0.22, 0);
    skyscrapersRoot.position.copy(skyPos);
    skyscrapersRoot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), skyPos.clone().normalize());
    globeRoot.add(skyscrapersRoot);
    skyscrapersGroupRef.current = skyscrapersRoot;

    // Modern High-Rise Materials: Pure White, Aluminum Silver, Slate Frames & Azure Reflective Glass
    const whiteFacadeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.28, metalness: 0.1 });
    const silverPanelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.32, metalness: 0.25 });
    const darkFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.4 });
    const cyanGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant reflective sky blue glass
      roughness: 0.15,
      metalness: 0.65,
      emissive: 0x0369a1,
      emissiveIntensity: 0.22,
    });
    const azureGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const redBeaconMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.2,
    });
    const warmLightMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.6,
    });

    // 1. Urban Plaza Foundation Base hugging the globe curvature
    const plazaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 0.12, 16),
      darkFrameMat
    );
    plazaBase.position.y = 0.06;
    plazaBase.receiveShadow = true;
    skyscrapersRoot.add(plazaBase);

    // 2. Tower A: Iconic Sloped-Roof Glass Skyscraper (Signature building from image)
    const towerA = new THREE.Group();
    towerA.position.set(-0.24, 0.1, 0.05);
    skyscrapersRoot.add(towerA);

    const tABaseGeo = new THREE.BoxGeometry(0.46, 1.85, 0.46);
    const tABase = new THREE.Mesh(tABaseGeo, whiteFacadeMat);
    tABase.position.y = 0.925;
    tABase.castShadow = true;
    towerA.add(tABase);

    // Sloped Glass Crown (Angled wedge roof)
    const tASlopeGeo = new THREE.CylinderGeometry(0.01, 0.44, 0.55, 4);
    const tASlope = new THREE.Mesh(tASlopeGeo, cyanGlassMat);
    tASlope.position.y = 1.85 + 0.26;
    tASlope.rotation.y = Math.PI / 4;
    tASlope.castShadow = true;
    towerA.add(tASlope);

    // Continuous glass ribbon window stripes on Tower A
    for (let wy = 0.22; wy < 1.75; wy += 0.26) {
      const winStripe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.48), cyanGlassMat);
      winStripe.position.y = wy;
      towerA.add(winStripe);
    }

    // Rooftop antenna mast with flashing beacon
    const mastGeo = new THREE.CylinderGeometry(0.012, 0.02, 0.45, 8);
    const mastMesh = new THREE.Mesh(mastGeo, silverPanelMat);
    mastMesh.position.set(0, 1.85 + 0.55 + 0.22, 0);
    towerA.add(mastMesh);

    const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), redBeaconMat);
    beaconLight.position.set(0, 1.85 + 0.55 + 0.45, 0);
    towerA.add(beaconLight);

    interactiveObjectsRef.current.push({ object: tABase, landmarkId: 'skyscrapers' });
    interactiveObjectsRef.current.push({ object: tASlope, landmarkId: 'skyscrapers' });

    // 3. Tower B: Modern Corporate High-Rise with Helipad
    const towerB = new THREE.Group();
    towerB.position.set(0.28, 0.1, -0.15);
    skyscrapersRoot.add(towerB);

    const tBBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.3, 0.42), silverPanelMat);
    tBBody.position.y = 1.15;
    tBBody.castShadow = true;
    towerB.add(tBBody);

    // Ribbon glass windows for Tower B
    for (let wy = 0.25; wy < 2.2; wy += 0.3) {
      const winB = new THREE.Mesh(new THREE.BoxGeometry(0.435, 0.14, 0.435), azureGlassMat);
      winB.position.y = wy;
      towerB.add(winB);
    }

    // Rooftop Helipad
    const helipad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16), darkFrameMat);
    helipad.position.y = 2.3 + 0.02;
    towerB.add(helipad);

    // Helipad inner ring and 'H'
    const heliRing = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.15, 16), warmLightMat);
    heliRing.rotation.x = -Math.PI / 2;
    heliRing.position.y = 2.3 + 0.045;
    towerB.add(heliRing);

    interactiveObjectsRef.current.push({ object: tBBody, landmarkId: 'skyscrapers' });

    // 4. Tower C: Curved Cylindrical Glass Tower
    const towerC = new THREE.Group();
    towerC.position.set(0.12, 0.1, 0.35);
    skyscrapersRoot.add(towerC);

    const tCCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.7, 24), cyanGlassMat);
    tCCylinder.position.y = 0.85;
    tCCylinder.castShadow = true;
    towerC.add(tCCylinder);

    // Architectural white horizontal rings on cylinder
    for (let ry = 0.2; ry < 1.65; ry += 0.28) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.02, 8, 24), whiteFacadeMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = ry;
      towerC.add(ring);
    }
    // Cylinder crown
    const tCCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 24), darkFrameMat);
    tCCrown.position.y = 1.76;
    towerC.add(tCCrown);

    interactiveObjectsRef.current.push({ object: tCCylinder, landmarkId: 'skyscrapers' });

    // 5. Tower D & E: Stepped Modern Office High-Rises
    const steppedTowersConfig = [
      { x: -0.22, z: -0.32, w: 0.36, h: 1.45, d: 0.36, mat: whiteFacadeMat, gMat: cyanGlassMat },
      { x: 0.45, z: 0.18, w: 0.32, h: 1.35, d: 0.32, mat: silverPanelMat, gMat: azureGlassMat },
      { x: -0.42, z: 0.18, w: 0.28, h: 1.1, d: 0.28, mat: whiteFacadeMat, gMat: cyanGlassMat },
      { x: 0.42, z: -0.35, w: 0.26, h: 0.95, d: 0.26, mat: silverPanelMat, gMat: azureGlassMat },
    ];

    steppedTowersConfig.forEach((cfg) => {
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d), cfg.mat);
      bldg.position.set(cfg.x, 0.1 + cfg.h / 2, cfg.z);
      bldg.castShadow = true;
      bldg.receiveShadow = true;
      skyscrapersRoot.add(bldg);

      // Window strips
      for (let wy = 0.18; wy < cfg.h - 0.15; wy += 0.24) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(cfg.w + 0.015, 0.09, cfg.d * 0.8), cfg.gMat);
        win.position.set(cfg.x, 0.1 + wy, cfg.z);
        skyscrapersRoot.add(win);
      }

      // Rooftop HVAC box
      const hvac = new THREE.Mesh(new THREE.BoxGeometry(cfg.w * 0.45, 0.08, cfg.d * 0.45), darkFrameMat);
      hvac.position.set(cfg.x, 0.1 + cfg.h + 0.04, cfg.z);
      skyscrapersRoot.add(hvac);

      interactiveObjectsRef.current.push({ object: bldg, landmarkId: 'skyscrapers' });
    });

    // 6. Street-level Plaza Details (Miniature Street Lamps)
    [-0.35, 0.32, 0.0].forEach((lx, lIdx) => {
      const lamp = new THREE.Group();
      lamp.position.set(lx, 0.12, lIdx === 1 ? -0.42 : 0.42);

      const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28), darkFrameMat);
      lampPole.position.y = 0.14;
      lamp.add(lampPole);

      const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), warmLightMat);
      lampBulb.position.y = 0.28;
      lamp.add(lampBulb);

      skyscrapersRoot.add(lamp);
    });

    // --- 7. RIGHT SIDE: COZY SUBURBAN HOUSE (IDENTICAL TO REFERENCE IMAGE) ---
    const houseRoot = new THREE.Group();
    // Positioned at ~4:30 on the right equator
    const housePos = new THREE.Vector3(globeRadius * 0.93, -globeRadius * 0.34, 0.15);
    houseRoot.position.copy(housePos);
    houseRoot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), housePos.clone().normalize());
    globeRoot.add(houseRoot);
    houseGroupRef.current = houseRoot;

    // White plaster walls
    const houseBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.72, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 })
    );
    houseBody.position.set(0, 0.36, 0);
    houseBody.castShadow = true;
    houseBody.receiveShadow = true;
    houseRoot.add(houseBody);

    // Steep Gabled Roof matching skyscraper building blue (0x0284c7)
    const roofGeo = new THREE.ConeGeometry(0.76, 0.58, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant reflective sky blue matching skyscrapers
      roughness: 0.25,
      metalness: 0.45,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 0.72 + 0.29, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseRoot.add(roof);

    // Architectural Chimney in matching deep ocean blue
    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.38, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5, metalness: 0.2 })
    );
    chimney.position.set(0.22, 0.95, 0.18);
    chimney.castShadow = true;
    houseRoot.add(chimney);

    // Windows with mullions
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const windowGlassMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });

    function createWindow(wx: number, wy: number, wz: number) {
      const winGroup = new THREE.Group();
      winGroup.position.set(wx, wy, wz);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.03), windowFrameMat);
      winGroup.add(frame);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.04), windowGlassMat);
      winGroup.add(glass);

      houseRoot.add(winGroup);
    }
    createWindow(-0.2, 0.45, 0.46);
    createWindow(0.2, 0.45, 0.46);

    // Front Porch structure with pillars (matching reference image!)
    const porchFloor = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.08, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    porchFloor.position.set(0, 0.04, 0.6);
    houseRoot.add(porchFloor);

    // Porch pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    [-0.2, 0.2].forEach((px) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4), pillarMat);
      pillar.position.set(px, 0.24, 0.72);
      houseRoot.add(pillar);
    });

    interactiveObjectsRef.current.push({ object: houseBody, landmarkId: 'cozy_house' });
    interactiveObjectsRef.current.push({ object: roof, landmarkId: 'cozy_house' });

    // --- 8. BOTTOM: YELLOW CONSTRUCTION TOWER CRANE (IDENTICAL TO REFERENCE IMAGE) ---
    const craneRoot = new THREE.Group();
    // Angled at 6:00 pointing slightly down towards 7:00
    const cranePos = new THREE.Vector3(-0.2, -globeRadius * 0.98, 0);
    craneRoot.position.copy(cranePos);
    craneRoot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cranePos.clone().normalize());
    globeRoot.add(craneRoot);
    craneGroupRef.current = craneRoot;

    const craneYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.25 });

    // Vertical lattice mast
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.8, 0.14), craneYellowMat);
    mast.position.set(0, 0.9, 0);
    mast.castShadow = true;
    craneRoot.add(mast);

    // Horizontal Jib Boom extending outwards
    const jib = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.11, 0.11), craneYellowMat);
    jib.position.set(0.55, 1.8, 0);
    jib.castShadow = true;
    craneRoot.add(jib);

    // Counterweight jib and block
    const counterWeight = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.22, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 })
    );
    counterWeight.position.set(-0.35, 1.8, 0);
    counterWeight.castShadow = true;
    craneRoot.add(counterWeight);

    interactiveObjectsRef.current.push({ object: mast, landmarkId: 'crane' });
    interactiveObjectsRef.current.push({ object: jib, landmarkId: 'crane' });

    // --- 9. RETRO ROCKET WITH CIRCLING WHITE SMOKE TRAIL ---
    const rocketRoot = new THREE.Group();
    scene.add(rocketRoot);
    rocketGroupRef.current = rocketRoot;

    const rocketBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.48, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.3 })
    );
    rocketBody.rotation.z = Math.PI / 2;
    rocketRoot.add(rocketBody);

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.24, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(0.36, 0, 0);
    rocketRoot.add(nose);

    const finMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    [-0.14, 0.14].forEach((fy) => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.18), finMat);
      fin.position.set(-0.2, fy, 0);
      rocketRoot.add(fin);
    });

    interactiveObjectsRef.current.push({ object: rocketBody, landmarkId: 'rocket' });
    interactiveObjectsRef.current.push({ object: nose, landmarkId: 'rocket' });

    // Continuous Smoke Ring Torus circling the globe (as in the reference image!)
    const smokeGeo = new THREE.TorusGeometry(globeRadius * 1.38, 0.07, 16, 100);
    const smokeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      transparent: true,
      opacity: 0.88,
    });
    const smokeTrail = new THREE.Mesh(smokeGeo, smokeMat);
    smokeTrail.rotation.x = Math.PI / 3;
    smokeTrail.rotation.y = Math.PI / 6;
    globeRoot.add(smokeTrail);
    smokeTrailRef.current = smokeTrail;

    // --- 10. HOT AIR BALLOONS (IDENTICAL TO REFERENCE IMAGE) ---
    const balloonsGroup = new THREE.Group();
    globeRoot.add(balloonsGroup);
    balloonsGroupRef.current = balloonsGroup;

    function createBalloon(color1: number, scale: number, pos: [number, number, number]) {
      const bGroup = new THREE.Group();
      bGroup.position.set(...pos);
      bGroup.scale.setScalar(scale);

      const envelope = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 24, 24),
        new THREE.MeshStandardMaterial({ color: color1, roughness: 0.4 })
      );
      envelope.scale.set(1, 1.25, 1);
      envelope.castShadow = true;
      bGroup.add(envelope);

      const stripe = new THREE.Mesh(
        new THREE.TorusGeometry(0.385, 0.04, 12, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      stripe.rotation.x = Math.PI / 2;
      bGroup.add(stripe);

      const basket = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.12, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      );
      basket.position.set(0, -0.65, 0);
      basket.castShadow = true;
      bGroup.add(basket);

      interactiveObjectsRef.current.push({ object: envelope, landmarkId: 'hot_air_balloon' });
      return bGroup;
    }

    // Balloon 1: Pink & White vertical stripes (at ~1:30)
    const balloon1 = createBalloon(0xec4899, 0.85, [globeRadius * 0.85, globeRadius * 0.85, 0.4]);
    // Balloon 2: Yellow & White stripes (at ~2:30)
    const balloon2 = createBalloon(0xf59e0b, 0.6, [globeRadius * 0.95, globeRadius * 0.45, -0.6]);
    balloonsGroup.add(balloon1);
    balloonsGroup.add(balloon2);

    // --- 11. ROAD SIGNS & DIRECTIONAL POSTS (IDENTICAL TO REFERENCE IMAGE) ---
    const signsGroup = new THREE.Group();
    globeRoot.add(signsGroup);

    // A. At 11:00: Wooden Directional Signpost with multiple arrow pointer boards!
    const woodSignPos = new THREE.Vector3(-globeRadius * 0.55, globeRadius * 0.85, 0.2);
    const woodSignGroup = new THREE.Group();
    woodSignGroup.position.copy(woodSignPos);
    woodSignGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), woodSignPos.clone().normalize());

    const woodPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 })
    );
    woodPost.position.set(0, 0.55, 0);
    woodSignGroup.add(woodPost);

    // 3 Directional Arrow Boards pointing left & right (just like in image at 11 o'clock!)
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 });
    [-0.15, 0.1, 0.35].forEach((by, idx) => {
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.03), boardMat);
      board.position.set((idx % 2 === 0 ? 0.08 : -0.08), 0.7 + by * 0.3, 0);
      board.rotation.z = (idx % 2 === 0 ? 0.08 : -0.08);
      woodSignGroup.add(board);
    });
    signsGroup.add(woodSignGroup);

    // B. At 1:00: Yellow Diamond Road Sign
    const diamondSignPos = new THREE.Vector3(globeRadius * 0.65, globeRadius * 0.75, -0.2);
    const diamondGroup = new THREE.Group();
    diamondGroup.position.copy(diamondSignPos);
    diamondGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), diamondSignPos.clone().normalize());

    const diamondPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    diamondPost.position.set(0, 0.45, 0);
    diamondGroup.add(diamondPost);

    const diamondMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.24, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    );
    diamondMesh.position.set(0, 0.9, 0);
    diamondMesh.rotation.z = Math.PI / 4;
    diamondGroup.add(diamondMesh);
    signsGroup.add(diamondGroup);

    // C. At 5:30: Red-and-White Triangular Warning Sign with airplane
    const signPostPos = new THREE.Vector3(globeRadius * 0.25, -globeRadius * 0.92, 0.25);
    const signGroup = new THREE.Group();
    signGroup.position.copy(signPostPos);
    signGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), signPostPos.clone().normalize());

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    post.position.set(0, 0.42, 0);
    signGroup.add(post);

    const triangleSign = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.03, 3),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    triangleSign.rotation.x = Math.PI / 2;
    triangleSign.position.set(0, 0.78, 0);
    signGroup.add(triangleSign);
    signsGroup.add(signGroup);

    // --- 12. FLUFFY CUMULUS CLOUD RING (INITIAL DESIGN) ---
    const cloudsGroup = new THREE.Group();
    globeRoot.add(cloudsGroup);
    cloudsGroupRef.current = cloudsGroup;

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    });

    for (let c = 0; c < 12; c++) {
      const singleCloud = new THREE.Group();
      const angle = (c / 12) * Math.PI * 2;
      const cloudDist = globeRadius * (1.2 + (c % 3) * 0.08);
      const cloudY = (Math.sin(c * 1.5) * 0.8) + (c % 2 === 0 ? 0.3 : -0.3);

      singleCloud.position.set(Math.cos(angle) * cloudDist, cloudY, Math.sin(angle) * cloudDist);

      for (let p = 0; p < 4; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.18 + Math.random() * 0.14, 12, 12),
          cloudMat
        );
        puff.position.set(
          (p - 1.5) * 0.16,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.12
        );
        singleCloud.add(puff);
      }
      cloudsGroup.add(singleCloud);
    }

    // --- 13. MOUSE & TOUCH EVENT LISTENERS ---
    const cachedInteractiveMeshes = interactiveObjectsRef.current.map((i) => i.object);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let lastRaycastTime = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      mouseVelocityRef.current = { x: 0, y: 0 };
    };

    const onPointerMove = (e: MouseEvent) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY - 16}px, 0)`;
      }

      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;

      if (isDraggingRef.current && globeRoot) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        mouseVelocityRef.current = { x: deltaX * 0.005, y: deltaY * 0.005 };

        globeRoot.rotation.y += deltaX * 0.006;
        globeRoot.rotation.x += deltaY * 0.004;

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }

      const now = performance.now();
      if (now - lastRaycastTime > 50 && !isDraggingRef.current && camera) {
        lastRaycastTime = now;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cachedInteractiveMeshes, true);

        if (intersects.length > 0) {
          const hit = intersects[0];
          const match = interactiveObjectsRef.current.find(
            (item) => item.object === hit.object || item.object.children.includes(hit.object)
          );
          if (match) {
            if (hoveredLandmarkIdRef.current !== match.landmarkId) {
              hoveredLandmarkIdRef.current = match.landmarkId;
              const lData = landmarksRef.current.find((l) => l.id === match.landmarkId);
              setHoveredLandmark(lData || null);
            }
            container.style.cursor = 'pointer';
            return;
          }
        }
        if (hoveredLandmarkIdRef.current !== null) {
          hoveredLandmarkIdRef.current = null;
          setHoveredLandmark(null);
        }
        container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - previousMousePositionRef.current.x);
      const deltaY = Math.abs(e.clientY - previousMousePositionRef.current.y);

      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      if (deltaX < 6 && deltaY < 6) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cachedInteractiveMeshes, true);

        if (intersects.length > 0) {
          const hit = intersects[0];
          const match = interactiveObjectsRef.current.find(
            (item) => item.object === hit.object || item.object.children.includes(hit.object)
          );
          if (match) {
            const lData = landmarksRef.current.find((l) => l.id === match.landmarkId);
            if (lData) {
              sound.playChime();
              onSelectLandmarkRef.current(lData);
            }
          }
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistRef.current = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current && globeRoot) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

        globeRoot.rotation.y += deltaX * 0.007;
        globeRoot.rotation.x += deltaY * 0.005;

        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && touchStartDistRef.current && camera) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = (dist - touchStartDistRef.current) * 0.01;
        camera.fov = Math.max(25, Math.min(65, camera.fov - factor));
        camera.updateProjectionMatrix();
        touchStartDistRef.current = dist;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      touchStartDistRef.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      cam.fov = Math.max(25, Math.min(65, cam.fov + e.deltaY * 0.02));
      cam.updateProjectionMatrix();
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('mouseleave', () => setHoveredLandmark(null));
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
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

    // --- 14. ANIMATION RENDER LOOP ---
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isPausedRef.current) {
        return;
      }

      const elapsedTime = performance.now() * 0.001;

      // Video entrance animation: smoothly zoom up from small distance to full center screen
      if (introPhaseRef.current === 'zooming_in' && !introFinishedRef.current && globeRoot) {
        introAnimProgressRef.current += 0.012;
        const p = Math.min(1, introAnimProgressRef.current);
        const easeScale = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        globeRoot.scale.setScalar(0.08 + 0.92 * easeScale);
        globeRoot.rotation.y = -Math.PI * (1 - easeScale);

        if (p >= 1) {
          introFinishedRef.current = true;
          globeRoot.scale.setScalar(1.0);
          onIntroZoomCompleteRef.current?.();
        }
      } else if (introPhaseRef.current === 'ready' && globeRoot && globeRoot.scale.x < 0.999) {
        // Guarantee full size when ready state is reached
        globeRoot.scale.setScalar(1.0);
        introFinishedRef.current = true;
      }

      // Camera lerp
      const anim = cameraAnimRef.current;
      if (anim.active) {
        anim.progress += 0.02;
        const t = anim.progress;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.lerpVectors(anim.startPos, anim.endPos, Math.min(1, ease));
        currentTargetRef.current.lerpVectors(anim.startTarget, anim.endTarget, Math.min(1, ease));
        camera.fov = THREE.MathUtils.lerp(anim.startFov, anim.endFov, Math.min(1, ease));
        camera.updateProjectionMatrix();
        camera.lookAt(currentTargetRef.current);

        if (anim.progress >= 1) {
          anim.active = false;
          camera.position.copy(anim.endPos);
          currentTargetRef.current.copy(anim.endTarget);
          camera.fov = anim.endFov;
          camera.updateProjectionMatrix();
          camera.lookAt(currentTargetRef.current);
        }
      } else {
        camera.lookAt(currentTargetRef.current);
      }

      // Auto rotation
      if (isAutoRotateRef.current && !isDraggingRef.current && !selectedLandmark && globeRoot && introFinishedRef.current) {
        globeRoot.rotation.y += 0.003;
      }

      // Inertia drag damping
      if (!isDraggingRef.current && globeRoot) {
        globeRoot.rotation.y += mouseVelocityRef.current.x;
        globeRoot.rotation.x += mouseVelocityRef.current.y;
        mouseVelocityRef.current.x *= 0.92;
        mouseVelocityRef.current.y *= 0.92;
      }

      // Rocket orbit
      if (rocketRoot) {
        const rAngle = elapsedTime * 0.8;
        const rRadius = globeRadius * 1.38;
        const rx = Math.cos(rAngle) * rRadius;
        const ry = Math.sin(rAngle * 0.9) * 0.7;
        const rz = Math.sin(rAngle) * rRadius;
        rocketRoot.position.set(rx, ry, rz);

        const nextRx = Math.cos(rAngle + 0.05) * rRadius;
        const nextRy = Math.sin((rAngle + 0.05) * 0.9) * 0.7;
        const nextRz = Math.sin(rAngle + 0.05) * rRadius;
        rocketRoot.lookAt(nextRx, nextRy, nextRz);
      }

      // Girl breathing & beacon pulse
      if (girlFigure) {
        const breath = Math.sin(elapsedTime * 2.2) * 0.02;
        torso.scale.set(1 + breath, 1 + breath, 1 + breath);
        head.rotation.y = Math.sin(elapsedTime * 1.2) * 0.1;
        beacon.rotation.y = elapsedTime * 2;
        beacon.position.y = 1.25 + Math.sin(elapsedTime * 3) * 0.06;
      }

      // Clouds slow drift
      if (cloudsGroup) {
        cloudsGroup.rotation.y = elapsedTime * 0.04;
      }

      // Balloons gentle bobbing
      if (balloonsGroup) {
        balloon1.position.y = globeRadius * 0.85 + Math.sin(elapsedTime * 1.5) * 0.08;
        balloon2.position.y = globeRadius * 0.45 + Math.cos(elapsedTime * 1.8) * 0.06;
      }

      // Anti-Gravity float physics!
      if (isAntiGravityRef.current) {
        const agOffset = Math.sin(elapsedTime * 2.5) * 0.12;
        girlRoot.position.y = globeRadius + 0.15 + agOffset;
        skyscrapersRoot.position.set(
          -globeRadius * (0.94 + agOffset * 0.1),
          globeRadius * (0.28 + agOffset * 0.05),
          0
        );
        houseRoot.position.set(
          globeRadius * (0.92 + agOffset * 0.1),
          -globeRadius * (0.32 + agOffset * 0.05),
          0.2
        );
        if (smokeTrailRef.current) {
          smokeTrailRef.current.scale.setScalar(1 + agOffset * 0.05);
        }
      } else {
        girlRoot.position.y = globeRadius;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Mounts once and runs continuously without lag

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      {hoveredLandmark && (
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-30 mb-3 px-3.5 py-2 bg-slate-900/90 text-white backdrop-blur-md rounded-xl border border-slate-700/60 shadow-xl will-change-transform"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${cursorPosRef.current.x}px, ${cursorPosRef.current.y - 16}px, 0)`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wide">{hoveredLandmark.name}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">{hoveredLandmark.tagline}</p>
        </div>
      )}
    </div>
  );
};
