export const vertexShader = `
varying vec2 vUv;
void main(){
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const 伪3D图片 = `
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform vec2 iMouse;
uniform vec4 iCamera;
uniform sampler2D depthImage;
uniform sampler2D originalImage;

vec2 mirrored(vec2 v) {
   vec2 m = mod(v,2.);//取余
   return mix(m,2.0 - m, step(1.0 ,m));
}

void main(){
   //教程
   // vec4 depth = texture2D(depthImage, vUv);
   // float t = mod(iTime,5.0); // 余数把秒映射为周期5秒
   // t = (t / 5.0 - 0.5) / 7.; // 把[0,5)映射为[0,1)
   // t = iCamera.x;
   // gl_FragColor = texture2D(originalImage, vUv + t*depth.r);

   //鼠标
   // vec2 threshold = vec2(150.,250.); //坐标偏移改这里和鼠标范围
   // vec4 tex1 = texture2D(depthImage, mirrored(vUv));
   // vec2 fake3d = vec2(vUv.x + (tex1.r - 0.5)*iMouse.x/threshold.x, vUv.y + (tex1.r - 0.5)*iMouse.y/threshold.y);
   // gl_FragColor = texture2D(originalImage,mirrored(fake3d));
  

   //相机
   float cx = iCamera.x * 0.3;
   float cy = iCamera.y;
   if (cx > 15.) {
      cx = 15.;
   } else if (cx < -15.) {
      cx = -15.;
   }
   if (cy > 0.025) {
      cy = 0.025;
   } else if (cy < -0.025) {
      cy = -0.025;
   }
   vec2 threshold = vec2(3.,2.); //坐标偏移改这里和鼠标范围
   vec4 tex1 = texture2D(depthImage, mirrored(vUv))*vec4(2.5);//乘法加深深度
   vec2 fake3d = vec2(vUv.x + (tex1.r - 0.5)*cx/threshold.x, vUv.y + (tex1.r - 0.5)*cy/threshold.y);
   gl_FragColor = texture2D(originalImage,mirrored(fake3d));


}
`

var a=`
#ifdef GL_ES
  precision mediump float;
#define GLSLIFY 1
#endif

uniform vec4 resolution;
uniform vec2 mouse;
uniform vec2 threshold;
uniform float time;
uniform float pixelRatio;
uniform sampler2D image0;
uniform sampler2D image1;


vec2 mirrored(vec2 v) {
     vec2 m = mod(v,2.);
     return mix(m,2.0 - m, step(1.0 ,m));
}

void main() {
     // uvs and textures
  vec2 uv = pixelRatio*gl_FragCoord.xy / resolution.xy ;
  vec2 vUv = (uv - vec2(0.5))*resolution.zw + vec2(0.5);
  vUv.y = 1. - vUv.y;
  vec4 tex1 = texture2D(image1,mirrored(vUv));
  // tex1.r = 1. - tex1.r;
  // tex1.r = tex1.r*tex1.r;
  vec2 fake3d = vec2(vUv.x + (tex1.r - 0.5)*mouse.x/threshold.x, vUv.y + (tex1.r - 0.5)*mouse.y/threshold.y);
  vec4 tex0 = texture2D(image0,mirrored(fake3d));
  


  gl_FragColor = vec4(uv,0.,1.);
  gl_FragColor = tex0;
}

`
export const fragmentShader = 伪3D图片