import './style.css'

// import { PLAYER_1 } from '@rcade/plugin-input-classic'

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

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module: device.createShaderModule({ code: triangleVertWGSL }),
  },
  fragment: {
    module: device.createShaderModule({ code: redFragWGSL }),
    targets: [{ format: presentationFormat }],
  },
  primitive: {
    topology: 'triangle-list',
  },
});

/**
 * Draw a frame to the WebGPU context, and recur with requestAnimationFrame
 * requires device and context to be initialized
 */
function frame() {
  const commandEncoder = device!.createCommandEncoder();

  const textureView = context!.getCurrentTexture().createView();

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
  passEncoder.draw(3);
  passEncoder.end();

  device!.queue.submit([commandEncoder.finish()]);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
