import './style.css'

import { PLAYER_1 } from '@rcade/plugin-input-classic'

import {
  clearRecoverableError,
  quitIfWebGPUNotAvailableOrMissingFeatures,
  showRecoverableError,
} from './util';

import triangleVertWGSL from './triangle.vert.wgsl?raw';
import redFragWGSL from './red.frag.wgsl?raw';

const VERT_STRUCT_SIZE = 16;
const TRIANGLE_PARAMS_SIZE = 16;

const VERTS = new Float32Array([
  0.0, 0.5, 0.0, 1.0,
  -0.5, -0.5, 0.0, 1.0,
  0.5, -0.5, 0.0, 1.0,
]);
const VERT_COUNT = VERTS.length / 4;

const MILLIS_PER_FRAME = 16.6;
const PLAYER_SPEED = 0.1;

const SOUND_EFFECT_COOLDOWN_MS = 500;

interface GameStateDeps {
  lastTimeMillis: number

  audioCtx: AudioContext;
  bubbles: SoundEffect;
  teleport: SoundEffect;

  device: GPUDevice;
  context: GPUCanvasContext;
  triangleParams: Float32Array<ArrayBuffer>;
  paramsBuffer: GPUBuffer;
  pipeline: GPURenderPipeline;
  vertBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
}

/**
 * The global state that's passed explicitly into GameState#update
 */
interface FrameInput {
  /** millis since program start, aka `performance.now()` */
  now: number;
  /** Player 1's inputs */
  playerOne: typeof PLAYER_1
}

class GameState {
  // fixed timestep tracking
  lastTimeMillis: number
  /** accumulator of millis not yet 'spent' on a fixed timestep */
  frameTimeMillis: number;

  // triangle
  x: 0.0;
  y: number;
  xScale: number;
  yScale: number;

  // audio
  audioCtx: AudioContext;
  bubbles: SoundEffect;
  teleport: SoundEffect;

  // rendering
  device: GPUDevice;
  context: GPUCanvasContext;
  triangleParams: Float32Array<ArrayBuffer>;
  paramsBuffer: GPUBuffer;
  pipeline: GPURenderPipeline;
  vertBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;

  constructor(deps: GameStateDeps) {
    // time
    this.lastTimeMillis = deps.lastTimeMillis;

    // audio
    this.audioCtx = deps.audioCtx;
    this.bubbles = deps.bubbles;
    this.teleport = deps.teleport;

    // graphics
    this.device = deps.device;
    this.context = deps.context;
    this.triangleParams = deps.triangleParams;
    this.paramsBuffer = deps.paramsBuffer;
    this.pipeline = deps.pipeline;
    this.vertBuffer = deps.vertBuffer;
    this.bindGroup = deps.bindGroup;

    // constants
    this.frameTimeMillis = 0.0;
    this.x = 0.0;
    this.y = 0.0;
    this.xScale = 1.0;
    this.yScale = 1.0;
  }

  update(input: FrameInput): void {
    const deltaTimeMillis = input.now - this.lastTimeMillis;
    this.frameTimeMillis += deltaTimeMillis;
    this.lastTimeMillis = input.now;

    const playerOne = input.playerOne;
    while (this.frameTimeMillis >= MILLIS_PER_FRAME) {
      this.frameTimeMillis -= MILLIS_PER_FRAME;
      this.bubbles.cooldown -= MILLIS_PER_FRAME;
      this.teleport.cooldown -= MILLIS_PER_FRAME;

      if (playerOne.DPAD.up) {
        this.y += PLAYER_SPEED;
      }
      if (playerOne.DPAD.down) {
        this.y -= PLAYER_SPEED;
      }
      if (playerOne.DPAD.left) {
        this.x -= PLAYER_SPEED;
      }
      if (playerOne.DPAD.right) {
        this.x += PLAYER_SPEED;
      }

      this.tryPlaySoundEffect(playerOne.A, this.bubbles);
      this.tryPlaySoundEffect(playerOne.B, this.teleport);
    }
  }

  tryPlaySoundEffect(input: boolean, soundEffect: SoundEffect): void {
    if (input && soundEffect.cooldown <= 0.0) {
      this.playAudio(soundEffect.buffer);
      soundEffect.cooldown = SOUND_EFFECT_COOLDOWN_MS;
    }
  }

  playAudio(buffer: AudioBuffer): void {
    let source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start()
  }

  draw(): void {
    const commandEncoder = this.device.createCommandEncoder();

    const textureView = this.context.getCurrentTexture().createView();

    this.triangleParams[0] = this.x;
    this.triangleParams[1] = this.y;
    this.triangleParams[2] = this.xScale;
    this.triangleParams[3] = this.yScale;
    this.device.queue.writeBuffer(this.paramsBuffer, 0, this.triangleParams);

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
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setVertexBuffer(0, this.vertBuffer);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.draw(VERT_COUNT);
    passEncoder.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }
}

