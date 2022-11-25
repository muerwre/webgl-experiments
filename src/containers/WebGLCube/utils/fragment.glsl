#ifdef GL_ES
precision highp float;
#endif

varying vec4 v_positionWithOffset;

void main(void){
  gl_FragColor=vec4(v_positionWithOffset.xyz,1);
}