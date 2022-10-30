class Tile {
    data: string | false
    collide: boolean
    constructor(data?: string | false) {
        this.data = data
        this.collide = false
    }
}

type ForEachIterator<T> = (x: number, y: number, data: T) => void
type MapIterator<T, U> = (x: number, y: number, data: T) => U

class Tilemap {
    tiles: Tile[][]
    width: number
    height: number


    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        const arr = new Array(width)

        for (let i = 0; i < width; i++) {
            arr[i] = []
            for (let j = 0; j < height; j++) {
                arr[i][j] = new Tile(false)
            }
        }

        this.tiles = arr

    }
    getTile(x: number, y: number): Tile | false {
        if (typeof this.tiles[x] === 'undefined' || typeof this.tiles[x][y] === 'undefined') {
            return false
        }
        return this.tiles[x][y]
    }
    setTile(x: number, y: number, data: string | false): void {
        if (typeof this.tiles[x][y] === 'undefined') {
            throw new Error('tile coordinate out of range')
        }
        this.tiles[x][y].data = data
    }
    // ref: https://github.com/photonstorm/phaser/blob/d67c93646cbfe8ba5997954f8af29a8f3f9e8e91/src/tilemaps/components/GetTilesWithin.js#L24
    getTilesWithin(x: number, y: number, width: number, height: number) {
        // Clip width and height to bottom right of map.
        if (x + width > this.width) {
            width = Math.max(this.width - x, 0)
        }

        if (y + height > this.height) {
            height = Math.max(this.height - y, 0)
        }

        let results = []

        for (let ty = y; ty < y + height; ty++) {
            for (let tx = x; tx < x + width; tx++) {
                let tile = this.tiles[ty][tx]

                if (tile !== null) {
                    results.push(tile)
                }
            }
        }

        return results
    }

    forEach(callback: ForEachIterator<Tile>) {
        this.map(callback)
    }

    map<U>(callback: MapIterator<Tile, U>): Array<U> {
        const result = []

        for (let x = 0, xl = this.tiles.length; x < xl; x++) {
            for (let y = 0, yl = this.tiles[x].length; y < yl; y++) {
                result.push(callback(x, y, this.tiles[x][y]))
            }
        }

        return result
    }
}

export { Tile, Tilemap }