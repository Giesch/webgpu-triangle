import './style.css'

import { PLAYER_1 } from '@rcade/plugin-input-classic'

import { quitIfWebGPUNotAvailableOrMissingFeatures } from './util';

import triangleVertWGSL from './triangle.vert.wgsl?raw';
import redFragWGSL from './red.frag.wgsl?raw';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const adapter = await navigator.gpu?.requestAdapter({
  featureLevel: 'compatibility',
});

const device = await adapter?.requestDevice() || null;
quitIfWebGPUNotAvailableOrMissingFeatures(adapter, device);

const context = canvas.getContext('webgpu');
if (!context) throw new Error('no webgpu context available');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

context.configure({
  device,
  format: presentationFormat,
});

const VERT_STRUCT_SIZE = 16;
const TRIANGLE_PARAMS_SIZE = 16;

const bindGroupLayout: GPUBindGroupLayout = device.createBindGroupLayout({
  label: "params layout",
  entries: [
    {
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'uniform',
        minBindingSize: TRIANGLE_PARAMS_SIZE,
        hasDynamicOffset: false,
      }
    }
  ]
});

const VERTS = new Float32Array([
  0.0, 0.5, 0.0, 1.0,
  -0.5, -0.5, 0.0, 1.0,
  0.5, -0.5, 0.0, 1.0,
]);
const VERT_COUNT = VERTS.length / 4;
const vertBuffer: GPUBuffer = device.createBuffer({
  label: 'vertex buffer',
  size: VERT_STRUCT_SIZE * VERT_COUNT,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
});
device!.queue.writeBuffer(vertBuffer, 0, VERTS);

const paramsBuffer: GPUBuffer = device.createBuffer({
  label: 'params buffer',
  size: TRIANGLE_PARAMS_SIZE,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
})
const bindGroup: GPUBindGroup = device.createBindGroup({
  label: 'params bind group',
  layout: bindGroupLayout,
  entries: [
    {
      binding: 0,
      resource: {
        buffer: paramsBuffer,
        offset: 0,
        size: TRIANGLE_PARAMS_SIZE
      }
    }
  ]
});

const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [bindGroupLayout]
});
const pipeline = device.createRenderPipeline({
  label: 'triangle pipeline',
  layout: pipelineLayout,
  vertex: {
    module: device.createShaderModule({ code: triangleVertWGSL }),
    entryPoint: "main",
    buffers: [
      {
        arrayStride: VERT_STRUCT_SIZE,
        attributes: [
          {
            shaderLocation: 0,
            format: 'float32x4',
            offset: 0
          }
        ]
      }
    ],
  },

  fragment: {
    module: device.createShaderModule({ code: redFragWGSL }),
    targets: [{ format: presentationFormat }],
  },

  primitive: {
    topology: 'triangle-list',
  },
});

const triangleParams = new Float32Array(4);

interface GameState {
  lastTimeMillis: number
  // it's the accumulator, name it better
  frameTimeMillis: number;
  x: 0.0,
  y: number;
  xScale: number;
  yScale: number;

  audioCtx: AudioContext;
  bubblesBuffer: AudioBuffer | null;
  teleportBuffer: AudioBuffer | null;
  // millis until we can play the effect again
  bubblesCooldown: number;
  teleportCooldown: number;
}

const gameState: GameState = {
  lastTimeMillis: performance.now(),
  frameTimeMillis: 0.0,
  x: 0.0,
  y: 0.0,
  xScale: 1.0,
  yScale: 1.0,

  audioCtx: new AudioContext(),
  bubblesBuffer: null,
  bubblesCooldown: 0.0,
  teleportBuffer: null,
  teleportCooldown: 0.0,
}

const MILLIS_PER_FRAME = 16.6;
const PLAYER_SPEED = 0.1;

/**
 * Draw a frame to the WebGPU context, and recur with requestAnimationFrame
 * requires device and context to be initialized
 */
function frame() {
  // UPDATE
  let deltaTimeMillis = performance.now() - gameState.lastTimeMillis;
  gameState.frameTimeMillis += deltaTimeMillis;
  while (gameState.frameTimeMillis >= MILLIS_PER_FRAME) {
    gameState.frameTimeMillis -= MILLIS_PER_FRAME;
    gameState.bubblesCooldown -= MILLIS_PER_FRAME;
    gameState.teleportCooldown -= MILLIS_PER_FRAME;

    if (PLAYER_1.DPAD.up) {
      gameState.y += PLAYER_SPEED;
    }
    if (PLAYER_1.DPAD.down) {
      gameState.y -= PLAYER_SPEED;
    }
    if (PLAYER_1.DPAD.left) {
      gameState.x -= PLAYER_SPEED;
    }
    if (PLAYER_1.DPAD.right) {
      gameState.x += PLAYER_SPEED;
    }

    if (PLAYER_1.A && gameState.bubblesCooldown <= 0.0) {
      playAudio(gameState.bubblesBuffer!);
      gameState.bubblesCooldown = 500;
    }
    if (PLAYER_1.B && gameState.teleportCooldown <= 0.0) {
      playAudio(gameState.teleportBuffer!);
      gameState.teleportCooldown = 500;
    }
  }

  // DRAW
  const commandEncoder = device!.createCommandEncoder();

  const textureView = context!.getCurrentTexture().createView();

  triangleParams[0] = gameState.x;
  triangleParams[1] = gameState.y;
  triangleParams[2] = gameState.xScale;
  triangleParams[3] = gameState.yScale;

  device!.queue.writeBuffer(paramsBuffer, 0, triangleParams);

  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: [0, 0, 0, 0], // Clear to transparent
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertBuffer);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.draw(VERT_COUNT);
  passEncoder.end();

  device!.queue.submit([commandEncoder.finish()]);

  gameState.lastTimeMillis = performance.now();
  requestAnimationFrame(frame);
}

function playBubbles() {
  let bubblesSource = gameState.audioCtx.createBufferSource();
  bubblesSource.buffer = gameState.bubblesBuffer
  bubblesSource.connect(gameState.audioCtx.destination);
  bubblesSource.start()
}

function playAudio(buffer: AudioBuffer) {
  let bubblesSource = gameState.audioCtx.createBufferSource();
  bubblesSource.buffer = buffer;
  bubblesSource.connect(gameState.audioCtx.destination);
  bubblesSource.start()
}


async function loadAudio(path: string): Promise<AudioBuffer> {
  let resp = await fetch(path);
  let buf = await resp.arrayBuffer();
  return gameState.audioCtx.decodeAudioData(buf);
}

async function init() {
  gameState.bubblesBuffer = await loadAudio('./bubbles_down.wav');
  gameState.teleportBuffer = await loadAudio('./teleport.wav');

  requestAnimationFrame(frame);
}


init();
