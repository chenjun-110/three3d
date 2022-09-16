<template>
  <div class="hello" style="position: relative;">
    <!-- <div class="kapian" ref="kapianRef">
      <img class="kuang" ref="kuangRef" src="../assets/1.png" />
      <img class="shan" src="../assets/2.png" />
    </div> -->
    <div ref="boxRef" class="three" @click="click"></div>
    <!-- <button @click="to3d" ref="to3dRef" style="position:absolute;top:60vh;right:40vw;">映射到三维世界</button> -->
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref, onMounted } from 'vue'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/addons/renderers/CSS3DRenderer.js';

import gsap from 'gsap'
// import { fragmentShader, vertexShader } from './whiteqiu.glsl.js'
import { fragmentShader, vertexShader } from './test.glsl.js'
import { fragmentShader as fragmentShader1, vertexShader as vertexShader1 } from './img3d.glsl.js'
import { BufferA, fragmentShader as fragmentShader2, vertexShader as vertexShader2 } from './trees.glsl.js'
// import { fragmentShader, vertexShader } from './sp.glsl.js'
// import { fragmentShader, vertexShader } from './qiu.glsl.js'
// import { fragmentShader, vertexShader } from './bianxing.glsl.js'

import { renderCard3D, createCard3D } from './card3d.js'
window.THREE = THREE


let boxRef = ref(null)
//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight, false)
let css2DLabelRenderer = new CSS2DRenderer();
css2DLabelRenderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(css2DLabelRenderer.domElement);
css2DLabelRenderer.domElement.style.position = 'absolute';
css2DLabelRenderer.domElement.style.top = 0;
css2DLabelRenderer.domElement.style.pointerEvents = 'none';
// let css3DRenderer = new CSS3DRenderer();
// css3DRenderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(css3DRenderer.domElement);

//相机
let scene = new THREE.Scene()
const fov = 50;
const near = 0.1;
const far = 1000;
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(5, 10, 15);
light2.castShadow = true;
scene.add(light2);
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
camera.position.set(0, 0, 10)
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = -10;
controls.maxDistance = 10;
controls.panSpeed = 1
controls.target = new THREE.Vector3(0, 0, 9);
controls.update();
scene.add(controls);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

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
  },
  iLock: {
    value: true
  }
}

// 背景图
const geometry = new THREE.SphereGeometry(10, 50, 50);
const texture = new THREE.TextureLoader().load('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a5555e708712a8012165187ca0e4.jpg%403000w_1l_0o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665144131&t=a4704961e5d1c27e309e99986b2ae03e');
const material = new THREE.MeshBasicMaterial({ map: texture, });
geometry.scale(1, 1, -1)
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 10)
scene.add(mesh);

// 立方体
const cube = new THREE.BoxGeometry(1, 3, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color('grey') });
const cubeMesh = new THREE.Mesh(cube, cubeMaterial);
cubeMaterial.onBeforeCompile = function (shader) {
  shader.vertexShader = vertexShader
  shader.fragmentShader = fragmentShader
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(
      window.innerWidth, window.innerHeight
    )
  }
  shader.uniforms.iTime = uniforms.iTime
  shader.uniforms.iMouse = uniforms.iMouse
  shader.uniforms.iCamera = uniforms.iCamera
  shader.uniforms.iLock = uniforms.iLock
}
cubeMesh.position.set(-5, -5, 8.5)
cubeMesh.name = "音响"
scene.add(cubeMesh);

//平面
const card = new THREE.PlaneGeometry(16 / 3, 11 / 3);
const cardMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
cardMaterial.onBeforeCompile = function (shader) {
  shader.vertexShader = vertexShader1
  shader.fragmentShader = fragmentShader1
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(
      window.innerWidth, window.innerHeight
    )
  }
  shader.uniforms.iTime = uniforms.iTime
  shader.uniforms.iMouse = uniforms.iMouse
  shader.uniforms.iCamera = uniforms.iCamera
  shader.uniforms.originalImage = {
    value: new THREE.TextureLoader().load('./mount.jpg')
  }
  shader.uniforms.depthImage = {
    value: new THREE.TextureLoader().load('./mount-map.jpg')
  }
}
const planeMash = new THREE.Mesh(card, cardMaterial);
planeMash.position.set(0, 0, 4)

// const card2 = new THREE.PlaneGeometry(16, 11);
// const cardMaterial2 = new THREE.MeshBasicMaterial({});
// cardMaterial2.onBeforeCompile = function (shader) {
//   shader.vertexShader = vertexShader2
//   shader.fragmentShader = fragmentShader2
//   shader.uniforms.iResolution = {
//     value: new THREE.Vector2(
//       window.innerWidth, window.innerHeight
//     )
//   }
//   shader.uniforms.iTime = uniforms.iTime
//   shader.uniforms.iChannel0 = uniforms.iChannel0
//   shader.uniforms.iFrame = {
//     value: 60.
//   }
// }
// const planeMash2 = new THREE.Mesh(card2, cardMaterial2);
// planeMash2.position.set(0, 0, 4)
// scene.add(planeMash2)

