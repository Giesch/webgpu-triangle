struct TriangleParams {
  offset: vec2f,
  scale: vec2f,
};

@group(0) @binding(0)
var<uniform> params: TriangleParams;

struct VertexInput {
  @location(0) position: vec4f,
};

struct VertexOutput {
  @builtin(position) position: vec4f,
};


struct FragmentInput {
  // the interpolated position from above
  @builtin(position) fragPos: vec4f,
};

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var out: VertexOutput;

  out.position = input.position + vec4f(params.offset.xy, 0.0, 0.0);

  return out;
}
