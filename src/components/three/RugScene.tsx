import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/components/primitives/motion";
import type { Product } from "@/data/products";

/**
 * The WebGL half of the rug viewer.
 *
 * Kept in its own module so Three.js is a separate chunk that only downloads
 * once <RugViewer/> decides to render a canvas. Nothing here is imported at
 * module load by any route.
 *
 * The product photograph does triple duty: colour map, displacement map, and
 * bump map. Its own luminance lifts the pile off the plane, so a new photo
 * updates the 3D surface with no extra assets to author.
 */

/** Mesh density. Dropped on phones, where the pixel budget is tighter. */
function segments(coarse: boolean) {
  return coarse ? [96, 68] : [200, 145];
}

/** One rug plane: displaced, lit, and gently curled at the edges. */
function RugMesh({
  product,
  textureUrl,
  coarse,
}: {
  product: Product;
  textureUrl: string;
  coarse: boolean;
}) {
  const texture = useTexture(textureUrl);
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const reduced = usePrefersReducedMotion();

  const geometry = useMemo(() => {
    const [sx, sy] = segments(coarse);
    const geo = new THREE.PlaneGeometry(2.7, 1.85, sx, sy);
    const pos = geo.attributes.position;

    // Lift the corners a little so the rug reads as a woven textile rather
    // than a flat billboard. The curl is strongest at the edges and dies off
    // toward the middle; a shallow wave keeps it from looking machined.
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / 1.35; // -1..1
      const y = pos.getY(i) / 0.925; // -1..1
      const curl = 0.115 * x ** 4 + 0.085 * y ** 4;
      const wave = 0.024 * Math.sin(x * 2.3) * Math.cos(y * 1.7);
      pos.setZ(i, curl + wave);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [coarse]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    const crop = product.render.textureCrop;
    // Clamp rather than repeat: catalogue photos are not seamless tiles, so
    // repeating them lays hard grid lines across the pile. Each texture is
    // sampled exactly once across the plane instead.
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    if (crop) {
      // Sample just the carpet out of a wider room shot. UV origin is the
      // bottom-left of the image, so oy is measured up from the bottom.
      const [ox, oy, sx, sy] = crop;
      texture.repeat.set(sx, sy);
      texture.offset.set(ox, oy);
    } else {
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);
    }
    texture.anisotropy = coarse ? 4 : 12;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture, product.render.textureCrop, coarse]);

  // Fade the rug in once its texture is ready, so a weave swap dissolves
  // instead of popping.
  useEffect(() => {
    if (material.current) material.current.opacity = 0;
  }, [textureUrl]);

  useFrame((state, delta) => {
    if (material.current && material.current.opacity < 1) {
      material.current.opacity = Math.min(1, material.current.opacity + delta * 1.6);
    }
    if (!mesh.current || reduced) return;
    // Idle drift, so the surface is never completely static.
    const t = state.clock.elapsedTime;
    mesh.current.rotation.z = Math.sin(t * 0.16) * 0.018;
    mesh.current.position.y = Math.sin(t * 0.38) * 0.014;
  });

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 2.34, 0, 0]} receiveShadow castShadow>
      <meshStandardMaterial
        ref={material}
        map={texture}
        displacementMap={texture}
        displacementScale={0.05 * product.render.pile}
        bumpMap={texture}
        bumpScale={0.22}
        roughness={product.render.roughness}
        metalness={0}
        // White, not the product's base colour: `color` multiplies the map, so
        // tinting here only darkens the true photographed yarn colour.
        color="#ffffff"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Turns the rug toward the pointer and eases it back to rest, with a slow
 * ambient sway underneath so it still feels alive when untouched.
 */
function PointerRig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const reduced = usePrefersReducedMotion();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const swayY = reduced ? 0 : Math.sin(t * 0.24) * 0.05;
    const swayX = reduced ? 0 : Math.cos(t * 0.19) * 0.022;
    const targetY = reduced ? 0 : pointer.x * 0.36 + swayY;
    const targetX = reduced ? 0 : -pointer.y * 0.17 + swayX;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
  });

  return <group ref={group}>{children}</group>;
}

/**
 * Cinematic dolly: the camera rises and pulls back a little as the section
 * travels up the viewport, so the rug is revealed rather than simply present.
 */
function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  const target = useRef(progress);

  useEffect(() => {
    target.current = progress;
  }, [progress]);

  useFrame(() => {
    // 0 at the bottom of the reveal, 1 once fully past.
    const p = THREE.MathUtils.clamp(target.current, 0, 1);
    const y = THREE.MathUtils.lerp(1.4, 2.0, p);
    const z = THREE.MathUtils.lerp(4.05, 3.5, p);
    camera.position.y += (y - camera.position.y) * 0.06;
    camera.position.z += (z - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Lighting() {
  return (
    <>
      {/* Warm ivory key from the upper left, matching the photography. */}
      <ambientLight intensity={1.05} color="#fff6e9" />
      <directionalLight
        position={[-3.4, 5.4, 3.2]}
        intensity={2.05}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      {/* Cool bounce from the right stops the shadow side going muddy. */}
      <directionalLight position={[4.2, 2.2, -2.4]} intensity={0.5} color="#e9eff6" />
      {/* Low rim from behind catches the tips of the pile and gives the
          displacement its silhouette. */}
      <directionalLight position={[0, 1.4, -4.2]} intensity={0.9} color="#ffe9cc" />
      <spotLight position={[0, 6.2, 1.4]} angle={0.72} penumbra={1} intensity={0.6} color="#ffffff" />
    </>
  );
}

export default function RugScene({
  product,
  textureUrl,
  progress = 0.5,
  coarse = false,
}: {
  product: Product;
  textureUrl: string;
  /** 0-1 scroll position of the host section, drives the camera dolly. */
  progress?: number;
  /** Reduce mesh density and anisotropy on small or low-power devices. */
  coarse?: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={coarse ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 1.65, 3.8], fov: 34 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // The photograph is the subject; filmic tone mapping would pull the
        // ivories grey. Render the colour as shot.
        toneMapping: THREE.NoToneMapping,
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ScrollCamera progress={progress} />
        <Lighting />
        <PointerRig>
          <RugMesh product={product} textureUrl={textureUrl} coarse={coarse} />
        </PointerRig>
        <ContactShadows
          position={[0, -0.66, 0]}
          opacity={0.32}
          scale={7.5}
          blur={3.1}
          far={2.6}
          resolution={coarse ? 256 : 512}
          color="#57492f"
        />
      </Suspense>
    </Canvas>
  );
}