class SoundEffect {
  buffer: AudioBuffer;
  /** millis until we can play the sound effect again */
  cooldown: number;

  constructor(buffer: AudioBuffer) {
    this.buffer = buffer;
    this.cooldown = 0.0;
  }
}

async function loadAudio(audioCtx: AudioContext, path: string): Promise<AudioBuffer> {
  const response = await fetch(path);
  const buffer = await response.arrayBuffer();
  return audioCtx.decodeAudioData(buffer);
}

function formatCompilationMessages(label: string, info: GPUCompilationInfo): string {
  return info.messages.map((m) => {
    const loc = `${m.lineNum}:${m.linePos}`;
    return `[${label}] ${m.type} at ${loc}: ${m.message}`;
  }).join('\n');
}

async function createTrianglePipeline(
  device: GPUDevice,
  vertCode: string,
  fragCode: string,
  layout: GPUPipelineLayout,
  format: GPUTextureFormat,
): Promise<GPURenderPipeline | null> {
  const vertModule = device.createShaderModule({ code: vertCode });
  const fragModule = device.createShaderModule({ code: fragCode });

  const [vertInfo, fragInfo] = await Promise.all([
    vertModule.getCompilationInfo(),
    fragModule.getCompilationInfo(),
  ]);

  const hasError =
    vertInfo.messages.some((m) => m.type === 'error') ||
    fragInfo.messages.some((m) => m.type === 'error');

  if (hasError) {
    const msg = [
      formatCompilationMessages('vertex', vertInfo),
      formatCompilationMessages('fragment', fragInfo),
    ].filter(Boolean).join('\n');
    console.error(msg);
    showRecoverableError(msg);
    return null;
  }

  // Surface warnings/info to the console but don't block the rebuild.
  const warnings = [
    formatCompilationMessages('vertex', vertInfo),
    formatCompilationMessages('fragment', fragInfo),
  ].filter(Boolean).join('\n');
  if (warnings) console.warn(warnings);

  device.pushErrorScope('validation');
  const pipeline = device.createRenderPipeline({
    label: 'triangle pipeline',
    layout,
    vertex: {
      module: vertModule,
      entryPoint: 'main',
      buffers: [
        {
          arrayStride: VERT_STRUCT_SIZE,
          attributes: [
            {
              shaderLocation: 0,
              format: 'float32x4',
              offset: 0,
            },
          ],
        },
      ],
    },

    fragment: {
      module: fragModule,
      targets: [{ format }],
    },

    primitive: {
      topology: 'triangle-list',
    },
  });

  const err = await device.popErrorScope();
  if (err) {
    console.error(err.message);
    showRecoverableError(err.message);
    return null;
  }

  clearRecoverableError();
  return pipeline;
}

async function init() {
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

  const vertBuffer: GPUBuffer = device.createBuffer({
    label: 'vertex buffer',
    size: VERT_STRUCT_SIZE * VERT_COUNT,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });
  device!.queue.writeBuffer(vertBuffer, 0, VERTS);

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
  const pipeline = await createTrianglePipeline(
    device,
    triangleVertWGSL,
    redFragWGSL,
    pipelineLayout,
    presentationFormat,
  );
  if (!pipeline) {
    throw new Error('initial pipeline build failed');
  }

  const triangleParams = new Float32Array(4);

  const audioCtx = new AudioContext();
  const bubblesBuffer = await loadAudio(audioCtx, './bubbles_down.wav');
  const teleportBuffer = await loadAudio(audioCtx, './teleport.wav');

  const deps: GameStateDeps = {
    lastTimeMillis: performance.now(),

    audioCtx: audioCtx,
    bubbles: new SoundEffect(bubblesBuffer),
    teleport: new SoundEffect(teleportBuffer),

    device,
    context,
    triangleParams,
    paramsBuffer,
    pipeline,
    vertBuffer,
    bindGroup,
  };

  const game = new GameState(deps);

  const frame = () => {
    game.update({
      now: performance.now(),
      playerOne: PLAYER_1
    });

    game.draw();

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);

  if (import.meta.hot) {
    let currentVertCode = triangleVertWGSL;
    let currentFragCode = redFragWGSL;

    const rebuild = async () => {
      const nextPipeline = await createTrianglePipeline(
        device,
        currentVertCode,
        currentFragCode,
        pipelineLayout,
        presentationFormat,
      );
      if (nextPipeline) {
        game.pipeline = nextPipeline;
      }
    };

    import.meta.hot.accept('./triangle.vert.wgsl?raw', (mod) => {
      if (!mod) return;
      currentVertCode = mod.default;
      rebuild();
    });
    import.meta.hot.accept('./red.frag.wgsl?raw', (mod) => {
      if (!mod) return;
      currentFragCode = mod.default;
      rebuild();
    });
  }
}

init();
