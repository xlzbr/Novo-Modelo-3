import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CampusBuilding } from '../types';
import { getCampusPath } from '../data/campusData';
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  Eye,
  Navigation,
  MapPin,
  Compass,
  Move,
  Focus,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

interface CampusMap3DProps {
  buildings: CampusBuilding[];
  selectedBuildingId: string | null;
  onSelectBuilding: (buildingId: string) => void;
  targetRoom?: string;
  className?: string;
}

export const CampusMap3D: React.FC<CampusMap3DProps> = ({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  targetRoom,
  className = 'w-full h-full min-h-[360px]',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredBuildingName, setHoveredBuildingName] = useState<string | null>(null);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);
  const [cameraModeTip, setCameraModeTip] = useState<string>('Órbita The Sims');

  // References for camera controller
  // Target focal point in the campus (look-at target)
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));

  // Spherical camera coordinate parameters: radius (distance), theta (azimuth), phi (polar angle)
  const cameraRadiusRef = useRef<number>(55);
  const cameraThetaRef = useRef<number>(Math.PI * 0.25); // 45 degrees isometric angle
  const cameraPhiRef = useRef<number>(Math.PI * 0.32); // ~57 degrees pitch

  const targetRadiusRef = useRef<number>(55);
  const targetThetaRef = useRef<number>(Math.PI * 0.25);
  const targetPhiRef = useRef<number>(Math.PI * 0.32);

  const selectedBuildingIdRef = useRef<string | null>(selectedBuildingId);
  const targetRoomRef = useRef<string | undefined>(targetRoom);
  const onSelectBuildingRef = useRef(onSelectBuilding);

  const { theme } = useEdu();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    selectedBuildingIdRef.current = selectedBuildingId;
  }, [selectedBuildingId]);

  useEffect(() => {
    targetRoomRef.current = targetRoom;
  }, [targetRoom]);

  useEffect(() => {
    onSelectBuildingRef.current = onSelectBuilding;
  }, [onSelectBuilding]);

  // Smooth focus on selected building preserving current viewing angle
  useEffect(() => {
    if (selectedBuildingId) {
      const b = buildings.find((x) => x.id === selectedBuildingId);
      if (b) {
        const [bx, by, bz] = b.position3D;
        // Shift focal look-at target to building's center/entrance
        targetLookAtRef.current.set(bx, by + 2.0, bz);
        // Ideal close inspection distance adapted to building scale
        targetRadiusRef.current = 28;
        // Keep pitch at comfortable angle for building viewing
        targetPhiRef.current = THREE.MathUtils.clamp(targetPhiRef.current, 0.45, 0.85);
      }
    } else {
      // Default overview
      targetLookAtRef.current.set(0, 1.2, 0);
      targetRadiusRef.current = 55;
      targetPhiRef.current = Math.PI * 0.32;
    }
  }, [selectedBuildingId, buildings]);

  const handleResetView = useCallback(() => {
    targetLookAtRef.current.set(0, 1.2, 0);
    targetRadiusRef.current = 55;
    targetThetaRef.current = Math.PI * 0.25;
    targetPhiRef.current = Math.PI * 0.32;
    setCameraModeTip('Visão Geral do Campus');
    setTimeout(() => setCameraModeTip('Órbita The Sims'), 2000);
  }, []);

  const handleFocusDestination = useCallback(() => {
    if (selectedBuildingIdRef.current) {
      const b = buildings.find((x) => x.id === selectedBuildingIdRef.current);
      if (b) {
        const [bx, by, bz] = b.position3D;
        targetLookAtRef.current.set(bx, by + 2.0, bz);
        targetRadiusRef.current = 26;
        targetPhiRef.current = 0.55;
        setCameraModeTip(`Foco: ${b.shortName}`);
        setTimeout(() => setCameraModeTip('Órbita The Sims'), 2000);
      }
    } else {
      handleResetView();
    }
  }, [buildings, handleResetView]);

  const handleZoom = useCallback((delta: number) => {
    targetRadiusRef.current = THREE.MathUtils.clamp(
      targetRadiusRef.current + delta,
      16,
      88
    );
  }, []);

  const handleRotate = useCallback((angleDelta: number) => {
    targetThetaRef.current += angleDelta;
  }, []);

  const handlePitch = useCallback((pitchDelta: number) => {
    // Clamp polar angle (0.28 rad ≈ 16° to 1.35 rad ≈ 77°)
    targetPhiRef.current = THREE.MathUtils.clamp(
      targetPhiRef.current + pitchDelta,
      0.28,
      1.35
    );
  }, []);

  // Keyboard navigation listener (arrows, +, -, Home/R, F)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handleRotate(-0.1);
      } else if (e.key === 'ArrowRight') {
        handleRotate(0.1);
      } else if (e.key === 'ArrowUp') {
        handlePitch(-0.06);
      } else if (e.key === 'ArrowDown') {
        handlePitch(0.06);
      } else if (e.key === '+' || e.key === '=') {
        handleZoom(-5);
      } else if (e.key === '-' || e.key === '_') {
        handleZoom(5);
      } else if (e.key === 'Home' || e.key === 'r' || e.key === 'R') {
        handleResetView();
      } else if (e.key === 'f' || e.key === 'F') {
        handleFocusDestination();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleRotate, handlePitch, handleZoom, handleResetView, handleFocusDestination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL support verification
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlAvailable(false);
        return;
      }
    } catch {
      setWebGlAvailable(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    // Warm tropical sky gradient background
    scene.background = new THREE.Color('#DCE8F4');
    scene.fog = new THREE.FogExp2('#DCE8F4', 0.0075);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 300);

    // Initial position calculated from spherical coords
    const updateCamFromSpherical = (lerpFactor = 0.08) => {
      cameraRadiusRef.current = THREE.MathUtils.lerp(
        cameraRadiusRef.current,
        targetRadiusRef.current,
        lerpFactor
      );
      cameraThetaRef.current = THREE.MathUtils.lerp(
        cameraThetaRef.current,
        targetThetaRef.current,
        lerpFactor
      );
      cameraPhiRef.current = THREE.MathUtils.lerp(
        cameraPhiRef.current,
        targetPhiRef.current,
        lerpFactor
      );
      currentLookAtRef.current.lerp(targetLookAtRef.current, lerpFactor);

      const r = cameraRadiusRef.current;
      const th = cameraThetaRef.current;
      const ph = cameraPhiRef.current;

      const cx = currentLookAtRef.current.x + r * Math.sin(ph) * Math.sin(th);
      const cy = currentLookAtRef.current.y + r * Math.cos(ph);
      const cz = currentLookAtRef.current.z + r * Math.sin(ph) * Math.cos(th);

      camera.position.set(cx, cy, cz);
      camera.lookAt(currentLookAtRef.current);
    };

    updateCamFromSpherical(1.0);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL initialization failed in CampusMap3D:', err);
      setWebGlAvailable(false);
      return;
    }

    // Shared Palette & Materials
    const palette = {
      grass: '#78A76E',
      grassAccent: '#8DB882',
      pavement: '#E2E8F0',
      pavementPlaza: '#EDF2F7',
      roadAsphalt: '#334155',
      roadCurb: '#CBD5E1',
      roadStripe: '#F8FAFC',
      foliumNavy: '#203A65',
      foliumNavyLight: '#2F4E85',
      glassCyan: '#38BDF8',
      glassNavy: '#1E3A5F',
      concreteWhite: '#FFFFFF',
      concreteSand: '#F1F5F9',
      roofGraphite: '#475569',
      woodDeck: '#B47B4E',
      waterCyan: '#0284C7',
      skylineFog: '#C5D6E8',
      palmTrunk: '#85583C',
      palmLeaf: '#2E7D32',
      treeLeafA: '#388E3C',
      treeLeafB: '#43A047',
    };

    // Procedural Textures
    const createStripedTileTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#E8EEF5';
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 128, 128);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.strokeRect(4, 4, 120, 120);

      const t = new THREE.CanvasTexture(c);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(8, 8);
      return t;
    };

    const tileTexture = createStripedTileTexture();

    // Label Sprite Generator
    const createLabelSprite = (text: string, subtext?: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 384;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      // Background rounded pill
      ctx.fillStyle = 'rgba(20, 36, 63, 0.94)';
      ctx.beginPath();
      ctx.roundRect(14, 16, 356, 96, 26);
      ctx.fill();

      // Border glow
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.font = 'bold 36px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 192, subtext ? 50 : 64);

      if (subtext) {
        ctx.font = '600 20px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = '#93C5FD';
        ctx.fillText(subtext, 192, 84);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(6.2, 2.1, 1);
      return sprite;
    };

    // Lights
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#94A3B8', 0.65);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#FFF9E6', 1.85);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Auxiliary soft fill light from opposite angle
    const fillLight = new THREE.DirectionalLight('#BAE6FD', 0.45);
    fillLight.position.set(-35, 30, -35);
    scene.add(fillLight);

    // =========================================================================
    // 1. TERRAIN & THE GREAT QUADRANGLE MASTER PLAN (FASE 1)
    // =========================================================================
    const campusRoot = new THREE.Group();
    scene.add(campusRoot);

    // Architectural Palette
    const archMat = {
      limestone: new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.6 }),
      limestoneWarm: new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.55 }),
      concreteWhite: new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.4 }),
      concretePillar: new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.5 }),
      slateRoof: new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.45 }),
      slateDark: new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.4 }),
      copperRoof: new THREE.MeshStandardMaterial({ color: '#2E6152', roughness: 0.35, metalness: 0.2 }),
      greenRoof: new THREE.MeshStandardMaterial({ color: '#4D7C0F', roughness: 0.85 }),
      woodDeck: new THREE.MeshStandardMaterial({ color: '#92603C', roughness: 0.7 }),
      woodPergola: new THREE.MeshStandardMaterial({ color: '#784421', roughness: 0.65 }),
      navyTrim: new THREE.MeshStandardMaterial({ color: palette.foliumNavy, roughness: 0.35 }),
      navyDark: new THREE.MeshStandardMaterial({ color: '#162847', roughness: 0.35 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.3, metalness: 0.4 }),
      brassGold: new THREE.MeshStandardMaterial({ color: '#F59E0B', roughness: 0.2, metalness: 0.85 }),
      waterCyan: new THREE.MeshStandardMaterial({
        color: '#0284C7',
        roughness: 0.06,
        metalness: 0.4,
        transparent: true,
        opacity: 0.88,
      }),
      glassFacade: new THREE.MeshStandardMaterial({
        color: '#38BDF8',
        roughness: 0.12,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      }),
      glassAtrium: new THREE.MeshStandardMaterial({
        color: '#7DD3FC',
        roughness: 0.08,
        metalness: 0.85,
        transparent: true,
        opacity: 0.75,
      }),
      pavementStone: new THREE.MeshStandardMaterial({
        color: '#E8EEF5',
        map: tileTexture,
        roughness: 0.65,
      }),
      pavementPlaza: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.5,
      }),
      curbStone: new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.6 }),
      roadAsphalt: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.85 }),
      parkLawn: new THREE.MeshStandardMaterial({ color: palette.grass, roughness: 0.8 }),
      lawnQuadrant: new THREE.MeshStandardMaterial({ color: '#82B376', roughness: 0.82 }),
    };

    // Base Regional Ground Plane (extends to horizon)
    const baseRegionalGeo = new THREE.PlaneGeometry(280, 280);
    const baseRegionalMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.95 });
    const baseRegional = new THREE.Mesh(baseRegionalGeo, baseRegionalMat);
    baseRegional.rotation.x = -Math.PI / 2;
    baseRegional.receiveShadow = true;
    campusRoot.add(baseRegional);

    // Elevated Campus Park Plinth (The Main Campus Plate: 86m x 90m)
    const campusPlateGeo = new THREE.BoxGeometry(86, 0.2, 90);
    const campusPlateMat = archMat.parkLawn;
    const campusPlate = new THREE.Mesh(campusPlateGeo, campusPlateMat);
    campusPlate.position.set(0, 0.1, 0);
    campusPlate.receiveShadow = true;
    campusRoot.add(campusPlate);

    // Perimeter Granite Retaining Border Curb
    const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(86.6, 0.28, 0.8), archMat.curbStone);
    curbNorth.position.set(0, 0.16, -45);
    campusRoot.add(curbNorth);

    const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(86.6, 0.28, 0.8), archMat.curbStone);
    curbSouth.position.set(0, 0.16, 45);
    campusRoot.add(curbSouth);

    const curbWest = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 90.6), archMat.curbStone);
    curbWest.position.set(-43, 0.16, 0);
    campusRoot.add(curbWest);

    const curbEast = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 90.6), archMat.curbStone);
    curbEast.position.set(43, 0.16, 0);
    campusRoot.add(curbEast);

    // =========================================================================
    // THE GREAT QUADRANGLE: Central Lawn Quadrants & Radial Walkways
    // =========================================================================
    // 4 Symmetrical Manicured Lawn Sectors with Beveled Stone Border (Britechester Quad style)
    const quadSectorDefs = [
      { x: -9.5, z: -10, w: 9.5, d: 8 },  // Northwest Quad (between Reitoria, Bloco A, Spine)
      { x: 9.5, z: -10, w: 9.5, d: 8 },   // Northeast Quad (between Reitoria, Bloco B, Spine)
      { x: -9.5, z: 12, w: 9.5, d: 9 },   // Southwest Quad (between Bloco C, Convivência, Spine)
      { x: 9.5, z: 12, w: 9.5, d: 9 },    // Southeast Quad (between Biblioteca, Convivência, Spine)
    ];

    quadSectorDefs.forEach((q) => {
      // Raised manicured lawn patch
      const qGeo = new THREE.BoxGeometry(q.w, 0.14, q.d);
      const qMesh = new THREE.Mesh(qGeo, archMat.lawnQuadrant);
      qMesh.position.set(q.x, 0.22, q.z);
      qMesh.receiveShadow = true;
      campusRoot.add(qMesh);

      // Stone border coping frame
      const borderGeo = new THREE.BoxGeometry(q.w + 0.5, 0.08, q.d + 0.5);
      const borderMesh = new THREE.Mesh(borderGeo, archMat.curbStone);
      borderMesh.position.set(q.x, 0.24, q.z);
      borderMesh.receiveShadow = true;
      campusRoot.add(borderMesh);
    });

    // Grand Boulevard Central Spine (North-South axial walkway: 8m wide)
    const spineWalkway = new THREE.Mesh(new THREE.PlaneGeometry(8, 70), archMat.pavementStone);
    spineWalkway.rotation.x = -Math.PI / 2;
    spineWalkway.position.set(0, 0.21, 0);
    spineWalkway.receiveShadow = true;
    campusRoot.add(spineWalkway);

    // North Cross-Walkway (connecting Bloco A and Bloco B at z = -6)
    const crossWalkwayNorth = new THREE.Mesh(new THREE.PlaneGeometry(54, 6.8), archMat.pavementStone);
    crossWalkwayNorth.rotation.x = -Math.PI / 2;
    crossWalkwayNorth.position.set(0, 0.212, -6);
    crossWalkwayNorth.receiveShadow = true;
    campusRoot.add(crossWalkwayNorth);

    // South Cross-Walkway (connecting Bloco C and Biblioteca at z = +8)
    const crossWalkwaySouth = new THREE.Mesh(new THREE.PlaneGeometry(54, 6.8), archMat.pavementStone);
    crossWalkwaySouth.rotation.x = -Math.PI / 2;
    crossWalkwaySouth.position.set(0, 0.212, 8);
    crossWalkwaySouth.receiveShadow = true;
    campusRoot.add(crossWalkwaySouth);

    // Central Grand Plaza & Water Mirror / Fountain (Centerpiece at [0, 0, 1])
    const plazaCenterGroup = new THREE.Group();
    plazaCenterGroup.position.set(0, 0.22, 1);

    // Outer circular stone plaza promenade
    const outerPlazaGeo = new THREE.CylinderGeometry(10.5, 10.8, 0.12, 48);
    const outerPlaza = new THREE.Mesh(outerPlazaGeo, archMat.pavementPlaza);
    outerPlaza.receiveShadow = true;
    plazaCenterGroup.add(outerPlaza);

    // Decorative contrasting stone ring
    const ringPlazaGeo = new THREE.RingGeometry(8.5, 10.2, 48);
    const ringPlaza = new THREE.Mesh(ringPlazaGeo, archMat.pavementStone);
    ringPlaza.rotation.x = -Math.PI / 2;
    ringPlaza.position.y = 0.07;
    ringPlaza.receiveShadow = true;
    plazaCenterGroup.add(ringPlaza);

    // Central Fountain Water Basin Rim
    const fountainRimGeo = new THREE.CylinderGeometry(5.4, 5.7, 0.48, 40);
    const fountainRim = new THREE.Mesh(fountainRimGeo, archMat.navyDark);
    fountainRim.position.y = 0.26;
    fountainRim.castShadow = true;
    fountainRim.receiveShadow = true;
    plazaCenterGroup.add(fountainRim);

    // Inner coping curb
    const fountainInnerCurb = new THREE.Mesh(
      new THREE.CylinderGeometry(5.0, 5.0, 0.52, 40),
      archMat.limestone
    );
    fountainInnerCurb.position.y = 0.27;
    plazaCenterGroup.add(fountainInnerCurb);

    // Water Surface
    const fountainWater = new THREE.Mesh(
      new THREE.CylinderGeometry(4.7, 4.7, 0.42, 40),
      archMat.waterCyan
    );
    fountainWater.position.y = 0.32;
    plazaCenterGroup.add(fountainWater);

    // Classical Multi-Tier Fountain Centerpiece
    // Lower pedestal
    const fPedestal1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.8, 24), archMat.limestone);
    fPedestal1.position.y = 0.6;
    fPedestal1.castShadow = true;
    plazaCenterGroup.add(fPedestal1);

    // Middle spill bowl
    const fBowl1 = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 1.4, 0.35, 24), archMat.navyDark);
    fBowl1.position.y = 1.05;
    fBowl1.castShadow = true;
    plazaCenterGroup.add(fBowl1);

    // Upper fluted column
    const fPedestal2 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.8, 16), archMat.limestone);
    fPedestal2.position.y = 1.5;
    fPedestal2.castShadow = true;
    plazaCenterGroup.add(fPedestal2);

    // Upper spill bowl
    const fBowl2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.6, 0.25, 20), archMat.navyDark);
    fBowl2.position.y = 1.95;
    fBowl2.castShadow = true;
    plazaCenterGroup.add(fBowl2);

    // Central bronze water plume finial
    const fFinial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 0.9, 12), archMat.brassGold);
    fFinial.position.y = 2.45;
    fFinial.castShadow = true;
    plazaCenterGroup.add(fFinial);

    // Curved Stone Benches around Plaza
    const benchAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    benchAngles.forEach((ang) => {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(Math.cos(ang) * 8.2, 0.08, Math.sin(ang) * 8.2);
      benchGroup.rotation.y = -ang + Math.PI / 2;

      // Stone bench seat & supports
      const seat = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.16, 0.75), archMat.limestoneWarm);
      seat.position.y = 0.35;
      seat.castShadow = true;
      benchGroup.add(seat);

      [-1.1, 1.1].forEach((bx) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.65), archMat.slateRoof);
        leg.position.set(bx, 0.175, 0);
        benchGroup.add(leg);
      });

      plazaCenterGroup.add(benchGroup);
    });

    campusRoot.add(plazaCenterGroup);

    // =========================================================================
    // EXTERNAL ROADS & PARKING BAYS
    // =========================================================================
    const createOuterRoadways = () => {
      const roadsGroup = new THREE.Group();

      // North Avenue (Arrival Boulevard in front of Portão 1)
      const northRoad = new THREE.Mesh(new THREE.PlaneGeometry(160, 10), archMat.roadAsphalt);
      northRoad.rotation.x = -Math.PI / 2;
      northRoad.position.set(0, 0.04, -38);
      northRoad.receiveShadow = true;
      roadsGroup.add(northRoad);

      // South Avenue (behind Portão 2)
      const southRoad = new THREE.Mesh(new THREE.PlaneGeometry(160, 10), archMat.roadAsphalt);
      southRoad.rotation.x = -Math.PI / 2;
      southRoad.position.set(0, 0.04, 38);
      southRoad.receiveShadow = true;
      roadsGroup.add(southRoad);

      // Yellow Center Divided Road Stripes
      const stripeMat = new THREE.MeshBasicMaterial({ color: '#FEF08A' });
      for (let x = -75; x <= 75; x += 6) {
        const s1 = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.28), stripeMat);
        s1.rotation.x = -Math.PI / 2;
        s1.position.set(x, 0.045, -38);
        roadsGroup.add(s1);

        const s2 = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.28), stripeMat);
        s2.rotation.x = -Math.PI / 2;
        s2.position.set(x, 0.045, 38);
        roadsGroup.add(s2);
      }

      // University Visitor & Staff Parking Bays (Northwest & Northeast)
      const createParkingBay = (px: number, pz: number) => {
        const lotGroup = new THREE.Group();
        lotGroup.position.set(px, 0.05, pz);

        // Asphalt parking apron
        const lotMesh = new THREE.Mesh(new THREE.PlaneGeometry(18, 12), archMat.roadAsphalt);
        lotMesh.rotation.x = -Math.PI / 2;
        lotMesh.receiveShadow = true;
        lotGroup.add(lotMesh);

        // Parking stall white lines
        const whiteLineMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
        for (let sx = -7.5; sx <= 7.5; sx += 3.0) {
          const stallLine = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 5.0), whiteLineMat);
          stallLine.rotation.x = -Math.PI / 2;
          stallLine.position.set(sx, 0.01, -3);
          lotGroup.add(stallLine);

          const stallLine2 = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 5.0), whiteLineMat);
          stallLine2.rotation.x = -Math.PI / 2;
          stallLine2.position.set(sx, 0.01, 3);
          lotGroup.add(stallLine2);
        }

        // Low perimeter granite curb
        const curb = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.22, 0.4), archMat.curbStone);
        curb.position.set(0, 0.11, 6.2);
        lotGroup.add(curb);

        return lotGroup;
      };

      roadsGroup.add(createParkingBay(-26, -32));
      roadsGroup.add(createParkingBay(26, -32));

      campusRoot.add(roadsGroup);
    };

    createOuterRoadways();

    // =========================================================================
    // 2. MAIN GATEWAY ARCHITECTURE (PORTÃO 1 & PORTÃO 2)
    // =========================================================================
    const createMainGatehouse = () => {
      const gateGroup = new THREE.Group();
      gateGroup.position.set(0, 0, -30);

      // Semicircular Arrival Drop-Off Loop
      const dropOffGeo = new THREE.RingGeometry(8, 14.2, 36, 1, 0, Math.PI);
      const dropOff = new THREE.Mesh(dropOffGeo, archMat.roadAsphalt);
      dropOff.rotation.x = -Math.PI / 2;
      dropOff.position.set(0, 0.06, -2.5);
      dropOff.receiveShadow = true;
      gateGroup.add(dropOff);

      // Central Landscaped Island with stone retaining curb
      const islandGeo = new THREE.CircleGeometry(7.8, 36);
      const island = new THREE.Mesh(islandGeo, archMat.lawnQuadrant);
      island.rotation.x = -Math.PI / 2;
      island.position.set(0, 0.14, -2.5);
      island.receiveShadow = true;
      gateGroup.add(island);

      const islandCurb = new THREE.Mesh(new THREE.TorusGeometry(7.8, 0.18, 8, 36), archMat.curbStone);
      islandCurb.rotation.x = -Math.PI / 2;
      islandCurb.position.set(0, 0.18, -2.5);
      gateGroup.add(islandCurb);

      // Modern Sculptural Canopy (Aerodynamic University Gateway)
      const canopyWing = new THREE.Mesh(new THREE.BoxGeometry(18, 0.55, 7.2), archMat.concreteWhite);
      canopyWing.position.set(0, 4.5, 0);
      canopyWing.castShadow = true;
      gateGroup.add(canopyWing);

      // Navy Fascia Band on Canopy
      const canopyFascia = new THREE.Mesh(new THREE.BoxGeometry(18.3, 0.3, 7.5), archMat.navyTrim);
      canopyFascia.position.set(0, 4.75, 0);
      gateGroup.add(canopyFascia);

      // V-shaped Angled Steel Support Columns
      [-6.5, 6.5].forEach((px) => {
        [-2.4, 2.4].forEach((pz) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.4, 16), archMat.darkMetal);
          col.position.set(px, 2.2, pz);
          col.castShadow = true;
          gateGroup.add(col);
        });
      });

      // Security Reception & Control Booth (Guarita de Acesso com Vidro Panorâmico)
      const boothCore = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.4, 4.0), archMat.limestone);
      boothCore.position.set(0, 1.7, 0);
      boothCore.castShadow = true;
      gateGroup.add(boothCore);

      const boothRoof = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 4.4), archMat.slateRoof);
      boothRoof.position.set(0, 3.5, 0);
      gateGroup.add(boothRoof);

      // Booth Continuous Glass Window Band
      const boothGlass = new THREE.Mesh(new THREE.BoxGeometry(4.9, 1.3, 4.1), archMat.glassFacade);
      boothGlass.position.set(0, 1.9, 0);
      gateGroup.add(boothGlass);

      // Pedestrian Turnstile Pavilions (East and West access gates)
      [-5.0, 5.0].forEach((tx) => {
        const turnstilePad = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 6.0), archMat.pavementStone);
        turnstilePad.position.set(tx, 0.1, 0);
        turnstilePad.receiveShadow = true;
        gateGroup.add(turnstilePad);
      });

      // Institutional "FOLIUM UNIVERSIDADE" Gateway Totem
      const totemCore = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.2, 0.5), archMat.navyDark);
      totemCore.position.set(9.2, 2.1, 2.5);
      totemCore.castShadow = true;
      gateGroup.add(totemCore);

      const totemGold = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 0.55), archMat.brassGold);
      totemGold.position.set(9.2, 4.1, 2.5);
      gateGroup.add(totemGold);

      const label = createLabelSprite('PORTÃO 1', 'BOULEVARD PRINCIPAL');
      label.position.set(0, 6.2, 0);
      label.scale.set(6.8, 2.3, 1);
      gateGroup.add(label);

      campusRoot.add(gateGroup);
    };

    createMainGatehouse();

    // South Entrance (Portão 2 — Acesso Sul & Convivência)
    const createSouthGatehouse = () => {
      const gateGroup = new THREE.Group();
      gateGroup.position.set(0, 0, 30);

      // Gateway Canopy
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(14, 0.45, 5.5), archMat.concreteWhite);
      canopy.position.set(0, 4.2, 0);
      canopy.castShadow = true;
      gateGroup.add(canopy);

      const fascia = new THREE.Mesh(new THREE.BoxGeometry(14.3, 0.25, 5.8), archMat.navyTrim);
      fascia.position.set(0, 4.45, 0);
      gateGroup.add(fascia);

      // Stone Gateway Piers
      [-5.5, 5.5].forEach((px) => {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.2, 0.8), archMat.limestone);
        pier.position.set(px, 2.1, 0);
        pier.castShadow = true;
        gateGroup.add(pier);
      });

      const label = createLabelSprite('PORTÃO 2', 'ACESSO SUL & CONVIVÊNCIA');
      label.position.set(0, 5.6, 0);
      label.scale.set(6.4, 2.1, 1);
      gateGroup.add(label);

      campusRoot.add(gateGroup);
    };

    createSouthGatehouse();

    // =========================================================================
    // 3. CAMPUS LANDSCAPING & TREE GROVES
    // =========================================================================
    const createPalmTree = (x: number, z: number, scale = 1.0) => {
      const palmGroup = new THREE.Group();
      palmGroup.position.set(x, 0, z);
      palmGroup.scale.set(scale, scale, scale);

      const trunkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.12, 2.5, 0),
        new THREE.Vector3(0.04, 5.0, 0.08),
        new THREE.Vector3(0, 6.8, 0.16),
      ]);
      const trunkGeo = new THREE.TubeGeometry(trunkCurve, 12, 0.26, 8, false);
      const trunkMat = new THREE.MeshStandardMaterial({ color: palette.palmTrunk, roughness: 0.85 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.castShadow = true;
      palmGroup.add(trunk);

      const leafMat = new THREE.MeshStandardMaterial({
        color: palette.palmLeaf,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });

      const frondCount = 9;
      for (let i = 0; i < frondCount; i++) {
        const angle = (i / frondCount) * Math.PI * 2;
        const frondGroup = new THREE.Group();
        frondGroup.position.set(0, 6.8, 0.16);
        frondGroup.rotation.y = angle;
        frondGroup.rotation.z = 0.55 + Math.random() * 0.12;

        const frondGeo = new THREE.ConeGeometry(0.75, 3.8, 4);
        frondGeo.translate(0, 1.9, 0);
        const frond = new THREE.Mesh(frondGeo, leafMat);
        frond.castShadow = true;
        frondGroup.add(frond);
        palmGroup.add(frondGroup);
      }

      const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.32, 16), archMat.curbStone);
      planter.position.y = 0.16;
      planter.receiveShadow = true;
      palmGroup.add(planter);

      return palmGroup;
    };

    const createShadeTree = (x: number, z: number, scale = 1.0, leafColor = palette.treeLeafA) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);
      treeGroup.scale.set(scale, scale, scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.35, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: '#5C381E', roughness: 0.9 })
      );
      trunk.position.y = 1.1;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const leafMat = new THREE.MeshStandardMaterial({
        color: leafColor,
        roughness: 0.75,
        flatShading: true,
      });

      const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 1), leafMat);
      c1.position.y = 2.8;
      c1.castShadow = true;
      treeGroup.add(c1);

      const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), leafMat);
      c2.position.set(0.5, 3.3, 0.4);
      c2.castShadow = true;
      treeGroup.add(c2);

      const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 1), leafMat);
      c3.position.set(-0.5, 3.1, -0.4);
      c3.castShadow = true;
      treeGroup.add(c3);

      return treeGroup;
    };

    // Plant Palms along Central Boulevard & Plaza Promenade
    const palmPositions: [number, number, number][] = [
      [-5.0, -25, 1.0],
      [5.0, -25, 1.0],
      [-5.0, -19, 1.05],
      [5.0, -19, 1.05],
      [-5.0, -13, 1.1],
      [5.0, -13, 1.1],
      [-7.2, -3, 1.15],
      [7.2, -3, 1.15],
      [-7.2, 5, 1.15],
      [7.2, 5, 1.15],
      [-5.0, 13, 1.05],
      [5.0, 13, 1.05],
      [-5.0, 19, 1.0],
      [5.0, 19, 1.0],
      [-5.0, 25, 1.0],
      [5.0, 25, 1.0],
      [0, -32.5, 1.2],
    ];

    palmPositions.forEach(([px, pz, pscale]) => {
      campusRoot.add(createPalmTree(px, pz, pscale));
    });

    // Plant Mature Shade Trees in Campus Parks & Quad Borders
    const treePositions: [number, number, number, string][] = [
      [-26, -16, 1.1, palette.treeLeafA],
      [-27, -10, 1.2, palette.treeLeafB],
      [-26, -2, 1.05, palette.treeLeafA],
      [-27, 4, 1.15, palette.treeLeafB],
      [-26, 14, 1.25, palette.treeLeafA],
      [26, -16, 1.1, palette.treeLeafB],
      [27, -10, 1.2, palette.treeLeafA],
      [26, -2, 1.05, palette.treeLeafB],
      [27, 4, 1.2, palette.treeLeafA],
      [26, 14, 1.15, palette.treeLeafB],
      [-10, -22, 1.0, palette.treeLeafA],
      [10, -22, 1.05, palette.treeLeafB],
      [-10, 24, 1.1, palette.treeLeafB],
      [10, 24, 1.0, palette.treeLeafA],
    ];

    treePositions.forEach(([tx, tz, tscale, tcolor]) => {
      campusRoot.add(createShadeTree(tx, tz, tscale, tcolor));
    });

    // =========================================================================
    // 4. CAMPUS PERIMETER BOUNDARY (UNIVERSITY WALL & GATES)
    // =========================================================================
    // Elegant low university perimeter wall with limestone piers and black wrought-iron railings
    const createPerimeterBoundary = () => {
      const boundaryGroup = new THREE.Group();

      const pierGeo = new THREE.BoxGeometry(0.7, 1.6, 0.7);
      const pierCapGeo = new THREE.BoxGeometry(0.85, 0.18, 0.85);

      // East and West border piers
      [-42.5, 42.5].forEach((borderX) => {
        for (let z = -44; z <= 44; z += 11) {
          const pier = new THREE.Mesh(pierGeo, archMat.limestone);
          pier.position.set(borderX, 0.8, z);
          pier.castShadow = true;
          boundaryGroup.add(pier);

          const cap = new THREE.Mesh(pierCapGeo, archMat.slateRoof);
          cap.position.set(borderX, 1.65, z);
          boundaryGroup.add(cap);

          // Connecting low wall
          if (z < 44) {
            const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 10.3), archMat.limestoneWarm);
            wall.position.set(borderX, 0.35, z + 5.5);
            wall.castShadow = true;
            boundaryGroup.add(wall);
          }
        }
      });

      campusRoot.add(boundaryGroup);
    };

    createPerimeterBoundary();

    // =========================================================================
    // 5. ARCHITECTURAL CAMPUS BUILDINGS (FASE 1: DEEP ARCHITECTURAL MASSING)
    // =========================================================================
    const buildingMeshes: THREE.Mesh[] = [];
    const highlightPins: Record<string, THREE.Group> = {};
    const highlightHalos: Record<string, THREE.Mesh> = {};

    buildings.forEach((b) => {
      const group = new THREE.Group();
      const [bx, by, bz] = b.position3D;
      const [bw, bh, bd] = b.dimensions3D;

      group.position.set(bx, by, bz);
      group.userData = { buildingId: b.id, name: b.name, code: b.code };

      // Helper to register any submesh as clickable
      const registerClickable = (mesh: THREE.Mesh) => {
        mesh.userData = { buildingId: b.id, name: b.name, code: b.code };
        buildingMeshes.push(mesh);
      };

      // Highest apex point for positioning the destination beacon diamond
      let roofApexY = bh + 0.8;

      // Primary architectural color for accents
      const primaryBrandMat = new THREE.MeshStandardMaterial({
        color: b.colorHex || palette.foliumNavy,
        roughness: 0.38,
      });

      // -----------------------------------------------------------------------
      // BLOCO A (bloco-a): Engenharia & Ciência da Computação (Foxbury Style)
      // Contemporary stepped volume, dark cantilevered gabled roof, accessible green roof
      // terrace, vertical sun louvers, grand 2-story glass vestibule with angled canopy
      // -----------------------------------------------------------------------
      if (b.id === 'bloco-a') {
        roofApexY = 7.8;

        // Elevated Foundation Plinth with steps
        const podium = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.5, 10.4), archMat.limestone);
        podium.position.y = 0.25;
        podium.receiveShadow = true;
        group.add(podium);
        registerClickable(podium);

        // Entrance flight of steps on East face (facing central quad)
        const steps = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 5.0), archMat.limestoneWarm);
        steps.position.set(bw / 2 + 0.9, 0.175, 0);
        steps.receiveShadow = true;
        group.add(steps);

        // Main 3-Story Academic Wing (East portion)
        const mainWingW = 7.6;
        const mainWingH = 6.4;
        const mainWingD = 8.8;
        const mainWing = new THREE.Mesh(
          new THREE.BoxGeometry(mainWingW, mainWingH, mainWingD),
          archMat.limestone
        );
        mainWing.position.set(2.0, mainWingH / 2 + 0.5, 0);
        mainWing.castShadow = true;
        mainWing.receiveShadow = true;
        group.add(mainWing);
        registerClickable(mainWing);

        // Cantilevered Angled Pitch Roof on Main Wing
        const roofSlab = new THREE.Mesh(
          new THREE.BoxGeometry(mainWingW + 1.2, 0.45, mainWingD + 1.2),
          archMat.slateRoof
        );
        roofSlab.position.set(2.0, mainWingH + 0.65, 0);
        roofSlab.castShadow = true;
        group.add(roofSlab);
        registerClickable(roofSlab);

        // Horizontal Ribbon Windows & Sun Louvers on 3 floors
        for (let floor = 1; floor <= 3; floor++) {
          const yPos = floor * 1.8 - 0.3 + 0.5;

          // East & West glass ribbons
          const glassRibbon = new THREE.Mesh(
            new THREE.BoxGeometry(mainWingW + 0.2, 0.85, mainWingD - 0.8),
            archMat.glassFacade
          );
          glassRibbon.position.set(2.0, yPos, 0);
          group.add(glassRibbon);

          // External Cantilevered Sun Louver (Brise-Soleil)
          const louver = new THREE.Mesh(
            new THREE.BoxGeometry(mainWingW + 0.8, 0.12, mainWingD + 0.4),
            primaryBrandMat
          );
          louver.position.set(2.0, yPos + 0.5, 0);
          louver.castShadow = true;
          group.add(louver);
        }

        // Stepped-Down 2-Story Lab Wing with Accessible Green Roof (West portion)
        const labWingW = 5.6;
        const labWingH = 4.4;
        const labWingD = 7.8;
        const labWing = new THREE.Mesh(
          new THREE.BoxGeometry(labWingW, labWingH, labWingD),
          archMat.limestoneWarm
        );
        labWing.position.set(-4.0, labWingH / 2 + 0.5, 0);
        labWing.castShadow = true;
        labWing.receiveShadow = true;
        group.add(labWing);
        registerClickable(labWing);

        // Green Roof Terrace (Vegetated sedum roof)
        const greenRoof = new THREE.Mesh(
          new THREE.BoxGeometry(labWingW - 0.4, 0.18, labWingD - 0.4),
          archMat.greenRoof
        );
        greenRoof.position.set(-4.0, labWingH + 0.55, 0);
        group.add(greenRoof);

        // Roof Terrace Perimeter Parapet & Safety Railing
        const parapet = new THREE.Mesh(
          new THREE.BoxGeometry(labWingW + 0.1, 0.45, labWingD + 0.1),
          archMat.concreteWhite
        );
        parapet.position.set(-4.0, labWingH + 0.7, 0);
        group.add(parapet);

        // Rooftop Access Bulkhead Pavilion on terrace
        const bulkhead = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 2.0, 2.2),
          archMat.limestone
        );
        bulkhead.position.set(-2.2, labWingH + 1.5, 1.2);
        bulkhead.castShadow = true;
        group.add(bulkhead);

        // Rooftop HVAC & Solar Array Enclosure
        const hvac = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.0, 2.4), archMat.darkMetal);
        hvac.position.set(2.0, mainWingH + 1.2, 0);
        hvac.castShadow = true;
        group.add(hvac);

        // Grand 2-Story Glass Entrance Vestibule facing East towards Quad
        const vestibule = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 3.8, 4.4),
          archMat.glassAtrium
        );
        vestibule.position.set(bw / 2 + 0.6, 2.2, 0);
        group.add(vestibule);

        // Angled Modern Architectural Entrance Canopy
        const canopy = new THREE.Mesh(
          new THREE.BoxGeometry(3.6, 0.35, 4.8),
          primaryBrandMat
        );
        canopy.position.set(bw / 2 + 1.6, 3.9, 0);
        canopy.rotation.z = -0.06;
        canopy.castShadow = true;
        group.add(canopy);
        registerClickable(canopy);

        // Angled Steel Support Columns
        [-1.8, 1.8].forEach((cz) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 12), archMat.darkMetal);
          col.position.set(bw / 2 + 3.0, 1.9, cz);
          col.castShadow = true;
          group.add(col);
        });

      // -----------------------------------------------------------------------
      // BLOCO B (bloco-b): Tecnologia da Informação & Redes
      // High-tech collegiate tower profile, vertical facade fins, central glazed
      // atrium, penthouse setback with glass balustrade, rooftop communication spire
      // -----------------------------------------------------------------------
      } else if (b.id === 'bloco-b') {
        roofApexY = 8.6;

        // Elevated High-Tech Foundation Platform
        const podium = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.5, 10.4), archMat.limestone);
        podium.position.y = 0.25;
        podium.receiveShadow = true;
        group.add(podium);
        registerClickable(podium);

        // Approach Steps and ADA Ramp on West face
        const steps = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 4.8), archMat.limestoneWarm);
        steps.position.set(-bw / 2 - 0.9, 0.175, 0);
        steps.receiveShadow = true;
        group.add(steps);

        // North Main Tower (4 stories, height: 7.8m)
        const northTowerW = 6.2;
        const northTowerH = 7.8;
        const northTowerD = 8.8;
        const northTower = new THREE.Mesh(
          new THREE.BoxGeometry(northTowerW, northTowerH, northTowerD),
          archMat.navyDark
        );
        northTower.position.set(2.8, northTowerH / 2 + 0.5, 0);
        northTower.castShadow = true;
        northTower.receiveShadow = true;
        group.add(northTower);
        registerClickable(northTower);

        // Vertical Architectural Fins / Mullions across North Tower Facade
        for (let finZ = -3.8; finZ <= 3.8; finZ += 1.3) {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, northTowerH, 0.35), archMat.darkMetal);
          fin.position.set(2.8 + northTowerW / 2 + 0.1, northTowerH / 2 + 0.5, finZ);
          fin.castShadow = true;
          group.add(fin);
        }

        // South Secondary Tower (3 stories with 4th floor setback terrace)
        const southTowerW = 5.2;
        const southTowerH = 6.0;
        const southTowerD = 8.2;
        const southTower = new THREE.Mesh(
          new THREE.BoxGeometry(southTowerW, southTowerH, southTowerD),
          archMat.limestone
        );
        southTower.position.set(-3.2, southTowerH / 2 + 0.5, 0);
        southTower.castShadow = true;
        southTower.receiveShadow = true;
        group.add(southTower);
        registerClickable(southTower);

        // Setback Sky-Terrace with Glass Balustrade on South Tower
        const terraceBalustrade = new THREE.Mesh(
          new THREE.BoxGeometry(southTowerW + 0.1, 0.5, southTowerD + 0.1),
          archMat.glassFacade
        );
        terraceBalustrade.position.set(-3.2, southTowerH + 0.75, 0);
        group.add(terraceBalustrade);

        // Central Glazed Sky-Atrium connecting the two tower masses
        const atriumW = 2.4;
        const atriumH = 7.2;
        const atriumD = 8.0;
        const atrium = new THREE.Mesh(
          new THREE.BoxGeometry(atriumW, atriumH, atriumD),
          archMat.glassAtrium
        );
        atrium.position.set(-0.2, atriumH / 2 + 0.5, 0);
        group.add(atrium);
        registerClickable(atrium);

        // Projecting Double-Height Glazed Entrance Portal facing West towards Quad
        const portalAtrium = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 4.4, 4.8),
          archMat.glassAtrium
        );
        portalAtrium.position.set(-bw / 2 - 0.7, 2.5, 0);
        group.add(portalAtrium);

        // Floating Modern Entrance Canopy
        const canopy = new THREE.Mesh(
          new THREE.BoxGeometry(3.6, 0.35, 5.2),
          primaryBrandMat
        );
        canopy.position.set(-bw / 2 - 1.6, 4.5, 0);
        canopy.castShadow = true;
        group.add(canopy);
        registerClickable(canopy);

        // Slender Steel Entrance Pillars
        [-2.0, 2.0].forEach((cz) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.3, 12), archMat.darkMetal);
          col.position.set(-bw / 2 - 3.0, 2.15, cz);
          col.castShadow = true;
          group.add(col);
        });

        // Rooftop Telecommunications Mast with Beacon & Microwave Dishes
        const mast = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.14, 4.2, 8),
          archMat.darkMetal
        );
        mast.position.set(3.5, northTowerH + 2.5, 2.0);
        mast.castShadow = true;
        group.add(mast);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), archMat.brassGold);
        beacon.position.set(3.5, northTowerH + 4.6, 2.0);
        group.add(beacon);

        // Rooftop Satellite Dish
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.2, 0.3, 16), archMat.limestone);
        dish.rotation.x = Math.PI * 0.3;
        dish.position.set(2.0, northTowerH + 1.2, -2.0);
        dish.castShadow = true;
        group.add(dish);

      // -----------------------------------------------------------------------
      // BLOCO C (bloco-c): Laboratórios, Robótica & Matemática Aplicada
      // Modular 2-story research building, expressed structural grid, makerspace
      // high-bay with glazed door, and industrial sawtooth skylight monitors
      // -----------------------------------------------------------------------
      } else if (b.id === 'bloco-c') {
        roofApexY = 6.4;

        // Heavy Stone Plinth with loading bay
        const podium = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.5, 10.4), archMat.limestone);
        podium.position.y = 0.25;
        podium.receiveShadow = true;
        group.add(podium);
        registerClickable(podium);

        // Entrance Steps on East face
        const steps = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 4.6), archMat.limestoneWarm);
        steps.position.set(bw / 2 + 0.9, 0.175, 0);
        steps.receiveShadow = true;
        group.add(steps);

        // Main Research Laboratory Block (2 stories, height: 5.2m)
        const mainLabW = 12.0;
        const mainLabH = 5.2;
        const mainLabD = 8.6;
        const mainLab = new THREE.Mesh(
          new THREE.BoxGeometry(mainLabW, mainLabH, mainLabD),
          archMat.limestoneWarm
        );
        mainLab.position.set(0, mainLabH / 2 + 0.5, 0);
        mainLab.castShadow = true;
        mainLab.receiveShadow = true;
        group.add(mainLab);
        registerClickable(mainLab);

        // Expressed White Structural Grid Frames on Facades
        for (let colX = -mainLabW / 2 + 1.5; colX <= mainLabW / 2 - 1.5; colX += 2.8) {
          const colMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, mainLabH, mainLabD + 0.15), archMat.concreteWhite);
          colMesh.position.set(colX, mainLabH / 2 + 0.5, 0);
          colMesh.castShadow = true;
          group.add(colMesh);
        }

        // Horizontal Floor Spandrel Band
        const spandrel = new THREE.Mesh(new THREE.BoxGeometry(mainLabW + 0.2, 0.6, mainLabD + 0.2), archMat.darkMetal);
        spandrel.position.set(0, 2.8, 0);
        group.add(spandrel);

        // Double-Height Makerspace & Robotics Workshop Wing (North portion)
        const workshopW = 4.8;
        const workshopH = 4.8;
        const workshopD = 5.4;
        const workshop = new THREE.Mesh(
          new THREE.BoxGeometry(workshopW, workshopH, workshopD),
          archMat.limestone
        );
        workshop.position.set(-3.2, workshopH / 2 + 0.5, 1.8);
        workshop.castShadow = true;
        group.add(workshop);
        registerClickable(workshop);

        // Industrial Glazed Overhead Roll-Up Door
        const rollUpDoor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 0.25), archMat.glassFacade);
        rollUpDoor.position.set(-3.2, 1.9, 1.8 + workshopD / 2 + 0.1);
        group.add(rollUpDoor);

        // Industrial Sawtooth Clerestory Roof Monitors (Angled daylight capture)
        for (let m = 0; m < 3; m++) {
          const xMon = -3.5 + m * 3.5;
          const sawtoothGroup = new THREE.Group();
          sawtoothGroup.position.set(xMon, mainLabH + 0.5, 0);

          // Sloped roof panel
          const slopeGeo = new THREE.BoxGeometry(2.6, 0.18, 7.8);
          const slope = new THREE.Mesh(slopeGeo, archMat.slateRoof);
          slope.rotation.z = 0.35;
          slope.position.set(0.6, 0.55, 0);
          sawtoothGroup.add(slope);

          // Vertical glass clerestory window
          const vertGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 7.6), archMat.glassFacade);
          vertGlass.position.set(-0.6, 0.55, 0);
          sawtoothGroup.add(vertGlass);

          group.add(sawtoothGroup);
        }

        // Projecting Steel Portal Canopy facing East
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 4.4), primaryBrandMat);
        canopy.position.set(bw / 2 + 1.5, 3.0, 0);
        canopy.castShadow = true;
        group.add(canopy);
        registerClickable(canopy);

        // Steel Portal Frame Legs
        [-1.8, 1.8].forEach((cz) => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.2), archMat.darkMetal);
          leg.position.set(bw / 2 + 2.8, 1.5, cz);
          leg.castShadow = true;
          group.add(leg);
        });

      // -----------------------------------------------------------------------
      // BIBLIOTECA CENTRAL (biblioteca): Monumento do Conhecimento (Britechester Style)
      // Monumental collegiate centerpiece: 4-column classical portico, pediment, grand
      // ceremonial steps, symmetrical wings, raised octagonal lantern cupola dome
      // -----------------------------------------------------------------------
      } else if (b.id === 'biblioteca') {
        roofApexY = 9.2;

        // Monumental 3-Tier Grand Stone Plinth
        const podium1 = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.3, 11.6), archMat.limestoneWarm);
        podium1.position.y = 0.15;
        podium1.receiveShadow = true;
        group.add(podium1);

        const podium2 = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.3, 10.6), archMat.limestone);
        podium2.position.y = 0.45;
        podium2.receiveShadow = true;
        group.add(podium2);
        registerClickable(podium2);

        // Grand Ceremonial Entrance Staircase facing West towards Quad
        const grandStairs = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 6.2), archMat.limestoneWarm);
        grandStairs.position.set(-bw / 2 - 1.1, 0.225, 0);
        grandStairs.receiveShadow = true;
        group.add(grandStairs);

        // Central Grand Reading Hall (3 stories, height: 7.2m)
        const centerHallW = 7.4;
        const centerHallH = 7.2;
        const centerHallD = 9.4;
        const centerHall = new THREE.Mesh(
          new THREE.BoxGeometry(centerHallW, centerHallH, centerHallD),
          archMat.limestone
        );
        centerHall.position.set(1.5, centerHallH / 2 + 0.6, 0);
        centerHall.castShadow = true;
        centerHall.receiveShadow = true;
        group.add(centerHall);
        registerClickable(centerHall);

        // Symmetrical Flanking Wings (North and South collection wings: 5.6m)
        [-3.6, 3.6].forEach((wingZ) => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.6, 2.8), archMat.limestoneWarm);
          wing.position.set(-2.2, 5.6 / 2 + 0.6, wingZ);
          wing.castShadow = true;
          group.add(wing);
          registerClickable(wing);

          // Hipped slate roof on wing
          const wingRoof = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.8, 3.2), archMat.slateRoof);
          wingRoof.position.set(-2.2, 5.6 + 0.9, wingZ);
          wingRoof.castShadow = true;
          group.add(wingRoof);
        });

        // Tall Vertical Classical Framed Reading Windows
        for (let wz = -3.2; wz <= 3.2; wz += 1.6) {
          const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.6, 0.9), archMat.glassFacade);
          winFrame.position.set(1.5 + centerHallW / 2 + 0.05, 4.4, wz);
          group.add(winFrame);
        }

        // Classical Monumental 4-Column Portico Entrance facing West
        const porticoW = 3.6;
        const porticoH = 5.2;
        const porticoD = 5.6;
        const porticoEntablature = new THREE.Mesh(
          new THREE.BoxGeometry(porticoW, 0.8, porticoD),
          archMat.limestone
        );
        porticoEntablature.position.set(-bw / 2 - 0.8, porticoH + 0.7, 0);
        porticoEntablature.castShadow = true;
        group.add(porticoEntablature);
        registerClickable(porticoEntablature);

        // Triangular Pediment crowning Portico
        const pedimentGeo = new THREE.ConeGeometry(3.6, 1.4, 4);
        pedimentGeo.rotateY(Math.PI / 4);
        pedimentGeo.scale(1, 1, 0.45);
        const pediment = new THREE.Mesh(pedimentGeo, archMat.limestone);
        pediment.position.set(-bw / 2 - 0.8, porticoH + 1.8, 0);
        pediment.castShadow = true;
        group.add(pediment);

        // 4 Classical Fluted Columns
        [-2.0, -0.65, 0.65, 2.0].forEach((colZ) => {
          const column = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, porticoH, 20), archMat.limestone);
          column.position.set(-bw / 2 - 2.2, porticoH / 2 + 0.6, colZ);
          column.castShadow = true;
          group.add(column);
        });

        // Grand Double-Height Monumental Entrance Doorway
        const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.4, 2.2), archMat.darkMetal);
        doorFrame.position.set(-bw / 2 + 0.2, 2.3, 0);
        group.add(doorFrame);

        // Raised Central Octagonal Lantern Cupola Dome
        const lanternDrum = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 1.4, 8), archMat.limestone);
        lanternDrum.position.set(1.5, centerHallH + 1.3, 0);
        lanternDrum.castShadow = true;
        group.add(lanternDrum);

        const lanternGlass = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.8, 8), archMat.glassAtrium);
        lanternGlass.position.set(1.5, centerHallH + 1.3, 0);
        group.add(lanternGlass);

        // Copper Hipped Cupola Dome
        const dome = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.5, 8), archMat.copperRoof);
        dome.position.set(1.5, centerHallH + 2.7, 0);
        dome.castShadow = true;
        group.add(dome);
        registerClickable(dome);

        // Crowning Polished Brass Finial Orb
        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), archMat.brassGold);
        finial.position.set(1.5, centerHallH + 3.8, 0);
        group.add(finial);

      // -----------------------------------------------------------------------
      // REITORIA (reitoria): Prédio Central & Secretaria Acadêmica
      // Stately collegiate centerpiece: central 4-story administrative hall with
      // prominent central clock tower (4 illuminated clock faces, belfry, gold flagpole),
      // mansard wings with dormers, 6-column ceremonial portico, grand double stairs
      // -----------------------------------------------------------------------
      } else if (b.id === 'reitoria') {
        roofApexY = 13.5;

        // Formal Civic Terrace Plinth
        const podium = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.6, 10.4), archMat.limestone);
        podium.position.y = 0.3;
        podium.receiveShadow = true;
        group.add(podium);
        registerClickable(podium);

        // Twin Flanking Ceremonial Stairs facing South towards Quad
        [-3.8, 3.8].forEach((sx) => {
          const stairs = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 2.0), archMat.limestoneWarm);
          stairs.position.set(sx, 0.2, bd / 2 + 0.9);
          stairs.receiveShadow = true;
          group.add(stairs);
        });

        // Central Civic Hall (3 stories, height: 7.6m)
        const centerHallW = 8.6;
        const centerHallH = 7.6;
        const centerHallD = 8.4;
        const centerHall = new THREE.Mesh(
          new THREE.BoxGeometry(centerHallW, centerHallH, centerHallD),
          archMat.limestone
        );
        centerHall.position.set(0, centerHallH / 2 + 0.6, 0);
        centerHall.castShadow = true;
        centerHall.receiveShadow = true;
        group.add(centerHall);
        registerClickable(centerHall);

        // Symmetrical East and West Administrative Wings (height: 6.2m)
        [-6.0, 6.0].forEach((wx) => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(4.4, 6.2, 7.6), archMat.limestoneWarm);
          wing.position.set(wx, 6.2 / 2 + 0.6, 0);
          wing.castShadow = true;
          group.add(wing);
          registerClickable(wing);

          // Steep Mansard Roof on wing
          const mansard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.4, 8.0), archMat.slateRoof);
          mansard.position.set(wx, 6.2 + 1.25, 0);
          mansard.castShadow = true;
          group.add(mansard);

          // Classical Dormer Window on Mansard Roof
          const dormer = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 0.6), archMat.limestone);
          dormer.position.set(wx, 6.2 + 1.2, 4.0);
          dormer.castShadow = true;
          group.add(dormer);
        });

        // 6-Column Ceremonial Colonnaded Portico facing South towards Quad
        const porticoW = 7.8;
        const porticoH = 5.6;
        const porticoEntablature = new THREE.Mesh(new THREE.BoxGeometry(porticoW, 0.8, 2.0), archMat.limestone);
        porticoEntablature.position.set(0, porticoH + 0.8, bd / 2 + 0.8);
        porticoEntablature.castShadow = true;
        group.add(porticoEntablature);
        registerClickable(porticoEntablature);

        // Triangular Pediment with Heraldic Seal
        const pedimentGeo = new THREE.ConeGeometry(porticoW * 0.6, 1.5, 4);
        pedimentGeo.rotateY(Math.PI / 4);
        pedimentGeo.scale(1, 1, 0.35);
        const pediment = new THREE.Mesh(pedimentGeo, archMat.limestone);
        pediment.position.set(0, porticoH + 1.9, bd / 2 + 0.8);
        pediment.castShadow = true;
        group.add(pediment);

        // Gold Medallion in Pediment Tympanum
        const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 16), archMat.brassGold);
        medallion.rotation.x = Math.PI / 2;
        medallion.position.set(0, porticoH + 1.6, bd / 2 + 1.2);
        group.add(medallion);

        // 6 Colonnade Pillars
        const colCount = 6;
        const colSpan = (porticoW - 1.2) / (colCount - 1);
        for (let c = 0; c < colCount; c++) {
          const colX = -porticoW / 2 + 0.6 + c * colSpan;
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, porticoH, 16), archMat.limestone);
          col.position.set(colX, porticoH / 2 + 0.6, bd / 2 + 1.6);
          col.castShadow = true;
          group.add(col);
        }

        // PROMINENT CENTRAL CLOCK TOWER (rising to 12.8m above base)
        const towerW = 3.6;
        const towerH = 5.2;
        const towerD = 3.6;
        const towerBody = new THREE.Mesh(
          new THREE.BoxGeometry(towerW, towerH, towerD),
          archMat.limestone
        );
        towerBody.position.set(0, centerHallH + towerH / 2 + 0.6, 0);
        towerBody.castShadow = true;
        group.add(towerBody);
        registerClickable(towerBody);

        // 4 Illuminated Clock Faces (North, South, East, West)
        const clockDialMat = new THREE.MeshBasicMaterial({ color: '#FEF9C3' });
        const clockRimMat = archMat.brassGold;

        const clockOffsets: [number, number, number, number][] = [
          [0, 0, towerD / 2 + 0.05, 0],              // South
          [0, 0, -towerD / 2 - 0.05, Math.PI],       // North
          [towerW / 2 + 0.05, 0, 0, Math.PI / 2],    // East
          [-towerW / 2 - 0.05, 0, 0, -Math.PI / 2],  // West
        ];

        clockOffsets.forEach(([cx, cy, cz, rotY]) => {
          const clockGroup = new THREE.Group();
          clockGroup.position.set(cx, centerHallH + towerH - 1.2, cz);
          clockGroup.rotation.y = rotY;

          // Rim
          const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 24), clockRimMat);
          rim.rotation.x = Math.PI / 2;
          clockGroup.add(rim);

          // Face dial
          const dial = new THREE.Mesh(new THREE.CircleGeometry(0.72, 24), clockDialMat);
          dial.position.z = 0.06;
          clockGroup.add(dial);

          // Hands
          const hourHand = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.38), archMat.darkMetal);
          hourHand.position.set(0, 0.14, 0.07);
          hourHand.rotation.z = -0.6;
          clockGroup.add(hourHand);

          const minuteHand = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.52), archMat.darkMetal);
          minuteHand.position.set(0, 0.2, 0.07);
          minuteHand.rotation.z = 0.8;
          clockGroup.add(minuteHand);

          group.add(clockGroup);
        });

        // Belfry Open Cupola with Arches
        const belfry = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 1.4, 8), archMat.limestoneWarm);
        belfry.position.set(0, centerHallH + towerH + 1.25, 0);
        belfry.castShadow = true;
        group.add(belfry);

        // Copper Pyramidal Roof Spire
        const spire = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.2, 8), archMat.copperRoof);
        spire.position.set(0, centerHallH + towerH + 3.0, 0);
        spire.castShadow = true;
        group.add(spire);
        registerClickable(spire);

        // Gold Flagpole with Folium University Banner
        const flagpole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.6, 8), archMat.brassGold);
        flagpole.position.set(0, centerHallH + towerH + 5.2, 0);
        group.add(flagpole);

        const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), primaryBrandMat);
        banner.position.set(0.7, centerHallH + towerH + 5.8, 0);
        group.add(banner);

      // -----------------------------------------------------------------------
      // CONVIVÊNCIA (convivencia): Centro de Convivência & Gastronomia
      // Light modernist pavilion: floor-to-ceiling glass dining front, warm timber
      // pergola trellis canopy, outdoor cafe terrace with tables and parasols, sedum roof
      // -----------------------------------------------------------------------
      } else {
        roofApexY = 4.8;

        // Ground-Level Garden Terrace Platform
        const podium = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.3, 10.5), archMat.limestone);
        podium.position.y = 0.15;
        podium.receiveShadow = true;
        group.add(podium);
        registerClickable(podium);

        // Modernist Pavilion Structure (height: 4.2m)
        const pavilionW = 14.8;
        const pavilionH = 4.2;
        const pavilionD = 7.6;
        const pavilion = new THREE.Mesh(
          new THREE.BoxGeometry(pavilionW, pavilionH, pavilionD),
          archMat.concreteWhite
        );
        pavilion.position.set(0, pavilionH / 2 + 0.3, 1.0);
        pavilion.castShadow = true;
        pavilion.receiveShadow = true;
        group.add(pavilion);
        registerClickable(pavilion);

        // Floor-to-Ceiling Continuous Glass Dining Facade facing North towards Quad
        const diningGlass = new THREE.Mesh(
          new THREE.BoxGeometry(pavilionW - 1.2, pavilionH - 0.8, 0.3),
          archMat.glassAtrium
        );
        diningGlass.position.set(0, pavilionH / 2 + 0.3, -pavilionD / 2 + 0.9);
        group.add(diningGlass);

        // Warm Timber Wall Cladding Accents
        const woodAccent = new THREE.Mesh(
          new THREE.BoxGeometry(3.6, pavilionH, 0.35),
          archMat.woodDeck
        );
        woodAccent.position.set(-pavilionW / 2 + 2.0, pavilionH / 2 + 0.3, -pavilionD / 2 + 0.9);
        group.add(woodAccent);

        // Partial Sedum Green Roof with Crisp White Fascia Edge
        const sedumRoof = new THREE.Mesh(
          new THREE.BoxGeometry(pavilionW - 0.8, 0.16, pavilionD - 0.8),
          archMat.greenRoof
        );
        sedumRoof.position.set(0, pavilionH + 0.38, 1.0);
        group.add(sedumRoof);

        const roofFascia = new THREE.Mesh(
          new THREE.BoxGeometry(pavilionW + 0.8, 0.35, pavilionD + 0.8),
          archMat.concreteWhite
        );
        roofFascia.position.set(0, pavilionH + 0.45, 1.0);
        roofFascia.castShadow = true;
        group.add(roofFascia);

        // Outdoor Pergola Dining Terrace (Facing North at z = -3.8)
        const deckW = 12.0;
        const deckD = 5.2;
        const outdoorDeck = new THREE.Mesh(
          new THREE.BoxGeometry(deckW, 0.22, deckD),
          archMat.woodDeck
        );
        outdoorDeck.position.set(0, 0.25, -bd / 2 - 1.0);
        outdoorDeck.receiveShadow = true;
        group.add(outdoorDeck);

        // Warm Cedar Timber Pergola Trellis overhead
        const pergolaH = 3.2;
        // Pergola support posts
        [-5.2, -1.8, 1.8, 5.2].forEach((px) => {
          [-3.0, 0.0].forEach((pz) => {
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, pergolaH, 0.18), archMat.woodPergola);
            post.position.set(px, pergolaH / 2 + 0.25, -bd / 2 - 1.0 + pz);
            post.castShadow = true;
            group.add(post);
          });
        });

        // Pergola horizontal wood rafters
        for (let r = -5.4; r <= 5.4; r += 0.9) {
          const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, deckD + 0.4), archMat.woodPergola);
          rafter.position.set(r, pergolaH + 0.25, -bd / 2 - 1.0);
          rafter.castShadow = true;
          group.add(rafter);
        }

        // Outdoor Cafe Bistro Tables with Colorful Parasols
        const tablePositions = [
          [-3.6, -bd / 2 - 1.5, '#F59E0B'],
          [0.0, -bd / 2 - 1.5, '#38BDF8'],
          [3.6, -bd / 2 - 1.5, '#10B981'],
        ];

        tablePositions.forEach(([tx, tz, umbrellaColor]) => {
          const tGroup = new THREE.Group();
          tGroup.position.set(tx as number, 0.25, tz as number);

          // Table top and base
          const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.08, 16), archMat.concreteWhite);
          tableTop.position.y = 0.85;
          tableTop.castShadow = true;
          tGroup.add(tableTop);

          const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85, 8), archMat.darkMetal);
          tableLeg.position.y = 0.425;
          tGroup.add(tableLeg);

          // Parasol pole
          const umbrellaPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8), archMat.darkMetal);
          umbrellaPole.position.y = 1.2;
          tGroup.add(umbrellaPole);

          // Parasol canopy
          const umbrellaCanopy = new THREE.Mesh(
            new THREE.ConeGeometry(1.3, 0.5, 8),
            new THREE.MeshStandardMaterial({ color: umbrellaColor as string, roughness: 0.5 })
          );
          umbrellaCanopy.position.y = 2.4;
          umbrellaCanopy.castShadow = true;
          tGroup.add(umbrellaCanopy);

          group.add(tGroup);
        });
      }

      // Invisible Bounding Click Hit-Box (ensures 100% raycast coverage across entire building volume)
      const hitBoxGeo = new THREE.BoxGeometry(bw + 2.5, bh + 3.0, bd + 2.5);
      const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.y = bh / 2 + 1.0;
      registerClickable(hitBox);
      group.add(hitBox);

      // Building Outline Highlight Halo (Animated on select)
      const haloGeo = new THREE.BoxGeometry(bw + 0.8, bh + 0.8, bd + 0.8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: '#2563EB',
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.y = bh / 2 + 0.5;
      haloMesh.visible = false;
      group.add(haloMesh);
      highlightHalos[b.id] = haloMesh;

      // Permanent Institutional Code Badge (High Elevation Sprite)
      const labelSprite = createLabelSprite(b.code, b.shortName);
      labelSprite.position.set(0, roofApexY + 1.8, 0);
      group.add(labelSprite);

      // Selected Pin Marker Group (Pulsing 3D Diamond Beacon)
      const pinGroup = new THREE.Group();
      pinGroup.userData = { baseY: roofApexY + 2.8 };
      pinGroup.position.set(0, roofApexY + 2.8, 0);
      pinGroup.visible = false;

      const pinGeo = new THREE.OctahedronGeometry(1.2, 0);
      const pinMat = new THREE.MeshStandardMaterial({
        color: '#38BDF8',
        emissive: '#0284C7',
        emissiveIntensity: 1.25,
        roughness: 0.1,
        metalness: 0.5,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinGroup.add(pinMesh);

      // Destination Pulsing Ground Ring
      const ringGeo = new THREE.RingGeometry(1.6, 2.2, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: '#38BDF8',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = -roofApexY - 2.0;
      pinGroup.add(ringMesh);

      group.add(pinGroup);
      highlightPins[b.id] = pinGroup;

      campusRoot.add(group);
    });

    // =========================================================================
    // 6. ROUTE LINE VISUALIZATION
    // =========================================================================
    const routeLineGroup = new THREE.Group();
    scene.add(routeLineGroup);

    const updateRouteVisual = (buildingId: string | null) => {
      while (routeLineGroup.children.length > 0) {
        const obj = routeLineGroup.children[0];
        routeLineGroup.remove(obj);
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        } else if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      }

      if (!buildingId) return;

      const pathData = getCampusPath(buildingId);
      if (!pathData || pathData.points3D.length < 2) return;

      const isNight = themeRef.current === 'dark';
      const routeColor = isNight ? '#38BDF8' : '#2563EB';
      const startColor = isNight ? '#34D399' : '#10B981';
      const endColor = isNight ? '#38BDF8' : '#2563EB';

      const pts = pathData.points3D.map(([px, py, pz]) => new THREE.Vector3(px, py + 0.1, pz));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineDashedMaterial({
        color: routeColor,
        dashSize: 1.4,
        gapSize: 0.6,
        linewidth: 4,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      routeLineGroup.add(line);

      // Start, intermediate waypoints, and destination entrance markers
      pts.forEach((pt, idx) => {
        if (idx === 0 || idx === pts.length - 1) {
          const markerGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.22, 24);
          const markerMat = new THREE.MeshStandardMaterial({
            color: idx === 0 ? startColor : endColor,
            emissive: idx === 0 ? (isNight ? '#059669' : '#047857') : (isNight ? '#0284C7' : '#1D4ED8'),
            emissiveIntensity: isNight ? 1.35 : 0.85,
            roughness: 0.2,
          });
          const marker = new THREE.Mesh(markerGeo, markerMat);
          marker.position.copy(pt);
          routeLineGroup.add(marker);
        } else {
          // Subtle intermediate waypoint ring
          const ringGeo = new THREE.RingGeometry(0.28, 0.44, 16);
          ringGeo.rotateX(-Math.PI / 2);
          const ringMat = new THREE.MeshBasicMaterial({
            color: routeColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: isNight ? 0.9 : 0.7,
          });
          const waypoint = new THREE.Mesh(ringGeo, ringMat);
          waypoint.position.copy(pt);
          routeLineGroup.add(waypoint);
        }
      });
    };

    updateRouteVisual(selectedBuildingIdRef.current);

    // =========================================================================
    // 7. INTERACTION: THE SIMS CAMERA CONTROLLER & RAYCASTING
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let hoveredMesh: THREE.Mesh | null = null;

    let isPointerDown = false;
    let pointerButton = 0; // 0 = left (orbit), 2 = right (pan)
    let prevPointerX = 0;
    let prevPointerY = 0;
    let touchStartDistance = 0;
    let hasMovedSignificantly = false;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && (!e.touches || e.touches.length === 0)) return;
      isPointerDown = true;
      hasMovedSignificantly = false;

      if ('touches' in e) {
        if (e.touches.length === 1) {
          prevPointerX = e.touches[0].clientX;
          prevPointerY = e.touches[0].clientY;
        } else if (e.touches.length >= 2) {
          touchStartDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      } else {
        pointerButton = e.button;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && (!e.touches || e.touches.length === 0)) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Two-finger Pinch Zoom (Mobile)
      if ('touches' in e && e.touches.length >= 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStartDistance > 0) {
          const delta = (touchStartDistance - dist) * 0.12;
          handleZoom(delta);
        }
        touchStartDistance = dist;
        return;
      }

      if (isPointerDown) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;
        prevPointerX = clientX;
        prevPointerY = clientY;

        if (Math.hypot(deltaX, deltaY) > 3) {
          hasMovedSignificantly = true;
        }

        const isPan =
          pointerButton === 2 || // Right mouse
          pointerButton === 1 || // Middle mouse
          ('shiftKey' in e && (e as MouseEvent).shiftKey); // Shift + Left drag

        if (isPan) {
          // Pan camera target in XZ plane relative to camera azimuth
          const panSpeed = 0.045 * (targetRadiusRef.current / 40);
          const forward = new THREE.Vector3(
            -Math.sin(cameraThetaRef.current),
            0,
            -Math.cos(cameraThetaRef.current)
          );
          const right = new THREE.Vector3(
            Math.cos(cameraThetaRef.current),
            0,
            -Math.sin(cameraThetaRef.current)
          );

          targetLookAtRef.current.addScaledVector(right, -deltaX * panSpeed);
          targetLookAtRef.current.addScaledVector(forward, -deltaY * panSpeed);

          // Clamp pan within campus perimeter
          targetLookAtRef.current.x = THREE.MathUtils.clamp(targetLookAtRef.current.x, -45, 45);
          targetLookAtRef.current.z = THREE.MathUtils.clamp(targetLookAtRef.current.z, -45, 45);
        } else {
          // Orbit camera around current focal target
          const orbitSpeed = 0.0075;
          targetThetaRef.current -= deltaX * orbitSpeed;
          targetPhiRef.current = THREE.MathUtils.clamp(
            targetPhiRef.current - deltaY * 0.005,
            0.28,
            1.35
          );
        }
      }
    };

    const onPointerUp = () => {
      // If user merely tapped/clicked without dragging, raycast to select building
      if (isPointerDown && !hasMovedSignificantly && pointerButton === 0) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(buildingMeshes);
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const bId = hit.userData.buildingId;
          if (bId) {
            onSelectBuildingRef.current(bId);
          }
        }
      }
      isPointerDown = false;
      touchStartDistance = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 4.5 : -4.5;
      handleZoom(zoomFactor);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent browser context menu so right-click pan works cleanly
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    domEl.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    domEl.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });
    domEl.addEventListener('contextmenu', onContextMenu);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let prevActiveId: string | null = null;
    let prevIsNight: boolean | null = null;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update smooth The Sims camera position
      updateCamFromSpherical(0.08);

      // Smooth Day/Night Lighting Transition based on global theme
      const isNight = themeRef.current === 'dark';
      const targetSkyColor = isNight ? new THREE.Color('#0F172A') : new THREE.Color('#DCE8F4');
      (scene.background as THREE.Color).lerp(targetSkyColor, 0.08);
      if (scene.fog) {
        scene.fog.color.lerp(targetSkyColor, 0.08);
      }

      // Sun/Moon Light: In night mode, crisp cool moonlight with ample intensity to define architectural silhouettes
      const targetSunColor = isNight ? new THREE.Color('#93C5FD') : new THREE.Color('#FFF9E6');
      sunLight.color.lerp(targetSunColor, 0.08);
      sunLight.intensity = THREE.MathUtils.lerp(sunLight.intensity, isNight ? 1.15 : 1.85, 0.08);

      // Ambient Light: Soft fill ensuring dark facades remain recognizable without washing out night mood
      const targetAmbientColor = isNight ? new THREE.Color('#4B6482') : new THREE.Color('#FFFFFF');
      ambientLight.color.lerp(targetAmbientColor, 0.08);
      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, isNight ? 1.05 : 1.15, 0.08);

      // Hemisphere Light: Balance cool night sky with grounded road/ground base
      const targetHemiSky = isNight ? new THREE.Color('#334E68') : new THREE.Color('#FFFFFF');
      const targetHemiGround = isNight ? new THREE.Color('#1E293B') : new THREE.Color('#94A3B8');
      hemiLight.color.lerp(targetHemiSky, 0.08);
      hemiLight.groundColor.lerp(targetHemiGround, 0.08);

      // Rim Fill Light: Prevents back-facing walls from blending into the terrain
      const targetFillColor = isNight ? new THREE.Color('#38BDF8') : new THREE.Color('#BAE6FD');
      fillLight.color.lerp(targetFillColor, 0.08);
      fillLight.intensity = THREE.MathUtils.lerp(fillLight.intensity, isNight ? 0.65 : 0.45, 0.08);

      // Check external change in selected building or dark/light theme
      const currentActiveId = selectedBuildingIdRef.current;
      if (currentActiveId !== prevActiveId || isNight !== prevIsNight) {
        prevActiveId = currentActiveId;
        prevIsNight = isNight;
        updateRouteVisual(currentActiveId);
      }

      // Hover Raycast
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        if (hoveredMesh !== hit) {
          if (hoveredMesh && hoveredMesh.userData.buildingId !== currentActiveId) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).emissive?.setHex(0x000000);
          }
          hoveredMesh = hit;
          if (hit.userData.buildingId !== currentActiveId) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).emissive?.setHex(0x1E3A8A);
            if ((hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity !== undefined) {
              (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.35;
            }
          }
          setHoveredBuildingName(hit.userData.name);
          domEl.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMesh) {
          if (hoveredMesh.userData.buildingId !== currentActiveId) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).emissive?.setHex(0x000000);
          }
          hoveredMesh = null;
          setHoveredBuildingName(null);
          domEl.style.cursor = 'grab';
        }
      }

      // Animate Destination Highlights (Diamond Pin & Ground Ring)
      buildings.forEach((b) => {
        const isSelected = b.id === currentActiveId;
        const pin = highlightPins[b.id];
        const halo = highlightHalos[b.id];

        if (pin) {
          pin.visible = isSelected;
          if (isSelected) {
            const baseY = pin.userData?.baseY ?? (b.dimensions3D[1] + 4.2);
            pin.position.y = baseY + Math.sin(elapsedTime * 3.5) * 0.4;
            pin.rotation.y = elapsedTime * 1.8;
          }
        }

        if (halo) {
          halo.visible = isSelected;
          if (isSelected) {
            (halo.material as THREE.MeshBasicMaterial).opacity =
              0.25 + Math.sin(elapsedTime * 4) * 0.15;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domEl.removeEventListener('mousedown', onPointerDown);
      domEl.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      domEl.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('contextmenu', onContextMenu);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      tileTexture.dispose();
      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, [buildings, handleZoom]);

  if (!webGlAvailable) {
    return (
      <div className="w-full h-80 sm:h-96 flex flex-col items-center justify-center bg-slate-100 rounded-2xl p-6 text-center border border-slate-200">
        <Layers className="w-12 h-12 text-[#203A65] mb-3" />
        <h4 className="text-sm font-bold text-slate-800">Visualização Simplificada do Campus</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          A aceleração 3D WebGL não está disponível no dispositivo. Utilize a visualização em lista para consultar as instalações.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className} bg-[#DCE8F4] dark:bg-[#0B132B] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#344563] shadow-inner group select-none`}
    >
      {/* Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Campus Orientation & Badge */}
      <div className="absolute top-3.5 left-3.5 flex items-center space-x-2 bg-white/95 dark:bg-[#14223D]/95 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-slate-200/90 dark:border-[#344563] shadow-xs text-slate-800 dark:text-slate-100 text-[11px] font-bold pointer-events-none">
        <div className="w-4 h-4 rounded-full bg-[#203A65] text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
          N
        </div>
        <span>Campus Folium • The Sims Mode</span>
      </div>

      {/* Building Hover Tooltip */}
      {hoveredBuildingName && (
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-[#203A65] dark:bg-[#1B3156] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl pointer-events-none flex items-center space-x-1.5 animate-in fade-in zoom-in-95 border border-white/20 dark:border-blue-400/30">
          <Eye className="w-3.5 h-3.5 text-amber-300" />
          <span>{hoveredBuildingName}</span>
        </div>
      )}

      {/* Destination In Route Banner */}
      {targetRoom && (
        <div className="absolute bottom-3.5 left-3.5 bg-[#203A65] dark:bg-[#1B3156] text-white px-4 py-2 rounded-2xl text-xs font-medium shadow-lg flex items-center space-x-2.5 border border-white/20 dark:border-blue-400/30 backdrop-blur-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>
            Destino em rota: <strong className="font-bold text-emerald-200">{targetRoom}</strong>
          </span>
        </div>
      )}

      {/* Floating 3D Sims-style Camera Controls */}
      <div className="absolute top-3.5 right-3.5 flex flex-col space-y-1.5 bg-white/95 dark:bg-[#14223D]/95 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200 dark:border-[#344563] shadow-md">
        <button
          onClick={() => handleZoom(-6)}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#203A65] dark:hover:text-[#93C5FD] hover:bg-[#EAF0F7] dark:hover:bg-[#1C3359] rounded-xl cursor-pointer transition-colors"
          title="Aproximar (Zoom In) [Tecla +]"
          aria-label="Aproximar visualização"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(6)}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#203A65] dark:hover:text-[#93C5FD] hover:bg-[#EAF0F7] dark:hover:bg-[#1C3359] rounded-xl cursor-pointer transition-colors"
          title="Afastar (Zoom Out) [Tecla -]"
          aria-label="Afastar visualização"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleRotate(-0.15)}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#203A65] dark:hover:text-[#93C5FD] hover:bg-[#EAF0F7] dark:hover:bg-[#1C3359] rounded-xl cursor-pointer transition-colors"
          title="Girar para a esquerda [Seta Esquerda]"
          aria-label="Girar câmera para a esquerda"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleRotate(0.15)}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#203A65] dark:hover:text-[#93C5FD] hover:bg-[#EAF0F7] dark:hover:bg-[#1C3359] rounded-xl cursor-pointer transition-colors"
          title="Girar para a direita [Seta Direita]"
          aria-label="Girar câmera para a direita"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={handleFocusDestination}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#203A65] dark:hover:text-[#93C5FD] hover:bg-[#EAF0F7] dark:hover:bg-[#1C3359] rounded-xl cursor-pointer transition-colors"
          title="Focar no destino [Tecla F]"
          aria-label="Focar no destino selecionado"
        >
          <Focus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#203A65] dark:hover:text-[#93C5FD] hover:bg-[#EAF0F7] dark:hover:bg-[#1C3359] rounded-xl cursor-pointer transition-colors text-[9px] font-extrabold flex items-center justify-center"
          title="Visão Geral do Campus [Tecla Home ou R]"
          aria-label="Restaurar visão geral"
        >
          RESET
        </button>
      </div>

      {/* The Sims Control Hint on bottom right */}
      <div className="absolute bottom-3.5 right-3.5 hidden sm:flex items-center space-x-2 text-[11px] text-slate-700 dark:text-slate-300 bg-white/95 dark:bg-[#14223D]/95 px-3.5 py-1.5 rounded-2xl backdrop-blur-xs pointer-events-none border border-slate-200/80 dark:border-[#344563] shadow-2xs font-medium">
        <Move className="w-3.5 h-3.5 text-[#203A65] dark:text-[#93C5FD]" />
        <span>Arraste com botão esquerdo para orbitar • Botão direito / Shift para mover • Roda para zoom</span>
      </div>
    </div>
  );
};
