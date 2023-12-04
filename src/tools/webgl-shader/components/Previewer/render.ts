import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeRenderer {
  readonly camera: THREE.OrthographicCamera;
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly resizeObserver: ResizeObserver;
  readonly controls;

  constructor(
    readonly root: HTMLDivElement,
  ) {

    this.camera = new THREE.OrthographicCamera();
    this.camera.position.setZ(10);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.scene.add(new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 'red',
      }),
    ));

    this.renderer = new THREE.WebGLRenderer();
    root.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(root);

    this.animate();
  }

  onResize() {
    this.renderer.setSize(this.root.clientWidth, this.root.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.render();
  }

  render() {
    // const time = Date.now() * 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.domElement.remove();
    this.renderer.dispose();
  }
}