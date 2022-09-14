export const vertexShader = `
varying vec2 vUv;
void main(){
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const 渐变色 = `
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform bool iLock;
void main(){
      if (iLock == true) {
         gl_FragColor = vec4(0.5,0.5,0.5,1.0);
      } else {

       vec3 col = 0.5 + 0.5*cos(iTime+vUv.xyx+vec3(0,2,4));
       gl_FragColor = vec4(col,1.0);
      }
      
   }
`
export const 灯带 = `
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
void main(){

      float lineWidth = 0.2;

      float t = mod(iTime,2.); // 把秒映射为[0,5)
      t = t / 2. ; // 把区间映射为[0,1)

      if((vUv.y-t- lineWidth)<lineWidth && (vUv.y-t- lineWidth) > 0.) {
        gl_FragColor = vec4(vec3(0.0), 1.0);
      } else {
        gl_FragColor = vec4(1.);
      }
   }
`
export const fragmentShader = 渐变色