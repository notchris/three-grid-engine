import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

import { Player } from './Player'

export default class Ground {
  width: number
  height: number
  uniforms: any
  mesh: THREE.Mesh
  constructor(scene: THREE.Scene, player: Player, width: number, height: number) {

    // let perlin = new ImprovedNoise()
    const g = new THREE.PlaneGeometry(width, height, width, height)

    g.rotateX(-Math.PI * 0.5)
    // let v2 = new THREE.Vector2()
    // for (let i = 0; i < g.attributes.position.count; i++) {
    //   v2.fromBufferAttribute((g.attributes.uv as any), i).multiplyScalar(5)
    //   let y = perlin.noise(v2.x, v2.y, 1.2) * 1
    //   g.attributes.position.setY(i, y)
    // }
    // g.computeVertexNormals()

    let uniforms = {
      mouse: { value: new THREE.Vector3().setScalar(-9999) },
      player: { value: new THREE.Vector3().copy(player.obj.position) },
      facing: { value: new THREE.Vector3().copy(player.tempDir) },
      showDirection: { value: true },
      showGrid: { value: true },
      showSpawn: { value: true },
      showMouse: { value: true }
    }
    const alphaMap = new THREE.TextureLoader().load('assets/alpha.png')
    let m = new THREE.MeshPhongMaterial({
      color: 0x79a456,
      transparent: true,
      alphaMap: alphaMap
    });

    (m as any).onBeforeCompile = (shader: any) => {
      shader.uniforms.mouse = uniforms.mouse
      shader.uniforms.player = uniforms.player
      shader.uniforms.facing = uniforms.facing
      shader.uniforms.showDirection = uniforms.showDirection
      shader.uniforms.showGrid = uniforms.showGrid
      shader.uniforms.showSpawn = uniforms.showSpawn
      shader.uniforms.showMouse = uniforms.showMouse
      shader.vertexShader = `
              varying vec3 vPos;
              ${shader.vertexShader}
            `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
                vPos = position;
              `
      )
      //console.log(shader.vertexShader);
      shader.fragmentShader = `
              #define ss(a, b, c) smoothstep(a, b, c)
              uniform vec3 mouse;
              uniform vec3 player;
              uniform vec3 facing;
              uniform bool showDirection;
              uniform bool showGrid;
              uniform bool showSpawn;
              uniform bool showMouse;
              varying vec3 vPos;
              ${shader.fragmentShader}
            `.replace(
        `#include <dithering_fragment>`,
        `#include <dithering_fragment>
              
                float cellSize = 1.;
                vec2 coord = vPos.xz / cellSize;
                
                vec2 mouseCell = floor(mouse.xz / cellSize) + 0.5;
                vec2 playerCell = floor(player.xz / cellSize) + 0.5;
                vec2 facingCell = floor(facing.xz / cellSize) + 0.5;
          
                vec2 rect = abs(coord - mouseCell);
                vec2 rectb = abs(coord - playerCell);
                vec2 rectc = abs(coord - facingCell);
                
                if (showMouse) {
                  float mf = float(abs(max(rect.x,rect.y)) < 0.5);
                  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0, 1, 1), mf);
                }
          
                if (showDirection) {
                  float ff = float(abs(max(rectc.x,rectc.y)) < 0.5);
                  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 1, 0), ff);
                }
          
                if (showSpawn) {
                  float pf = float(abs(max(rectb.x,rectb.y)) < 0.5);
                  gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 0, 0), pf);
                }
          
                vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
                float line = min(grid.x, grid.y);
                float color = 1.0 - min(line, 1.0);
                
                gl_FragColor.rgb = showGrid ? mix(gl_FragColor.rgb, vec3(0, 0, 0), color) : gl_FragColor.rgb;
                
              `
      )
    }

    this.uniforms = uniforms

    this.mesh = new THREE.Mesh(g, m)
    this.mesh.geometry.translate(width / 2, 0, height / 2)
    scene.add(this.mesh)


  }

}