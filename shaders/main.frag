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
    float angle = randVal * 2.0 * 3.14159; // seeded random angle between 0 and 2 pi that changes periodically over time
    return vec2(cos(angle + time * 0.5), sin(angle + time * 0.5)); // unit vector (vector with length = 1 that encodes direction)
}

float perlin(vec2 pos, float gridSize) {

    // get all 4 grid vertices of the current grid cell
    // component-wise division followed by component wise flooring
    vec2 gridVertTl = floor(pos.xy / gridSize);
    vec2 gridVertTr = floor(pos.xy / gridSize) + vec2(1, 0);
    vec2 gridVertBl = floor(pos.xy / gridSize) + vec2(0, 1);
    vec2 gridVertBr = floor(pos.xy / gridSize) + vec2(1, 1);

    // compute random gradients for each grid vertex
    vec2 gradientTl = randGradient(gridVertTl);
    vec2 gradientTr = randGradient(gridVertTr);
    vec2 gradientBl = randGradient(gridVertBl);
    vec2 gradientBr = randGradient(gridVertBr);

    // map frag coord to grid cell space
    vec2 fragPos = pos.xy / gridSize;
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
    return mix(topMix, bottomMix, sy) + 0.5;
}

void main()
{
    int octaves = 6;
    float gridSize = 100.0;
    float finalNoise = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float totalAmplitude = 0.0;

    // generate fractal noise -> blend octaves of perlin noise
    for (int i = 0; i < octaves; ++i) {
        finalNoise += perlin(gl_FragCoord.xy * frequency, gridSize) * amplitude;
        totalAmplitude += amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    finalNoise /= totalAmplitude;
    int colorIndex = int(finalNoise * 9.0); // Map to 0-9 (10 colors)
    finalColor = colors[colorIndex]; }
