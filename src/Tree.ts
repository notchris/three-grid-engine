// import getObjFileAsString from './model/tree'
// import * as THREE from 'three'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

// const treeRay = new THREE.Raycaster()
// const treeRayPos = new THREE.Vector3()
// const treeRayDir = new THREE.Vector3(0, -1, 0)

// const vertices = []
// const dummy = new THREE.Object3D()
// const group = new OBJLoader().parse(getObjFileAsString())
// const geo = (group.children[1] as any).geometry
// geo.computeBoundingBox()
// geo.scale(0.5, 0.5, 0.5)


// let material = new THREE.MeshToonMaterial()
// material.onBeforeCompile = shader => {

//     // Vertex Shader
//     shader.uniforms.color1 = { value: new THREE.Color("#79a456") }
//     shader.uniforms.color2 = { value: new THREE.Color("#476132") }
//     shader.uniforms.bboxMin = { value: geo.boundingBox.min }
//     shader.uniforms.bboxMax = { value: geo.boundingBox.max }
//     shader.vertexShader = shader.vertexShader.replace(
//         `#include <common>`,
//         `
//   #include <common>
//   uniform vec3 bboxMin;
//   uniform vec3 bboxMax;

//   varying vec2 vUv;
//   `
//     )
//     shader.vertexShader = shader.vertexShader.replace(
//         `#include <begin_vertex>`,
//         `
//   #include <begin_vertex>
//   vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
//   gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  
//   `
//     )

//     shader.fragmentShader = shader.fragmentShader.replace(
//         `#include <common>`,
//         `
//   #include <common>
//   uniform vec3 color1;
//   uniform vec3 color2;

//   varying vec2 vUv;
//   `
//     )

//     shader.fragmentShader = shader.fragmentShader.replace(
//         `#include <dithering_fragment>`,
//         `
//   #include <dithering_fragment>
  
//   vec3 col = mix(color2, color1, vUv.y);
//   gl_FragColor = vec4( outgoingLight * col, diffuseColor.a );

//   `
//     )

// }


// tilemap.forEach((x, y, tile) => {
//     if (tile.collide) {
//         vertices.push({ x, y })
//     }
// })
// const mesh = new THREE.InstancedMesh((geo as any), material, vertices.length)
// console.log(vertices.length)

// vertices.forEach((v, i) => {
//     treeRayPos.set(v.x + i / 2, 100, v.y)
//     treeRay.set(treeRayPos, treeRayDir)
//     const intersect = treeRay.intersectObject(world.ground.mesh)
//     if (intersect.length > 0) {

//         const rndScale = THREE.MathUtils.randFloat(1, 1.5)
//         const rndOffset = THREE.MathUtils.randFloat(-0.3, 0.3)

//         dummy.position.set(v.x + i / 2, intersect[0].point.y - 0.2, v.y + rndOffset)
//         dummy.scale.set(rndScale, rndScale, rndScale)
//         dummy.updateMatrix()
//         mesh.setMatrixAt(i, dummy.matrix)
//     }
// })


// mesh.instanceMatrix.needsUpdate = true
// scene.add(mesh)