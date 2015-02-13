uniform vec3 uBaseColor;
uniform vec2 resolution;
varying vec3 fPosition;
varying vec3 fNormal;

vec3 rim(vec3 color, float start, float end, float coef) {
  vec3 normal = normalize(fNormal);
  vec3 eye = normalize(-fPosition.xyz);
  float rim = smoothstep(start, end, 1.0 - dot(normal, eye));
  return clamp(rim, 0.0, 1.0) * coef * color;
}

void main() {
  gl_FragColor = vec4(rim(uBaseColor, 0.6, 0.3, 4.0), 1.0);
}
