#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

void main() {
    vec4 inColor = texture(sourceTexture, sourceUV);
    outColor = inColor;

    outColor.rgb += dFdx(inColor.rgb)*vec3(3, 0, -3);
}


