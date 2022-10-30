import * as THREE from 'three'
import { Player } from './Player'
import Sky from './Sky'
import Ground from './Ground'

export default class World {
    scene: THREE.Scene
    width: number
    height: number
    sky: Sky
    ground: Ground
    player: Player
    constructor(scene: THREE.Scene, player: Player, width: number, height: number) {
        this.scene = scene
        this.width = width
        this.height = height

        // Create sky
        this.sky = new Sky(scene)
        this.ground = new Ground(scene, player, width, height)

    }
}