import { useRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "../hooks/useThreeScene";

export function AreaCanvas({ color, shape }) {
  const ref = useRef();
  useThreeScene(ref, (scene, camera, renderer) => {
    camera.position.z = 2.5;
    const light = new THREE.PointLight(color, 20, 10);
    light.position.set(1, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111122, 3));

    let geo;
    if (shape === "torus") geo = new THREE.TorusGeometry(0.6, 0.22, 16, 60);
    else if (shape === "octa") geo = new THREE.OctahedronGeometry(0.75, 0);
    else if (shape === "ico") geo = new THREE.IcosahedronGeometry(0.75, 0);
    else if (shape === "dodeca") geo = new THREE.DodecahedronGeometry(0.7, 0);
    else if (shape === "cone") geo = new THREE.ConeGeometry(0.6, 1.2, 8);
    else geo = new THREE.TetrahedronGeometry(0.8, 0);

    const mat = new THREE.MeshPhongMaterial({
      color: 0x0d0d14, emissive: new THREE.Color(color).multiplyScalar(0.15),
      specular: new THREE.Color(color), shininess: 150,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const wireMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), wireframe: true, opacity: 0.3, transparent: true });
    const wire = new THREE.Mesh(geo, wireMat);
    scene.add(mesh);
    scene.add(wire);

    let t = 0, frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      t += 0.02;
      mesh.rotation.x = t * 0.4;
      mesh.rotation.y = t * 0.7;
      wire.rotation.copy(mesh.rotation);
      renderer.render(scene, camera);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  });
  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
