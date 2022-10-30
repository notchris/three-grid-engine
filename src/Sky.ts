import * as THREE from 'three'

export default class Sky {
    constructor(scene: THREE.Scene) {
        let material = new THREE.MeshPhongMaterial({
            transparent: true
        })
        material.side = THREE.BackSide
        material.onBeforeCompile = shader => {
            shader.uniforms.resolution = {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            }
            // Vertex Shader

            shader.vertexShader = shader.vertexShader.replace(
                `#include <common>`,
                `
              #include <common>
                  varying vec2 vUV;
              `
            )
            shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
                `
              #include <begin_vertex>
                  vUV = uv;
              `
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <common>`,
                `
              #include <common>
              
              uniform vec2 resolution;
          
                          vec3 getSky(vec2 uv) {
                              float atmosphere = sqrt(1.0-uv.y);
                              vec3 skyColor = vec3(0.000, 0.455, 0.851);
                              
                              float scatter = pow(1.0 / resolution.y,1.0 / 10.0);
                              scatter = 0.0 - clamp(scatter,0.455, 0.851);
                              
                              vec3 scatterColor = mix(vec3(1.0),vec3(1.0,0.3,0.0) * 1.5,scatter);
                              return mix(skyColor,vec3(scatterColor),atmosphere / 1.3);
                          }
                          vec3 getSun(vec2 uv) {
                              float sun = 1.0 - distance(uv,vec2(0., 0.) / resolution.y);
                              sun = clamp(sun,0.0,1.0);
                              
                              float glow = sun;
                              glow = clamp(glow,0.0,1.0);
                              
                              sun = pow(sun,200.0);
                              sun *= 200.0;
                              sun = clamp(sun,0.0,1.0);
                              
                              glow = pow(glow,6.0) * 1.0;
                              glow = pow(glow,(uv.y));
                              glow = clamp(glow,0.0,1.0);
                              
                              sun *= pow(dot(uv.y, uv.y), 1.0 / 1.65);
                              
                              glow *= pow(dot(uv.y, uv.y), 1.0 / 2.0);
                              
                              sun += glow;
                              
                              vec3 sunColor = vec3(1.0,0.6,0.05) * sun;
                              
                              return vec3(sunColor);
                          }
              
              `
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <dithering_fragment>`,
                `
              #include <dithering_fragment>
              vec2 uv = gl_FragCoord.xy / resolution.y;
          
              vec3 sky = getSky(uv);
              vec3 sun = getSun(uv);
          
              gl_FragColor = vec4(sky + sun,1.0);
          
              `
            )
            material.userData.shader = shader
        }

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(500, 16, 16),
            material
        )

        scene.add(mesh)
    }
}