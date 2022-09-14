export const vertexShader = `
varying vec2 vUv;
void main(){
   vUv = uv;
  //  mat4 model = mat4(
  //   position.x * 10.0,0.0,0.0,0.0
  //   ,0.0,1.0,0.0,0.0
  //   ,0.0,0.0,1.0,0.0
  //   ,0.0,0.0,0.0,1.0);
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export const fragmentShader = ``