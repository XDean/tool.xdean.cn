import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeRenderer {
  readonly camera: THREE.OrthographicCamera;
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly resizeObserver: ResizeObserver;
  readonly controls: OrbitControls;
  readonly shaderMaterial: THREE.ShaderMaterial;
  readonly clock = new THREE.Clock();

  constructor(
    readonly root: HTMLDivElement,
  ) {

    this.camera = new THREE.OrthographicCamera();
    this.camera.position.setZ(10);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.shaderMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        time: {value: 0.0},
      },
    });
    this.scene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(),
      this.shaderMaterial,
    ));

    this.renderer = new THREE.WebGLRenderer();
    root.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(root);

    this.clock.start();
    this.animate();
  }

  onResize() {
    this.renderer.setSize(this.root.clientWidth, this.root.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.shaderMaterial.uniforms.time.value = this.clock.getElapsedTime();
    this.shaderMaterial.uniformsNeedUpdate = true;
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

  setVertexShader(s: string) {
    this.shaderMaterial.vertexShader = s;
    this.shaderMaterial.needsUpdate = true;
  }

  setFragmentShader(s: string) {
    this.shaderMaterial.fragmentShader = s;
    this.shaderMaterial.needsUpdate = true;
  }
}