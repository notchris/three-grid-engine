import { Direction } from "./Direction"
import { tileSize } from "./Globals"
import * as THREE from 'three'

export class Player {
  capsuleInfo: any
  tempPos: THREE.Vector3
  tempDir: THREE.Vector3
  arrow: THREE.ArrowHelper
  obj: THREE.Object3D
  mesh: THREE.Mesh
  constructor(
    scene: THREE.Scene,
    private tilePos: THREE.Vector2
  ) {


    this.mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1),
      new THREE.MeshNormalMaterial()
    )
    this.obj = new THREE.Object3D()

    this.obj.add(
      this.mesh
    )

    this.mesh.geometry.translate(0.5, 0.5, 0.5)

    this.obj.position.set(
      tilePos.x * tileSize,
      0,
      tilePos.y * tileSize
    )

    this.tempPos = new THREE.Vector3()
    this.tempDir = new THREE.Vector3(0, 0, -1)

    this.arrow = new THREE.ArrowHelper(new THREE.Vector3(), this.obj.position, 2, 0xff0000)
    scene.add(this.obj)
    scene.add(this.arrow)
  }

  getDirection(d: string): void {
    switch (d) {
      case 'none':
        break
      case 'up':
        this.tempDir.set(0, 0, -1)
        break
      case 'down':
        this.tempDir.set(0, 0, 1)
        break
      case 'left':
        this.tempDir.set(-1, 0, 0)
        break
      case 'right':
        this.tempDir.set(1, 0, 0)
        break
      default:
        break
    }
  }

  getPosition(): THREE.Vector2 {
    return new THREE.Vector2(this.obj.position.x, this.obj.position.z)
  }

  setPosition(position: THREE.Vector2): void {
    this.obj.position.set(position.x, 0, position.y)
  }


  stopAnimation(direction: Direction) {
    // const animationManager = this.sprite.anims.animationManager;
    // const standingFrame = animationManager.get(direction).frames[1].frame.name;
    // this.sprite.anims.stop();
    // this.sprite.setFrame(standingFrame);
  }

  startAnimation(direction: Direction) {
    // this.sprite.anims.play(direction)
  }

  getTilePos(): THREE.Vector2 {
    return this.tilePos.clone()
  }

  getTileDirection(): THREE.Vector3 {
    const c = this.tilePos.clone()
    this.tempPos.set(c.x, 0, c.y).add(this.tempDir)
    return this.tempPos
  }

  setTilePos(tilePosition: THREE.Vector2): void {
    this.tilePos = tilePosition.clone()
  }
}
