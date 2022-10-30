import { Direction } from "./Direction"
import { GridPhysics } from "./GridPhysics"
import Controller from './Controller'

export class GridControls {
  constructor(
    private controller: Controller,
    private gridPhysics: GridPhysics
  ) { }

  update() {
    const cursors = this.controller.keys
    if (cursors.left) {
      this.gridPhysics.movePlayer(Direction.LEFT)
    } else if (cursors.right) {
      this.gridPhysics.movePlayer(Direction.RIGHT)
    } else if (cursors.up) {
      this.gridPhysics.movePlayer(Direction.UP)
    } else if (cursors.down) {
      this.gridPhysics.movePlayer(Direction.DOWN)
    }
  }
}
