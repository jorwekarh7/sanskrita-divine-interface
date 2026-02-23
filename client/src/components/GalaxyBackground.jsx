    import { useEffect, useRef } from "react";
    import * as THREE from "three";

    // Big fullscreen mythic galaxy + scroll zoom.
    // Removes the "orange ball" and replaces with a soft glow core.
    export default function GalaxyBackground({ mode }) {
    const mountRef = useRef(null);
    const rafRef = useRef(null);

    // zoom state
    const stateRef = useRef({
        targetDistance: 95,
        distance: 95,
    });

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        if (mode !== "divine") return;

        // ===== Scene / Camera / Renderer =====
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000000");

        const camera = new THREE.PerspectiveCamera(
        72, // slightly wider for epic feel
        window.innerWidth / window.innerHeight,
        0.1,
        2000
        );

        const MIN_Z = 35;   // must match your clamp min
        const MAX_Z = 220;  // must match your clamp max

        const Y_NEAR = 26;  // zoomed IN: more top-down
        const Y_FAR  = 10;  // zoomed OUT: more side-ish

        const LOOK_Y_NEAR = -6;  // zoomed IN: look slightly down into the disk
        const LOOK_Y_FAR  = 0;   // zoomed OUT: look at center


        // Start farther so it fills full screen, but still huge.
        camera.position.set(0, 12, 95);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // ===== GALAXY (3x bigger) =====
        const params = {
        count: 42000,        // more points = denser and more “reference-like”
        size: 0.028,
        radius: 260,         // <<< BIGGER (this is your “triple the size”)
        branches: 6,
        spin: 1.8,
        randomness: 0.35,
        randomnessPower: 3.2,
        diskThickness: 3.2,  // keep thin disk like reference
        insideColor: new THREE.Color("#ffd6b2"),  // warm core
        outsideColor: new THREE.Color("#6aa8ff"), // cool edges
        };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.count * 3);
        const colors = new Float32Array(params.count * 3);

        for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        // bias stars towards center to get a bright core like your reference
        const r = Math.pow(Math.random(), 0.55) * params.radius;

        const spinAngle = r * params.spin * 0.01; // keep spin stable at big radius
        const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

        // randomness smaller at outer radius to keep arms clear
        const randScale = params.randomness * (1 - r / params.radius);

        const randomX =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            randScale *
            r;

        const randomY =
            (Math.random() - 0.5) * params.diskThickness * (0.65 + 0.35 * (1 - r / params.radius));

        const randomZ =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            randScale *
            r;

        const angle = branchAngle + spinAngle;

        positions[i3] = Math.cos(angle) * r + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(angle) * r + randomZ;

        // color blend (warm core -> cool edge)
        const mixed = params.insideColor.clone();
        mixed.lerp(params.outsideColor, r / params.radius);

        // brighten core slightly
        const coreBoost = 1 + (1 - r / params.radius) * 0.35;
        colors[i3] = Math.min(1, mixed.r * coreBoost);
        colors[i3 + 1] = Math.min(1, mixed.g * coreBoost);
        colors[i3 + 2] = Math.min(1, mixed.b * coreBoost);
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        });

        const galaxy = new THREE.Points(geometry, material);

        // Tilt the whole galaxy to match reference (a disk in perspective)
        galaxy.rotation.x = -0.353;
        galaxy.rotation.z = -0.05;
        scene.add(galaxy);

        // ===== CORE GLOW (NO ORANGE BALL) =====
        // A billboarded sprite for glow instead of a solid sphere.
        const glowTexture = makeRadialGlowTexture();
        const coreGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: new THREE.Color("#ffe7d2"),
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        );
        coreGlow.scale.set(55, 55, 1); // big bright core like reference
        coreGlow.position.set(0, 0, 0);
        scene.add(coreGlow);

        // A second cooler halo glow (adds the pink/blue vibe)
        const haloGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: glowTexture,
            color: new THREE.Color("#7db6ff"),
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        );
        haloGlow.scale.set(135, 135, 1);
        haloGlow.position.set(0, 0, 0);
        scene.add(haloGlow);

        // ===== Resize =====
        const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", onResize);

        // ===== Scroll zoom =====
        const canScroll = (el, deltaY) => {
        if (!el) return false;

        const scrollable = el.scrollHeight > el.clientHeight + 1;
        if (!scrollable) return false;

        const atTop = el.scrollTop <= 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

        // If scrolling up and not already at top -> box can scroll
        if (deltaY < 0 && !atTop) return true;

        // If scrolling down and not already at bottom -> box can scroll
        if (deltaY > 0 && !atBottom) return true;

        return false;
        };

        const onWheel = (e) => {
        // ✅ If wheel happens over either prompt box, NEVER zoom galaxy.
        // Let the box scroll if it can; otherwise do nothing.
        const overBox = e.target?.closest?.(".seeker-prompt__input, .divine-prompt__text");
        if (overBox) return;

        // Otherwise, zoom galaxy
        e.preventDefault();

        const s = stateRef.current;
        const delta = Math.max(-140, Math.min(140, e.deltaY));
        s.targetDistance = THREE.MathUtils.clamp(s.targetDistance + delta * 0.11, 35, 220);
        };


        window.addEventListener("wheel", onWheel, { passive: false });

        // ===== Animate =====
        const clock = new THREE.Clock();

        const animate = () => {
        const t = clock.getElapsedTime();

        // Slow majestic spin
        galaxy.rotation.y += 0.00055;

        // Core “breathing”
        coreGlow.material.opacity = 0.82 + Math.sin(t * 1.25) * 0.08;
        haloGlow.material.opacity = 0.20 + Math.sin(t * 0.95 + 1.3) * 0.06;

        // Smooth zoom
        const s = stateRef.current;
        s.distance = THREE.MathUtils.lerp(s.distance, s.targetDistance, 0.075);

        // Gentle orbit + keep looking at center
        const orbit = 1.4;
// Normalize zoom (0 = fully zoomed IN, 1 = fully zoomed OUT)
        const u = THREE.MathUtils.clamp(
        (s.distance - MIN_Z) / (MAX_Z - MIN_Z),
        0,
        1
        );

        // Smooth curve
        const e = u * u * (3 - 2 * u);

        // ===== DRAMATIC ANGLE CHANGE =====

        // When zoomed IN → high Y (top view)
        // When zoomed OUT → low Y (side view)
        const Y_NEAR = 45;   // was too small before
        const Y_FAR  = 6;    // strong side view

        const baseY = THREE.MathUtils.lerp(Y_NEAR, Y_FAR, e);

        // Slight breathing
        const breatheY = Math.sin(t * 0.12) * 0.6;

        camera.position.x = Math.sin(t * 0.10) * 1.4;
        camera.position.y = baseY + breatheY;
        camera.position.z = s.distance;

        // Change look target too
        const LOOK_Y_NEAR = -12;  // strong downward look
        const LOOK_Y_FAR  = 0;

        const lookY = THREE.MathUtils.lerp(LOOK_Y_NEAR, LOOK_Y_FAR, e);

        camera.lookAt(0, lookY, 0);


        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("wheel", onWheel);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        geometry.dispose();
        material.dispose();
        glowTexture.dispose();
        coreGlow.material.dispose();
        haloGlow.material.dispose();

        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, [mode]);

    return (
        <div
        ref={mountRef}
        style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
        }}
        />
    );
    }

    /**
     * Creates a soft radial glow texture on the fly (no image file needed)
     */
    function makeRadialGlowTexture() {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const g = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
    );

    g.addColorStop(0.0, "rgba(255,255,255,1)");
    g.addColorStop(0.18, "rgba(255,220,190,0.85)");
    g.addColorStop(0.35, "rgba(255,160,200,0.35)");
    g.addColorStop(1.0, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
    }
