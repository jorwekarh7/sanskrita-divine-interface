    import { useEffect, useRef } from "react";
    import * as THREE from "three";

    export default function GalaxyBackground() {
    const mountRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000000"); // TRUE SPACE

        const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
        );

        camera.position.set(0, 12, 55);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // ===== GALAXY SETTINGS =====
        const params = {
        count: 9000,
        size: 0.035,
        radius: 30,
        branches: 6,
        spin: 1.4,
        randomness: 0.4,
        randomnessPower: 3,
        insideColor: new THREE.Color("#ffddaa"),
        outsideColor: new THREE.Color("#3366ff"),
        };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.count * 3);
        const colors = new Float32Array(params.count * 3);

        for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spin;
        const branchAngle =
            ((i % params.branches) / params.branches) * Math.PI * 2;

        const randomX =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            params.randomness *
            radius;

        const randomY =
            (Math.random() - 0.5) * 0.8;

        const randomZ =
            Math.pow(Math.random(), params.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            params.randomness *
            radius;

        positions[i3] =
            Math.cos(branchAngle + spinAngle) * radius + randomX;

        positions[i3 + 1] = randomY;

        positions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = params.insideColor.clone();
        mixedColor.lerp(params.outsideColor, radius / params.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
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
        opacity: 0.85,
        });

        const galaxy = new THREE.Points(geometry, material);
        scene.add(galaxy);

        // ===== CORE GLOW (Controlled) =====
        const coreMaterial = new THREE.MeshBasicMaterial({
        color: "#ffaa66",
        transparent: true,
        opacity: 0.4,
        });

        const core = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 32, 32),
        coreMaterial
        );

        scene.add(core);

        // Resize
        const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", onResize);

        // Animation
        const animate = () => {
        galaxy.rotation.y += 0.0008; // subtle real motion
        galaxy.rotation.x = 0.25;

        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
        window.removeEventListener("resize", onResize);

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        geometry.dispose();
        material.dispose();
        coreMaterial.dispose();
        renderer.dispose();

        if (mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement);
        }
        };
    }, []);

    return (
    <div
        ref={mountRef}
        style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,           // ✅ was negative, now visible
        pointerEvents: "none",
        }}
    />
    );

    }