// var renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
// let scene2 = new THREE.Scene()
// const card3 = new THREE.PlaneGeometry(16, 11);
// const cardMaterial3 = new THREE.MeshBasicMaterial({});
// cardMaterial3.onBeforeCompile = function (shader) {
//   shader.vertexShader = vertexShader2
//   shader.fragmentShader = BufferA
//   shader.uniforms.iResolution = {
//     value: new THREE.Vector2(
//       window.innerWidth, window.innerHeight
//     )
//   }
//   shader.uniforms.iTime = uniforms.iTime
//   shader.uniforms.iMouse = uniforms.iMouse
//   shader.uniforms.iCamera = uniforms.iCamera
//   shader.uniforms.iFrame = {
//     value: 60.
//   }
// }
// const planeMash3 = new THREE.Mesh(card3, cardMaterial3);
// planeMash3.position.set(0, 0, 4)
// scene2.add(planeMash3)
// scene.add(planeMash3)
const textConfig = [
  {
    textContent: '相框',
    position: new THREE.Vector3(0.4, 1.3, 0),
    parent: scene,
    click() {
      scene.add(planeMash);
      //隐藏文字div
      planeMash.children[0].element.style.display = 'block'
      scene.getObjectByName('相框').element.style.opacity = 0
      console.log(scene);
    }
  },
  {
    textContent: '门',
    position: new THREE.Vector3(-8, 1, 10.8),
    parent: scene,
    click() {
      console.log('1234')
      alert('门')
    }
  },
  {
    textContent: '开关',
    position: new THREE.Vector3(0, 1.5, 0),
    parent: cubeMesh,
    click() {
      uniforms.iLock.value = !uniforms.iLock.value
      cubeMaterial.needsUpdate = true
      console.log('音响', uniforms)
    }
  },
  {
    textContent: '关闭',
    position: new THREE.Vector3(2.2, 1.5, 0),
    parent: planeMash,
    click() {
      scene.remove(planeMash);
      console.log(planeMash)
      scene.getObjectByName('相框').element.style.opacity = 1
      planeMash.children[0].element.style.display = 'none'
    }
  },
]
//创建文字标签
function createText() {
  for (let config of textConfig) {
    const { textContent, position, click, parent } = config
    let div = document.createElement('div');
    div.className = 'label';
    div.textContent = textContent;
    div.style.pointerEvents = 'auto'
    div.addEventListener('click', click)
    let css2d = new CSS2DObject(div);
    css2d.name = textContent
    css2d.position.copy(position);
    parent.add(css2d);
  }
}



scene.background = material
scene.environment = material

console.log('mesh', mesh)

console.log('camera', camera)
// console.log('sprite', sprite)
const click = (event) => {
  const mouseX = event.clientX;//鼠标单击坐标X
  const mouseY = event.clientY;//鼠标单击坐标Y

  // 屏幕坐标转标准设备坐标
  const x = (mouseX / window.innerWidth) * 2 - 1;
  const y = -(mouseY / window.innerHeight) * 2 + 1;
  // clickModel(event)

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

createCard3D({scene})



const clock = new THREE.Clock()
function render() {
  // sprite.position.set(camera.position.x, 0, camera.position.z - 5)
  uniforms.iTime.value = clock.getElapsedTime()
  uniforms.iCamera.value.x = camera.position.x
  uniforms.iCamera.value.y = camera.position.y
  uniforms.iCamera.value.z = camera.position.z
  // console.log(camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2))
  let w = camera.position.z % 50. // 把秒映射为[0,5)
  w = w / 50. // 把区间映射为[0,1)
  uniforms.iCamera.value.w = camera.position.z * 0.05

  // renderer.render(scene2, camera, renderTarget);
  // uniforms.iChannel0.value = renderTarget.texture
  let bool = true
  renderCard3D({ camera, uniforms, scene, renderer, controls, showWorld: bool })

  bool &&renderer.render(scene, camera);

  css2DLabelRenderer.render(scene, camera)
  // css3DRenderer.render(scene, camera)
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
onMounted(() => {
  boxRef.value.appendChild(renderer.domElement);
  render();
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  createText()
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
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

.label {
  color: white;
  cursor: pointer;
}

.container3d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.kapian {
  width: 340px;
  height: 464px;
  display: inline-block;
  position: absolute;
  background-color: rgb(201, 249, 247);
  overflow: hidden;
}

.kuang {
  position: absolute;
  top: 0;
  right: -1px;
  width: 378px;
  height: 500px;
  z-index: 1;
}

.shan {
  width: 100%;
  position: absolute;
  bottom: 30px;
  left: 0;
  transform: translate3d(0px, 0px, -20px);
}
</style>
