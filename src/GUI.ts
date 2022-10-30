import * as UIL from 'uil'
import { Player } from './Player'

export default class GUI {
    config: {
        showDirectionArrow: boolean,
        showDirectionTile: boolean,
        showGrid: boolean,
        showSpawn: boolean,
        showMouse: boolean
    }
    constructor(player: Player, uniforms: any) {
        const ui = new UIL.Gui({ w: 400 })
        const title = ui.add('title', { name: 'Settings' })

        this.config = {
            showDirectionArrow: true,
            showDirectionTile: true,
            showGrid: true,
            showSpawn: true,
            showMouse: true
        }

        const groupA = ui.add('group', { name: 'Toggles', h: 30, bg: '#905' })
        // Option Toggles
        const showDirectionArrow = groupA.add('bool', { name: 'Direction Arrow', value: true }).onChange((v: any) => {
            player.arrow.visible = v
            this.config.showDirectionArrow = v
        })
        const showDirectionTile = groupA.add('bool', { name: 'Direction Tile', value: true }).onChange((v: any) => {
            uniforms.showDirection.value = v
            this.config.showDirectionTile = v
        })
        const showGrid = groupA.add('bool', { name: 'Grid Lines', value: true }).onChange((v: any) => {
            uniforms.showGrid.value = v
            this.config.showGrid = v
        })
        const showSpawn = groupA.add('bool', { name: 'Spawn Tile', value: true }).onChange((v: any) => {
            uniforms.showSpawn.value = v
            this.config.showSpawn = v
        })
        const showMouse = groupA.add('bool', { name: 'Mouse Tile', value: true }).onChange((v: any) => {
            uniforms.showMouse.value = v
            this.config.showMouse = v
        })
    }
}