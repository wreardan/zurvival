/*
dream vision vUvt effect
http://www.geeks3d.com/20091112/shader-library-dream-vision-vUvt-processing-filter-glsl/
*/

uniform sampler2D tDiffuse;
varying vec2 vUv;

//uniforms for enabling effects
uniform float dreamvision;
uniform float bloodvision;

void main() {
  vec4 texColor = texture2D(tDiffuse, vUv); //original pixel color
  gl_FragColor = texColor;
  if(dreamvision > 0.0){
    vec4 texColorDream = texColor;
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

    gl_FragColor = mix(gl_FragColor,texColorDream, dreamvision);
  }
  if(bloodvision > 0.0){
    vec4 texColorBlood = vec4(texColor.r/2.0 + texColor.g/4.0 + texColor.b/4.0, 0.0, 0.0, texColor.a);
    gl_FragColor = mix(gl_FragColor, texColorBlood, bloodvision);
  }   
}