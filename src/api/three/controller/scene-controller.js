import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



let renderer = null
let camera = null
let scene = null
let controls = null
let resizeObserver = null

const groundSize = 10000

function resizeRenderer() {
  if (!renderer || !camera || !scene) return

  const canvas = renderer.domElement

  const rect = canvas.getBoundingClientRect()
  const width = rect.width || canvas.clientWidth || 1
  const height = rect.height || canvas.clientHeight || 1

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}

function startRenderLoop() {
  const animate = () => {
    if (!renderer || !scene || !camera) return

    renderer.render(scene, camera)
  }

  renderer.setAnimationLoop(animate)
}

function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xAAAAAA);

  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10000)
  // camera.position.z = 5
  camera.position.set(50, 100, 80)
  camera.lookAt(0, 0, 0)

  const canvas = document.querySelector('#c');

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x111111, 1)
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  // container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.7, 0);
  controls.update();

  // addGround()
  // addGroundGrid()
  addLight()
  addSky()

  loadModel('static/models/bujiadi_saidao.glb')

  resizeRenderer()
  startRenderLoop()

  resizeObserver = new ResizeObserver(() => {
    resizeRenderer()
  })
  resizeObserver.observe(canvas)

  requestAnimationFrame(() => {
    resizeRenderer()
  })
}


function destroyScene() {
  resizeObserver?.disconnect()
  renderer?.setAnimationLoop(null)
  renderer?.dispose()
}


function addGroundGrid() {
  const gridHelper = new THREE.GridHelper(groundSize, 100, 0x00ff00, 0xffffff);
  scene.add(gridHelper);
}

function addGround() {
  const planeSize = groundSize;

  const loader = new THREE.TextureLoader();
  const texture = loader.load('resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({ color: '#054908', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
}


function addLight() {
  // lights

  const ambientLight = new THREE.AmbientLight(0x606060, 3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(-100, 100, 100).normalize();
  scene.add(directionalLight);
}


function addSky() {
  // Sky

  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const uniforms = sky.material.uniforms;
  uniforms['turbidity'].value = 0;
  uniforms['rayleigh'].value = 3;
  uniforms['mieDirectionalG'].value = 0.7;
  uniforms['cloudElevation'].value = 1;
  uniforms['sunPosition'].value.set(- 0.8, 0.19, 0.56); // elevation: 11, azimuth: -55

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(DRACO_GLTF_CONFIG);
}


function loadModel(url = 'static/models/Cesium_Air.glb') {
  const loader = new GLTFLoader();

  loader.load(url, function (gltf) {

    scene.add(gltf.scene);

  }, undefined, function (error) {

    console.error(error);

  });
}



const SceneController = {
  initScene,
  resizeRenderer,
  destroyScene,
  addGroundGrid,
  loadModel,
  addGround,
  addLight,
  addSky,
}


export default SceneController
