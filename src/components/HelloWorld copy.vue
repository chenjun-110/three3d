<template>
  <div class="hello">
    <div ref="boxRef" class="three " @click="click"></div>
    <button @click="to3d" ref="to3dRef" style="position:absolute;top:60vh;right:40vw;">映射到三维世界</button>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
// import { fragmentShader, vertexShader } from './whiteqiu.glsl.js'
// import { fragmentShader, vertexShader } from './test.glsl.js'
// import { fragmentShader, vertexShader } from './sp.glsl.js'
// import { fragmentShader, vertexShader } from './qiu.glsl.js'
import { fragmentShader, vertexShader } from './bianxing.glsl.js'
window.THREE = THREE
onMounted(() => {
  boxRef.value.appendChild(renderer.domElement);
  render();
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  window.addEventListener('mousemove', function (event) {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = - (event.clientY / window.innerHeight) * 2 + 1;
    // uniforms.iMouse.value.x = event.pageX
    // uniforms.iMouse.value.y = event.pageY
    uniforms.iMouse.value.x = camera.position.x / 5 * window.innerWidth
    uniforms.iMouse.value.y = -1 * camera.position.y / 5 * window.innerHeight
    // console.log('camera', camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2))


  });

})

let boxRef = ref(null)

//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight, false)

let scene = new THREE.Scene()

const fov = 50;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
camera.position.set(0, 0, 15)
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(controls);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// const geometry = new THREE.SphereGeometry(5, 100, 100);
const geometry = new THREE.BoxGeometry(1, 2, 1);
// const texture = new THREE.TextureLoader().load('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a5555e708712a8012165187ca0e4.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665144131&t=a4704961e5d1c27e309e99986b2ae03e');
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// geometry.scale(1, 1, -1)

// const material = new THREE.SpriteMaterial({ color: 0xffffff });

// const sprite = new THREE.Sprite(material);
// sprite.scale.set(2, 2,2)
// scene.add(sprite);
const uniforms = {
  iTime: {
    value: 0
  },
  iMouse: {
    value: new THREE.Vector2(0, 0,)
  },
  iChannel0: {
    value: 0
  },
  iCamera: {
    value: new THREE.Vector4(0, 0, 0, 1.)
  }
}
material.onBeforeCompile = function (shader) {
  shader.vertexShader = vertexShader
  //替换片元着色器
  // shader.fragmentShader = fragmentShader
  //改全局变量
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(
      window.innerWidth, window.innerHeight
    )
  }
  shader.uniforms.iTime = uniforms.iTime
  shader.uniforms.iMouse = uniforms.iMouse
  shader.uniforms.iCamera = uniforms.iCamera
  shader.uniforms.iChannel0 = new THREE.TextureLoader().load('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a5555e708712a8012165187ca0e4.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665144131&t=a4704961e5d1c27e309e99986b2ae03e')
}

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const pointsMaterial = new THREE.PointsMaterial({
  size: 10,
  sizeAttenuation: false,
  map: new THREE.TextureLoader().load('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a5555e708712a8012165187ca0e4.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665144131&t=a4704961e5d1c27e309e99986b2ae03e'),
  alphaTest: 0.5
});
const points = new THREE.Points(mesh.geometry, pointsMaterial);
points.morphTargetInfluences = mesh.morphTargetInfluences;
points.morphTargetDictionary = mesh.morphTargetDictionary;
mesh.add(points);


scene.background = material
scene.environment = material

