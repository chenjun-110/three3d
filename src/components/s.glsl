_setupGeometry(){
  this._geometry=new n.InstancedBufferGeometry,
  this._geometry.copy(this._baseGeometry),//new n.PlaneBufferGeometry(1,1,1,1)
  this.aPos=new n.InstancedBufferAttribute(new Float32Array(4*this._nb),4),
  this.aScale=new n.InstancedBufferAttribute(new Float32Array(3*this._nb),3),
  this.aOrientation=new n.InstancedBufferAttribute(new Float32Array(4*this._nb),4),
  this._geometry.addAttribute("a_pos",this.aPos),
  this._geometry.addAttribute("a_scale",this.aScale),
  this._geometry.addAttribute("a_orientation",this.aOrientation);
  for(let e=0;e<this._nb;e++){
    this.aPos.setXYZW(e, 
    (0,r.default)(-10,10),
    (0, r.default)(-10,10),(0,
      r.default)(-10,10),(0,
      r.default)(.2,.8)),
      this.aScale.setXYZ(e,1,1,1);
      const t=(new n.Quaternion).setFromAxisAngle(new n.Vector3(0,0,1),0);
      this.aOrientation.setXYZW(e,t.x,t.y,t.z,t.w)
    }
  }
  
  #define GLSLIFY 1
  attribute vec4 a_pos;
  attribute vec3 a_scale;
  attribute vec4 a_orientation;
  attribute vec2 aOffset;
  attribute float aSpeed;
  attribute float aStartPosition;
  attribute float aVertcalOffset;
  attribute float aDirection;
  uniform float uTime;
  uniform float uGlobalScale;
  varying vec2 vUv;
  varying vec2 vOffset;
  varying float vAlpha;
  mat3 quatToMatrix(vec4 q){
    mat3 mat;
    float sqw=q.w*q.w;
    float sqx=q.x*q.x;
    float sqy=q.y*q.y;
    float sqz=q.z*q.z;// invs (inverse square length) is only required if quaternion is not already normalised
    float invs=1./(sqx+sqy+sqz+sqw);
    mat[0][0]=(sqx-sqy-sqz+sqw)*invs;// since sqw + sqx + sqy + sqz =1/invs*invs
    mat[1][1]=(-sqx+sqy-sqz+sqw)*invs;
    mat[2][2]=(-sqx-sqy+sqz+sqw)*invs;
    float tmp1=q.x*q.y;
    float tmp2=q.z*q.w;
    mat[1][0]=2.*(tmp1+tmp2)*invs;
    mat[0][1]=2.*(tmp1-tmp2)*invs;/n tmp1=q.x*q.z
    tmp2=q.y*q.w;
    mat[2][0]=2.*(tmp1-tmp2)*invs;
    mat[0][2]=2.*(tmp1+tmp2)*invs;
    tmp1=q.y*q.z;tmp2=q.x*q.w;
    mat[2][1]=2.*(tmp1+tmp2)*invs;
    mat[1][2]=2.*(tmp1-tmp2)*invs;
    return mat;
  }
  void main(){
    vec3 pos=a_pos.xyz;
    pos.x=mod(uTime*aSpeed*200.*aDirection+aStartPosition,1000.)-500.;
    pos.y+=sin(uTime*aSpeed)*aVertcalOffset;//
    pos.x+=uTime*10.;
    vec3 scale=a_scale;//
    scale.x+=(sin(uTime*aSpeed)+1.)*1.;
    scale.y*=(sin(uTime*aSpeed*5.)+1.)*1.*uGlobalScale;
    vec4 orientation=a_orientation;
    mat3 rotation=quatToMatrix(orientation);
    vec4 viewModelPosition=modelViewMatrix*vec4(position*scale*rotation+pos,1.);
    gl_Position=projectionMatrix*viewModelPosition;
    vUv=uv;
    vAlpha=a_pos.w;
    vOffset=aOffset;
  }
  