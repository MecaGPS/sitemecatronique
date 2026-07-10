import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const GLB_URL = 'assets/models/assemblage-agv.glb';
const STEP_URL = 'assets/models/assemblage-agv.step';
const OCCT_BASE = 'assets/vendor/occt-import-js/';
const WORKER_URL = 'assets/js/step-parser.worker.js';

function occtLocateFile(path) {
  return OCCT_BASE + path;
}

function buildMeshFromOcct(geometryMesh) {
  const positions = geometryMesh.attributes?.position?.array;
  const indices = geometryMesh.index?.array;
  if (!positions?.length || !indices?.length) {
    throw new Error('Maillage STEP invalide.');
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  if (geometryMesh.attributes.normal?.array) {
    geometry.setAttribute(
      'normal',
      new THREE.Float32BufferAttribute(geometryMesh.attributes.normal.array, 3)
    );
  } else {
    geometry.computeVertexNormals();
  }

  geometry.setIndex(new THREE.BufferAttribute(Uint32Array.from(indices), 1));

  const defaultColor = geometryMesh.color
    ? new THREE.Color(geometryMesh.color[0], geometryMesh.color[1], geometryMesh.color[2])
    : new THREE.Color(0xb8c4ce);

  const materials = [
    new THREE.MeshStandardMaterial({ color: defaultColor, metalness: 0.15, roughness: 0.55 })
  ];

  if (geometryMesh.brep_faces?.length) {
    for (const faceColor of geometryMesh.brep_faces) {
      const color = faceColor.color
        ? new THREE.Color(faceColor.color[0], faceColor.color[1], faceColor.color[2])
        : defaultColor;
      materials.push(new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.55 }));
    }

    let triangleIndex = 0;
    let faceColorGroupIndex = 0;
    const triangleCount = indices.length / 3;

    while (triangleIndex < triangleCount) {
      let lastIndex;
      let materialIndex;

      if (faceColorGroupIndex >= geometryMesh.brep_faces.length) {
        lastIndex = triangleCount;
        materialIndex = 0;
      } else if (triangleIndex < geometryMesh.brep_faces[faceColorGroupIndex].first) {
        lastIndex = geometryMesh.brep_faces[faceColorGroupIndex].first;
        materialIndex = 0;
      } else {
        lastIndex = geometryMesh.brep_faces[faceColorGroupIndex].last + 1;
        materialIndex = faceColorGroupIndex + 1;
        faceColorGroupIndex++;
      }

      geometry.addGroup(triangleIndex * 3, (lastIndex - triangleIndex) * 3, materialIndex);
      triangleIndex = lastIndex;
    }
  }

  return new THREE.Mesh(geometry, materials.length > 1 ? materials : materials[0]);
}

function meshesFromOcctResult(result) {
  const group = new THREE.Group();
  for (const meshData of result.meshes) {
    group.add(buildMeshFromOcct(meshData));
  }
  return group;
}

