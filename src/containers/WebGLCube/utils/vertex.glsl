attribute vec4 aVertexPosition;
varying vec4 v_positionWithOffset;

uniform float slide;
uniform vec4 rotation;

void main(){
  mat4 rotateX=mat4(
    1,0,0,0,
    0,rotation.xy,0,
    0,rotation.zw,0,
    0,0,0,1
  );
  
  mat4 rotateY=mat4(
    rotation.x,0,rotation.z,0,
    0,1,0,0,
    rotation.y,0,rotation.w,0,
    0,0,0,1
  );
  
  mat4 rotateZ=mat4(
    rotation.xy,0,0,
    rotation.zw,0,0,
    0,0,1,0,
    0,0,0,1
  );
  
  vec4 scale=vec4(vec3(slide*slide*.2).xyz,1);
  
  gl_Position=rotateZ*rotateX*rotateY*aVertexPosition*scale,
  v_positionWithOffset=gl_Position+vec4(1,1,1,1);
}