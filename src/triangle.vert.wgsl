@vertex
fn main(
    @builtin(vertex_index) vertexIndex : u32
) -> @builtin(position) vec4f {
    var corners = array<vec2f, 3>(
        vec2(0.0, 0.5),
        vec2(-0.5, -0.5),
        vec2(0.5, -0.5)
    );

    return vec4f(corners[vertexIndex], 0.0, 1.0);
}
