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

void main()
{
    float gridSize = 50.0;
    float vertSize = 0.02;

    float fractX = fract(gl_FragCoord.x / gridSize);
    float fractY = fract(gl_FragCoord.y / gridSize);

 
    // component-wise division followed by component wise flooring
    vec2 gridVert = floor(gl_FragCoord.xy / gridSize);
    float randVal = rand(gridVert);

    float angle = randVal * 2 * 3.14159; // angle between 0 and 2 pi
    vec2 gradient = vec2(cos(angle), sin(angle)); // unit vector

    // check if we're at a grid vert
    if ((fractX < vertSize && fractY < vertSize) || 
        (fractX < vertSize && fractY > 1 - vertSize) || 
        (fractX > 1 - vertSize && fractY < vertSize) || 
        (fractX > 1- vertSize && fractY > 1 - vertSize)) {
        
        // normalize red and green with respect to the gradient components
        float r = (gradient.x + 1.0) / 2.0;
        float g = (gradient.y + 1.0) / 2.0;
        
        finalColor = vec4(r, g, 0.0, 1.0);
    } else {
        finalColor = vec4(vec3(0), 1);
    }
}
