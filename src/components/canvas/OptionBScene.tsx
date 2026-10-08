import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Landmark, LandmarkId } from '../../types';
import { sound } from '../../utils/audio';

interface OptionBSceneProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onSelectLandmark: (landmark: Landmark) => void;
  isAntiGravity: boolean;
  isAutoRotate: boolean;
  onResetView?: () => void;
}

export const OptionBScene: React.FC<OptionBSceneProps> = ({
  landmarks,
  selectedLandmark,
  onSelectLandmark,
  isAntiGravity,
  isAutoRotate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<Landmark | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const girlGroupRef = useRef<THREE.Group | null>(null);
  const skyscrapersGroupRef = useRef<THREE.Group | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const boatGroupRef = useRef<THREE.Group | null>(null);
  const rocketGroupRef = useRef<THREE.Group | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const smokeTrailRef = useRef<THREE.Mesh | null>(null);
  const interactiveObjectsRef = useRef<{ object: THREE.Object3D; landmarkId: LandmarkId }[]>([]);

  // Camera animation interpolation state
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
    startFov: 44,
    endFov: 44,
    progress: 1,
    duration: 1.5,
  });

  const currentTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Mouse orbit dragging state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);

  // Default camera overview
  const DEFAULT_CAM_POS = new THREE.Vector3(0, 1.0, 7.8);
  const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
  const DEFAULT_FOV = 44;

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

  useEffect(() => {
    if (selectedLandmark) {
      animateCameraTo(selectedLandmark.cameraPosition, selectedLandmark.cameraTarget, selectedLandmark.fov, 1.5);
    } else {
      animateCameraTo([DEFAULT_CAM_POS.x, DEFAULT_CAM_POS.y, DEFAULT_CAM_POS.z], [DEFAULT_TARGET.x, DEFAULT_TARGET.y, DEFAULT_TARGET.z], DEFAULT_FOV, 1.2);
    }
  }, [selectedLandmark, animateCameraTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // EXACT Mint Pastel Sea Green / Turquoise Background from the reference video!
    scene.background = new THREE.Color(0x47c7ac);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. LIGHTING (Artistic Low-Poly Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keySun = new THREE.DirectionalLight(0xfffaed, 2.2);
    keySun.position.set(6, 10, 7);
    keySun.castShadow = true;
    keySun.shadow.mapSize.width = 1024;
    keySun.shadow.mapSize.height = 1024;
    scene.add(keySun);

    const softFill = new THREE.DirectionalLight(0xa7f3d0, 0.85);
    softFill.position.set(-6, -3, -4);
    scene.add(softFill);

    const topRim = new THREE.DirectionalLight(0xfef08a, 0.7);
    topRim.position.set(0, 8, -5);
    scene.add(topRim);

    // --- 3. ROOT GLOBE GROUP ---
    const globeRoot = new THREE.Group();
    scene.add(globeRoot);
    globeGroupRef.current = globeRoot;

    // --- 4. OPTION B: STYLIZED ISLAND GLOBE ---
    const globeRadius = 2.3;

    // Base ocean sphere (vibrant turquoise waters)
    const oceanGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant tropical ocean
      roughness: 0.35,
      metalness: 0.1,
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.receiveShadow = true;
    globeRoot.add(oceanMesh);

    // Island landmass cap (lush stylized green plateau with white cliffs matching video)
    const islandGeo = new THREE.CylinderGeometry(globeRadius * 0.95, globeRadius * 0.88, 0.45, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Lush island green
      roughness: 0.8,
    });
    const islandPlateau = new THREE.Mesh(islandGeo, islandMat);
    islandPlateau.position.set(0, globeRadius * 0.75, 0);
    islandPlateau.receiveShadow = true;
    globeRoot.add(islandPlateau);

    // Sandy coast shoreline ring
    const sandGeo = new THREE.TorusGeometry(globeRadius * 0.96, 0.08, 12, 40);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
    const sandRing = new THREE.Mesh(sandGeo, sandMat);
    sandRing.rotation.x = Math.PI / 2;
    sandRing.position.set(0, globeRadius * 0.75 - 0.15, 0);
    globeRoot.add(sandRing);

    // White cliff rock accents
    const rockMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    for (let r = 0; r < 8; r++) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.18 + Math.random() * 0.12),
        rockMat
      );
      const rAngle = (r / 8) * Math.PI * 2;
      rock.position.set(
        Math.cos(rAngle) * (globeRadius * 0.92),
        globeRadius * 0.68 + (Math.random() - 0.5) * 0.1,
        Math.sin(rAngle) * (globeRadius * 0.92)
      );
      rock.castShadow = true;
      globeRoot.add(rock);
    }

    // Stylized low-poly trees (pine & round bushes from video diorama)
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });

    function createTree(x: number, z: number, scale: number = 1) {
      const tree = new THREE.Group();
      tree.position.set(x, globeRadius * 0.98, z);
      tree.scale.setScalar(scale);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.25, 8), treeTrunkMat);
      trunk.position.y = 0.125;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.42, 6),
        Math.random() > 0.5 ? treeFoliageMat1 : treeFoliageMat2
      );
      foliage.position.y = 0.35;
      foliage.castShadow = true;
      tree.add(foliage);

      globeRoot.add(tree);
    }

    // Cluster trees on the island
    [
      [-0.8, -0.6],
      [-1.1, -0.3],
      [-0.9, 0.5],
      [-1.2, 0.2],
      [0.8, 0.6],
      [1.1, 0.3],
      [0.9, -0.7],
      [-0.4, -1.0],
    ].forEach(([tx, tz]) => createTree(tx, tz, 0.8 + Math.random() * 0.4));

    // --- 5. NORTH POLE: THE GIRL ON THE SUITCASE (ROOPA DEVA) ---
    const girlRoot = new THREE.Group();
    girlRoot.position.set(0, globeRadius + 0.1, 0);
    globeRoot.add(girlRoot);
    girlGroupRef.current = girlRoot;

    // The Vintage Travel Trunk / Suitcase
    const suitcaseWidth = 1.15;
    const suitcaseHeight = 0.68;
    const suitcaseDepth = 0.58;
    const suitcaseGeo = new THREE.BoxGeometry(suitcaseWidth, suitcaseHeight, suitcaseDepth);
    const suitcaseMat = new THREE.MeshStandardMaterial({
      color: 0x92400e, // Warm Cognac Leather
      roughness: 0.45,
      metalness: 0.15,
    });
    const suitcase = new THREE.Mesh(suitcaseGeo, suitcaseMat);
    suitcase.position.set(0, suitcaseHeight / 2, 0);
    suitcase.castShadow = true;
    suitcase.receiveShadow = true;
    girlRoot.add(suitcase);

    // Brass corner guards
    const cornerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 });
    [
      [-suitcaseWidth / 2, -suitcaseHeight / 2, -suitcaseDepth / 2],
      [suitcaseWidth / 2, -suitcaseHeight / 2, -suitcaseDepth / 2],
      [-suitcaseWidth / 2, suitcaseHeight / 2, -suitcaseDepth / 2],
      [suitcaseWidth / 2, suitcaseHeight / 2, -suitcaseDepth / 2],
      [-suitcaseWidth / 2, -suitcaseHeight / 2, suitcaseDepth / 2],
      [suitcaseWidth / 2, -suitcaseHeight / 2, suitcaseDepth / 2],
      [-suitcaseWidth / 2, suitcaseHeight / 2, suitcaseDepth / 2],
      [suitcaseWidth / 2, suitcaseHeight / 2, suitcaseDepth / 2],
    ].forEach(([cx, cy, cz]) => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), cornerMat);
      corner.position.set(cx, cy + suitcaseHeight / 2, cz);
      girlRoot.add(corner);
    });

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeo, cornerMat);
    handle.rotation.z = Math.PI;
    handle.position.set(0, suitcaseHeight + 0.02, 0);
    girlRoot.add(handle);

    // The Girl Figure (Roopa Deva)
    const girlFigure = new THREE.Group();
    girlFigure.position.set(0, suitcaseHeight, 0.06);
    girlRoot.add(girlFigure);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.6 });
    const sweaterMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.7 }); // Teal knit sweater
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }); // Charcoal pants
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 }); // Dark sleek bob
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }); // Leather boots

    // Hips
    const hips = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.28), pantsMat);
    hips.position.set(0, 0.1, 0);
    hips.castShadow = true;
    girlFigure.add(hips);

    // Thighs
    const thighGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.38);
    const leftThigh = new THREE.Mesh(thighGeo, pantsMat);
    leftThigh.rotation.x = Math.PI / 2;
    leftThigh.position.set(-0.13, 0.1, 0.18);
    leftThigh.castShadow = true;
    girlFigure.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, pantsMat);
    rightThigh.rotation.x = Math.PI / 2;
    rightThigh.position.set(0.13, 0.1, 0.18);
    rightThigh.castShadow = true;
    girlFigure.add(rightThigh);

    // Shins dangling over front of suitcase
    const shinGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.42);
    const leftShin = new THREE.Mesh(shinGeo, pantsMat);
    leftShin.position.set(-0.13, -0.12, 0.36);
    leftShin.castShadow = true;
    girlFigure.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, pantsMat);
    rightShin.position.set(0.13, -0.12, 0.36);
    rightShin.castShadow = true;
    girlFigure.add(rightShin);

    // Boots
    const bootGeo = new THREE.BoxGeometry(0.13, 0.14, 0.22);
    const leftBoot = new THREE.Mesh(bootGeo, bootsMat);
    leftBoot.position.set(-0.13, -0.34, 0.41);
    leftBoot.castShadow = true;
    girlFigure.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, bootsMat);
    rightBoot.position.set(0.13, -0.34, 0.41);
    rightBoot.castShadow = true;
    girlFigure.add(rightBoot);

    // Torso / Sweater
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.26), sweaterMat);
    torso.position.set(0, 0.38, -0.02);
    torso.castShadow = true;
    girlFigure.add(torso);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.1), skinMat);
    neck.position.set(0, 0.64, -0.02);
    girlFigure.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), skinMat);
    head.position.set(0, 0.81, -0.01);
    head.castShadow = true;
    girlFigure.add(head);

    // Hair
    const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(0.205, 20, 20), hairMat);
    hairCrown.position.set(0, 0.84, -0.03);
    hairCrown.scale.set(1.02, 1.05, 1.1);
    girlFigure.add(hairCrown);

    const hairSideLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.22), hairMat);
    hairSideLeft.position.set(-0.16, 0.77, 0.02);
    girlFigure.add(hairSideLeft);

    const hairSideRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.22), hairMat);
    hairSideRight.position.set(0.16, 0.77, 0.02);
    girlFigure.add(hairSideRight);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.44);
    const leftArm = new THREE.Mesh(armGeo, sweaterMat);
    leftArm.position.set(-0.25, 0.35, 0.04);
    leftArm.rotation.z = 0.22;
    leftArm.rotation.x = -0.15;
    leftArm.castShadow = true;
    girlFigure.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, sweaterMat);
    rightArm.position.set(0.25, 0.35, 0.04);
    rightArm.rotation.z = -0.22;
    rightArm.rotation.x = -0.15;
    rightArm.castShadow = true;
    girlFigure.add(rightArm);

    // Golden Floating Beacon Crystal above her
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

    interactiveObjectsRef.current.push({ object: suitcase, landmarkId: 'girl_me' });
    interactiveObjectsRef.current.push({ object: torso, landmarkId: 'girl_me' });
    interactiveObjectsRef.current.push({ object: head, landmarkId: 'girl_me' });
    interactiveObjectsRef.current.push({ object: beacon, landmarkId: 'girl_me' });

    // --- 6. ARCHITECTURAL TOWERS & SKYSCRAPERS (OPTION B STYLE FROM VIDEO) ---
    // In the video, the towers have architectural letter / voxel forms
    const skyscrapersRoot = new THREE.Group();
    skyscrapersRoot.position.set(-1.4, globeRadius * 0.7, 0.2);
    globeRoot.add(skyscrapersRoot);
    skyscrapersGroupRef.current = skyscrapersRoot;

    const bldgColors = [0xf1f5f9, 0xe2e8f0, 0xcbd5e1, 0x94a3b8];
    const towerConfigs = [
      { x: 0, z: 0, w: 0.55, h: 1.6, d: 0.45 },
      { x: -0.45, z: 0.15, w: 0.45, h: 1.25, d: 0.4 },
      { x: 0.4, z: -0.2, w: 0.4, h: 1.9, d: 0.45 },
      { x: -0.15, z: -0.4, w: 0.5, h: 1.4, d: 0.35 },
    ];

    towerConfigs.forEach((cfg, idx) => {
      const bGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const bMat = new THREE.MeshStandardMaterial({
        color: bldgColors[idx % bldgColors.length],
        roughness: 0.35,
        metalness: 0.2,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(cfg.x, cfg.h / 2, cfg.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      skyscrapersRoot.add(bMesh);

      // Window grid detailing
      const windowMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      for (let wy = 0.2; wy < cfg.h - 0.2; wy += 0.3) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(cfg.w * 0.6, 0.1, cfg.d + 0.02), windowMat);
        win.position.set(cfg.x, wy, cfg.z);
        skyscrapersRoot.add(win);
      }

      interactiveObjectsRef.current.push({ object: bMesh, landmarkId: 'skyscrapers' });
    });

    // --- 7. THE COZY HOME (RIGHT SIDE, RED ROOF) ---
    const houseRoot = new THREE.Group();
    houseRoot.position.set(1.4, globeRadius * 0.68, 0.1);
    globeRoot.add(houseRoot);
    houseGroupRef.current = houseRoot;

    // Body
    const houseBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.65, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    houseBody.position.set(0, 0.325, 0);
    houseBody.castShadow = true;
    houseBody.receiveShadow = true;
    houseRoot.add(houseBody);

    // Red Gabled Roof
    const roofGeo = new THREE.ConeGeometry(0.75, 0.55, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 0.65 + 0.275, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseRoot.add(roof);

    // Chimney with cartoon smoke puff
    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.35, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 })
    );
    chimney.position.set(0.22, 0.88, 0.18);
    chimney.castShadow = true;
    houseRoot.add(chimney);

    const smokePuff = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })
    );
    smokePuff.position.set(0.22, 1.15, 0.18);
    houseRoot.add(smokePuff);

    interactiveObjectsRef.current.push({ object: houseBody, landmarkId: 'cozy_house' });
    interactiveObjectsRef.current.push({ object: roof, landmarkId: 'cozy_house' });

    // --- 8. HARBOR DOCK, CRANE & TINY YELLOW BOAT (AS IN VIDEO AT 00:04) ---
    const dockRoot = new THREE.Group();
    dockRoot.position.set(0, -globeRadius * 0.96, 0.2);
    globeRoot.add(dockRoot);

    // Crane Mast
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const craneMast = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.5, 0.14), craneMat);
    craneMast.position.set(0, 0.75, 0);
    craneMast.castShadow = true;
    dockRoot.add(craneMast);

    const craneJib = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.1), craneMat);
    craneJib.position.set(0.35, 1.5, 0);
    craneJib.castShadow = true;
    dockRoot.add(craneJib);

    interactiveObjectsRef.current.push({ object: craneMast, landmarkId: 'crane' });

    // Little Yellow Boat cruising in the water below (Directly from video!)
    const boatGroup = new THREE.Group();
    boatGroup.position.set(0, -globeRadius * 1.08, 0.8);
    scene.add(boatGroup);
    boatGroupRef.current = boatGroup;

    const boatHull = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.15, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }) // Yellow boat
    );
    boatGroup.add(boatHull);

    const boatCabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.18, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    boatCabin.position.set(-0.06, 0.14, 0);
    boatGroup.add(boatCabin);

    // --- 9. RETRO ORBITING ROCKET WITH SMOKE TRAIL ---
    const rocketRoot = new THREE.Group();
    scene.add(rocketRoot);
    rocketGroupRef.current = rocketRoot;

    const rocketBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.46, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    rocketBody.rotation.z = Math.PI / 2;
    rocketRoot.add(rocketBody);

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.22, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(0.34, 0, 0);
    rocketRoot.add(nose);

    // Continuous Smoke Ring Torus
    const smokeGeo = new THREE.TorusGeometry(globeRadius * 1.38, 0.07, 16, 80);
    const smokeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      transparent: true,
      opacity: 0.85,
    });
    const smokeTrail = new THREE.Mesh(smokeGeo, smokeMat);
    smokeTrail.rotation.x = Math.PI / 3;
    smokeTrail.rotation.y = Math.PI / 6;
    globeRoot.add(smokeTrail);
    smokeTrailRef.current = smokeTrail;

    interactiveObjectsRef.current.push({ object: rocketBody, landmarkId: 'rocket' });
    interactiveObjectsRef.current.push({ object: nose, landmarkId: 'rocket' });

    // --- 10. HOT AIR BALLOONS ---
    const balloonsGroup = new THREE.Group();
    globeRoot.add(balloonsGroup);

    function createBalloon(color: number, pos: [number, number, number], scale: number = 0.75) {
      const bGroup = new THREE.Group();
      bGroup.position.set(...pos);
      bGroup.scale.setScalar(scale);

      const envelope = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 20, 20),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
      envelope.scale.set(1, 1.25, 1);
      envelope.castShadow = true;
      bGroup.add(envelope);

      const basket = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.12, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      basket.position.set(0, -0.65, 0);
      bGroup.add(basket);

      interactiveObjectsRef.current.push({ object: envelope, landmarkId: 'hot_air_balloon' });
      return bGroup;
    }

    const balloonPink = createBalloon(0xec4899, [globeRadius * 0.85, globeRadius * 0.85, 0.4], 0.8);
    const balloonYellow = createBalloon(0xf59e0b, [globeRadius * 0.95, globeRadius * 0.45, -0.6], 0.6);
    balloonsGroup.add(balloonPink);
    balloonsGroup.add(balloonYellow);

    // --- 11. CUMULUS CLOUD RING ---
    const cloudsGroup = new THREE.Group();
    globeRoot.add(cloudsGroup);
    cloudsGroupRef.current = cloudsGroup;

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      transparent: true,
      opacity: 0.92,
    });

    for (let c = 0; c < 10; c++) {
      const singleCloud = new THREE.Group();
      const angle = (c / 10) * Math.PI * 2;
      const cDist = globeRadius * (1.18 + (c % 2) * 0.1);
      const cY = (c % 2 === 0 ? 0.35 : -0.35) + Math.sin(c) * 0.3;

      singleCloud.position.set(Math.cos(angle) * cDist, cY, Math.sin(angle) * cDist);

      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.18 + Math.random() * 0.12, 10, 10),
          cloudMat
        );
        puff.position.set((p - 1) * 0.16, 0, (Math.random() - 0.5) * 0.1);
        singleCloud.add(puff);
      }
      cloudsGroup.add(singleCloud);
    }

    // --- 12. EVENT LISTENERS (MOUSE & TOUCH RAYCASTING & ORBIT) ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      mouseVelocityRef.current = { x: 0, y: 0 };
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;
      setCursorPos({ x: e.clientX, y: e.clientY });

      if (isDraggingRef.current && globeRoot) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        mouseVelocityRef.current = { x: deltaX * 0.005, y: deltaY * 0.005 };

        globeRoot.rotation.y += deltaX * 0.006;
        globeRoot.rotation.x += deltaY * 0.004;

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        interactiveObjectsRef.current.map((i) => i.object),
        true
      );

      if (intersects.length > 0) {
        const hit = intersects[0];
        const match = interactiveObjectsRef.current.find(
          (item) => item.object === hit.object || item.object.children.includes(hit.object)
        );
        if (match) {
          const lData = landmarks.find((l) => l.id === match.landmarkId);
          setHoveredLandmark(lData || null);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredLandmark(null);
      container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
    };

    const onPointerUp = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - previousMousePositionRef.current.x);
      const deltaY = Math.abs(e.clientY - previousMousePositionRef.current.y);

      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      if (deltaX < 5 && deltaY < 5) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          interactiveObjectsRef.current.map((i) => i.object),
          true
        );

        if (intersects.length > 0) {
          const hit = intersects[0];
          const match = interactiveObjectsRef.current.find(
            (item) => item.object === hit.object || item.object.children.includes(hit.object)
          );
          if (match) {
            const lData = landmarks.find((l) => l.id === match.landmarkId);
            if (lData) {
              sound.playChime();
              onSelectLandmark(lData);
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
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
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

    // --- 13. ANIMATION RENDER LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

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
      if (isAutoRotate && !isDraggingRef.current && !selectedLandmark && globeRoot) {
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

      // Little boat floating & rocking
      if (boatGroup) {
        const boatAngle = -elapsedTime * 0.4;
        const bDist = globeRadius * 1.05;
        boatGroup.position.set(Math.cos(boatAngle) * bDist, -globeRadius * 0.7, Math.sin(boatAngle) * bDist);
        boatGroup.rotation.y = boatAngle + Math.PI / 2;
        boatGroup.rotation.z = Math.sin(elapsedTime * 3) * 0.08;
      }

      // Girl breathing & beacon pulse
      if (girlFigure) {
        const breath = Math.sin(elapsedTime * 2.2) * 0.02;
        torso.scale.set(1 + breath, 1 + breath, 1 + breath);
        head.rotation.y = Math.sin(elapsedTime * 1.2) * 0.1;
        beacon.rotation.y = elapsedTime * 2;
        beacon.position.y = 1.25 + Math.sin(elapsedTime * 3) * 0.06;
      }

      // Clouds rotation
      if (cloudsGroup) {
        cloudsGroup.rotation.y = elapsedTime * 0.04;
      }

      // Anti-Gravity float physics!
      if (isAntiGravity) {
        const agOffset = Math.sin(elapsedTime * 2.5) * 0.14;
        girlRoot.position.y = globeRadius + 0.15 + agOffset;
        skyscrapersRoot.position.y = globeRadius * 0.7 + agOffset * 0.8;
        houseRoot.position.y = globeRadius * 0.68 + agOffset * 0.8;
        if (smokeTrailRef.current) {
          smokeTrailRef.current.scale.setScalar(1 + agOffset * 0.05);
        }
      } else {
        girlRoot.position.y = globeRadius + 0.1;
        skyscrapersRoot.position.y = globeRadius * 0.7;
        houseRoot.position.y = globeRadius * 0.68;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [landmarks, onSelectLandmark, isAntiGravity, isAutoRotate, DEFAULT_CAM_POS, DEFAULT_TARGET, DEFAULT_FOV]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      {hoveredLandmark && (
        <div
          className="fixed pointer-events-none z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 bg-slate-900/90 text-white backdrop-blur-md rounded-xl border border-slate-700/60 shadow-xl animate-bounce"
          style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y - 12}px` }}
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
