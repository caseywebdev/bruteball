uniform vec3 viewVector;
uniform float c;
uniform float p;
varying float intensity;
void main() {
  vec3 vn1 = normalize(normalMatrix * normal);
  vec3 vn2 = normalize(normalMatrix * viewVector);
  intensity = pow(c - dot(vn1, vn2), p);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
