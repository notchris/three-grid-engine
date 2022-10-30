import { Direction } from "./Direction"
import { tileSize } from './Globals'
import { Player } from "./Player"
import { Tilemap } from "./Tilemap"
import * as THREE from 'three'

export class GridPhysics {
  private movementDirectionVectors: {
    [key in Direction]?: THREE.Vector2
  } = {
      [Direction.UP]: new THREE.Vector2(0, -1),
      [Direction.DOWN]: new THREE.Vector2(0, 1),
      [Direction.LEFT]: new THREE.Vector2(-1, 0),
      [Direction.RIGHT]: new THREE.Vector2(1, 0),
    }

  movementDirection: Direction = Direction.NONE;

  private readonly speedPixelsPerSecond: number = tileSize * 4;
  private tileSizePixelsWalked: number = 0;

  private lastMovementIntent = Direction.NONE;

  constructor(
    private player: Player,
    private tileMap: Tilemap
  ) { }

  movePlayer(direction: Direction): void {
    this.lastMovementIntent = direction
    if (this.isMoving()) return
    if (this.isBlockingDirection(direction)) {
      this.player.stopAnimation(direction)
    } else {
      this.startMoving(direction)
    }
  }

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta)
    }
    this.lastMovementIntent = Direction.NONE
  }

  isMoving(): boolean {
    return this.movementDirection != Direction.NONE
  }

  private startMoving(direction: Direction): void {
    this.player.startAnimation(direction)
    this.movementDirection = direction
    this.updatePlayerTilePos()
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta)

    if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSprite(pixelsToWalkThisUpdate)
    } else if (this.shouldContinueMoving()) {
      this.movePlayerSprite(pixelsToWalkThisUpdate)
      this.updatePlayerTilePos()
    } else {
      this.movePlayerSprite(tileSize - this.tileSizePixelsWalked)
      this.stopMoving()
    }
  }

  private updatePlayerTilePos() {
    this.player.setTilePos(
      this.player
        .getTilePos()
        .add(this.movementDirectionVectors[this.movementDirection])
    )
  }

  private movePlayerSprite(pixelsToMove: number) {
    const directionVec = this.movementDirectionVectors[
      this.movementDirection
    ].clone()
    const movementDistance = directionVec.multiply(new THREE.Vector2(pixelsToMove, pixelsToMove))
    const newPlayerPos = this.player.getPosition().add(movementDistance)
    this.player.setPosition(newPlayerPos)

    this.tileSizePixelsWalked += pixelsToMove
    this.tileSizePixelsWalked %= tileSize
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta
    return this.speedPixelsPerSecond * deltaInSeconds
  }

  private stopMoving(): void {
    this.player.stopAnimation(this.movementDirection)
    this.movementDirection = Direction.NONE
  }

  private willCrossTileBorderThisUpdate(
    pixelsToWalkThisUpdate: number
  ): boolean {
    return (
      this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= tileSize
    )
  }

  private shouldContinueMoving(): boolean {
    return (
      this.movementDirection == this.lastMovementIntent &&
      !this.isBlockingDirection(this.lastMovementIntent)
    )
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction))
  }

  private tilePosInDirection(direction: Direction): THREE.Vector2 {
    return this.player
      .getTilePos()
      .add(this.movementDirectionVectors[direction])
  }

  private hasBlockingTile(pos: THREE.Vector2): boolean {
    const tile = this.tileMap.getTile(pos.x, pos.y)
    return tile === false || tile.collide
  }

}
