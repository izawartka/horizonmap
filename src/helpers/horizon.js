import createREGL from 'regl';
import Constants from './constants';

async function processTiles(combinedTiles, heightOffset, rays, radius, includeCurvature) {
    const width = combinedTiles.width;
    const height = combinedTiles.height;
    const maxRadius = Math.ceil(Math.max(width, height) / 2);

    const canvas = new OffscreenCanvas(width, height);

    const gl = canvas.getContext('webgl');
    if(!gl) throw new Error('WebGL not supported');

    const regl = createREGL({ gl });

    if(!regl) throw new Error('REGL not supported');

    const tileBuffer = regl.framebuffer({
        color: regl.texture({
            data: combinedTiles.data,
            width: combinedTiles.width,
            height: combinedTiles.height
        }),
        depth: false
    });

    const roundBuffer = regl.framebuffer({
        color: regl.texture({
            width: rays,
            height: maxRadius,
            wrap: 'clamp',
        }),
        depth: false
    });

    const roundBuffer2 = regl.framebuffer({
        color: regl.texture({
            width: rays,
            height: maxRadius,
            wrap: 'clamp'
        }),
        depth: false
    });

    const projectAndRelativise = regl({
        frag: `
            precision mediump float;
            uniform sampler2D tex;
            uniform float heightOffset;
            uniform vec2 size;
            uniform vec2 center;
            uniform float radius;
            uniform float theta;
            varying vec2 uv;

            float colorToHeight(vec4 color) {
                return (color.r * 65536.0 + color.g * 256.0 + color.b) - 32768.0;
            }

            vec4 angleToColor(float angle) {
                float a2 = angle / 3.14159265359 + 0.5; // Normalize to [0,1]
                float fixed24 = a2 * 16777215.0; // Scale to 24-bit integer range (2^24 - 1)
            
                return vec4(
                    floor(fixed24 / 65536.0) / 255.0,                // High byte (Red)
                    floor(mod(fixed24, 65536.0) / 256.0) / 255.0,    // Mid byte (Green)
                    mod(fixed24, 256.0) / 255.0,                     // Low byte (Blue)
                    1.0                                             // Alpha (constant 1)
                );
            }

            float getBaseHeight() {
                vec4 color = texture2D(tex, center / size);
                return colorToHeight(color);
            }

            vec2 project(vec2 uv) {
                float angle = uv.x * 2.0 * 3.14159265359;

                vec2 outUv = center + vec2(
                    uv.y * center.x * cos(angle),
                    uv.y * center.y * sin(angle)
                );

                return outUv / size;                
            }

            float uv2ToDistance(vec2 uv2) {
                return length(uv2 - vec2(0.5)) * radius * 1000.0;
            }
            
            float getCurvatureHeightDiff(float distance) {
                ${includeCurvature ? '' : 'return 0.0;'}
                float earthRadius = 6371000.0;
                float curvature = distance * distance / (2.0 * earthRadius);
                return curvature;
            }

            void main() {
                vec2 uv2 = project(uv);
                vec4 color = texture2D(tex, uv2);
                float height = colorToHeight(color);
                float distance = uv2ToDistance(uv2);
                float heightDiff = height - getBaseHeight() - heightOffset - getCurvatureHeightDiff(distance);
                float angle = atan(heightDiff, distance);
                gl_FragColor = angleToColor(angle);
            }
        `,
        vert: `
            precision mediump float;
            attribute vec2 position;
            varying vec2 uv;
            void main() {
                uv = 0.5 * (position + 1.0);
                gl_Position = vec4(position, 0, 1);
            }
        `,
        attributes: {
            position: [
                -1, -1,
                    1, -1,
                -1,  1,
                    1,  1
            ]
        },
        count: 4,
        primitive: 'triangle strip',
        uniforms: {
            tex: tileBuffer,
            heightOffset: ~~(heightOffset),
            size: [width, height],
            center: [width / 2, height / 2],
            radius: ~~(radius)
        },
        framebuffer: roundBuffer
    });

    const calcVisibility = regl({
        frag: `
            precision mediump float;
            uniform sampler2D tex;
            varying vec2 uv;

            float colorToAnglePi(vec4 color) {
                float fixed24 = color.r * 65536.0 * 255.0 + color.g * 256.0 * 255.0 + color.b * 255.0;
                float a2 = fixed24 / 16777215.0;
                return (a2 - 0.5);
            }

            void main() {
                vec4 color = texture2D(tex, uv);
                float angle = colorToAnglePi(color);
                bool visible = true;
                for(int i = 0; i <= ${maxRadius}; i++) {
                    float y = float(i) / float(${maxRadius});
                    if(y >= uv.y) break;
                    vec4 distantColor = texture2D(tex, vec2(uv.x, y));
                    float distantAngle = colorToAnglePi(distantColor);
                    float angleDiff = angle - distantAngle;
                    
                    if(angleDiff < 0.0) {
                        visible = false;
                        break;
                    }
                }

                if(visible) {
                    float color = 0.5 - angle*100.0;
                    gl_FragColor = vec4(0.0, color, 0.0, ${Constants.horizon.overlayAlpha});
                }
            }
        `,
        vert: `
            precision mediump float;
            attribute vec2 position;
            varying vec2 uv;
            void main() {
                uv = 0.5 * (position + 1.0);
                gl_Position = vec4(position, 0, 1);
            }
        `,
        attributes: {
            position: [
                -1, -1,
                    1, -1,
                -1,  1,
                    1,  1
            ]
        },
        count: 4,
        primitive: 'triangle strip',
        uniforms: {
            tex: roundBuffer
        },
        framebuffer: roundBuffer2
    });

    const unproject = regl({
        frag: `
            precision mediump float;
            uniform sampler2D tex;
            uniform vec2 size;
            uniform vec2 center;
            varying vec2 uv;

            vec2 unproject(vec2 uv) {
                vec2 diff = uv * size - center;
                float angle;
                if(uv.y < 0.5) {
                    angle = atan(-diff.y, -diff.x) + 3.14159265359;
                } else {
                    angle = atan(diff.y, diff.x);
                }
                float distance = length(diff);

                return vec2(
                    angle / (2.0 * 3.14159265359),
                    distance / max(size.x, size.y) * 2.0
                );
            }

            void main() {
                vec2 uv2 = unproject(uv);
                if(uv2.x < 0.0 || uv2.x > 1.0 || uv2.y < 0.0 || uv2.y > 1.0) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                    return;
                }

                gl_FragColor = texture2D(tex, uv2);
            }
        `,
        vert: `
            precision mediump float;
            attribute vec2 position;
            varying vec2 uv;
            void main() {
                uv = 0.5 * (position + 1.0);
                gl_Position = vec4(position, 0, 1);
            }
        `,
        attributes: {
            position: [
                -1, -1,
                    1, -1,
                -1,  1,
                    1,  1
            ]
        },
        count: 4,
        primitive: 'triangle strip',
        uniforms: {
            tex: roundBuffer2,
            size: [width, height],
            center: [width / 2, height / 2]
        }
    });

    projectAndRelativise();
    calcVisibility();
    unproject();

    const pixelData = new Uint8ClampedArray(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);

    regl.destroy();

    return new ImageData(pixelData, width, height);
}

const getDataUrlFromImageData = (imageData) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
};

const Horizon = {
    processTiles,
    getDataUrlFromImageData
};

export default Horizon;