async function fetchStepBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fichier STEP introuvable (${response.status}).`);
  return new Uint8Array(await response.arrayBuffer());
}

async function parseStepOnMainThread(buffer) {
  if (typeof window.occtimportjs !== 'function') {
    throw new Error('Bibliothèque occt-import-js non chargée.');
  }
  const occt = await window.occtimportjs({ locateFile: occtLocateFile });
  const result = occt.ReadFile('step', buffer, null);
  if (!result?.meshes?.length) throw new Error('Aucun maillage dans le fichier STEP.');
  return result;
}

function parseStepInWorker(buffer) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER_URL);
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('Délai dépassé lors de l’analyse du STEP.'));
    }, 180000);

    worker.onmessage = (event) => {
      clearTimeout(timeout);
      worker.terminate();
      if (event.data?.ok) {
        resolve(event.data.result);
      } else {
        reject(new Error(event.data?.error || 'Erreur worker STEP.'));
      }
    };

    worker.onerror = () => {
      clearTimeout(timeout);
      worker.terminate();
      reject(new Error('Worker STEP indisponible.'));
    };

    worker.postMessage({ format: 'step', buffer, params: null }, [buffer.buffer]);
  });
}

async function parseStep(buffer) {
  try {
    return await parseStepInWorker(buffer);
  } catch (workerError) {
    console.warn('[AGV 3D] Worker STEP échoué, repli thread principal.', workerError);
    const freshBuffer = await fetchStepBuffer(STEP_URL);
    return parseStepOnMainThread(freshBuffer);
  }
}

async function loadGlb(url) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  return gltf.scene;
}

async function loadStep(url) {
  const buffer = await fetchStepBuffer(url);
  const result = await parseStep(buffer);
  return meshesFromOcctResult(result);
}

async function loadModel() {
  try {
    const glbResponse = await fetch(GLB_URL, { method: 'HEAD' });
    if (glbResponse.ok) {
      return { object: await loadGlb(GLB_URL), upAxis: 'y' };
    }
  } catch {
    /* pas de GLB, on continue avec le STEP */
  }

  const object = await loadStep(STEP_URL);
  return { object, upAxis: 'z' };
}

function fitCameraToObject(camera, controls, object, upAxis) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const fitOffset = 1.35;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = (maxDim * fitOffset) / (2 * Math.tan(fov / 2));

  if (upAxis === 'z') {
    camera.up.set(0, 0, 1);
    camera.position.set(distance * 0.85, -distance * 0.65, distance * 0.55);
  } else {
    camera.up.set(0, 1, 0);
    camera.position.set(distance * 0.75, distance * 0.45, distance * 0.65);
  }

  camera.near = Math.max(distance / 200, 0.01);
  camera.far = distance * 200;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  controls.target.set(0, 0, 0);
  controls.update();
}

class AgvModelViewer {
  constructor(root) {
    this.root = root;
    this.canvasHost = root.querySelector('.model-viewer-canvas');
    this.loadingEl = root.querySelector('.model-viewer-loading');
    this.errorEl = root.querySelector('.model-viewer-error');
    this.resetBtn = root.querySelector('[data-action="reset-view"]');

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe8edf2);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvasHost.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(4, 6, 8);
    const fillLight = new THREE.DirectionalLight(0xdce8f5, 0.35);
    fillLight.position.set(-6, 2, -4);
    this.scene.add(ambient, keyLight, fillLight);

    this.modelRoot = new THREE.Group();
    this.scene.add(this.modelRoot);

    this.defaultCameraState = null;
    this.running = true;

    this.resetBtn?.addEventListener('click', () => this.resetView());
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvasHost);

    const section = root.closest('.slide-section');
    if (section) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.resize();
        }
      }, { threshold: 0.05 });
      visibilityObserver.observe(section);
    }

    this.resize();
    this.animate();
    this.load();
  }

  resize() {
    const { clientWidth, clientHeight } = this.canvasHost;
    if (!clientWidth || !clientHeight) return;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight, false);
  }

  setLoading(isLoading) {
    this.loadingEl.hidden = !isLoading;
  }

  showError(message) {
    this.errorEl.textContent = message;
    this.errorEl.hidden = false;
    this.loadingEl.hidden = true;
  }

  saveCameraState() {
    this.defaultCameraState = {
      position: this.camera.position.clone(),
      target: this.controls.target.clone(),
      up: this.camera.up.clone(),
      near: this.camera.near,
      far: this.camera.far
    };
  }

  resetView() {
    if (!this.defaultCameraState) return;
    this.camera.position.copy(this.defaultCameraState.position);
    this.camera.up.copy(this.defaultCameraState.up);
    this.camera.near = this.defaultCameraState.near;
    this.camera.far = this.defaultCameraState.far;
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(this.defaultCameraState.target);
    this.controls.update();
  }

  animate = () => {
    if (!this.running) return;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  async load() {
    this.setLoading(true);
    this.errorEl.hidden = true;

    try {
      const { object, upAxis } = await loadModel();
      this.modelRoot.clear();
      this.modelRoot.add(object);
      this.resize();
      fitCameraToObject(this.camera, this.controls, this.modelRoot, upAxis);
      this.saveCameraState();
      this.setLoading(false);
    } catch (error) {
      console.error('[AGV 3D]', error);
      this.showError(
        error?.message ||
          'Le modèle 3D n\'a pas pu être chargé. Vérifiez le chemin du fichier ou le format utilisé.'
      );
    }
  }
}

document.querySelectorAll('[data-agv-model-viewer]').forEach((root) => {
  new AgvModelViewer(root);
});
