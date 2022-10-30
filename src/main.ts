import * as THREE from 'three'
import { Player } from "./Player"
import { GridControls } from "./GridControls"
import { GridPhysics } from "./GridPhysics"
import Controller from './Controller'
import { Tile, Tilemap } from './Tilemap'
import GUI from './GUI'
import World from './World'

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x000000, 0.001)
const clock = new THREE.Clock()

const mapWidth = 35
const mapHeight = 35

// Player
const player = new Player(scene, new THREE.Vector2(10, 10))

// World
const tilemap = new Tilemap(mapWidth, mapHeight)
const world = new World(scene, player, mapWidth, mapHeight)

// World Border
tilemap.getTilesWithin(0, 0, 1, 30).forEach((t) => {
  t.collide = true
})


// Player Ground Raycaster
let groundVector = new THREE.Vector3(0, -1, 0)
let groundCast = new THREE.Raycaster()

const controller = new Controller()
const gridPhysics = new GridPhysics(player, tilemap)
const gridControls = new GridControls(controller, gridPhysics)

// temp vectors
let tempVec = new THREE.Vector3()
let tempVec2 = new THREE.Vector3()
let tempVec3 = new THREE.Vector3()

// THREE setup
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000)

let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(innerWidth, innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

//let controls = new OrbitControls(camera, renderer.domElement)

let light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(mapWidth, mapHeight, mapHeight)
//light.position.setScalar(100)

scene.add(new THREE.AmbientLight(0xffffff, 0.8))


scene.add(new THREE.HemisphereLight(0xffffcc, 0x19bbdc, 0.5))


let pointer = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
let intersects: string | any[]

window.addEventListener("pointermove", event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  intersects = raycaster.intersectObject(world.ground.mesh, false)
  if (intersects.length > 0) {
    world.ground.uniforms.mouse.value.copy(intersects[0].point)
  }
})





camera.position.set(player.obj.position.x, 10, player.obj.position.z + 10)
camera.lookAt(player.obj.position)

// GUI
const gui = new GUI(player, world.ground.uniforms)

// UPDATE
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta()
  gridControls.update()
  gridPhysics.update(delta)

  // uniforms.player.value.copy(player.obj.position)

  tempVec2.copy(player.obj.position)
  tempVec2.y = 10
  tempVec2.x += 0.5
  tempVec2.z += 0.5
  groundCast.set(tempVec2, groundVector)

  // See if the ray from the camera into the world hits one of our meshes
  const intersects = groundCast.intersectObject(world.ground.mesh)

  // Toggle rotation bool for meshes that we clicked
  if (intersects.length > 0) {
    const pt = intersects[0].point.y
    player.obj.position.y = pt
  }
  player.getDirection(gridPhysics.movementDirection)

  // Arrow loigic
  if (gui.config.showDirectionArrow) {
    player.arrow.setDirection(player.tempDir)
    tempVec3.copy(player.obj.position)
    tempVec3.x += 0.5
    tempVec3.z += 0.5
    tempVec3.y += 1
    player.arrow.position.copy(tempVec3)
  }

  const pos = player.getTileDirection()
  world.ground.uniforms.facing.value.copy(pos)

  tempVec.set(player.obj.position.x, 10, player.obj.position.z + 10)
  camera.position.lerp(
    tempVec,
    0.05
  )
  renderer.render(scene, camera)
})