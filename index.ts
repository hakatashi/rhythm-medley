/*
import {Scene, OrthographicCamera, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshLambertMaterial, Mesh, PointLight, MeshBasicMaterial} from 'three';

const scene = new Scene();
const camera = new OrthographicCamera(-100, 100, -100, 100, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshBasicMaterial({color: 0x00ff00});
const cube = new Mesh(geometry, material);
scene.add(cube);

const light = new PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 3);
scene.add(light);

camera.position.z = 5;

function animate() {
	requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

animate();
*/

import './App';
