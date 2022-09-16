import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let sceneBack = new THREE.Scene()
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
let div = ''
const cameraBack = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// cameraBack.position.set(0, 2, 10)
const axesHelper = new THREE.AxesHelper(5);
sceneBack.add(axesHelper);

const geometry = new THREE.CircleGeometry(0.3, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const circle = new THREE.Mesh(geometry, material);
circle.position.set(-1, 4, 0)
sceneBack.add(circle);

const geometry1 = new THREE.CircleGeometry(1, 32);
const circle1 = new THREE.Mesh(geometry1, material);
circle1.position.set(2, 3, 2)
sceneBack.add(circle1);

const Plane = new THREE.PlaneGeometry(2, 0.3);
const materialPlane = new THREE.MeshBasicMaterial({ color: 0xfebe00, side: THREE.DoubleSide });
const plane = new THREE.Mesh(Plane, materialPlane);
plane.position.set(0, -0.7, 8) //靠近摄像机的lookAt，不然挪视角会幅度很大
sceneBack.add(plane);

let z = 0
export function renderCard3D({ scene, camera, uniforms, renderer, showWorld = true, controls }) {
  if (!z) {
    z = camera.position.z
  }
  // 相机和面的夹角，内外世界应一样。
  // let positions = geometry2.attributes.position.array
  // let normals = geometry2.attributes.normal.array
  // let cameravec3 = new THREE.Vector3().copy(camera.position)
  // //面顶点到相机的向量 应= 原点到相机的向量 - 原点到面顶点的向量
  // cameravec3.sub(new THREE.Vector3(positions[0], positions[1], positions[2]))
  // //向量与顶点法向量的夹角
  // let angle = cameravec3.angleTo(new THREE.Vector3(normals[0], normals[1], normals[2]))
  // //内相机的旋转轴
  // let axis = new THREE.Vector3().copy(controls.target).normalize()
  // 旋转
  // let vec = new THREE.Vector3().copy(camera.position).applyAxisAngle(axis, angle*0.0001)
  // cameraBack.position.set(vec.x, vec.y, z)
  let b = 1-(camera.position.z-10)/10 //变化率
  cameraBack.position.set(camera.position.x * b, camera.position.y * b, z)
  // cameraBack.setRotationFromAxisAngle(axis, angle)
  // console.log(angle, cameraBack.position)

  showWorld && renderer.setRenderTarget(renderTarget)
  renderer.render(sceneBack, cameraBack, renderTarget);
  showWorld && renderer.setRenderTarget(null)
  // if (!div) {
  //   div = renderer.domElement
  //   const controls = new OrbitControls(cameraBack, renderer.domElement);
  //   controls.target = new THREE.Vector3(0, 2, 0);
  //   controls.update();
  // }
}
const geometry2 = new THREE.PlaneGeometry(1, 1);
//创建外壳
export function createCard3D({ scene }) {
  const material2 = new THREE.MeshPhongMaterial({ map: renderTarget.texture, side: THREE.DoubleSide });
  const plane2 = new THREE.Mesh(geometry2, material2);
  plane2.position.set(0, 0, 8)
  scene.add(plane2);
  console.log('外壳', geometry2)


  return plane2
}