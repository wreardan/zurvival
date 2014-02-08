/*
dream vision vUvt effect
http://www.geeks3d.com/20091112/shader-library-dream-vision-vUvt-processing-filter-glsl/
*/

uniform sampler2D tDiffuse;
varying vec2 vUv;

//uniforms for enabling effects
uniform float dreamvision;

void main() {
  vec4 texColor = texture2D(tDiffuse, vUv); //original pixel color
  gl_FragColor = texColor;
if(dreamvision > 0){
  texColorDream
  texColorDream += texture2D(tDiffuse, vUv + 0.001);
  texColorDream += texture2D(tDiffuse, vUv + 0.003);
  texColorDream += texture2D(tDiffuse, vUv + 0.005);
  texColorDream += texture2D(tDiffuse, vUv + 0.007);
  texColorDream += texture2D(tDiffuse, vUv + 0.009);
  texColorDream += texture2D(tDiffuse, vUv + 0.011);

  texColorDream += texture2D(tDiffuse, vUv - 0.001);
  texColorDream += texture2D(tDiffuse, vUv - 0.003);
  texColorDream += texture2D(tDiffuse, vUv - 0.005);
  texColorDream += texture2D(tDiffuse, vUv - 0.007);
  texColorDream += texture2D(tDiffuse, vUv - 0.009);
  texColorDream += texture2D(tDiffuse, vUv - 0.011);

  texColorDream.rgb = vec3((texColorDream.r + texColorDream.g + texColorDream.b) / 3.0);
  texColorDream = texColorDream / 9.5;

  gl_FragColor = mix(texColor,texColorDream, dreamvision);
  }
}