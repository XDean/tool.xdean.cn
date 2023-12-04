// language=Glsl
export const VertexShader = `\
varying vec2 vUv;
varying vec4 vPos;

void main(){
    vUv = uv;
    vPos = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    gl_Position = vPos;
}
`

// language=Glsl
export const BasicShader = `
uniform float time;
varying vec2 vUv;
varying vec4 vPos;

void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 1, 1);
}

`