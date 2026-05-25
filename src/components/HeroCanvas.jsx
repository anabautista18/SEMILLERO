import { useRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "../hooks/useThreeScene";

export function HeroCanvas() {
  const ref = useRef();
  useThreeScene(ref, (scene, camera, renderer, el) => {
    // Lights
    const ambientLight = new THREE.AmbientLight(0x1a0a2e, 2);
    scene.add(ambientLight);
    const pointOrange = new THREE.PointLight(0xe57224, 60, 20);
    pointOrange.position.set(3, 2, 2);
    scene.add(pointOrange);
    const pointPurple = new THREE.PointLight(0x7c3aed, 60, 20);
    pointPurple.position.set(-3, -2, 2);
    scene.add(pointPurple);

    // Main torus knot
    const torusGeo = new THREE.TorusKnotGeometry(1.1, 0.32, 180, 24, 2, 3);
    const torusMat = new THREE.MeshPhongMaterial({
      color: 0x0d0d14,
      emissive: 0x2a0a50,
      specular: 0xa855f7,
      shininess: 120,
      wireframe: false,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, opacity: 0.18, transparent: true });
    const wire = new THREE.Mesh(torusGeo, wireMat);
    scene.add(wire);

    // Floating icosahedra (satellites)
    const satellites = [];
    for (let i = 0; i < 6; i++) {
      const g = new THREE.OctahedronGeometry(0.12 + Math.random() * 0.1, 0);
      const m = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0xe57224 : 0x7c3aed,
        emissive: i % 2 === 0 ? 0x331100 : 0x1a0038,
        shininess: 200,
      });
      const mesh = new THREE.Mesh(g, m);
      const angle = (i / 6) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 1.4, Math.sin(angle * 2) * 0.5);
      mesh.userData = { baseAngle: angle, speed: 0.4 + Math.random() * 0.3 };
      scene.add(mesh);
      satellites.push(mesh);
    }

    // Particle field
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xa855f7, size: 0.025, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse interaction
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let frame;
    let t = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      t += 0.012;
      torus.rotation.x = t * 0.3 + my * 0.2;
      torus.rotation.y = t * 0.5 + mx * 0.2;
      wire.rotation.copy(torus.rotation);
      satellites.forEach((s) => {
        const a = s.userData.baseAngle + t * s.userData.speed;
        s.position.x = Math.cos(a) * 2.2;
        s.position.y = Math.sin(a) * 1.4;
        s.position.z = Math.sin(a * 2) * 0.5;
        s.rotation.x += 0.02;
        s.rotation.y += 0.03;
      });
      particles.rotation.y += 0.001;
      pointOrange.position.x = Math.sin(t * 0.7) * 3;
      pointPurple.position.x = -Math.sin(t * 0.5) * 3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
    };
  });
  return <div ref={ref} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }} />;
}
