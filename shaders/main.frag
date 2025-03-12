#version 330
in vec2 fragTexCoord;
in vec4 fragColor;

out vec4 finalColor;

uniform float time;
uniform vec4 colors[10];
uniform vec2 resolution;

// map vector to a scalar by using dot product
// then project it to sine wave which clamps value between -1 and 1
// multiply by a big scalar to create more randomness
// finally take the fractional part
float rand(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothT(float t) {
    return t * t * (3.0 - 2.0 * t); // 3t² - 2t³
}

vec2 randGradient(vec2 vertex) {
    float randVal = rand(vertex);
    float angle = randVal * 2.0 * 3.14159; // random angle between 0 and 2 pi
    return vec2(cos(angle), sin(angle)); // unit vector (vector with length = 1 that encodes direction)
}

void main()
{
    float gridSize = 50.0;
    float vertSize = 0.02;

    // get all 4 grid vertices of the current grid cell
    // component-wise division followed by component wise flooring
    vec2 gridVertTl = floor(gl_FragCoord.xy / gridSize);
    vec2 gridVertTr = floor(gl_FragCoord.xy / gridSize) + vec2(1, 0);
    vec2 gridVertBl = floor(gl_FragCoord.xy / gridSize) + vec2(0, 1);
    vec2 gridVertBr = floor(gl_FragCoord.xy / gridSize) + vec2(1, 1);

    // compute random gradients for each grid vertex
    vec2 gradientTl = randGradient(gridVertTl);
    vec2 gradientTr = randGradient(gridVertTr);
    vec2 gradientBl = randGradient(gridVertBl);
    vec2 gradientBr = randGradient(gridVertBr);

    // map frag coord to grid cell space
    vec2 fragPos = gl_FragCoord.xy / gridSize;
    vec2 normalizedFragPos = fract(fragPos);

    // calculate vectors pointing from grid vertices to the fragment
    vec2 distTl = normalizedFragPos - vec2(0.0, 0.0);
    vec2 distTr = normalizedFragPos - vec2(1.0, 0.0);
    vec2 distBl = normalizedFragPos - vec2(0.0, 1.0);
    vec2 distBr = normalizedFragPos - vec2(1.0, 1.0);

    float dotTl = dot(distTl, gradientTl);
    float dotTr = dot(distTr, gradientTr);
    float dotBl = dot(distBl, gradientBl);
    float dotBr = dot(distBr, gradientBr);

    float sx = smoothT(normalizedFragPos.x);
    float sy = smoothT(normalizedFragPos.y);
    // spatial interpolation
        // horizontal
    float topMix = mix(dotTl, dotTr, sx);
    float bottomMix = mix(dotBl, dotBr, sx);
        // vertical
    float finalNoise = mix(topMix, bottomMix, sy) + 0.5;

    finalColor = colors[1] * vec4(vec3(1), finalNoise);
}
