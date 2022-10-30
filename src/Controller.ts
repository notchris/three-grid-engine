export default class Controller {
    keys: {
        up: boolean,
        down: boolean,
        right: boolean,
        left: boolean
    }
    constructor() {
        this.keys = {
            up: false,
            down: false,
            right: false,
            left: false
        }

        window.addEventListener('keydown', (e) => {
            this.keyswitch(e, true)
        })
        window.addEventListener('keyup', (e) => {
            this.keyswitch(e, false)
        })
        window.addEventListener('keypress', (e) => {
            // Keys that shouldnt fire 1000 times per frame
        })
    }

    keyswitch(e: KeyboardEvent, bool: boolean) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                e.preventDefault() // Up
                this.keys.up = bool
                break
            case 'KeyS':
            case 'ArrowDown':
                e.preventDefault() // Down
                this.keys.down = bool
                break
            case 'KeyD':
            case 'ArrowRight':
                e.preventDefault() // Right
                this.keys.right = bool
                break
            case 'KeyA':
            case 'ArrowLeft':
                e.preventDefault() // Left
                this.keys.left = bool
                break
            default:
                break
        }
    }

}