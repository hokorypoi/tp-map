import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';



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

  scene.traverse((obj) => {
    if (obj.isLine2 && obj.material) {
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      materials.forEach((material) => {
        if (material.resolution) {
          material.resolution.set(width, height)
        }
      })
    }
  })

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

  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100000)
  camera.position.set(50, 100, 80)
  camera.lookAt(0, 0, 0)

  const canvas = document.querySelector('#c');

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x111111, 1)
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'

  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.6

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.7, 0);
  controls.update();

  // addGround()
  addGroundGrid()
  addLight()
  addSky()

  // 单条线示例
  // addLngLatLine([
  //   [115.9364043, 39.68036144],
  //   [115.93639231, 39.68036946],
  //   [115.93629647, 39.68027862],
  //   [115.93598594, 39.68015012],
  // ], scene, 2, {
  //   color: '#00d4ff',
  //   width: 3
  // })

  // 多条线示例
  // addLngLatLine([
  //   [
  //     [115.9364043, 39.68036144],
  //     [115.93639231, 39.68036946],
  //     [115.93629647, 39.68027862],
  //     [115.93598594, 39.68015012],
  //   ],
  //   [
  //     [115.93598000, 39.68014000],
  //     [115.93590000, 39.68005000],
  //     [115.93585000, 39.68002000],
  //   ]
  // ], scene, 2, [
  //   { color: '#00d4ff', width: 60, textureUrl: 'resources/images/line1.png' },
  //   { color: '#ff00aa', width: 10, textureUrl: 'resources/images/line2.png' }
  // ])

  addLines();

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

function addLines() {
  const lines = window.appThreeConf.lines || []
  const ls = lines.map(r => r.coordinates)
  const cs = lines.map(r => ({
    color: r.color || '#00d4ff',
    width: 8,
    textureUrl: 'static/resources/images/asphalt_02_diff_512.png'
  }))

  const lineGroup = new THREE.Group()
  scene.add(lineGroup)

  addLngLatLine(ls, lineGroup, 0.1, cs, 'lnglat')

  // 整体缩放
  lineGroup.scale.set(0.02, 1, 0.02)
  lineGroup.position.set(0, 0, 0)
  // 如果需要沿某个轴缩放：
  // lineGroup.scale.set(2, 1, 1)
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
  const ambientLight = new THREE.AmbientLight(0x606060, 1.0);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(-100, 100, 100).normalize();
  scene.add(directionalLight);
}

function addSky() {
  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const uniforms = sky.material.uniforms;
  uniforms['turbidity'].value = 2;
  uniforms['rayleigh'].value = 1.2;
  uniforms['mieDirectionalG'].value = 0.08;
  uniforms['sunPosition'].value.set(-0.8, 0.15, 0.56);
}

function loadModel(url = 'static/models/Cesium_Air.glb') {
  const loader = new GLTFLoader();

  loader.load(url, function (gltf) {
    scene.add(gltf.scene);
  }, undefined, function (error) {
    console.error(error);
  });
}

function configureTexture(texture, repeat = 20) {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeat, 1)

  if ('colorSpace' in texture) {
    texture.colorSpace = THREE.SRGBColorSpace
  } else {
    texture.encoding = THREE.sRGBEncoding
  }

  return texture
}

function createLineTexture(options = {}) {
  const {
    textureUrl,
    color,
    lineIndex = 0,
    width = 512,
    height = 32,
    repeat = 20
  } = options

  if (textureUrl) {
    const texture = new THREE.TextureLoader().load(textureUrl)
    return configureTexture(texture, repeat)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const hue = (lineIndex * 60 + 180) % 360
  const stripeColor = color || `hsl(${hue}, 100%, 60%)`

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(0.5, stripeColor)
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.strokeStyle = gradient
  ctx.lineWidth = 12
  ctx.lineCap = 'round'
  ctx.beginPath()
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.moveTo(x, canvas.height / 2)
    ctx.lineTo(x + 20, canvas.height / 2)
  }
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  return configureTexture(texture, repeat)
}

function createLineMaterial(options = {}, lineIndex = 0) {
  const texture = options.texture || createLineTexture({ ...options, lineIndex })

  const colorValue =
    typeof options.color === 'string'
      ? new THREE.Color(options.color)
      : (options.color ?? 0x00d4ff)

  const material = new LineMaterial({
    color: colorValue,
    linewidth: options.width ?? 3,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    map: texture,
    transparent: true,
    depthWrite: false,
    alphaTest: 0.01,
    dashed: false,
    worldUnits: true
  })

  material.needsUpdate = true
  return material
}

function isMultiLine(coords) {
  return Array.isArray(coords) &&
    coords.length > 0 &&
    Array.isArray(coords[0]) &&
    coords[0].length > 0 &&
    Array.isArray(coords[0][0])
}

function parseCoord(coord, coordOrder = 'lnglat') {
  const [a, b] = coord
  if (coordOrder === 'latlng') {
    return { lng: b, lat: a }
  }
  return { lng: a, lat: b }
}

function addLngLatLine(coords, parent, height = 2, options = {}, coordOrder = 'lnglat') {
  if (!parent || !Array.isArray(coords) || coords.length === 0) return

  const lineGroups = isMultiLine(coords) ? coords : [coords]
  const optionGroups = Array.isArray(options) ? options : [options]

  if (lineGroups.length === 0) return

  const { lng: baseLng, lat: baseLat } = parseCoord(lineGroups[0][0], coordOrder)
  let previousEnd = null
  const builtLines = []

  lineGroups.forEach((line, index) => {
    if (!Array.isArray(line) || line.length < 2) return

    const points = line.map((coord) => {
      const { lng, lat } = parseCoord(coord, coordOrder)

      const latRad = lat * Math.PI / 180
      const x = (lat - baseLat) * 110540
      const z = (lng - baseLng) * 111320 * Math.cos(latRad)

      return new THREE.Vector3(x, height, z)
    })

    if (previousEnd) {
      const offset = previousEnd.clone().sub(points[0])
      points.forEach((p) => p.add(offset))
    }

    builtLines.push({
      points,
      lineOptions: optionGroups[index] ?? optionGroups[0] ?? {},
      index
    })

    previousEnd = points[points.length - 1].clone()
  })

  const allPoints = builtLines.flatMap(({ points }) => points)
  if (allPoints.length === 0) return

  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity

  allPoints.forEach((p) => {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minZ = Math.min(minZ, p.z)
    maxZ = Math.max(maxZ, p.z)
  })

  const centerX = (minX + maxX) / 2
  const centerZ = (minZ + maxZ) / 2
  const shift = new THREE.Vector3(-centerX, 0, -centerZ)

  builtLines.forEach(({ points, lineOptions, index }) => {
    points.forEach((p) => p.add(shift))

    const geometry = new LineGeometry()
    const positions = []
    points.forEach((p) => {
      positions.push(p.x, p.y, p.z)
    })
    geometry.setPositions(positions)

    const material = createLineMaterial(lineOptions, index)

    const lineMesh = new Line2(geometry, material)
    lineMesh.renderOrder = 999
    parent.add(lineMesh)
  })
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
  addLngLatLine,
}


export default SceneController