console.log('mesh', mesh)
function createCube(e) {
  // 创建立方体
  var cubeGeometry = new THREE.SphereGeometry(4, 10, 10)
  var cubeMaterial = new THREE.MeshLambertMaterial({
    morphTargets: true,
    color: 0xff0000
  })

  var cubeTarget1 = new THREE.SphereGeometry(2, 5, 5);
  var cubeTarget2 = new THREE.SphereGeometry(3, 4, 1)
  cubeGeometry.morphAttributes.position = [
    // new THREE.BufferAttribute(cubeTarget2.attributes.position.array, 3),
    new THREE.BufferAttribute(cubeTarget1.attributes.position.array, 3)
  ]
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(0, 3, 0)
  scene.add(cube)
  return cube
}
// const cube = createCube()
console.log('camera', camera)
// console.log('sprite', sprite)
const click = (event) => {
  // gsap.to(camera, {
  //   fov: camera.fov < 25 ? 50 : 10,
  //   duration: 10,
  //   onUpdate() {
  //     camera.updateProjectionMatrix();
  //   }
  // })
  const mouseX = event.clientX;//鼠标单击坐标X
  const mouseY = event.clientY;//鼠标单击坐标Y

  // 屏幕坐标转标准设备坐标
  const x = (mouseX / window.innerWidth) * 2 - 1;
  const y = -(mouseY / window.innerHeight) * 2 + 1;
  clickModel(event)

  // console.log('event.clientXY', mouseX, mouseY)
  // console.log('worldVector', convertCoodsToThree(mouseX, mouseY, 4), transToScreenCoord(mesh.position))//get3DPosByCanvasPos(new THREE.Vector2(mouseX, mouseY)))

  // 进行剩下操作，比如判断鼠标是否选中某个物体
}
const balls = []
const clickModel = (e) => {
  //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
  //根据照相机，把这个向量转换到视点坐标系
  let x = (e.clientX / window.innerWidth) * 2 - 1;
  let y = -(e.clientY / window.innerHeight) * 2 + 1;
  var vector = new THREE.Vector3(x, y, 0.5).unproject(camera);

  //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  //射线和模型求交，选中一系列直线
  var intersects = raycaster.intersectObjects(scene.children);
  // console.log('imtersrcts=',intersects, scene)
  let t = uniforms.iTime.value % 5 // 把秒映射为[0,5)
  // t = t / 5 // 把区间映射为[0,1)
  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].object.isMesh) {
      // x: Math.sin(uniforms.iTime.value) * target.position.x,
      //   y: Math.cos(uniforms.iTime.value) * target.position.y,
      //   z: Math.cos(uniforms.iTime.value) * target.position.z,
      const target = intersects[i].object
      console.log('mesh', target)
      balls.push(target)
      target._position = {
        t: t,
        x: target.position.x,
        y: target.position.y,
        z: target.position.z
      }
      const vec = new THREE.Vector3(target._position.x, target._position.y, target._position.z)
      let start = 2 * Math.PI + vec.angleTo(new THREE.Vector3(1, 0, 0)) //坐标转弧度再转sin起点偏移量
      let r = target.position.lengthSq()//Math.sqrt(target._position.x ** 2 + target._position.z ** 2)
      console.log(vec.angleTo(new THREE.Vector3(1, 0, 0)), r)

      setInterval(() => {
        target.position.x = Math.sin(start - 1.5 * Math.PI) * r
        target.position.z = Math.cos(start - 0.5 * Math.PI) * r
        target.position.y = Math.cos(start - 0.5 * Math.PI) * r
        start += 0.05
      }, 16)
      // gsap.to(target.position, {
      //   x: -target.position.x,
      //   // y: -target.position.y,
      //   z: -target.position.z,
      //   duration: 2,
      //   repeat: -1,
      //   yoyo: true,
      //   ease: 'none',
      //   onUpdate() {
      //     camera.updateProjectionMatrix();
      //   }
      // })
      break;
    }
  }
}
const to3dRef = ref()
const to3d = () => {
  const y = to3dRef.value.offsetTop;
  const x = to3dRef.value.offsetLeft;
  const geometry1 = new THREE.SphereGeometry(1, 32, 16);
  const material1 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geometry1, material1);
  scene.add(sphere);
  const vec2 = convertCoodsToThree(x, y)
  sphere.position.x = vec2.x
  sphere.position.y = vec2.y
  sphere.position.z = vec2.z
  console.log('to3d', x, y, vec2)

}
const convertCoodsToThree = (mouseX, mouseY, mouseZ = camera.position.z * 0.2) => {
  const x = (mouseX / window.innerWidth) * 2 - 1;
  const y = -(mouseY / window.innerHeight) * 2 + 1;
  var vec = new THREE.Vector3();
  vec.set(x, y, 0.5);
  vec.unproject(camera);

  vec.sub(camera.position).normalize();
  var distance = (mouseZ - camera.position.z) / vec.z;
  var pos = new THREE.Vector3();
  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  return new THREE.Vector3(pos.x, pos.y, pos.z);
};
function transToScreenCoord(vector) {
  var screenCoord = {};
  console.log('vector1', vector)
  vector.project(camera);//将三维坐标投影到相机平面变成以屏幕中心为原点的二维坐标。投影结果是一个单位向量，值在[-1,1]内。
  console.log('vector2', vector)
  screenCoord.x = (0.5 + vector.x / 2) * window.innerWidth;
  screenCoord.y = (0.5 - vector.y / 2) * window.innerHeight;
  return screenCoord;
}
// function get3DPosByCanvasPos (pos, targetZ=5) {    
//     let vec = new THREE.Vector3(); // create once and reuse
//     let target = new THREE.Vector3(); // create once and reuse
//     vec.set(
//         ( pos.x / window.innerWidth ) * 2 - 1,
//         - ( pos.y / window.innerHeight ) * 2 + 1,
//         0.5 );
//     vec.unproject( camera );
//     vec.sub( camera.position ).normalize();
//     var distance = (targetZ - camera.position.z) / 5;
//     target.copy( camera.position ).add( vec.multiplyScalar( distance ) );
//     return target;
// }

const clock = new THREE.Clock()
let startTime = Date.now()
function render(time) {
  // sprite.position.set(camera.position.x, 0, camera.position.z - 5)
  uniforms.iTime.value = clock.getElapsedTime()
  uniforms.iCamera.value.x = camera.position.x
  uniforms.iCamera.value.y = camera.position.y
  uniforms.iCamera.value.z = camera.position.z
  let w = camera.position.z % 50. // 把秒映射为[0,5)
  w = w / 50. // 把区间映射为[0,1)
  uniforms.iCamera.value.w = camera.position.z * 0.05

  // balls.forEach(v => {
  //   // let t = uniforms.iTime.value % (2 * Math.PI) // 把秒映射为[0,2p)
  //   // t = t / (2 * Math.PI) // 把区间映射为[0,2p)  
  //   v.position.x = (Math.sin(uniforms.iTime.value % (5) - v._position.t)) * 5
  //   v.position.z = (Math.cos(uniforms.iTime.value % (5) - v._position.t)) * 5

  //   // v.position.z = Math.cos(uniforms.iTime.value) - v._position.z / (2 * Math.PI)
  // })
  renderer.render(scene, camera);
  requestAnimationFrame(render);

  // var position = mesh.geometry.attributes.position;
  // for (let i = 0; i * 9 < position.array.length; i++) {
  //   position.array[i * 3] -= 0.001
  //   // position.array[i*3+1] += ( Date.now() - startTime ) / 1000000
  //   // position.array[i*3+2] += ( Date.now() - startTime ) / 1000000
  // }
  // console.log('position', position)
  // position.needsUpdate = true;
  let t = uniforms.iTime.value % 1 / 1// 把秒映射为[0,5)
  // cube.morphTargetInfluences[0] = t
  // cube.morphTargetInfluences[1] = 0.1
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
