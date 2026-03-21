import './style.css'
import { PLAYER_1, SYSTEM } from '@rcade/plugin-input-classic'

function Assert(expression : boolean, msg : string){
    if(!expression){
        const mem = wasmMemU8;
        console.log(`${msg}`);
        let err = new Error(msg);
        MakeErrorDebugElement(err as Error);
        running = false;
        throw err;
    }
}
function GetPerformanceNowSeconds() : number{
    return (performance.now() / 1000.0);
}

function GetPerformanceNowMS() : number{
    return (performance.now());
}
    function mat4_mul(out: Float32Array, a: Float32Array, b: Float32Array){
      out[0]  = a[0]*b[0]  + a[1]*b[4]  + a[2]*b[8]   + a[3]*b[12];
      out[1]  = a[0]*b[1]  + a[1]*b[5]  + a[2]*b[9]   + a[3]*b[13];
      out[2]  = a[0]*b[2]  + a[1]*b[6]  + a[2]*b[10]  + a[3]*b[14];
      out[3]  = a[0]*b[3]  + a[1]*b[7]  + a[2]*b[11]  + a[3]*b[15];
      out[4]  = a[4]*b[0]  + a[5]*b[4]  + a[6]*b[8]   + a[7]*b[12];
      out[5]  = a[4]*b[1]  + a[5]*b[5]  + a[6]*b[9]   + a[7]*b[13];
      out[6]  = a[4]*b[2]  + a[5]*b[6]  + a[6]*b[10]  + a[7]*b[14];
      out[7]  = a[4]*b[3]  + a[5]*b[7]  + a[6]*b[11]  + a[7]*b[15];
      out[8]  = a[8]*b[0]  + a[9]*b[4]  + a[10]*b[8]  + a[11]*b[12];
      out[9]  = a[8]*b[1]  + a[9]*b[5]  + a[10]*b[9]  + a[11]*b[13];
      out[10] = a[8]*b[2]  + a[9]*b[6]  + a[10]*b[10] + a[11]*b[14];
      out[11] = a[8]*b[3]  + a[9]*b[7]  + a[10]*b[11] + a[11]*b[15];
      out[12] = a[12]*b[0] + a[13]*b[4] + a[14]*b[8]  + a[15]*b[12];
      out[13] = a[12]*b[1] + a[13]*b[5] + a[14]*b[9]  + a[15]*b[13];
      out[14] = a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14];
      out[15] = a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15];
    }


    function mat4_transpose(out : Float32Array, a : Float32Array){
      out[0 ] = a[0 ];
      out[1 ] = a[4 ];
      out[2 ] = a[8 ];
      out[3 ] = a[12];
      out[4 ] = a[1 ];
      out[5 ] = a[5 ];
      out[6 ] = a[9 ];
      out[7 ] = a[13];
      out[8 ] = a[2 ];
      out[9 ] = a[6 ];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3 ];
      out[13] = a[7 ];
      out[14] = a[11];
      out[15] = a[15];
    }

    function mat4_nullify(a : Float32Array){
        a[0 ] = 0; a[1 ] = 0; a[2 ] = 0; a[3 ] = 0; 
        a[4 ] = 0; a[5 ] = 0; a[6 ] = 0; a[7 ] = 0; 
        a[8 ] = 0; a[9 ] = 0; a[10] = 0; a[11] = 0; 
        a[12] = 0; a[13] = 0; a[14] = 0; a[15] = 0; 
    }
    function mat4_identity(a : Float32Array){
        a[0 ] = 1; a[1 ] = 0; a[2 ] = 0; a[3 ] = 0; 
        a[4 ] = 0; a[5 ] = 1; a[6 ] = 0; a[7 ] = 0; 
        a[8 ] = 0; a[9 ] = 0; a[10] = 1; a[11] = 0; 
        a[12] = 0; a[13] = 0; a[14] = 0; a[15] = 1; 
    }

const quadVertData = new Float32Array([
  // x,    y,    z,     nx,  ny,  nz,     r,   g,   b,     u,   v
  -0.5, -0.5,  0.0,    0.0, 0.0, 1.0,    1.0, 0.0, 0.0,   0.0, 0.0,
   0.5, -0.5,  0.0,    0.0, 0.0, 1.0,    0.0, 1.0, 0.0,   1.0, 0.0,
   0.5,  0.5,  0.0,    0.0, 0.0, 1.0,    0.0, 0.0, 1.0,   1.0, 1.0,
  -0.5,  0.5,  0.0,    0.0, 0.0, 1.0,    1.0, 0.0, 0.0,   0.0, 1.0,
]);

const fullscreenQuadData = new Float32Array([
    //x     y           u       v
    -1.0, -1.0,        0.0, 0.0,
     1.0, -1.0,        1.0, 0.0,
     1.0,  1.0,        1.0, 1.0,
    -1.0,  1.0,        0.0, 1.0,
]);

const quadIndData = new Uint16Array([
  0, 1, 2,
  0, 2, 3,
]);

const pyramidVertData = new Float32Array([
  // x,    y,    z,      nx,     ny,     nz,     r,   g,   b,     u,   v
  -0.5, -0.5, -0.3,     0.0,   -1.0,    0.0,    1.0, 1.0, 1.0,   0.0, 0.0,
   0.5, -0.5, -0.3,     0.0,   -1.0,    0.0,    1.0, 1.0, 1.0,   1.0, 0.0,
   0.5,  0.5, -0.3,     0.0,   -1.0,    0.0,    1.0, 1.0, 1.0,   1.0, 1.0,
  -0.5,  0.5, -0.3,     0.0,   -1.0,    0.0,    1.0, 1.0, 1.0,   0.0, 1.0,

  -0.5, -0.5, -0.3,     0.0,   -0.848,  0.53,   1.0, 1.0, 1.0,   0.0, 0.0,
   0.5, -0.5, -0.3,     0.0,   -0.848,  0.53,   1.0, 1.0, 1.0,   1.0, 0.0,
   0.0,  0.0,  0.5,     0.0,   -0.848,  0.53,   1.0, 1.0, 1.0,   1.0, 1.0,

   0.5, -0.5, -0.3,     0.848,  0.0,    0.53,   1.0, 1.0, 1.0,   0.0, 0.0,
   0.5,  0.5, -0.3,     0.848,  0.0,    0.53,   1.0, 1.0, 1.0,   1.0, 0.0,
   0.0,  0.0,  0.5,     0.848,  0.0,    0.53,   1.0, 1.0, 1.0,   1.0, 1.0,

   0.5,  0.5, -0.3,     0.0,    0.848,  0.53,   1.0, 1.0, 1.0,   0.0, 0.0,
  -0.5,  0.5, -0.3,     0.0,    0.848,  0.53,   1.0, 1.0, 1.0,   1.0, 0.0,
   0.0,  0.0,  0.5,     0.0,    0.848,  0.53,   1.0, 1.0, 1.0,   1.0, 1.0,

  -0.5,  0.5, -0.3,    -0.848,  0.0,    0.53,   1.0, 1.0, 1.0,   0.0, 0.0,
  -0.5, -0.5, -0.3,    -0.848,  0.0,    0.53,   1.0, 1.0, 1.0,   1.0, 0.0,
   0.0,  0.0,  0.5,    -0.848,  0.0,    0.53,   1.0, 1.0, 1.0,   1.0, 1.0,
]);

const pyramidIndData = new Uint16Array([
  0,  1,  2,
  0,  2,  3,
  4,  5,  6,
  7,  8,  9,
  10, 11, 12,
  13, 14, 15,
]);

const shaderSourceScreenSpaceTest = `


const c_A = 65u;
const c_B = 66u;
const c_C = 67u;
const c_D = 68u;
const c_E = 69u;
const c_F = 70u;
const c_G = 71u;
const c_H = 72u;
const c_I = 73u;
const c_J = 74u;
const c_K = 75u;
const c_L = 76u;
const c_M = 77u;
const c_N = 78u;
const c_O = 79u;
const c_P = 80u;
const c_Q = 81u;
const c_R = 82u;
const c_S = 83u;
const c_T = 84u;
const c_U = 85u;
const c_V = 86u;
const c_W = 87u;
const c_X = 88u;
const c_Y = 89u;
const c_Z = 90u;
const c_a = 97u;
const c_b = 98u;
const c_c = 99u;
const c_d = 100u;
const c_e = 101u;
const c_f = 102u;
const c_g = 103u;
const c_h = 104u;
const c_i = 105u;
const c_j = 106u;
const c_k = 107u;
const c_l = 108u;
const c_m = 109u;
const c_n = 110u;
const c_o = 111u;
const c_p = 112u;
const c_q = 113u;
const c_r = 114u;
const c_s = 115u;
const c_t = 116u;
const c_u = 117u;
const c_v = 118u;
const c_w = 119u;
const c_x = 120u;
const c_y = 121u;
const c_z = 122u;
const c_minus = 45u;
const c_dot = 46u;
const c_colon = 58u;
const c_0 = 48u;
const c_space = 32u;

const atlas: array<u32, 128> = array<u32, 128>(
    0x4EEAE8EEu, 0xA5110000u,
    0xC22A882Au, 0x052A94F8u,
    0x4EEEEE4Eu, 0xA01100A8u,
    0x48222A4Au, 0x48800870u,
    0xEEE2EE4Eu, 0x07112270u,
    0x00000000u, 0x000E1CA8u,
    0xE44A004Eu, 0x000000A8u,
    0xAA4A4042u, 0x00000000u,
    0xEA000046u, 0x00000000u,
    0x2A004000u, 0xFBEF8000u,
    0x24000444u, 0xAAAABEF8u,
    0x00000000u, 0x30862AA8u,
    0x2844C66Cu, 0x61C30C60u,
    0x44828244u, 0xAAAAAAA8u,
    0x82828282u, 0xAAAAAAA8u,
    0x44828244u, 0x00000000u,
    0x2844C66Cu, 0x00000000u,
    0x00000000u, 0x00000000u,
    0x04000824u, 0x739F61F0u,
    0x4440A82Au, 0x8ADC7980u,
    0x44EE4444u, 0xFA5869F0u,
    0x0440A28Au, 0xFB586580u,
    0x44000284u, 0x9B986580u,
    0x00000000u, 0x9A586DF0u,
    0x6A74B1EEu, 0x9B9F79F8u,
    0xA442AD02u, 0x00000000u,
    0x647131ECu, 0x00053EF8u,
    0x2A42A10Au, 0xF9ED9C70u,
    0xEE74A1CAu, 0x838D8820u,
    0x00000000u, 0xFA0F8820u,
    0xBBA38E20u, 0xF2EF88A0u,
    0x80218250u, 0xC26D8890u,
    0x8A26BAF8u, 0xC36D9C90u,
    0x0A0A2850u, 0xC3E53EF8u,
    0xEAEC1820u, 0x00000000u,
    0x00000000u, 0x08020608u,
    0x4CECEEEAu, 0x0802C468u,
    0xAA8A888Au, 0xCCC6EEAEu,
    0xEC8AEEAEu, 0xAA8A842Au,
    0xAA8A88AAu, 0xECC6E4EAu,
    0xACECE8EAu, 0x00000000u,
    0x00000000u, 0x44880004u,
    0xEEA8A8EEu, 0x0088000Au,
    0x42A8EEAAu, 0x44A8A8ECu,
    0x42C8AAAEu, 0x44C8EEA8u,
    0x4AA8AAA8u, 0x4CACAAE8u,
    0xEEAEAAE8u, 0x00000000u,
    0x00000000u, 0x40040000u,
    0x4C6EAAAAu, 0xA6E400AAu,
    0xAA84AAAAu, 0x488EAAAAu,
    0x6C44AAAAu, 0x2864AAE4u,
    0x2A24AAE4u, 0x28E4E4AAu,
    0x2AC4E4AAu, 0x00400000u,
    0x00000000u, 0xAEA00480u,
    0xAE401000u, 0x62000000u,
    0xA2459240u, 0x24000880u,
    0x444496E0u, 0x2E0E0702u,
    0x48449E80u, 0x00B42007u,
    0x4E779AE0u, 0x00B0E005u,
    0x0000001Cu, 0x50B0AECCu,
    0x00800014u, 0xF8F4AAACu,
    0x0080000Cu, 0x50F4A8ECu,
    0x00F39114u, 0xF894EEACu,
    0x00929B1Cu, 0x509400C0u,
);

//   xpos, ypos,wid,height
const atlasdim: array<vec4u, 96> = array<vec4u, 96>(
vec4u(27u, 53u, 4u, 6u),// space   32u 
vec4u(24u, 6u , 4u, 6u),// !       33u
vec4u(27u, 53u, 4u, 6u),// "       34u
vec4u(27u, 53u, 4u, 6u),// #       35u
vec4u(27u, 53u, 4u, 6u),// $       36u
vec4u(27u, 53u, 4u, 6u),// %       37u
vec4u(27u, 53u, 4u, 6u),// &       38u
vec4u(27u, 53u, 4u, 6u),// '       39u
vec4u(27u, 53u, 4u, 6u),// (       40u
vec4u(27u, 53u, 4u, 6u),// )       41u
vec4u(27u, 53u, 4u, 6u),// *       42u
vec4u(27u, 53u, 4u, 6u),// +       43u
vec4u(27u, 53u, 4u, 6u),// ,       44u
vec4u(12u, 18u, 4u, 6u),// -       45u
vec4u(20u, 6u , 4u, 6u),// .       46u
vec4u(27u, 53u, 4u, 6u),// /       47u
vec4u(4u , 6u , 4u, 6u),// 0       48u
vec4u(0u , 0u , 4u, 6u),// 1       49u
vec4u(4u , 0u , 4u, 6u),// 2       50u
vec4u(8u , 0u , 4u, 6u),// 3       51u
vec4u(12u, 0u , 4u, 6u),// 4       52u
vec4u(16u, 0u , 4u, 6u),// 5       53u
vec4u(20u, 0u , 4u, 6u),// 6       54u
vec4u(24u, 0u , 4u, 6u),// 7       55u
vec4u(28u, 0u , 4u, 6u),// 8       56u
vec4u(0u , 6u , 4u, 6u),// 9       57u
vec4u(16u, 6u , 4u, 6u),// :       58u
vec4u(27u, 53u, 4u, 6u),// ;       59u
vec4u(27u, 53u, 4u, 6u),// <       60u
vec4u(27u, 53u, 4u, 6u),// =       61u
vec4u(27u, 53u, 4u, 6u),// >       62u
vec4u(28u, 6u , 4u, 6u),// ?       63u
vec4u(27u, 53u, 4u, 6u),// @       64u
vec4u(0u , 36u, 4u, 6u),// A       65u
vec4u(4u , 36u, 4u, 6u),// B       66u
vec4u(8u , 36u, 4u, 6u),// C       67u
vec4u(12u, 36u, 4u, 6u),// D       68u
vec4u(16u, 36u, 4u, 6u),// E       69u
vec4u(20u, 36u, 4u, 6u),// F       70u
vec4u(24u, 36u, 4u, 6u),// G       71u
vec4u(28u, 36u, 4u, 6u),// H       72u
vec4u(0u , 42u, 4u, 6u),// I       73u
vec4u(4u , 42u, 4u, 6u),// J       74u
vec4u(8u , 42u, 4u, 6u),// K       75u
vec4u(12u, 42u, 4u, 6u),// L       76u
vec4u(16u, 42u, 4u, 6u),// M       77u
vec4u(20u, 42u, 4u, 6u),// N       78u
vec4u(24u, 42u, 4u, 6u),// O       79u
vec4u(28u, 42u, 4u, 6u),// P       80u
vec4u(0u , 48u, 4u, 6u),// Q       81u
vec4u(4u , 48u, 4u, 6u),// R       82u
vec4u(8u , 48u, 4u, 6u),// S       83u
vec4u(12u, 48u, 4u, 6u),// T       84u
vec4u(16u, 48u, 4u, 6u),// U       85u
vec4u(20u, 48u, 4u, 6u),// V       86u
vec4u(24u, 48u, 4u, 6u),// W       87u
vec4u(28u, 48u, 4u, 6u),// X       88u
vec4u(0u , 54u, 4u, 6u),// Y       89u
vec4u(4u , 54u, 4u, 6u),// Z       90u
vec4u(27u, 53u, 4u, 6u),// [       91u
vec4u(27u, 53u, 4u, 6u),// \       92u
vec4u(27u, 53u, 4u, 6u),// ]       93u
vec4u(40u, 52u, 4u, 6u),// ^       94u
vec4u(44u, 52u, 4u, 6u),// _       95u
vec4u(27u, 53u, 4u, 6u),// graveAcc96u
vec4u(32u, 35u, 4u, 6u),// a       97u
vec4u(36u, 35u, 4u, 6u),// b       98u
vec4u(40u, 35u, 4u, 6u),// c       99u
vec4u(44u, 35u, 4u, 6u),// d       100u
vec4u(48u, 35u, 4u, 6u),// e       101u
vec4u(52u, 35u, 4u, 6u),// f       102u
vec4u(56u, 35u, 4u, 6u),// g       103u
vec4u(60u, 35u, 4u, 6u),// h       104u
vec4u(32u, 41u, 4u, 6u),// i       105u
vec4u(36u, 41u, 4u, 6u),// j       106u
vec4u(40u, 41u, 4u, 6u),// k       107u
vec4u(44u, 41u, 4u, 6u),// l       108u
vec4u(48u, 41u, 4u, 6u),// m       109u
vec4u(52u, 41u, 4u, 6u),// n       110u
vec4u(56u, 41u, 4u, 6u),// o       111u
vec4u(60u, 41u, 4u, 6u),// p       112u
vec4u(32u, 47u, 4u, 6u),// q       113u
vec4u(36u, 47u, 4u, 6u),// r       114u
vec4u(40u, 47u, 4u, 6u),// s       115u
vec4u(44u, 47u, 4u, 6u),// t       116u
vec4u(48u, 47u, 4u, 6u),// u       117u
vec4u(52u, 47u, 4u, 6u),// v       118u
vec4u(56u, 47u, 4u, 6u),// w       119u
vec4u(60u, 47u, 4u, 6u),// x       120u
vec4u(32u, 52u, 4u, 6u),// y       121u
vec4u(36u, 52u, 4u, 6u),// z       122u
vec4u(27u, 53u, 4u, 6u),// {       123u
vec4u(27u, 53u, 4u, 6u),// |       124u
vec4u(27u, 53u, 4u, 6u),// }       125u
vec4u(27u, 53u, 4u, 6u),// ~       126u
vec4u(0u , 30u, 6u, 6u),//         127u
);



fn OverlapsText(fragPos: vec2f, startPos: vec2f, chars: ptr<function, array<u32, 32>>, arraylen: u32, textScale: f32) -> bool{
    var fragx = u32(0);
    var fragy = u32(0);
    var ax = 0u;//atlas x //top left coord of the specific glyph in the atlas
    var ay = 0u;
    var gx = 0u;//exact coord the current pixel overlaps in the glyph (4x5 box)
    var gy = 0u;
    var charInd = 0u;//character index
    
    var fontArrayHeight = 128u;
    var fontArrayWidth = 32u;

    if(i32(fragPos.x) - i32(startPos.x) < 0){return false;}
    if(i32(fragPos.y) - i32(startPos.y) < 0){return false;}

    var textpx = u32((fragPos.x-startPos.x) / textScale);//coords of the pixel in the text space
    var textpy = u32((fragPos.y-startPos.y) / textScale);

    //for all pixels, reverse map to a string and see if they should light up
    var charMaxW = 6u; //a cheap check to see if we roughly fall into the range of the text
    var charMaxH = 5u;
    if(textpx < (arraylen*charMaxW) && textpy < charMaxH){
        //so this pixel falls inside that boundary, now figure out the char it overlaps
        
        //TODO: construct the entire string with all variable widths
        //determine which variable width glyph the pixels falls into
        var charindex = 0u;
        var curstepx = 0u;
        var glyphStartX = 0u;
        var inside = false;
        for(var i = 0u; i < arraylen; i++){
            var dim = vec4u(atlasdim[(chars[i] - fontArrayWidth)]);
            if(textpx >= curstepx && textpx < (curstepx + dim.z)){
                charindex = i;
                inside = true;
                glyphStartX = curstepx;
                break;
            }
            curstepx += dim.z;
        }
        if(!inside){return false;}

        if(charindex < arraylen){
            var charcode = chars[charindex];
            if(charcode >= fontArrayWidth){
                //get the actual position in the texture of this char
                var atlasIndex = charcode - fontArrayWidth;
                var dim = vec4u(atlasdim[atlasIndex]);
                gx = textpx - glyphStartX;
                gy = textpy % dim.w;
                ax = dim.x;
                ay = dim.y;
                fragx = ax + gx;
                fragy = ay + gy;
            }

        }else{
            fragx = 0;
            fragy = 0;
        }

    }else{
        fragx = 0;
        fragy = 0;
    }

    var offsetRow = 0u;
    if(fragx >= fontArrayWidth){
        offsetRow++;
        fragx -= fontArrayWidth;
    }
    var y = fragy*2u;
    var row = 0u;
    var bits = 0u;
    var on = 0u;

    if((y+1u) < fontArrayHeight && fragx < fontArrayWidth){
        row = atlas[y+offsetRow];
        bits = (row >> (31u - fragx)) & 1u;

    }
    return (bits == 1u);
}




fn cat_str(
    str1: ptr<function, array<u32, 32>>, 
    n1  : ptr<function, u32>,
    str2: ptr<function, array<u32, 32>>, 
    n2  : ptr<function, u32>,
    ){
        for(var i = 0u; i < *n2 && *n1 < 32; i++){
            str1[*n1] = str2[i];
            *n1++;
        }
    }

//input: char array, count, max, floating point value
//output: appended floating point number to char array
fn append_fixed(
    out: ptr<function, array<u32, 32>>, 
    n: ptr<function, u32>,
    outcap: u32,
    cval: f32,//const val
    prec: u32 //precision
    ){
        var val = cval;
        if(val < 0.0){
            val = -val;
            out[*n] = c_minus; *n++;
        }

        var scale = 1u;
        for(var i = 0u; i < prec; i++){scale *= 10u;}



        var scaledf = val * f32(scale) + 0.5; //how does this rounding work exactly?
        var scaled = u32(scaledf);
        var ip = scaled / scale;
        var fp = scaled % scale;
        
        var tmp : array<u32, 8> = array<u32, 8>();
        var tmpcap = 8u;
        var tlen = 0u;
        //read out an integer
        if((ip == 0u) && (ip % 10) == 0u){
            tmp[tlen] = c_0;
            tlen++;
        }else{
            while(ip > 0u && ((tlen+1u) < tmpcap)){
                tmp[tlen] = c_0 + (ip % 10);
                tlen++;
                ip /= 10u;
            }
        }
        
        while(tlen > 0u && (*n+1 < outcap)){
            tlen--;
            out[*n] = tmp[tlen];
            *n++;
        }
        //now read out the floating part
        out[*n] = c_dot; *n++;

        tlen = 0;
        var div = scale / 10u;
        var tval = 0u; //temp val
        //using div because it gives us leading 0s
        for(var i = 0u; i < prec && *n+1 < outcap; i++){
            tval = 0u;
            if(div > 0u){
                tval = (fp / div) % 10u;
                div /= 10u;
            }
            out[*n] = c_0 + tval;
            *n++;
        }
}







struct ScreenSpaceCameraUniform{
    screenWidth     :   f32,
    screenHeight    :   f32,
    time            :   f32,
    mousex          :   f32,

    mousey          :   f32,
    mouseleft       :   u32,
    mouseright      :   u32,
    mousewheel      :   i32,

    pad0            :   f32,
    pad1            :   f32,
    pad2            :   f32,
    pad3            :   f32,

};

fn srgb_to_linear(c: vec3f) -> vec3f {
    let a = c / 12.92;
    let b = pow((c + vec3f(0.055)) / 1.055, vec3f(2.4));
    let use_a = c <= vec3f(0.04045);
    return select(b, a, use_a);
}

fn linear_to_srgb(c: vec3f) -> vec3f {
    let a = 12.92 * c;
    let b = 1.055 * pow(c, vec3f(1.0 / 2.4)) - vec3f(0.055);
    let use_a = c <= vec3f(0.0031308);
    return select(b, a, use_a);
}


struct VIn {
  @location(0) pos : vec2f,
  @location(1) uv  : vec2f,
};

struct VOut {
  @builtin(position) pos : vec4f,
  @location(0) uv : vec2f,
};

struct FragIn {
    @builtin(position) fragPos : vec4f,
    @location(0) uv : vec2f,

};


@group(0) @binding(0) var<uniform> spcu: ScreenSpaceCameraUniform;
@group(0) @binding(1) var textureArray: texture_2d_array<f32>;
@group(0) @binding(2) var textureSampler: sampler;

const pi = 3.14159265359;

fn sdfCircle(diff: vec2f, rad: f32) -> f32{
    var dist = length(diff) - rad;
    return dist;
}

//b.x = half width
//b.y = half height
//r.x = roundness top right
//r.y = roundness bot right
//r.z = roundness top left
//r.w = roundness bot left
fn sdfRoundedRect(p: vec2f, b: vec2f, r_in: vec4f) -> f32 {
    var r = r_in;

    if (p.x <= 0.0) {
        r.x = r.z;
        r.y = r.w;
    }
    if (p.y <= 0.0) {
        r.x = r.y;
    }

    let q: vec2f = abs(p) - b + vec2f(r.x); // broadcast r.x explicitly
    return min(max(q.x, q.y), 0.0) + length(max(q, vec2f(0.0))) - r.x;
}

fn sdfAabb(p: vec2f, b: vec2f) -> f32 {

    var d = abs(p) - b;
    return length( vec2f(max(d.x,0.0), max(d.y,0.0))) + min(max(d.x, d.y), 0.0);
}

fn skew(v: vec2f) -> vec2f {
    return vec2f(-v.y, v.x);
}

fn sdfObb(p_in: vec2f, c: vec2f, he: vec2f, u: vec2f) -> f32 {
    var m = transpose(mat2x2f(u, skew(u)));
    var p = p_in;
    p = p - c;
    p = m * p;
    return sdfAabb(p, he);
}


@vertex
fn vs_main(v: VIn) -> VOut {
  var o: VOut;
  o.pos = vec4f(v.pos, 0.0, 1.0);
  o.uv  = v.uv;
  return o;
}

@fragment
fn fs_main(in: FragIn) -> @location(0) vec4f{
    //flip UV for screen blit
    let uv = vec2f(in.uv.x, 1.0 - in.uv.y);
    var startPos = vec2f(0);
    // var startPos = vec2f(375,260);

    // return vec4f(0);

    //set to 0 when finished testing
    var mouse = vec2f(spcu.mousex, spcu.mousey);
    var res = vec2f(spcu.screenWidth, spcu.screenHeight);
    //normalizes mouse to have its origin at screen center 0,0
    var mousep  = ((2.0 * mouse         )   - res   )/res.y;
    var p       = ((2.0 * in.fragPos.xy )   - res   )/res.y;
    var alpha = 1.0;
    var color = vec3f(0.0, 0.0, 0.0);
    var orange = vec3f(0.9, 0.6, 0.3);
    // var orange = vec3f(1, 0.0, 0.0);
    var blue = vec3f(0.65, 0.85, 1.0);
    // var blue = vec3f(0,0, 1.0);
    var red = vec3f(1.0, 0.0, 0.0);
    var black = vec3f(0);
    var white = vec3f(1);
    var debugval = 0f;
    var cpos = vec2f(0.0, 0.0);
    var rad = 0.5;
    var diff = p - cpos;
    var dist = sdfCircle(diff, rad);

    var bdim = vec2f(0.5,0.75);
    var bmin = min(bdim.x, bdim.y);
    var ra = vec4f(0.5,0,.1,0);
    var r = min(ra,vec4f(bmin));
    // var r = ra;
    dist = sdfRoundedRect(p-cpos, bdim, r);

    
    var md = abs(mousep) - bdim;
    var mdd = length( vec2f(max(md.x,0.0), max(md.y,0.0))) + min(max(md.x, md.y), 0.0);
    


    // dist = sdfAabb(p-cpos, bdim);
    var angle = spcu.time;
    // var angle = 0f;
    var u = vec2f(sin(angle),  cos(angle));
    var he = vec2f(0.25 + (0.125 * sin(spcu.time + cos(spcu.time*1.33))));
    var distObb = sdfObb(p, cpos, he, u) - (0.05 * abs(0.5*cos(spcu.time)));
    var distCir = sdfCircle(p - mousep, 0.3);
    dist = min(distObb,distCir); //union
    // dist = max(dist,dist1); //intersection
    // dist = max(dist,-dist1); //difference

    //smooth min
    //polynomial smooth min, k = blend radius
    let k = 0.125f;
    let a = distObb;
    let b = distCir;
    let h = clamp(0.5 + 0.5 * (b-a)/k, 0.0, 1.0);
    dist = mix(b,a,h)-k*h*(1.0 - h);

    var color1 = vec3f(0,1,0);
    
    let useCircle = select(0.0, 1.0, distCir < distObb); // 1 if circle wins
    if(dist < 0){
        color = blue;
            color = mix(color, color1, useCircle);
        if(dist < -0.25){color = red;}
    }else{
        color = orange; 
    }
    var timev = spcu.pad0;
    color = color * (1.0 - exp(-6.0 * abs(dist)));
    color = color * 0.2 + color * 0.8 * sin((dist*150)+spcu.time*4);

    //step returns 1 if edge < x == -1.5 <= dist ? 1 : 0
    color = mix(white, color, smoothstep(0.0, 0.01, abs(dist)));
    

    //circle around mouse
    dist = sdfObb(mousep - p, cpos, he, u) - 0.05;
    
    
    
    // if(spcu.mouseleft == 1u){

    //     color = mix(vec3(1,1,0.25), color, smoothstep(0, 0.01, abs(length(p-mousep)-abs(dist))));
    //     color = mix(vec3(1,1,0.25), color, smoothstep(0, 0.01, length(p-mousep)-0.005));
    // }
    debugval = mousep.x;

    // color = mix(color1, color, step(0.01, dist1));
    // color = mix(color1, color, step(0.01, min(dist,dist1)));

    color = srgb_to_linear(color);

    // color.r = dist;

    // return vec4f(color, alpha*spcu.pad1);

    
    // var out : array<u32, 32> = array<u32, 32>();
    // var outcap = 32u;
    // var n = 0u;
    // var finalstr : array<u32, 32> = array<u32, 32>();
    // var nf = 0u;
    // var textScale = 30f;
    // var textHeight = 5f * textScale;
    // var test = 0;
    // if(in.fragPos.y >= startPos.y && in.fragPos.y <= startPos.y + textHeight){
    //     n = 0u;
    //     nf = 0u;
    //     append_fixed(&out, &n, outcap, debugval, 3);
    //     // append_fixed(&out, &n, outcap, -105.105, 3);
    //     cat_str(&finalstr, &nf, &out, &n);
    //     if(OverlapsText(in.fragPos.xy, startPos, &finalstr, nf, textScale)){
    //         // color = red;
    //         color.r = 1;
    //         color.g = 1;
    //         color.b = 1;
    //         alpha = 1.0;
    //     }
    // }


    // return vec4f(color, alpha*spcu.pad1);
    var colorrgb = color.rgb;
    var srgb = pow(colorrgb, vec3f(1.0 / 2.2));
    // color.rgb = srgb;
    return vec4f(srgb, alpha*spcu.pad1);
}
`;

const shaderSourceScreenSpace = `

const c_A = 65u;
const c_B = 66u;
const c_C = 67u;
const c_D = 68u;
const c_E = 69u;
const c_F = 70u;
const c_G = 71u;
const c_H = 72u;
const c_I = 73u;
const c_J = 74u;
const c_K = 75u;
const c_L = 76u;
const c_M = 77u;
const c_N = 78u;
const c_O = 79u;
const c_P = 80u;
const c_Q = 81u;
const c_R = 82u;
const c_S = 83u;
const c_T = 84u;
const c_U = 85u;
const c_V = 86u;
const c_W = 87u;
const c_X = 88u;
const c_Y = 89u;
const c_Z = 90u;
const c_a = 97u;
const c_b = 98u;
const c_c = 99u;
const c_d = 100u;
const c_e = 101u;
const c_f = 102u;
const c_g = 103u;
const c_h = 104u;
const c_i = 105u;
const c_j = 106u;
const c_k = 107u;
const c_l = 108u;
const c_m = 109u;
const c_n = 110u;
const c_o = 111u;
const c_p = 112u;
const c_q = 113u;
const c_r = 114u;
const c_s = 115u;
const c_t = 116u;
const c_u = 117u;
const c_v = 118u;
const c_w = 119u;
const c_x = 120u;
const c_y = 121u;
const c_z = 122u;
const c_minus = 45u;
const c_dot = 46u;
const c_colon = 58u;
const c_0 = 48u;
const c_space = 32u;

const atlas: array<u32, 128> = array<u32, 128>(
    0x4EEAE8EEu, 0xA5110000u,
    0xC22A882Au, 0x052A94F8u,
    0x4EEEEE4Eu, 0xA01100A8u,
    0x48222A4Au, 0x48800870u,
    0xEEE2EE4Eu, 0x07112270u,
    0x00000000u, 0x000E1CA8u,
    0xE44A004Eu, 0x000000A8u,
    0xAA4A4042u, 0x00000000u,
    0xEA000046u, 0x00000000u,
    0x2A004000u, 0xFBEF8000u,
    0x24000444u, 0xAAAABEF8u,
    0x00000000u, 0x30862AA8u,
    0x2844C66Cu, 0x61C30C60u,
    0x44828244u, 0xAAAAAAA8u,
    0x82828282u, 0xAAAAAAA8u,
    0x44828244u, 0x00000000u,
    0x2844C66Cu, 0x00000000u,
    0x00000000u, 0x00000000u,
    0x04000824u, 0x739F61F0u,
    0x4440A82Au, 0x8ADC7980u,
    0x44EE4444u, 0xFA5869F0u,
    0x0440A28Au, 0xFB586580u,
    0x44000284u, 0x9B986580u,
    0x00000000u, 0x9A586DF0u,
    0x6A74B1EEu, 0x9B9F79F8u,
    0xA442AD02u, 0x00000000u,
    0x647131ECu, 0x00053EF8u,
    0x2A42A10Au, 0xF9ED9C70u,
    0xEE74A1CAu, 0x838D8820u,
    0x00000000u, 0xFA0F8820u,
    0xBBA38E20u, 0xF2EF88A0u,
    0x80218250u, 0xC26D8890u,
    0x8A26BAF8u, 0xC36D9C90u,
    0x0A0A2850u, 0xC3E53EF8u,
    0xEAEC1820u, 0x00000000u,
    0x00000000u, 0x08020608u,
    0x4CECEEEAu, 0x0802C468u,
    0xAA8A888Au, 0xCCC6EEAEu,
    0xEC8AEEAEu, 0xAA8A842Au,
    0xAA8A88AAu, 0xECC6E4EAu,
    0xACECE8EAu, 0x00000000u,
    0x00000000u, 0x44880004u,
    0xEEA8A8EEu, 0x0088000Au,
    0x42A8EEAAu, 0x44A8A8ECu,
    0x42C8AAAEu, 0x44C8EEA8u,
    0x4AA8AAA8u, 0x4CACAAE8u,
    0xEEAEAAE8u, 0x00000000u,
    0x00000000u, 0x40040000u,
    0x4C6EAAAAu, 0xA6E400AAu,
    0xAA84AAAAu, 0x488EAAAAu,
    0x6C44AAAAu, 0x2864AAE4u,
    0x2A24AAE4u, 0x28E4E4AAu,
    0x2AC4E4AAu, 0x00400000u,
    0x00000000u, 0xAEA00480u,
    0xAE401000u, 0x62000000u,
    0xA2459240u, 0x24000880u,
    0x444496E0u, 0x2E0E0702u,
    0x48449E80u, 0x00B42007u,
    0x4E779AE0u, 0x00B0E005u,
    0x0000001Cu, 0x50B0AECCu,
    0x00800014u, 0xF8F4AAACu,
    0x0080000Cu, 0x50F4A8ECu,
    0x00F39114u, 0xF894EEACu,
    0x00929B1Cu, 0x509400C0u,
);

//   xpos, ypos,wid,height
const atlasdim: array<vec4u, 96> = array<vec4u, 96>(
vec4u(27u, 53u, 4u, 6u),// space   32u 
vec4u(24u, 6u , 4u, 6u),// !       33u
vec4u(27u, 53u, 4u, 6u),// "       34u
vec4u(27u, 53u, 4u, 6u),// #       35u
vec4u(27u, 53u, 4u, 6u),// $       36u
vec4u(27u, 53u, 4u, 6u),// %       37u
vec4u(27u, 53u, 4u, 6u),// &       38u
vec4u(27u, 53u, 4u, 6u),// '       39u
vec4u(27u, 53u, 4u, 6u),// (       40u
vec4u(27u, 53u, 4u, 6u),// )       41u
vec4u(27u, 53u, 4u, 6u),// *       42u
vec4u(27u, 53u, 4u, 6u),// +       43u
vec4u(27u, 53u, 4u, 6u),// ,       44u
vec4u(12u, 18u, 4u, 6u),// -       45u
vec4u(20u, 6u , 4u, 6u),// .       46u
vec4u(27u, 53u, 4u, 6u),// /       47u
vec4u(4u , 6u , 4u, 6u),// 0       48u
vec4u(0u , 0u , 4u, 6u),// 1       49u
vec4u(4u , 0u , 4u, 6u),// 2       50u
vec4u(8u , 0u , 4u, 6u),// 3       51u
vec4u(12u, 0u , 4u, 6u),// 4       52u
vec4u(16u, 0u , 4u, 6u),// 5       53u
vec4u(20u, 0u , 4u, 6u),// 6       54u
vec4u(24u, 0u , 4u, 6u),// 7       55u
vec4u(28u, 0u , 4u, 6u),// 8       56u
vec4u(0u , 6u , 4u, 6u),// 9       57u
vec4u(16u, 6u , 4u, 6u),// :       58u
vec4u(27u, 53u, 4u, 6u),// ;       59u
vec4u(27u, 53u, 4u, 6u),// <       60u
vec4u(27u, 53u, 4u, 6u),// =       61u
vec4u(27u, 53u, 4u, 6u),// >       62u
vec4u(28u, 6u , 4u, 6u),// ?       63u
vec4u(27u, 53u, 4u, 6u),// @       64u
vec4u(0u , 36u, 4u, 6u),// A       65u
vec4u(4u , 36u, 4u, 6u),// B       66u
vec4u(8u , 36u, 4u, 6u),// C       67u
vec4u(12u, 36u, 4u, 6u),// D       68u
vec4u(16u, 36u, 4u, 6u),// E       69u
vec4u(20u, 36u, 4u, 6u),// F       70u
vec4u(24u, 36u, 4u, 6u),// G       71u
vec4u(28u, 36u, 4u, 6u),// H       72u
vec4u(0u , 42u, 4u, 6u),// I       73u
vec4u(4u , 42u, 4u, 6u),// J       74u
vec4u(8u , 42u, 4u, 6u),// K       75u
vec4u(12u, 42u, 4u, 6u),// L       76u
vec4u(16u, 42u, 4u, 6u),// M       77u
vec4u(20u, 42u, 4u, 6u),// N       78u
vec4u(24u, 42u, 4u, 6u),// O       79u
vec4u(28u, 42u, 4u, 6u),// P       80u
vec4u(0u , 48u, 4u, 6u),// Q       81u
vec4u(4u , 48u, 4u, 6u),// R       82u
vec4u(8u , 48u, 4u, 6u),// S       83u
vec4u(12u, 48u, 4u, 6u),// T       84u
vec4u(16u, 48u, 4u, 6u),// U       85u
vec4u(20u, 48u, 4u, 6u),// V       86u
vec4u(24u, 48u, 4u, 6u),// W       87u
vec4u(28u, 48u, 4u, 6u),// X       88u
vec4u(0u , 54u, 4u, 6u),// Y       89u
vec4u(4u , 54u, 4u, 6u),// Z       90u
vec4u(27u, 53u, 4u, 6u),// [       91u
vec4u(27u, 53u, 4u, 6u),// \       92u
vec4u(27u, 53u, 4u, 6u),// ]       93u
vec4u(40u, 52u, 4u, 6u),// ^       94u
vec4u(44u, 52u, 4u, 6u),// _       95u
vec4u(27u, 53u, 4u, 6u),// graveAcc96u
vec4u(32u, 35u, 4u, 6u),// a       97u
vec4u(36u, 35u, 4u, 6u),// b       98u
vec4u(40u, 35u, 4u, 6u),// c       99u
vec4u(44u, 35u, 4u, 6u),// d       100u
vec4u(48u, 35u, 4u, 6u),// e       101u
vec4u(52u, 35u, 4u, 6u),// f       102u
vec4u(56u, 35u, 4u, 6u),// g       103u
vec4u(60u, 35u, 4u, 6u),// h       104u
vec4u(32u, 41u, 4u, 6u),// i       105u
vec4u(36u, 41u, 4u, 6u),// j       106u
vec4u(40u, 41u, 4u, 6u),// k       107u
vec4u(44u, 41u, 4u, 6u),// l       108u
vec4u(48u, 41u, 4u, 6u),// m       109u
vec4u(52u, 41u, 4u, 6u),// n       110u
vec4u(56u, 41u, 4u, 6u),// o       111u
vec4u(60u, 41u, 4u, 6u),// p       112u
vec4u(32u, 47u, 4u, 6u),// q       113u
vec4u(36u, 47u, 4u, 6u),// r       114u
vec4u(40u, 47u, 4u, 6u),// s       115u
vec4u(44u, 47u, 4u, 6u),// t       116u
vec4u(48u, 47u, 4u, 6u),// u       117u
vec4u(52u, 47u, 4u, 6u),// v       118u
vec4u(56u, 47u, 4u, 6u),// w       119u
vec4u(60u, 47u, 4u, 6u),// x       120u
vec4u(32u, 52u, 4u, 6u),// y       121u
vec4u(36u, 52u, 4u, 6u),// z       122u
vec4u(27u, 53u, 4u, 6u),// {       123u
vec4u(27u, 53u, 4u, 6u),// |       124u
vec4u(27u, 53u, 4u, 6u),// }       125u
vec4u(27u, 53u, 4u, 6u),// ~       126u
vec4u(0u , 30u, 6u, 6u),//         127u
);



fn OverlapsText(fragPos: vec2f, startPos: vec2f, chars: ptr<function, array<u32, 32>>, arraylen: u32, textScale: f32) -> bool{
    var fragx = u32(0);
    var fragy = u32(0);
    var ax = 0u;//atlas x //top left coord of the specific glyph in the atlas
    var ay = 0u;
    var gx = 0u;//exact coord the current pixel overlaps in the glyph (4x5 box)
    var gy = 0u;
    var charInd = 0u;//character index
    
    var fontArrayHeight = 128u;
    var fontArrayWidth = 32u;

    if(i32(fragPos.x) - i32(startPos.x) < 0){return false;}
    if(i32(fragPos.y) - i32(startPos.y) < 0){return false;}

    var textpx = u32((fragPos.x-startPos.x) / textScale);//coords of the pixel in the text space
    var textpy = u32((fragPos.y-startPos.y) / textScale);

    //for all pixels, reverse map to a string and see if they should light up
    var charMaxW = 6u; //a cheap check to see if we roughly fall into the range of the text
    var charMaxH = 5u;
    if(textpx < (arraylen*charMaxW) && textpy < charMaxH){
        //so this pixel falls inside that boundary, now figure out the char it overlaps
        
        //TODO: construct the entire string with all variable widths
        //determine which variable width glyph the pixels falls into
        var charindex = 0u;
        var curstepx = 0u;
        var glyphStartX = 0u;
        var inside = false;
        for(var i = 0u; i < arraylen; i++){
            var dim = vec4u(atlasdim[(chars[i] - fontArrayWidth)]);
            if(textpx >= curstepx && textpx < (curstepx + dim.z)){
                charindex = i;
                inside = true;
                glyphStartX = curstepx;
                break;
            }
            curstepx += dim.z;
        }
        if(!inside){return false;}

        if(charindex < arraylen){
            var charcode = chars[charindex];
            if(charcode >= fontArrayWidth){
                //get the actual position in the texture of this char
                var atlasIndex = charcode - fontArrayWidth;
                var dim = vec4u(atlasdim[atlasIndex]);
                gx = textpx - glyphStartX;
                gy = textpy % dim.w;
                ax = dim.x;
                ay = dim.y;
                fragx = ax + gx;
                fragy = ay + gy;
            }

        }else{
            fragx = 0;
            fragy = 0;
        }

    }else{
        fragx = 0;
        fragy = 0;
    }

    var offsetRow = 0u;
    if(fragx >= fontArrayWidth){
        offsetRow++;
        fragx -= fontArrayWidth;
    }
    var y = fragy*2u;
    var row = 0u;
    var bits = 0u;
    var on = 0u;

    if((y+1u) < fontArrayHeight && fragx < fontArrayWidth){
        row = atlas[y+offsetRow];
        bits = (row >> (31u - fragx)) & 1u;

    }
    return (bits == 1u);
}




fn cat_str(
    str1: ptr<function, array<u32, 32>>, 
    n1  : ptr<function, u32>,
    str2: ptr<function, array<u32, 32>>, 
    n2  : ptr<function, u32>,
    ){
        for(var i = 0u; i < *n2 && *n1 < 32; i++){
            str1[*n1] = str2[i];
            *n1++;
        }
    }

//input: char array, count, max, floating point value
//output: appended floating point number to char array
fn append_fixed(
    out: ptr<function, array<u32, 32>>, 
    n: ptr<function, u32>,
    outcap: u32,
    cval: f32,//const val
    prec: u32 //precision
    ){
        var val = cval;
        if(val < 0.0){
            val = -val;
            out[*n] = c_minus; *n++;
        }

        var scale = 1u;
        for(var i = 0u; i < prec; i++){scale *= 10u;}



        var scaledf = val * f32(scale) + 0.5; //how does this rounding work exactly?
        var scaled = u32(scaledf);
        var ip = scaled / scale;
        var fp = scaled % scale;
        
        var tmp : array<u32, 8> = array<u32, 8>();
        var tmpcap = 8u;
        var tlen = 0u;
        //read out an integer
        if((ip == 0u) && (ip % 10) == 0u){
            tmp[tlen] = c_0;
            tlen++;
        }else{
            while(ip > 0u && ((tlen+1u) < tmpcap)){
                tmp[tlen] = c_0 + (ip % 10);
                tlen++;
                ip /= 10u;
            }
        }
        
        while(tlen > 0u && (*n+1 < outcap)){
            tlen--;
            out[*n] = tmp[tlen];
            *n++;
        }
        //now read out the floating part
        out[*n] = c_dot; *n++;

        tlen = 0;
        var div = scale / 10u;
        var tval = 0u; //temp val
        //using div because it gives us leading 0s
        for(var i = 0u; i < prec && *n+1 < outcap; i++){
            tval = 0u;
            if(div > 0u){
                tval = (fp / div) % 10u;
                div /= 10u;
            }
            out[*n] = c_0 + tval;
            *n++;
        }
}





struct VertexInput{
    @builtin(vertex_index) vertIndex: u32,
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
    @location(2) color: vec3f,
    @location(3) uv: vec2f,


    //BEGIN INSTANCED DATA
    @location(4 ) posAngle:        vec4f,
    @location(5 ) instanceColor:   vec4f,
    @location(6 ) size:            vec2f,
    @location(7 ) uvmin:           vec2f,
    @location(8 ) uvmax:           vec2f,
    @location(9 ) shapeIndex:      vec2u,
    @location(10) textureIndex:    vec2u,

};

struct VertexOutput{
    @builtin(position) position: vec4f,
    @location(0) normal: vec3f,
    @location(1) color: vec3f,
    @location(2) uv: vec2f,
    @location(3) localpx: vec2f,

    @location(4 ) posAngle:        vec4f,
    @location(5 ) instanceColor:   vec4f,
    @location(6 ) size:            vec2f,
    @location(7 ) uvmin:           vec2f,
    @location(8 ) uvmax:           vec2f,
    @location(9 ) @interpolate(flat) shapeIndex:      vec2u,
    @location(10) @interpolate(flat) textureIndex:    vec2u,
    @location(11) debug:           vec4f,
    
};


struct FragmentInput{
    @builtin(position) fragPos: vec4f, 
    @location(0) normal: vec3f,
    @location(1) color: vec3f,
    @location(2) uv: vec2f,
    @location(3) localpx: vec2f,
    
    @location(4 ) posAngle:        vec4f,
    @location(5 ) instanceColor:   vec4f,
    @location(6 ) size:            vec2f,
    @location(7 ) uvmin:           vec2f,
    @location(8 ) uvmax:           vec2f,
    @location(9 ) @interpolate(flat) shapeIndex:      vec2u,
    @location(10) @interpolate(flat) textureIndex:    vec2u,
    @location(11) debug:           vec4f,
};



struct ScreenSpaceCameraUniform{
    screenWidth     :   f32,
    screenHeight    :   f32,
    time            :   f32,
    mousex          :   f32,
    
    mousey          :   f32,
    mouseleft       :   u32,
    mouseright      :   u32,
    mousewheel      :   i32,

    pad0            :   f32,
    pad1            :   f32,
    pad2            :   f32,
    pad3            :   f32,

};






@group(0) @binding(0) var<uniform> spcu: ScreenSpaceCameraUniform;
@group(0) @binding(1) var textureArray: texture_2d_array<f32>;
@group(0) @binding(2) var textureSampler: sampler;


const pi = 3.14159265359;

fn sdfCircle(diff: vec2f, rad: f32) -> f32{
    var dist = length(diff) - rad;
    return dist;
}

//b.x = half width
//b.y = half height
//r.x = roundness top right
//r.y = roundness bot right
//r.z = roundness top left
//r.w = roundness bot left
fn sdfRoundedRect(p: vec2f, b: vec2f, r_in: vec4f) -> f32 {
    var r = r_in;

    if (p.x <= 0.0) {
        r.x = r.z;
        r.y = r.w;
    }
    if (p.y <= 0.0) {
        r.x = r.y;
    }

    let q: vec2f = abs(p) - b + vec2f(r.x); // broadcast r.x explicitly
    return min(max(q.x, q.y), 0.0) + length(max(q, vec2f(0.0))) - r.x;
}

fn sdfAabb(p: vec2f, b: vec2f) -> f32 {

    var d = abs(p) - b;
    return length( vec2f(max(d.x,0.0), max(d.y,0.0))) + min(max(d.x, d.y), 0.0);
}

fn perp(u: vec2f) -> vec2f { return vec2f(-u.y, u.x); }

fn sdfObb(p_in: vec2f, c: vec2f, he: vec2f, ang: f32) -> f32 {
    let u  = vec2f(cos(ang), -sin(ang)); // local +x axis in world
    let v  = perp(u);                   // local +y axis in world
    let d  = p_in - c;                  // world offset from center

    // world -> local (rotate by -ang) using projections
    let p  = vec2f(dot(d, u), dot(d, v));

    return sdfAabb(p, he);
}


@vertex
fn vs_main(in: VertexInput) -> VertexOutput{
    var out: VertexOutput;
    out.debug = vec4f(0);
        

    var size = in.size;
    
    let ang = in.posAngle.z;
    let c =  cos(ang);
    var s =  sin(ang);

    var ax0 = in.position.x * size.x;
    var ay0 = in.position.y * size.y;

    var ax = ax0;
    var ay = ay0;
    out.size            = size;
    //stretch the quad to fit over the shape
    if(in.shapeIndex.x == 1){ //circle
        var padding = 5f;
        size *= 2f;
        //send over region to draw to before padding
        out.size            = size;
        size += padding;
        s = -s;
        ax0 = in.position.x * size.x;
        ay0 = in.position.y * size.y;
        ax =  ax0 * c + ay0 * s;
        ay =  ax0 * s - ay0 * c;

    }else if(in.shapeIndex.x == 2 || in.shapeIndex.x == 4){ //obb or ui aabb
        //half extents are sent in for obbs
        var padding = 5f;
        size *= 2f;
        out.size            = size;

        size += padding;
        s = -s;
        ax0 = in.position.x * size.x;
        ay0 = in.position.y * size.y;
        ax =  ax0 * c + ay0 * s;
        ay =  ax0 * s - ay0 * c;
    }else if(in.shapeIndex.x == 0){ //text
        
    }
    //pixel to ndc
    //given x/given y
    let localpx = vec2f(
        in.position.x * size.x,
        in.position.y * size.y,
    );
    out.localpx = localpx;


    
    var gx = in.posAngle.x;
    var gy = in.posAngle.y;



    let px = in.posAngle.x + ax;
    let py = in.posAngle.y + ay;

    var x = ((px / spcu.screenWidth) * 2.0) - 1.0;
    var y = 1.0 - ((py / spcu.screenHeight) * 2.0);

    out.position = vec4f(x, y, 1.0, 1.0);
    out.normal = vec4f(in.normal, 0.0).xyz ;
    out.color = in.color;
    out.uv = in.uv;


    out.posAngle        = in.posAngle;
    out.instanceColor   = in.instanceColor;
    out.shapeIndex      = in.shapeIndex;
    out.uvmin           = in.uvmin;
    out.uvmax           = in.uvmax;
    out.instanceColor   = in.instanceColor;
    out.textureIndex    = in.textureIndex;

    return out;
}

@fragment
fn fs_main(in: FragmentInput) -> @location(0) vec4f{
    let useTexture = in.textureIndex.x;
    let textureIndex = in.textureIndex.y;
    let uv = vec2f(in.uv.x, in.uv.y);
    let atlasUV = in.uvmin + uv * (in.uvmax - in.uvmin);
    // var color = textureSample(textureArray, textureSampler, atlasUV).r;
    var color = vec4f(1.0);
    if(useTexture == 1){//font atlas
        var v = textureSampleLevel(textureArray, textureSampler, atlasUV, textureIndex, 0.0).r;
        color = vec4f(v,0,0,v);
    }else if(useTexture == 2){//for png textures
        // color = vec4f(1.0, 0.0, 0.0, 1.0);
        // color = vec4f(textureSample(textureArray, textureSampler, atlasUV, textureIndex).r,1.0, 0.0, 1.0);
        color = vec4f(textureSampleLevel(textureArray, textureSampler, atlasUV, textureIndex, 0.0).rgb, 1.0);

    }else{  //solid color quad
        color = in.instanceColor;
        color = vec4f(1,0,0,1);
    }
    if(in.shapeIndex.x != 0){
        var mouse = vec2f(spcu.mousex, spcu.mousey);
        var res = vec2f(spcu.screenWidth, spcu.screenHeight);
        //normalizes mouse to have its origin at screen center 0,0
        var mousep      = ((2.0 * mouse          )   - res   )/res.y;
        var p           = ((2.0 * in.fragPos.xy  )   - res   )/res.y;
        var pos         = ((2.0 * in.posAngle.xy )   - res   )/res.y;
        // var rad       = ((2.0 * in.size1.xy )   - res   )/res.y;
        // var rad       = vec2f(32f/f32(spcu.screenWidth))*2;
        //LOGIC TO DRAW JUST ONE SHAPE
        color = in.instanceColor;
        // color.r = 0.5f;
        color.a = 0.1f;
        if(in.shapeIndex.x == 1){ //circle
            var rad       = (((in.size.x))/spcu.screenHeight);

            var dist = sdfCircle(p - pos, rad);
            if(dist < 0){
                color.a = 1.0f;
            }
            color = color * 0.8 + (color * 0.2)*abs(sin(dist * 150 + spcu.time*4));
            color = mix(vec4f(1), color, smoothstep(0,0.005, abs(dist)));
        }else if(in.shapeIndex.x == 2){//obb
            var he       = in.size;
            he.x /= spcu.screenHeight;
            he.y /= spcu.screenHeight;

            var dist = sdfObb(p, pos, he, in.posAngle.z);// - 0.05;
            if(dist < 0){
                color.a = 1.0f;
            }
            color = color * 0.8 + (color * 0.2)*abs(sin(dist * 150 + spcu.time*4));
            color = mix(vec4f(1), color, smoothstep(0,0.005, abs(dist)));
        }else if(in.shapeIndex.x == 3){//aabb

        }else if(in.shapeIndex.x == 4){//checkered aabb UI
            var he       = in.size;
            he.x /= spcu.screenHeight;
            he.y /= spcu.screenHeight;
            var dist = sdfAabb(p - pos, he);
            //if its not a checkered pixel, skip
            var checker = f32(u32(in.fragPos.x) % 4 == 0 && u32(in.fragPos.y) % 4 == 0);
            if(dist < 0){
                color.a = 1.0f * checker;
            }
            color = color * 0.8 + (color * 0.2)*abs(sin(dist * 150 + spcu.time*4));
            color = mix(vec4f(1), color, smoothstep(0,0.005, abs(dist)));

        }

        var out : array<u32, 32> = array<u32, 32>();
        var outcap = 32u;
        var n = 0u;
        var finalstr : array<u32, 32> = array<u32, 32>();
        var nf = 0u;
        var textScale = 2f;
        var textHeight = 5f * textScale;
        var startPos = vec2f(f32(spcu.mousex)-in.size.x*0.5, f32(spcu.mousey)-in.size.y*0.5);
        // var debugval = spcu.mousex;
        var debugval = f32(spcu.mousey);
        if(in.fragPos.y >= startPos.y && in.fragPos.y <= startPos.y + textHeight){
            n = 0u;
            nf = 0u;
            append_fixed(&out, &n, outcap, debugval, 3);
            cat_str(&finalstr, &nf, &out, &n);
            if(OverlapsText(in.fragPos.xy, startPos, &finalstr, nf, textScale)){
                color = vec4f(1.0f);
            }
        }
        // color.r = 1.0f;

    }


    var colorrgb = color.rgb;
    var srgb = pow(colorrgb, vec3f(1.0 / 2.2));
    // color.rgb = srgb;
    return vec4f(srgb, color.a);
}
`;

const shaderSourceBlit = `
struct VIn {
  @location(0) pos : vec2f,
  @location(1) uv  : vec2f,
};

struct VOut {
  @builtin(position) pos : vec4f,
  @location(0) uv : vec2f,
};

@group(0) @binding(0) var blitTexture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;

@vertex
fn vs_main(v: VIn) -> VOut {
  var o: VOut;
  o.pos = vec4f(v.pos, 0.0, 1.0);
  o.uv  = v.uv;
  return o;
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f{
    //flip UV for screen blit
    let uv = vec2f(in.uv.x, 1.0 - in.uv.y);
    var color = textureSample(blitTexture, textureSampler, uv).rgb;
    // var color = vec3f(1.0, 0.0, 0.0);
    return vec4f(color, 1.0);
}
`;
const shaderSource3d = `


struct VertexInput{
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
    @location(2) color: vec3f,
    @location(3) uv: vec2f,
};

struct VertexOutput{
    @builtin(position) position: vec4f,
    @location(0) normal: vec3f,
    @location(1) color: vec3f,
    @location(2) uv: vec2f,
};

struct FragmentInput{
    @builtin(position) fragPos: vec4f,
    @location(0) normal: vec3f,
    @location(1) color: vec3f,
    @location(2) uv: vec2f,
};


struct CameraUniform{
    projectionMatrix: mat4x4f,  
    viewMatrix: mat4x4f,
    time: f32,
};

struct MyUniforms{
    modelMatrix: mat4x4f,
    color: vec4f,
    time: f32,
};


@group(0) @binding(0) var<uniform> uCamUni: CameraUniform;
@group(0) @binding(1) var<uniform> uMyUniforms: MyUniforms;
@group(0) @binding(2) var gradientTexture: texture_2d<f32>;
@group(0) @binding(3) var textureSampler: sampler;

const pi = 3.14159265359;

@vertex
fn vs_main(in: VertexInput) -> VertexOutput{
    var out: VertexOutput;
    out.position = uCamUni.projectionMatrix * uCamUni.viewMatrix * uMyUniforms.modelMatrix * vec4f(in.position, 1.0);
    out.normal = (uMyUniforms.modelMatrix * vec4f(in.normal, 0.0)).xyz ;
    out.color = in.color;
    out.uv = in.uv;
    return out;
}

@fragment
fn fs_main(in: FragmentInput) -> @location(0) vec4f{
    let lightColor1 = vec3f(1.0, 0.9, 0.6);
    let lightColor2 = vec3f(0.6, 0.9, 1.0);
    let lightDirection1 = vec3f(0.5, -0.9, 0.1);
    let lightDirection2 = vec3f(0.2,  0.4, 0.3);
    let shading1 = max(0.0, dot(lightDirection1, in.normal));
    let shading2 = max(0.0, dot(lightDirection2, in.normal));

    let shading = shading1 * lightColor1 + shading2 * lightColor2;
    // let color = in.color * uMyUniforms.color.rgb * shading;
    // let color = textureLoad(gradientTexture, vec2i(in.position.xy),0).rgb;
    let texelCoords = vec2i(in.uv * vec2f(textureDimensions(gradientTexture)));

    //for when we arent using a sampler
    // let color = textureLoad(gradientTexture, texelCoords, 0).rgb * shading;

    var color = textureSample(gradientTexture, textureSampler, in.uv).rgb * shading;
    color = uMyUniforms.color.rgb * color;
    // let color = textureLoad(gradientTexture, vec2i(in.position.xy),0).rgb;
    let linear_color = pow(color, vec3f(2.2));
    // return vec4f(linear_color, 1.0);


    // return vec4f(textureSample(gradientTexture, textureSampler, in.uv).rgb, 1.0);
    
    let srgb = pow(color, vec3f(1.0 / 2.2));
    return vec4f(srgb, 1.0);
    // return vec4f(in.uv, 0.0, 1.0);
}`;




function AssertNonNull<T>(value: T | null, msg: string): T{
    if (value === null){
        console.error(msg);
        MakeErrorDebugElement(new Error(msg));
        throw new Error(msg);
    } 
    return value;
}

function AssertInstanceOf<T>(
    value: unknown,
    ctor: {new (...args: any[]): T},
    msg: string
): asserts value is T{
    if (!(value instanceof ctor))   {
        console.error(msg);
        MakeErrorDebugElement(new Error(msg));
        throw new Error(msg);
    }
    if(value === null)              {
        console.error(msg);
        MakeErrorDebugElement(new Error(msg));
        throw new Error(msg);
    }
}

type Ctor<T> = Function & {prototype: T};

function GetElementId<T>(id: string, ctor: Ctor<T>): T{
    const el = document.getElementById(id);
    if(!el) throw new Error(`Missing #${id}`);
    if(!(el instanceof (ctor as any))) throw new Error(`#${id} is not the expected element type!`);
    return el as T;
}



let mouseX = 0;
let mouseY = 0;
let mouseleft = 0;
let running : boolean = true;
let elapsedTime : number = 0;
let canvas : HTMLCanvasElement;

type wgpu_state = {
    device                          : GPUDevice,
    context                         : GPUCanvasContext,
    offscreenTextureView            : GPUTextureView,
    offscreenTexture                : GPUTexture,
    captureTextureView              : GPUTextureView,
    captureTexture                  : GPUTexture,
    depthTextureView                : GPUTextureView,
    depthTexture                    : GPUTexture,
    sampler                         : GPUSampler,
    patternTexture                  : GPUTexture,
    patternTextureView              : GPUTextureView,
    fontAtlasTextureArray           : GPUTexture,
    fontAtlasTextureArrayView       : GPUTextureView,
    screenSpaceTextureArray         : GPUTexture,
    screenSpaceTextureArrayView     : GPUTextureView,
    deviceLimits                    : GPUSupportedLimits,
    queue                           : GPUQueue,
    depthTextureFormat              : GPUTextureFormat,
    textureFormat                   : GPUTextureFormat,
    surfaceFormat                   : GPUTextureFormat,
    texMem                          : Uint8Array,
    uniformBuffer                   : GPUBuffer,
    cameraUniformBuffer             : GPUBuffer,
    screenSpaceCameraUniformBuffer  : GPUBuffer,
    screenSpaceInstanceBuffer       : GPUBuffer,
    screenSpaceInstanceSize         : number,
    uniformStructSize               : number,
    cameraUniformSize               : number,
    screenSpaceCameraUniformSize    : number,
    screenSpaceCameraUniform        : Float32Array,
    cameraUniform                   : Float32Array,
    objectUniform                   : Float32Array,
    screenSpaceInstances            : Float32Array,
    shaderModuleScreenSpaceTest     : GPUShaderModule,
    shaderModule3d                  : GPUShaderModule,
    shaderModuleBlit                : GPUShaderModule,
    shaderModuleScreenSpace         : GPUShaderModule,
    uniformBufferSize               : number,
    uniformStride                   : number,
    pyramidVertSize                 : number,
    quadVertSize                    : number,
    fullscreenQuadVertSize          : number,
    pyramidIndSize                  : number,
    quadIndSize                     : number,
    pyrVertBuf                      : GPUBuffer,
    quadVertBuf                     : GPUBuffer,
    fullscreenQuadVertBuf           : GPUBuffer,
    pyrIndBuf                       : GPUBuffer,
    quadIndBuf                      : GPUBuffer,
    pipelineLayout3d                : GPUPipelineLayout,
    pipelineLayoutScreenSpaceTest   : GPUPipelineLayout,
    pipelineLayoutScreenSpace       : GPUPipelineLayout,
    pipelineLayoutBlit              : GPUPipelineLayout,
    pipeline3d                      : GPURenderPipeline,
    pipelineScreenSpace             : GPURenderPipeline,
    pipelineBlit                    : GPURenderPipeline,
    pipelineScreenSpaceTest         : GPURenderPipeline,
    bindGroup3d                     : GPUBindGroup,
    bindGroupBlitOffscreen          : GPUBindGroup,
    bindGroupBlitCapture            : GPUBindGroup,
    bindGroupScreenSpaceFont        : GPUBindGroup,
    bindGroupScreenSpaceTextures    : GPUBindGroup,
    bindGroupLayout3d               : GPUBindGroupLayout,
    bindGroupLayoutBlit             : GPUBindGroupLayout,
    bindGroupLayoutScreenSpace      : GPUBindGroupLayout,
};



//resize correctly css size vs backing store size
//webgpu renders in physical pixels so match device pixel ratio
function ResizeCanvasToDisplaySize(){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width  * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    // console.log(w);
    // console.log(h);
    if(canvas.width !== w || canvas.height !== h){
        canvas.width = w;
        canvas.height = h;
        return true;
    }
    return false;
}

function configure(wst : wgpu_state){
    const device = wst.device;
    const format = wst.surfaceFormat;

    // console.log("configuring...");
    // console.log(device);
    // console.log(wst.surfaceFormat);
    if(ResizeCanvasToDisplaySize()){
        wst.context.configure({device, format, alphaMode: "premultiplied"});
        ResizeWGPU(wst);
    }

}

function CreateTexture(wst: wgpu_state, width: number, height: number, layers: number, usageFlags: GPUTextureUsageFlags, textureFormat: GPUTextureFormat) : GPUTexture{
    return wst.device.createTexture({
        size: [width, height, layers],
        format: textureFormat,
        usage: usageFlags,
    });
}


function CreateTextureView(texture: GPUTexture, layerCount: number){
    return texture.createView({
        aspect: 'all',//webgpu default
        baseMipLevel: 0,
        mipLevelCount: 1,
        baseArrayLayer: 0,
        arrayLayerCount: layerCount,
        dimension: layerCount > 1 ? '2d-array' : '2d',
    });
}



function populateTexMem(wst : wgpu_state){
    for(let y = 0; y < 256; y++){
        for(let x = 0; x < 256; x++){
            const i = 4 * (y * 256 + x);

            // Emulate C integer division + modulus for unsigned values
            const xDiv16 = Math.floor(x / 16);
            const yDiv16 = Math.floor(y / 16);
            const xMyDiv16 = Math.floor((x - y) / 16);
            const xPyDiv16 = Math.floor((x + y) / 16);

            wst.texMem[i + 0] = (xDiv16 % 2 === yDiv16 % 2) ? 255 : 0;
            wst.texMem[i + 1] = (xMyDiv16 % 2 === 0) ? 255 : 0;
            wst.texMem[i + 2] = (xPyDiv16 % 2 === 0) ? 255 : 0;
            wst.texMem[i + 3] = 255;
        
        }
    }
    wst.device.queue.writeTexture({
        texture: wst.patternTexture,
        mipLevel: 0,
        origin: {x: 0, y: 0, z: 0}
    },
    wst.texMem.buffer as ArrayBuffer,
    {
        offset: wst.texMem.byteOffset,
        bytesPerRow: 256 * 4,
        rowsPerImage: 256,
    },
    {
        width: 256,
        height: 256,
        depthOrArrayLayers: 1,
    });
}

function CreateSampler(wst : wgpu_state){
    wst.sampler = wst.device.createSampler({
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        addressModeW: 'clamp-to-edge',
        magFilter: 'linear',
        minFilter: 'linear',
        mipmapFilter: 'linear',
        lodMinClamp: 0.0,
        lodMaxClamp: 1.0, 
        compare: undefined, //for depth comparison, not used here
        maxAnisotropy: 1,
    });
}
    
function CreateDepthTexture(wst : wgpu_state){
    var width = canvas.width;
    var height = canvas.height;
    
    wst.depthTexture = wst.device.createTexture({
        size: [width, height, 1],
        format: wst.depthTextureFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
}
function CreateDepthTextureView(wst : wgpu_state){

    wst.depthTextureView = wst.depthTexture.createView({
        aspect: 'depth-only',
        baseMipLevel: 0,
        mipLevelCount: 1,
        baseArrayLayer: 0,
        arrayLayerCount: 1,
        dimension: "2d",//optional, usually inferred
        format: wst.depthTextureFormat,
    });
}

//align must be a power of 2
function AlignUp(x: number, align: number) : number{
    return (x + (align - 1)) & ~(align - 1);
}

function AlignUpCeil(x: number, align: number) : number{
    return Math.ceil(x / align) * align;
}


function InitBuffers(wst : wgpu_state){

    let alignment = wst.deviceLimits.minUniformBufferOffsetAlignment;
    wst.uniformStride = Math.ceil(wst.uniformStructSize / alignment) * alignment; // 64
    console.log('uniform stride ', wst.uniformStride);
    // set shaderModule here
    wst.shaderModuleScreenSpaceTest = wst.device.createShaderModule({code: shaderSourceScreenSpaceTest});
    wst.shaderModule3d              = wst.device.createShaderModule({code: shaderSource3d});
    wst.shaderModuleBlit            = wst.device.createShaderModule({code: shaderSourceBlit});
    wst.shaderModuleScreenSpace     = wst.device.createShaderModule({code: shaderSourceScreenSpace});
    //  let uniformBufferSize = uniformStride + 4*8;
    wst.uniformBufferSize = wst.uniformStride * 4;
    
    wst.uniformBuffer = wst.device.createBuffer({
        size: wst.uniformBufferSize,
        label: 'Uniform Buffer',
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    console.log(`Camera Uniform Buffer Size: ${wst.cameraUniformSize}`);
    wst.cameraUniformBuffer = wst.device.createBuffer({
        size: wst.cameraUniformSize,
        label: 'Camera Uniform Buffer',
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    wst.screenSpaceCameraUniformBuffer = wst.device.createBuffer({
        size: wst.screenSpaceCameraUniformSize,
        label: 'Screen Space Camera Uniform Buffer',
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    wst.pyrVertBuf = wst.device.createBuffer({
        size: wst.pyramidVertSize,
        label: 'Pyramid Vertex Buffer',
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    wst.pyrIndBuf = wst.device.createBuffer({
        size: wst.pyramidIndSize,
        label: 'Pyramid Index Buffer',
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    wst.quadVertBuf = wst.device.createBuffer({
        size: wst.quadVertSize,
        label: 'Quad Vertex Buffer',
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    wst.fullscreenQuadVertBuf = wst.device.createBuffer({
        size: wst.fullscreenQuadVertSize,
        label: 'Fullscreen Quad Vertex Buffer',
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    wst.quadIndBuf = wst.device.createBuffer({
        size: wst.quadIndSize,
        label: 'Quad Index Buffer',
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });

    wst.screenSpaceInstanceBuffer = wst.device.createBuffer({
        size: wst.screenSpaceInstanceSize,
        label: 'Screen Space Instance Buffer',
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    //fill vertex/index buffers with data
    wst.queue.writeBuffer(wst.pyrVertBuf,   0, pyramidVertData);
    wst.queue.writeBuffer(wst.pyrIndBuf,    0, pyramidIndData);
    wst.queue.writeBuffer(wst.quadVertBuf,  0, quadVertData);
    wst.queue.writeBuffer(wst.fullscreenQuadVertBuf,  0, fullscreenQuadData);
    wst.queue.writeBuffer(wst.quadIndBuf,   0, quadIndData);

}

    function ReloadBindGroup3d(wst : wgpu_state){
        wst.bindGroup3d = wst.device.createBindGroup({
            label: '3d bind group',
            layout: wst.bindGroupLayout3d,
            entries: [            
            {
                binding: 0,
                resource: {
                    buffer: wst.cameraUniformBuffer,
                    offset: 0,
                    size: wst.cameraUniformSize
                },
            },
            {
                binding: 1,
                resource: {
                    buffer: wst.uniformBuffer,
                    offset: 0,
                    size: wst.uniformStride
                },
            },
            {
                binding: 2,
                resource: wst.patternTextureView,
            },
            {
                binding: 3,
                resource: wst.sampler,
            },

            ]
        });
    }

    function InitBindings3d(wst : wgpu_state){
        wst.bindGroupLayout3d = wst.device.createBindGroupLayout({
            label: '3d bind group layout',
            entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer:{ //camera uniform
                    type: 'uniform',
                    minBindingSize: wst.cameraUniformSize,
                    //how do we set the required limits if relying on a browser?
                    hasDynamicOffset: false
                },
            },
            {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer:{ //dynamic uniform buffer
                    type: 'uniform',
                    minBindingSize: wst.uniformStride,
                    //how do we set the required limits if relying on a browser?
                    hasDynamicOffset: true
                },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {} //use default parameters
            },
            {
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {type: 'filtering'}//equivalent to WGPUSamplerBindingType_Filtering
            },

            ]
        });
        ReloadBindGroup3d(wst);
    }


    function ReloadBindGroupScreenSpaceFont(wst : wgpu_state){
         wst.bindGroupScreenSpaceFont = wst.device.createBindGroup({
            label: 'screen space FONT bind group',
            layout: wst.bindGroupLayoutScreenSpace,
            entries: [            
            {
                binding: 0,
                resource: {
                    buffer: wst.screenSpaceCameraUniformBuffer,
                    offset: 0,
                    size: wst.screenSpaceCameraUniformSize
                },
            },
            {
                binding: 1,
                resource: wst.fontAtlasTextureArrayView,
            },
            {
                binding: 2,
                resource: wst.sampler,
            },

            ]
        });
    }
    function ReloadBindGroupScreenSpaceTextures(wst : wgpu_state){
         wst.bindGroupScreenSpaceTextures = wst.device.createBindGroup({
            label: 'screen space TEXTURES bind group',
            layout: wst.bindGroupLayoutScreenSpace,
            entries: [            
            {
                binding: 0,
                resource: {
                    buffer: wst.screenSpaceCameraUniformBuffer,
                    offset: 0,
                    size: wst.screenSpaceCameraUniformSize
                },
            },
            {
                binding: 1,
                resource: wst.screenSpaceTextureArrayView,
            },
            {
                binding: 2,
                resource: wst.sampler,
            },

            ]
        });
    }

    function CreateScreenSpaceBindings(wst : wgpu_state){
        wst.bindGroupLayoutScreenSpace = wst.device.createBindGroupLayout({
            label: 'screen space bind group layout',
            entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer:{ //camera uniform
                    type: 'uniform',
                    minBindingSize: wst.screenSpaceCameraUniformSize,
                    //how do we set the required limits if relying on a browser?
                    hasDynamicOffset: false
                },
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType: "float",
                    viewDimension: "2d-array",
                    multisampled: false,
                }
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {
                    type: 'filtering'
                }//equivalent to WGPUSamplerBindingType_Filtering
            },

            ]
        });

       
    }
    
    function ReloadBindGroupBlitCapture(wst : wgpu_state){
        
        wst.bindGroupBlitCapture = wst.device.createBindGroup({
            label: 'capture blit bind group',
            layout: wst.bindGroupLayoutBlit,
            entries: [            
            {
                binding: 0,
                resource: wst.captureTextureView,
            },
            {
                binding: 1,
                resource: wst.sampler,
            },

            ]
        });
    }
    function ReloadBindGroupBlitOffscreen(wst : wgpu_state){
        
        wst.bindGroupBlitOffscreen = wst.device.createBindGroup({
            label: 'offscreen blit bind group',
            layout: wst.bindGroupLayoutBlit,
            entries: [            
            {
                binding: 0,
                resource: wst.offscreenTextureView,
            },
            {
                binding: 1,
                resource: wst.sampler,
            },

            ]
        });
    }
    function InitBindingLayoutBlit(wst : wgpu_state){
        wst.bindGroupLayoutBlit = wst.device.createBindGroupLayout({
            label: 'screen BLIT bind group layout',
            entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {} //use default parameters
            },
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {type: 'filtering'}//equivalent to WGPUSamplerBindingType_Filtering
            },

            ]
        });
        ReloadBindGroupBlitCapture(wst);
        ReloadBindGroupBlitOffscreen(wst);
    }

    function InitPipeline3d(wst : wgpu_state){
        
        wst.pipelineLayout3d = wst.device.createPipelineLayout({
            bindGroupLayouts: [wst.bindGroupLayout3d]
        });

        wst.pipeline3d = wst.device.createRenderPipeline({
            layout: wst.pipelineLayout3d, // Optional: auto layout

            vertex: {
                module: wst.shaderModule3d,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 11 * 4, //11 floats, 4 bytes each
                    attributes: [
                    {
                        shaderLocation: 0,
                        format: "float32x3",
                        offset: 0,
                    },
                    {
                        shaderLocation: 1,
                        format: "float32x3",
                        offset: 3*4,
                    },
                    {
                        shaderLocation: 2,
                        format: "float32x3",
                        offset: 6*4,
                    },
                    {
                        shaderLocation: 3,
                        format: "float32x2",
                        offset: 9*4,
                    },
                ]
                }]
            },

            fragment: {
                module: wst.shaderModule3d,
                entryPoint: 'fs_main',
                targets: [{
                format: navigator.gpu.getPreferredCanvasFormat()
                }]
            },

            primitive: {
                topology: 'triangle-list',
                frontFace: 'ccw',
                cullMode: 'none'
            },

            depthStencil: {
                format: wst.depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: "less",
            },

            multisample: {
                count: 1,
                mask: 0xFFFFFFFF,
                alphaToCoverageEnabled: false
            }
        });

    }

    function InitPipelineBlit(wst : wgpu_state){
        
        wst.pipelineLayoutBlit = wst.device.createPipelineLayout({
            bindGroupLayouts: [wst.bindGroupLayoutBlit]
        });

        wst.pipelineBlit = wst.device.createRenderPipeline({
            layout: wst.pipelineLayoutBlit, // Optional: auto layout

            vertex: {
                module: wst.shaderModuleBlit,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 4 * 4, //4 floats, 4 bytes each
                    attributes: [
                    {
                        shaderLocation: 0,
                        format: "float32x2",
                        offset: 0,
                    },
                    {
                        shaderLocation: 1,
                        format: "float32x2",
                        offset: 2*4,
                    },
                ]
                }]
            },

            fragment: {
                module: wst.shaderModuleBlit,
                entryPoint: 'fs_main',
                targets: [{
                format: navigator.gpu.getPreferredCanvasFormat()
                }]
            },

            primitive: {
                topology: 'triangle-list',
                frontFace: 'ccw',
                cullMode: 'none'
            },

            // depthStencil: {
            //     format: depthTextureFormat,
            //     depthWriteEnabled: true,
            //     depthCompare: "less",
            // },

            multisample: {
                count: 1,
                mask: 0xFFFFFFFF,
                alphaToCoverageEnabled: false
            }
        });

    }

    
    function InitPipelineScreenSpace(wst : wgpu_state){
        
        wst.pipelineLayoutScreenSpace = wst.device.createPipelineLayout({
            bindGroupLayouts: [wst.bindGroupLayoutScreenSpace],
            label: 'screen space pipeline layout'
        });

        wst.pipelineScreenSpace = wst.device.createRenderPipeline({
            layout: wst.pipelineLayoutScreenSpace, // Optional: auto layout

            vertex: {
                module: wst.shaderModuleScreenSpace,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 11 * 4, //11 floats, 4 bytes each
                    attributes: [
                    {
                        shaderLocation: 0,
                        format: "float32x3",
                        offset: 0,
                    },
                    {
                        shaderLocation: 1,
                        format: "float32x3",
                        offset: 3*4,
                    },
                    {
                        shaderLocation: 2,
                        format: "float32x3",
                        offset: 6*4,
                    },
                    {
                        shaderLocation: 3,
                        format: "float32x2",
                        offset: 9*4,
                    },
                ]
                },
                {
                    //per instance data
                    arrayStride: 72,
                    stepMode: "instance",
                    attributes: [
                        {
                            shaderLocation: 4,
                            format: "float32x4",
                            offset: 0,
                        },
                        {
                            shaderLocation: 5,
                            format: "float32x4",
                            offset: 4*4,
                        },
                        {
                            shaderLocation: 6,
                            format: "float32x2",
                            offset: 8*4,
                        },
                        {
                            shaderLocation: 7,
                            format: "float32x2",
                            offset: 10*4,
                        },
                        {
                            shaderLocation: 8,
                            format: "float32x2",
                            offset: 12*4,
                        },
                        {
                            shaderLocation: 9,
                            format: "uint32x2",
                            offset: 14*4,
                        },
                        {
                            shaderLocation: 10,
                            format: "uint32x2",
                            offset: 16*4,
                        },
                    ]
                }]
            },

            fragment: {
                module: wst.shaderModuleScreenSpace,
                entryPoint: 'fs_main',
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    blend:{
                        color:{
                            operation: "add",
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha",
                        },
                        alpha:{
                            operation: "add",
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                        },
                    }
                }]
            },

            primitive: {
                topology: 'triangle-list',
                frontFace: 'ccw',
                cullMode: 'none'
            },

            //no stencil
            // depthStencil: {
            //     format: depthTextureFormat,
            //     depthWriteEnabled: true,
            //     depthCompare: "less",
            // },

            multisample: {
                count: 1,
                mask: 0xFFFFFFFF,
                alphaToCoverageEnabled: false
            }
        });

    }
    

    function InitPipelineScreenSpaceTest(wst : wgpu_state){
        
        wst.pipelineLayoutScreenSpaceTest = wst.device.createPipelineLayout({
            bindGroupLayouts: [wst.bindGroupLayoutScreenSpace],
            label: 'screen space test pipeline layout'
        });

        wst.pipelineScreenSpaceTest = wst.device.createRenderPipeline({
            layout: wst.pipelineLayoutScreenSpaceTest, // Optional: auto layout

            vertex: {
                module: wst.shaderModuleScreenSpaceTest,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: 4 * 4, //4 floats, 4 bytes each
                    attributes: [
                    {
                        shaderLocation: 0,
                        format: "float32x2",
                        offset: 0,
                    },
                    {
                        shaderLocation: 1,
                        format: "float32x2",
                        offset: 2*4,
                    },
                ]
                }]
            },
            fragment: {
                module: wst.shaderModuleScreenSpaceTest,
                entryPoint: 'fs_main',
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    blend:{
                        color:{
                            operation: "add",
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha",
                        },
                        alpha:{
                            operation: "add",
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                        },
                    }
                }]
            },

            primitive: {
                topology: 'triangle-list',
                frontFace: 'ccw',
                cullMode: 'none'
            },

            //no stencil
            // depthStencil: {
            //     format: depthTextureFormat,
            //     depthWriteEnabled: true,
            //     depthCompare: "less",
            // },

            multisample: {
                count: 1,
                mask: 0xFFFFFFFF,
                alphaToCoverageEnabled: false
            }
        });

    }

let S = new Float32Array(16);
let T = new Float32Array(16);
let R1 = new Float32Array(16);
let tempMat0 = new Float32Array(16);
let tempMat1 = new Float32Array(16);
let modelMat = new Float32Array(16);

function SetDynamicUniformBuffers(wst : wgpu_state){
    let currentTime = GetPerformanceNowSeconds(); //current time in milliseconds


    S.set([
         0.3,  0.0, 0.0, 0.0,
         0.0,  0.3, 0.0, 0.0,
         0.0,  0.0, 0.3, 0.0,
         0.0,  0.0, 0.0, 1.0,
    ]);

    // Translate the object
    T.set([
        1.0,  0.0, 0.0, 0.7,
        0.0,  1.0, 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        0.0,  0.0, 0.0, 1.0,
    ]);
    // float angle1 = time;
    let angle1 : number = -currentTime;
    let c1 : number = Math.cos(angle1);
    let s1 : number = Math.sin(angle1);
    //this is being interpreted as column major in the multiplication function?
    R1.set([
        c1,  s1,  0.0, 0.0,
        -s1,  c1,  0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);

    mat4_mul(tempMat0, T, S);
    mat4_mul(tempMat1, R1, tempMat0); 

    mat4_transpose(modelMat, tempMat1);
    // mat4_identity(modelMat);
    wst.objectUniform.set(modelMat, 0);
    wst.objectUniform[16] = 1.0;
    wst.objectUniform[17] = 1.0;
    wst.objectUniform[18] = 0.99;
    wst.objectUniform[19] = 1.0;
    wst.objectUniform[20] = currentTime;

    // modelMat[0] = 0.030612;
    // modelMat[1] = -0.298418;
    // modelMat[2] = 0.000000;
    // modelMat[3] = 0.000000;

    // modelMat[4] = 0.298418;
    // modelMat[5] = 0.030612;
    // modelMat[6] = 0.000000;
    // modelMat[7] = 0.000000;

    // modelMat[8] = 0.000000;
    // modelMat[9] = 0.000000;
    // modelMat[10] = 0.300000;
    // modelMat[11] = 0.000000;

    // modelMat[12] = 0.051021;
    // modelMat[13] = -0.497363;
    // modelMat[14] = 0.000000;
    // modelMat[15] = 1.000000;
    // wst.queue.writeBuffer(wst.uniformBuffer, wst.uniformStride*0, wst.objectUniform);
    wst.queue.writeBuffer(
        wst.uniformBuffer,
        wst.uniformStride * 0,
        wst.objectUniform.buffer as ArrayBuffer,
        wst.objectUniform.byteOffset,
        wst.objectUniform.byteLength
    );
    // console.log("FIRST MODEL MATRIX");
    // console.log(`${modelMat[0 ]},${modelMat[1 ]},${modelMat[2 ]},${modelMat[3 ]},`);
    // console.log(`${modelMat[4 ]},${modelMat[5 ]},${modelMat[6 ]},${modelMat[7 ]},`);
    // console.log(`${modelMat[8 ]},${modelMat[9 ]},${modelMat[10]},${modelMat[11]},`);
    // console.log(`${modelMat[12]},${modelMat[13]},${modelMat[14]},${modelMat[15]} `);

    angle1 = -currentTime/2.0;
    c1 = Math.cos(angle1);
    s1 = Math.sin(angle1);
    //this is being interpreted as column major in the multiplication function?
    R1[0] = c1; R1[1] = s1; R1[4] = -s1; R1[5] = c1;
    T[3] = 0.5; T[11] = 0.1;
    // S[0] = 2; S[5] = 2; //scale the quads to 2x size
    mat4_mul(tempMat0, T, S);
    mat4_mul(tempMat1, R1, tempMat0); 

    mat4_transpose(modelMat, tempMat1);
    // mat4_identity(modelMat);
    wst.objectUniform.set(modelMat, 0);
    wst.objectUniform[16] =  1.0;
    wst.objectUniform[17] =  0.0;
    wst.objectUniform[18] =  0.5;
    wst.objectUniform[19] =  1.0;
    wst.objectUniform[20] = -currentTime/2.0;
    wst.queue.writeBuffer(
        wst.uniformBuffer,
        wst.uniformStride * 1,
        wst.objectUniform.buffer as ArrayBuffer,
        wst.objectUniform.byteOffset,
        wst.objectUniform.byteLength
    );

    angle1 = currentTime/4;
    c1 = Math.cos(angle1);
    s1 = Math.sin(angle1);
    //this is being interpreted as column major in the multiplication function?
    R1[0] = c1; R1[1] = s1; R1[4] = -s1; R1[5] = c1;
    T[3] = 0.6; T[7] = 0.2; T[11] = 0.3;
    mat4_mul(tempMat0, T, S);
    mat4_mul(tempMat1, R1, tempMat0); 

    mat4_transpose(modelMat, tempMat1);
    // mat4_identity(modelMat);
    wst.objectUniform.set(modelMat, 0);
    wst.objectUniform[16] =  0.0;
    wst.objectUniform[17] =  1.0;
    wst.objectUniform[18] =  0.1;
    wst.objectUniform[19] =  1.0;
    wst.objectUniform[20] = -currentTime/4.0;
    wst.queue.writeBuffer(
        wst.uniformBuffer,
        wst.uniformStride * 2,
        wst.objectUniform.buffer as ArrayBuffer,
        wst.objectUniform.byteOffset,
        wst.objectUniform.byteLength
    );


    angle1 = currentTime;
    c1 = Math.cos(angle1);
    s1 = Math.sin(angle1);
    //this is being interpreted as column major in the multiplication function?
    R1[0] = c1; R1[1] = s1; R1[4] = -s1; R1[5] = c1;
    T[3] = 0.65; T[7] = -0.1; T[11] = -0.1;

    mat4_mul(tempMat0, T, S);
    mat4_mul(tempMat1, R1, tempMat0); 

    mat4_transpose(modelMat, tempMat1);
    // mat4_identity(modelMat);
    wst.objectUniform.set(modelMat, 0);
    wst.objectUniform[16] =  0.0;
    wst.objectUniform[17] =  1.0;
    wst.objectUniform[18] =  0.5;
    wst.objectUniform[19] =  0.7;
    wst.objectUniform[20] = -currentTime/4.0;
    wst.queue.writeBuffer(
        wst.uniformBuffer,
        wst.uniformStride * 3,
        wst.objectUniform.buffer as ArrayBuffer,
        wst.objectUniform.byteOffset,
        wst.objectUniform.byteLength
    );
    // console.log(uniformStride); //256
}



function ResizeWGPU(wst : wgpu_state){

    wst.device.queue.onSubmittedWorkDone();
    
    if(wst.depthTexture){
        wst.depthTexture.destroy();
    }

    CreateDepthTexture(wst);
    CreateDepthTextureView(wst);

    if(wst.captureTexture){
        wst.captureTexture.destroy();
    }
    if(wst.offscreenTexture){
        wst.offscreenTexture.destroy();
    }

    wst.captureTexture          = CreateTexture(wst, canvas.width,   canvas.height,  1, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT, wst.textureFormat);
    wst.offscreenTexture        = CreateTexture(wst, canvas.width,   canvas.height,  1, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT, wst.textureFormat);

    wst.captureTextureView          = CreateTextureView(wst.captureTexture, 1);
    wst.offscreenTextureView        = CreateTextureView(wst.offscreenTexture, 1);

    if(wst.bindGroupLayoutBlit){
        ReloadBindGroupBlitOffscreen(wst);
        ReloadBindGroupBlitCapture(wst);
    }
}

let PerformanceMeasureMax = 128;
let performanceTimings = new Float32Array(PerformanceMeasureMax);
let performanceIndex = 0;

var instanceCount : number = 0;
var SDFInstanceCount : number = 0;
var TextInstanceCount : number = 0;


let SPIBytes = 72; //screen space instance byte size
let SPI32s = 18; //has 18 32 bit values 
let SPIMaxCount = 512;
let SPITextMaxCount = 2048;

let SPIMax = (SPIMaxCount + SPITextMaxCount) * SPIBytes;

let tempProjMat = new Float32Array(16);
let projMat = new Float32Array(16);
let tempViewMat = new Float32Array(16);
let viewMat = new Float32Array(16);
let mat4R2 = new Float32Array(16);
let mat4T2 = new Float32Array(16);
var baseInstanceDrawMem = new ArrayBuffer(SPIMax);
var f32 = new Float32Array(baseInstanceDrawMem);
var u32 = new Uint32Array(baseInstanceDrawMem);
var color = new Float32Array(4);


function AppendInstance(wst : wgpu_state, posx : number, posy : number, angle : number, sizex : number, sizey : number, color : Float32Array, uvminx : number, uvminy : number, uvmaxx : number, uvmaxy : number, shapeIndex : number, texIndex1:number, texIndex2:number){
    
    let memOffset:number = instanceCount * SPI32s;
    //write screen space instance test data
    //posAngle              vec4f
    f32[memOffset + 0] = posx;
    f32[memOffset + 1] = posy;
    f32[memOffset + 2] = angle;
    f32[memOffset + 3] = 0;

    //instance color        vec4f
    f32[memOffset + 4] = color[0];
    f32[memOffset + 5] = color[1];
    f32[memOffset + 6] = color[2];
    f32[memOffset + 7] = color[3];

    //size                  vec2f
    f32[memOffset + 8] = sizex;
    f32[memOffset + 9] = sizey;

    //uvmin                 vec2f
    f32[memOffset + 10] = uvminx;
    f32[memOffset + 11] = uvminy;

    //uvmax                 vec2f
    f32[memOffset + 12] = uvmaxx;
    f32[memOffset + 13] = uvmaxy;

    //shapeIndex            vec2u
    u32[memOffset + 14] = shapeIndex;
    u32[memOffset + 15] = 0;

    //textureIndex          vec2u
    u32[memOffset + 16] = texIndex1;
    u32[memOffset + 17] = texIndex2;
    
    instanceCount++;
}

function frame(wst : wgpu_state, currentTime : number){
    
    //reset draw counts
    instanceCount = 0;




    let focalLength : number = 2.0;
    let nearV   : number = 0.01;
    let farV    : number = 100.0;
    let scale   : number = 1.0;
    // let ratio   : number = canvas.width/canvas.height;
    let ratio   : number = 480/360;
    let pzz     : number = farV / (focalLength * (farV - nearV));
    
    let pzw     : number = -(farV * nearV) / (focalLength * (farV- nearV));
    
    // mat4 P = {
    //     1.0         , 0.0           , 0.0               , 0.0                       , 
    //     0.0         , ratio         , 0.0               , 0.0                       , 
    //     0.0         , 0.0           , pzz               , pzw                       , 
    //     0.0         , 0.0           , 1.0f / focalLength, 0.0                       , 
    // };
    //projection matrix

    tempProjMat[0 ] = 1;
    tempProjMat[1 ] = 0;
    tempProjMat[2 ] = 0;
    tempProjMat[3 ] = 0;
    
    tempProjMat[4 ] = 0;
    tempProjMat[5 ] = ratio;
    tempProjMat[6 ] = 0;
    tempProjMat[7 ] = 0;

    tempProjMat[8 ] = 0;
    tempProjMat[9 ] = 0;
    tempProjMat[10] = pzz;
    tempProjMat[11] = pzw;

    tempProjMat[12] = 0;
    tempProjMat[13] = 0;
    tempProjMat[14] = 1.0 / focalLength;
    tempProjMat[15] = 0;
    mat4_transpose(projMat, tempProjMat);
    // mat4_identity(projMat);
    wst.cameraUniform.set(projMat, 0);

    //do we need to manually clean up the new float arrays we create every frame?
    //view matrix

    let angle2 = 3.0 * 3.14 / 4.0;
    let c2 = Math.cos(angle2);
    let s2 = Math.sin(angle2);
    mat4R2.set([
    1.0, 0.0, 0.0, 0.0,
    0.0,  c2,  s2, 0.0,
    0.0, -s2,  c2, 0.0,
    0.0, 0.0, 0.0, 1.0,
    ]);
    mat4T2.set([
    1.0,  0.0, 0.0, 0.0,
    0.0,  1.0, 0.0, 0.0,
    0.0,  0.0, 1.0, 2.0,
    0.0,  0.0, 0.0, 1.0,
    ]);
    mat4_mul(tempViewMat, mat4T2, mat4R2);
    mat4_transpose(viewMat, tempViewMat);
    // mat4_identity(viewMat);
    wst.cameraUniform.set(viewMat, 16);

    wst.cameraUniform[32] = currentTime;
    // console.log(currentTime);
    wst.queue.writeBuffer(wst.cameraUniformBuffer, 0, wst.cameraUniform.buffer as ArrayBuffer, wst.cameraUniform.byteOffset, wst.cameraUniform.byteLength);

    // let mousex : number = 0;
    // let mousey : number = 0;
    // let mouseleft : number = 0;
    let mouseright : number = 0;
    let mousewheel : number = 0;
    wst.screenSpaceCameraUniform[0] = canvas.width;
    wst.screenSpaceCameraUniform[1] = canvas.height;
    wst.screenSpaceCameraUniform[2] = currentTime;
    wst.screenSpaceCameraUniform[3] = mouseX;

    wst.screenSpaceCameraUniform[4] = mouseY;
    wst.screenSpaceCameraUniform[5] = mouseleft;
    wst.screenSpaceCameraUniform[6] = mouseright;
    wst.screenSpaceCameraUniform[7] = mousewheel;

    wst.screenSpaceCameraUniform[8 ] = 1;
    wst.screenSpaceCameraUniform[9 ] = 0.95;
    wst.screenSpaceCameraUniform[10] = 0;
    wst.screenSpaceCameraUniform[11] = 0;


    wst.queue.writeBuffer(wst.screenSpaceCameraUniformBuffer, 0, wst.screenSpaceCameraUniform.buffer as ArrayBuffer, wst.screenSpaceCameraUniform.byteOffset, wst.screenSpaceCameraUniform.byteLength);


    //entities in dynamic uniform buffer
    SetDynamicUniformBuffers(wst);


    //write screen space instance test data
    
    //to draw circle at mouse
    color[0] = 0;
    color[1] = 1;
    color[2] = 0;
    color[3] = 0;
    //color red if we are clicking left down
    if(mouseleft){
        color[0] = 1;
        color[1] = 0;
    }
    // AppendInstance(wst, mouseX, mouseY, 0, 32, 32, color, 0,0,1,1, 1,0,0);

    //draw Performance
    
    let posx :number = 0;
    let posy :number = 0;
    let sizex:number = 0;
    let sizey:number = 0;

    let perfBarWidth = canvas.width / PerformanceMeasureMax;

    let rratio:number = 0;//red color ratio
    let gratio:number = 0;//green color ratio
    let curPerf:number = 0;
    let curInd:number = 0;
    let expectedFrameTime:number = 1.0/60.0;
    // console.log("START PERF SCAN");
    posy = canvas.height;
    posx = 0;
    color[0] = 1; //r
    color[1] = 0; //g
    color[2] = 0; //b
    sizex = 5;
    for(let i = 0; i < PerformanceMeasureMax; i++){
        sizey = 200;//max size of the performance measure in pixels
        rratio = 0;//red color ratio
        gratio = 0;//green color ratio
        //128 - 0 = 128

        //first frame: index = 0
        //0 - 0 = 0
        //0 - 1 = -1 + 128 = 127

        curInd = (performanceIndex-1 - i);
        if(performanceIndex-1 - i < 0){
            curInd = curInd + PerformanceMeasureMax;
        }
        //8 instances
        //i = 7 which is < 8
        curPerf = performanceTimings[curInd];

        let rratioBuggyOvercorrection = 1;
        rratio  = (curPerf / expectedFrameTime) * rratioBuggyOvercorrection ;
        gratio  = 1 -rratio ;
        color[0] = rratio;
        color[1] = gratio;
        sizey = sizey * rratio;
        posx += (perfBarWidth);
        AppendInstance(wst, posx, posy - sizey, 0, sizex, sizey, color, 0,0,1,1, 2,0,0);
    }
    // console.log(posx, posy, sizex, sizey);
    // AppendInstance(wst, posx, posy, sizey, sizex, color, 1);
    
    //append all engine draw commands
    // console.log(`shape draw command count: ${memU32[(drawCommandsMemOffset + (2048 * SPIBytes) + 4 + (512 *SPIBytes))/4]}`);
    // console.log(`shape draw command count: ${memU32[(drawCommandsMemOffset)]}`);
    let shapeCount = wasmMemU32[drawCommandsShapesCountOffset / 4];
    // console.log(`shape draw command count offset: ${(drawCommandsMemOffset)}, shapeCount: ${shapeCount}`);
    for(let i = 0; i < shapeCount; i++){
        let memOffset = (drawCommandsShapesOffset + (SPIBytes * i)) / 4;
        //72 bytes to work with
        //posangle [4]
        let posx  = wasmMemF32[memOffset + 0];
        let posy  = wasmMemF32[memOffset + 1];
        let angle = wasmMemF32[memOffset + 2];
        let SHAPE = wasmMemF32[memOffset + 3];

        //color
        color[0] = wasmMemF32[memOffset + 4];
        color[1] = wasmMemF32[memOffset + 5];
        color[2] = wasmMemF32[memOffset + 6];
        color[3] = wasmMemF32[memOffset + 7];

        //size
        let sizex = wasmMemF32[memOffset + 8];
        let sizey = wasmMemF32[memOffset + 9];

        //uvmin
        let uvminx = wasmMemF32[memOffset + 10];
        let uvminy = wasmMemF32[memOffset + 11];

        //uvmax
        let uvmaxx = wasmMemF32[memOffset + 12];
        let uvmaxy = wasmMemF32[memOffset + 13];

        let shapeIndexx = wasmMemU32[memOffset + 14];
        let shapeIndexy = wasmMemU32[memOffset + 15];

        let textureIndexx = wasmMemU32[memOffset + 16];
        let textureIndexy = wasmMemU32[memOffset + 17];

        // console.log(`shape | posx: ${posx} | posy: ${posy} | sizex: ${sizex} | sizey: ${sizey} | shapeIndex: ${shapeIndexx},`)
        AppendInstance(wst, posx, posy, angle, sizex, sizey,color, 0,0,1,1, shapeIndexx,0,0);
    }
    SDFInstanceCount = instanceCount;

    let textCount = wasmMemU32[drawCommandsTextCountOffset / 4];
    // console.log(`shape draw command count offset: ${(drawCommandsMemOffset)}, shapeCount: ${shapeCount}`);
    for(let i = 0; i < textCount; i++){
        let memOffset = (drawCommandsTextOffset + (SPIBytes * i)) / 4;
        //72 bytes to work with
        //posangle [4]
        let posx  = wasmMemF32[memOffset + 0];
        let posy  = wasmMemF32[memOffset + 1];
        let angle = wasmMemF32[memOffset + 2];
        let SHAPE = wasmMemF32[memOffset + 3];

        //color
        color[0] = wasmMemF32[memOffset + 4];
        color[1] = wasmMemF32[memOffset + 5];
        color[2] = wasmMemF32[memOffset + 6];
        color[3] = wasmMemF32[memOffset + 7];

        //size
        let sizex = wasmMemF32[memOffset + 8];
        let sizey = wasmMemF32[memOffset + 9];

        //uvmin
        let uvminx = wasmMemF32[memOffset + 10];
        let uvminy = wasmMemF32[memOffset + 11];

        //uvmax
        let uvmaxx = wasmMemF32[memOffset + 12];
        let uvmaxy = wasmMemF32[memOffset + 13];

        let shapeIndexx = wasmMemU32[memOffset + 14];
        let shapeIndexy = wasmMemU32[memOffset + 15];

        let textureIndexx = wasmMemU32[memOffset + 16];
        let textureIndexy = wasmMemU32[memOffset + 17];

        // console.log(`shape | posx: ${posx} | posy: ${posy} | sizex: ${sizex} | sizey: ${sizey} | shapeIndex: ${shapeIndexx},`)
        AppendInstance(wst, posx, posy, angle, sizex, sizey, color, uvminx, uvminy, uvmaxx, uvmaxy, shapeIndexx,textureIndexx,textureIndexy);

    }

    //1 meter != 32 pixels
    // 1 meter = X css pixels in the current viewport
    let dpr = window.devicePixelRatio;
    let viewPortHeightCss = canvas.getBoundingClientRect().height;

    let strTest = "dpr: " + dpr.toFixed(2);
    DrawText(wst, fontMetricsDefault, strTest, 400, 0);

    strTest = "cssHeight: " + viewPortHeightCss.toFixed(2);
    DrawText(wst, fontMetricsDefault, strTest, 400, 30);

    // color[0] = 1.0;
    // color[1] = 1.0;
    // color[2] = 1.0;
    // color[3] = 1.0;
    // AppendInstance(wst, 300, 400, 512, 512, color, 0,1,0);

    TextInstanceCount = instanceCount - SDFInstanceCount;

    wst.queue.writeBuffer(wst.screenSpaceInstanceBuffer, 0, baseInstanceDrawMem, 0, SPIMax);


    //write engine draw commands directly to gpu buffer
    //write screen space shapes
    /*
    wst.queue.writeBuffer(
        wst.screenSpaceInstanceBuffer,
        0,
        wasmMemU8.buffer as ArrayBuffer,
        drawCommandsShapesOffset,
        72 * shapeCount
        );
        
    //write screen space text
    wst.queue.writeBuffer(
        wst.screenSpaceInstanceBuffer,
        72 * shapeCount,
        wasmMemU8.buffer as ArrayBuffer,
        drawCommandsTextOffset,
        72 * textCount
    );
    */

    const encoder = wst.device.createCommandEncoder();
    const view = wst.context.getCurrentTexture().createView();
    

        const prepass = encoder.beginRenderPass({
        colorAttachments: [{
            view: wst.offscreenTextureView,
            clearValue: {r: 0.86, g: 0.27, b: 0.20, a: 1.0},
            loadOp: "clear",
            storeOp: "store",
        }],
        });
    prepass.setPipeline(wst.pipelineScreenSpaceTest);
    prepass.setVertexBuffer(0, wst.fullscreenQuadVertBuf);
    prepass.setIndexBuffer(wst.quadIndBuf, "uint16");
    prepass.setBindGroup(0, wst.bindGroupScreenSpaceTextures);
    prepass.drawIndexed(6, 1);
    prepass.end();

    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: wst.offscreenTextureView,
            clearValue: {r: 0.86, g: 0.27, b: 0.20, a: 1.0},
            loadOp: "load",
            storeOp: "store",
        }],
        depthStencilAttachment: {
            view: wst.depthTextureView,
            depthClearValue: 1.0,
            depthLoadOp: "clear",
            depthStoreOp: "store",
            depthReadOnly: false,
        },
    });
    pass.setPipeline(wst.pipeline3d);


    pass.setVertexBuffer(0, wst.quadVertBuf);
    pass.setIndexBuffer(wst.quadIndBuf, "uint16");
    pass.setBindGroup(0, wst.bindGroup3d, [0 * wst.uniformStride]);
    pass.drawIndexed(6, 1);

    pass.setBindGroup(0, wst.bindGroup3d, [1 * wst.uniformStride]);
    pass.drawIndexed(6, 1);

    pass.setBindGroup(0, wst.bindGroup3d, [2 * wst.uniformStride]);
    pass.drawIndexed(6, 1);

    pass.setVertexBuffer(0, wst.pyrVertBuf);
    pass.setIndexBuffer(wst.pyrIndBuf, "uint16");
    pass.setBindGroup(0, wst.bindGroup3d, [3 * wst.uniformStride]);
    pass.drawIndexed(18, 1);
    pass.end();

    //pass 2: blit offscreen to capture texture
    const pass2 = encoder.beginRenderPass({
        colorAttachments: [{
            view: wst.captureTextureView,
            clearValue: {r: 0.86, g: 0.27, b: 0.20, a: 1.0},
            loadOp: "clear",
            storeOp: "store",
        }],
    });
    pass2.setPipeline(wst.pipelineBlit);
    pass2.setVertexBuffer(0, wst.fullscreenQuadVertBuf);
    pass2.setIndexBuffer(wst.quadIndBuf, "uint16");
    pass2.setBindGroup(0, wst.bindGroupBlitOffscreen);
    pass2.drawIndexed(6, 1);
    pass2.end();

    //pass 3: draw UI to capture texture
    const pass3 = encoder.beginRenderPass({
        colorAttachments: [{
            view: wst.captureTextureView,
            clearValue: {r: 0.86, g: 0.27, b: 0.20, a: 1.0},
            loadOp: "load",
            storeOp: "store",
        }],
    });
    pass3.setPipeline(wst.pipelineScreenSpace);
    pass3.setVertexBuffer(0, wst.quadVertBuf);
    pass3.setVertexBuffer(1, wst.screenSpaceInstanceBuffer);
    pass3.setIndexBuffer(wst.quadIndBuf, "uint16");
    
    pass3.setBindGroup(0, wst.bindGroupScreenSpaceTextures);
    pass3.drawIndexed(6, SDFInstanceCount, 0, 0, 0);

    pass3.setBindGroup(0, wst.bindGroupScreenSpaceFont);
    // console.log(`ShapeInstanceCount: ${SDFInstanceCount}, TextInstanceCount: ${TextInstanceCount}`);
    pass3.drawIndexed(6, TextInstanceCount, 0, 0, SDFInstanceCount);
    
    pass3.end();
    
    //pass 4: blit capture texture to surface
   const pass4 = encoder.beginRenderPass({
        colorAttachments: [{
            view,
            clearValue: {r: 0.86, g: 0.27, b: 0.20, a: 1.0},
            loadOp: "clear",
            storeOp: "store",
        }],
    });
    pass4.setPipeline(wst.pipelineBlit);
    pass4.setVertexBuffer(0, wst.fullscreenQuadVertBuf);
    pass4.setIndexBuffer(wst.quadIndBuf, "uint16");
    pass4.setBindGroup(0, wst.bindGroupBlitCapture);
    pass4.drawIndexed(6, 1);
    pass4.end();


    wst.device.queue.submit([encoder.finish()]);



}



//END OF RENDERING


type vec2 = {
    x : number;
    y : number;
};

const MAX_ASCII = 100;
//FONT INFORMATION
type font_metrics = {
    size :                      number; //u32 ; //size of font metric package in file memory
    atlasSize :                 Float32Array; //vec2 ;
    ascent :                    number; //float ;
    descent :                   number; //float ;
    linegap :                   number; //float ;
    advanceWidthMax :           number; //float ;
    textureArrayIndex :         number; //uint32_t ;
    glyphCount :                number; //uint32_t ;
    nonStandardGlyphMappings :  Uint32Array; //length 4 //uint32_t [4];

    leftSideBearing :           Float32Array; //float [MAX_ASCII];
    advanceWidth :              Float32Array; //float [MAX_ASCII];
    ymin :                      Float32Array; //float [MAX_ASCII];
    ymax :                      Float32Array; //float [MAX_ASCII];
    atlasMin :                  Float32Array; //vec2 [MAX_ASCII];
    atlasMax :                  Float32Array; //vec2 [MAX_ASCII];
    // nonStandardGlyphMappings:    
    //0 = quarter (1/4)
    //1 = mars
    //2 = sun
    //3 = fun
};



function ZeroRLERead(view :  DataView, offset : number, storeView : DataView, storeOffset : number, sizeToRead : number){
    let atlasi : number = 0;
    let readi  : number = 0;
    let byte   : number = view.getUint8(offset + readi); readi++;
    while(readi <= sizeToRead){
        if(byte == 0){
            storeView.setUint8(storeOffset + atlasi, 0); atlasi++;
            let zeroCount    : number = view.getUint8(offset + readi); readi++;
            for(let i = 0; i < zeroCount; ++i){
            storeView.setUint8(storeOffset + atlasi, 0); atlasi++;
            }
        }else{
            storeView.setUint8(storeOffset + atlasi, byte); atlasi++;
        }
        byte = view.getUint8(offset + readi); readi++;
    }
}

type FontReaderBlob = {
    view : DataView;
    offset : number;
};

type FontMetricsOffset = {
    offset : number;
};

function ReadFontFileBinaryAtlas(view : DataView, memSize : number, fileOffset : number, atlasView : DataView, atlasOffset : number, fontAtlasMaxSize: number) : number{
    console.log(`offset: ${fileOffset}`);
    // if((offset + count) >= fileSize){}
    if((fileOffset + 4) >= memSize){return -2;}
    console.log(`memSize: ${memSize}`);

    const atlasSize = view.getUint32(fileOffset, true);     fileOffset += 4;    if((fileOffset + 4) >= memSize){return -2;}
    
    if(atlasSize >= fontAtlasMaxSize){return -2;}

    console.log(`atlas size: ${atlasSize}`);
    //read in the font atlas
    ZeroRLERead(view, fileOffset, atlasView, atlasOffset, atlasSize);
    fileOffset += atlasSize;
    return fileOffset;
}


function ReadFontFileBinaryMetrics(view : DataView, memSize : number, fileOffset : number, fontMetricsView : DataView) : number{

    let metricsOffset = 0;
    let fileMetricsOffset       = fileOffset - metricsOffset;
    let sizeOffset              = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    let atlasSizeXOffset        = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//float
    let atlasSizeYOffset        = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//float
    let ascentOffset            = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//float
    let descentOffset           = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//float
    let linegapOffset           = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//float
    let advanceWidthMaxOffset   = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//float
    let textureArrayIndexOffset = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    let glyphCountOffset        = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    let nonStandard0Offset      = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    let nonStandard1Offset      = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    let nonStandard2Offset      = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    let nonStandard3Offset      = metricsOffset; metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) >= memSize || (fileOffset >= memSize)){return -2;}//uint32
    // console.log(`sizeOffset:                ${sizeOffset}`);
    // console.log(`atlasSizeXOffset:          ${atlasSizeXOffset}`);
    // console.log(`atlasSizeYOffset:          ${atlasSizeYOffset}`);
    // console.log(`ascentOffset:              ${ascentOffset}`);
    // console.log(`descentOffset:             ${descentOffset}`);
    // console.log(`linegapOffset:             ${linegapOffset}`);
    // console.log(`advanceWidthMaxOffset:     ${advanceWidthMaxOffset}`);
    // console.log(`textureArrayIndexOffset:   ${textureArrayIndexOffset}`);
    // console.log(`glyphCountOffset:          ${glyphCountOffset}`);
    // console.log(`nonStandard0Offset:        ${nonStandard0Offset}`);
    // console.log(`nonStandard1Offset:        ${nonStandard1Offset}`);
    // console.log(`nonStandard2Offset:        ${nonStandard2Offset}`);
    // console.log(`nonStandard3Offset:        ${nonStandard3Offset}`);
    fontMetricsView.setUint32(sizeOffset,               view.getUint32 (sizeOffset              + fileMetricsOffset, true), true);
    fontMetricsView.setFloat32(atlasSizeXOffset,        view.getFloat32(atlasSizeXOffset        + fileMetricsOffset, true), true);
    fontMetricsView.setFloat32(atlasSizeYOffset,        view.getFloat32(atlasSizeYOffset        + fileMetricsOffset, true), true);
    fontMetricsView.setFloat32(ascentOffset,            view.getFloat32(ascentOffset            + fileMetricsOffset, true), true);
    fontMetricsView.setFloat32(descentOffset,           view.getFloat32(descentOffset           + fileMetricsOffset, true), true);
    fontMetricsView.setFloat32(linegapOffset,           view.getFloat32(linegapOffset           + fileMetricsOffset, true), true);
    fontMetricsView.setFloat32(advanceWidthMaxOffset,   view.getFloat32(advanceWidthMaxOffset   + fileMetricsOffset, true), true);
    fontMetricsView.setUint32 (textureArrayIndexOffset, view.getUint32 (textureArrayIndexOffset + fileMetricsOffset, true), true);
    fontMetricsView.setUint32 (glyphCountOffset,        view.getUint32 (glyphCountOffset        + fileMetricsOffset, true), true);
    fontMetricsView.setUint32 (nonStandard0Offset,      view.getUint32 (nonStandard0Offset      + fileMetricsOffset, true), true);
    fontMetricsView.setUint32 (nonStandard1Offset,      view.getUint32 (nonStandard1Offset      + fileMetricsOffset, true), true);
    fontMetricsView.setUint32 (nonStandard2Offset,      view.getUint32 (nonStandard2Offset      + fileMetricsOffset, true), true);
    fontMetricsView.setUint32 (nonStandard3Offset,      view.getUint32 (nonStandard3Offset      + fileMetricsOffset, true), true);
    // console.log(`size                 : ${fontMetricsView.getUint32 (sizeOffset, true)}`);
    // console.log(`atlasSizeX           : ${fontMetricsView.getFloat32(atlasSizeXOffset, true)}`);
    // console.log(`atlasSizeY           : ${fontMetricsView.getFloat32(atlasSizeYOffset, true)}`);
    // console.log(`ascent               : ${fontMetricsView.getFloat32(ascentOffset, true)}`);
    // console.log(`descent              : ${fontMetricsView.getFloat32(descentOffset, true)}`);
    // console.log(`linegap              : ${fontMetricsView.getFloat32(linegapOffset, true)}`);
    // console.log(`advanceWidthMaxOffset: ${fontMetricsView.getFloat32(advanceWidthMaxOffset, true)}`);
    // console.log(`textureArrayIndex    : ${fontMetricsView.getUint32 (textureArrayIndexOffset, true)}`);
    // console.log(`glyphCount           : ${fontMetricsView.getUint32 (glyphCountOffset, true)}`);
    // console.log(`nonStandard0         : ${fontMetricsView.getUint32 (nonStandard0Offset, true)}`);
    // console.log(`nonStandard1         : ${fontMetricsView.getUint32 (nonStandard1Offset, true)}`);
    // console.log(`nonStandard2         : ${fontMetricsView.getUint32 (nonStandard2Offset, true)}`);
    // console.log(`nonStandard3         : ${fontMetricsView.getUint32 (nonStandard3Offset, true)}`);
    let glyphCount = fontMetricsView.getUint32 (glyphCountOffset, true);
    Assert(glyphCount < MAX_ASCII, "TOO MANY GLYPHS IN THE FONT DATA BINARY! MORE THAN 100!");
    for(let i = 0; i < glyphCount; i++){
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
        fontMetricsView.setFloat32(metricsOffset,   view.getFloat32(fileOffset, true), true); metricsOffset += 4; fileOffset += 4; if((metricsOffset + 4) > memSize || (fileOffset > memSize)){return -2;}
    }
    return fileOffset;
}


//render loop
function gameLoop(wst : wgpu_state/* , wasmExports : WasmExports */){
    if(!running)return;

    try{

        // export const PLAYER_1 = {
        //     DPAD: { up: false, down: false, left: false, right: false },
        //     A: false,
        //     B: false,
        // };
        if(PLAYER_1.DPAD.up){
            mouseY++;    
        }
        if(PLAYER_1.DPAD.down){
            mouseY--;    
        }
        if(PLAYER_1.DPAD.left){
            mouseX--;    
        }
        if(PLAYER_1.DPAD.right){
            mouseX++;    
        }
        if(mouseX < 0)mouseX = 0;
        if(mouseX > canvas.width)mouseX = canvas.width - 1;
        if(mouseY < 0)mouseY = 0;
        if(mouseY > canvas.height)mouseY = canvas.height - 1;
        let currentTime = GetPerformanceNowSeconds(); //current time in milliseconds

        // wasmExports.setCurrentTime(currentTime); 
        // wasmExports.update();
        // console.log(`offset of drawCommands in mem: ${wasmExports.GetDrawCommands()}`);
        frame(wst, currentTime);

        let frameTime = GetPerformanceNowSeconds() - currentTime;
        performanceTimings[performanceIndex] = frameTime;
        // console.log(frameTime);
        performanceIndex = (performanceIndex + 1) % PerformanceMeasureMax;

    } catch (err){
        if(err instanceof Error){
            console.log("gameLoop error triggered");
            MakeErrorDebugElement(err);
        }else{
            //handle the case where err is not an error instance
            console.log("gameLoop unknown error triggered");
            MakeErrorDebugElement(new Error('An unknown error occured!'));
        }
        running = false;
    }

    if(running){
        requestAnimationFrame(() => gameLoop(wst/* , wasmExports */));
    }
}

async function InitWgpuState() : Promise<wgpu_state>{
    
    if(!navigator.gpu){
        console.error("Can not access navigator gpu!");
        throw new Error("Can not access navigator gpu!");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if(!adapter){
        console.error("No WebGPU adapter found!");
        throw new Error("No WebGPU adapter found!");
    }
    const device = await adapter.requestDevice();
    if(!device){
        console.error("No WebGPU device found!");
        throw new Error("No WebGPU device found!");
    }

    canvas = GetElementId("gfx", HTMLCanvasElement);
    if(!canvas){
        console.error("COULD NOT GET CANVAS!");
        throw new Error("COULD NOT GET CANVAS!");
    }
    if(!navigator.gpu){
        console.error("NO NAVIGATOR GPU!");
        throw new Error("NO NAVIGATOR GPU!");
    }


    const format = navigator.gpu.getPreferredCanvasFormat();
    console.log("preferred cavas format: ", format);
    
    

    const context = canvas.getContext("webgpu");
    if(!context){
        console.error("Could not get canvas context!");
        throw new Error("Could not get canvas context!");
    }

    // const textureFormat = "rgba8unorm";
    // const textureFormat = "rgba8unorm-srgb";


    


    let wst : wgpu_state = {} as wgpu_state;
    wst.device = device;
    wst.context = context;
    wst.textureFormat = format;
    wst.surfaceFormat = format;
    wst.depthTextureFormat = "depth24plus",
    wst.texMem = new Uint8Array(4 * 256*256);
    wst.screenSpaceInstanceSize = SPIMax;
    wst.uniformStructSize = AlignUpCeil(64 + 16 + 4, 16); //mat4 + vec4 + float
    wst.cameraUniformSize = AlignUpCeil(64 + 64 + 4, 16); //mat4 + mat4 + float
    wst.screenSpaceCameraUniformSize = AlignUpCeil(16 + 16 + 16, 16); //mat4 + mat4 + float
    wst.screenSpaceCameraUniform = new Float32Array(wst.screenSpaceCameraUniformSize / 4); //convert from bytes to floats (4 bytes each)
    wst.cameraUniform = new Float32Array(wst.cameraUniformSize / 4); //convert from bytes to floats (4 bytes each)
    wst.objectUniform = new Float32Array(wst.uniformStructSize / 4);

    wst.screenSpaceInstances = new Float32Array(
        4 + //posAngle      vec4f
        4 + //color         vec4f
        2 + //size          vec2f
        2 + //uvmin         vec2f
        2 + //uvmax         vec2f
        2 + //shapeIndex    vec2u
        2   //textureIndex  vec2u
    );
    wst.pyramidVertSize             = AlignUpCeil(Object.keys(pyramidVertData).length       * 4 , 4);
    wst.quadVertSize                = AlignUpCeil(Object.keys(quadVertData).length          * 4 , 4);
    wst.fullscreenQuadVertSize      = AlignUpCeil(Object.keys(fullscreenQuadData).length    * 4 , 4);
    wst.pyramidIndSize              = AlignUpCeil(Object.keys(pyramidIndData).length        * 2 , 4);
    wst.quadIndSize                 = AlignUpCeil(Object.keys(quadIndData).length           * 2 , 4);
    
    return wst;
}



//WASM SETUP AND DEFINTIONS

type WasmEnvImports = {
    memory: WebAssembly.Memory;
    memset(ptr: number, value: number, size: number): number;
    memcpy(dest: number, src: number, size: number): number;
    malloc(size: number): number;
    free(ptr: number): void;
    printStr(msgPtr: number): void;
    printChar(charValue: number): void;
    printInt(msgPtr: number, value: number): void;
    printFlt(msgPtr: number, value: number): void;
    printf(msgPtr: number): void;
    acosf(x: number): number;
    cosf(x: number): number;
    sinf(x: number): number;
    tanf(x: number): number;
    atan2(y: number, x: number) : number;
    fabsf(v: number) : number;
    timingNow(): number;
    AssertJS(expression : boolean, msg : number, file : number, line : number, func : number) : void;

};

type WasmImports = {
    env: WasmEnvImports;
};

type WasmExports = {
    __data_end: WebAssembly.Global;
    __heap_base: WebAssembly.Global;
    init() : void;
    update() : void;
    getPixelBuffer() : number;
    GetDrawCommands() : number;
    GetDrawCommandsShapesOffset() : number;
    GetDrawCommandsShapesCountOffset() : number;
    GetDrawCommandsTextOffset() : number;
    GetDrawCommandsTextCountOffset() : number;
    getTotalTime() : number;
    getDeltaTime() : number;
    initHeap(base : number) : void;
    setCurrentTime(ms : number) : void;
    SetWindowSize(width : number, height: number) : void;
    SetCanvasPixelInfo(pixelsPerMeter : number) : void;

    AppendMouseMoveEvent(mousex : number, mousey : number) : void;
    AppendKeyDownEvent(key : number) : void;
    AppendKeyUpEvent(key : number) : void;
    AppendMouseDownEvent(mousebutton : number) : void;
    AppendMouseUpEvent(mousebutton : number) : void;
    LoadFontFileFile(mem_ptr : number, size : number) : void;
    GetTexturePointer(type : number) : number;
    LoadFontMetricsFromJS(mem_ptr : number, size : number, fontIndex : number) : void;
};

function readCString(mem : Uint8Array, ptr: number) {
  let str = '';
  let i = ptr;
  while (mem[i] !== 0) {
    str += String.fromCharCode(mem[i]);
    i++;
  }
  return str;
}

// WebAssembly page size is always 64KB (65536 bytes)
const WASM_PAGE_SIZE = 64 * 1024; // 65536 bytes
const INITIAL_PAGES = 4096;  // 4096 * 64KB = 256MB
const MAX_PAGES = 4096;

// Calculate actual memory sizes
const INITIAL_MEMORY_SIZE = INITIAL_PAGES * WASM_PAGE_SIZE;
const MAX_MEMORY_SIZE = MAX_PAGES * WASM_PAGE_SIZE;
console.log(`initial memory: ${INITIAL_MEMORY_SIZE}`);
const wasmMemory = new WebAssembly.Memory({
  initial: INITIAL_PAGES, //16 * 64kb = 1mb
  maximum: INITIAL_PAGES, //must match the --max-memory value
  //4096*65536=268435456
});

const heapBase = 2 * (1024 * 1024);//game memory starts 1MB in
const fileBufferSize = 512 * 1024;
let fileBufferBase = heapBase - fileBufferSize;
console.log('initing fileBufferBase to: ', fileBufferBase);

let wasmMemU8 = new Uint8Array(wasmMemory.buffer);
let wasmMemU32 = new Uint32Array(wasmMemory.buffer);
let wasmMemF32 = new Float32Array(wasmMemory.buffer);

let drawCommandsMemOffset : number = 0;
let drawCommandsShapesOffset : number = 0;
let drawCommandsShapesCountOffset : number = 0;
let drawCommandsTextOffset : number = 0;
let drawCommandsTextCountOffset : number = 0;

const envImports: WasmEnvImports = {
    memory: wasmMemory,
    memset: (ptr, value, size) => {
        let mem = wasmMemU8;

        ptr = Number(ptr);
        size = Number(size);
        value = Number(value);

        // For small sizes, just do the loop
        if (size < 64) {
            for (let i = 0; i < size; i++) {
            mem[ptr + i] = value;
            }
            return ptr;
        }

        // For larger sizes, use fill() which is more optimized
        const targetArray = mem.subarray(ptr, ptr + size);
        targetArray.fill(value);

        return ptr;
    },

    memcpy: (dest, src, size) => {
        const mem = wasmMemU8;

        // console.log(destNum, srcNum, sizeNum);

        // Bounds checking (optional but recommended)
        if (dest < 0 || src < 0 || size < 0) {
            throw new Error('Invalid memory operation: negative values');
        }

        if (size < 64) {
            for (let i = 0; i < size; i++) {
            mem[dest + i] = mem[src + i];
            }
        } else {
            const srcArray = mem.subarray(src, src + size);
            mem.set(srcArray, dest);
        }

        return dest;
    },
    malloc: (size) => {
        //placeholder
        console.warn('malloc called but not implemented');
        return 0;
    },
    free: (ptr) => {
        console.warn('free called but not implemented');
    },
    printStr: (msg_ptr) => {
        const mem = wasmMemU8;
        let msg = readCString(mem, msg_ptr);
        console.log(msg);
    },
    printChar: (char_value) => {
        const charNum = typeof char_value === 'bigint' ? Number(char_value) : char_value;
        const char = String.fromCharCode(charNum);
        console.log(char);
    },
    printInt: (msg_ptr, value) => {
        const mem = wasmMemU8;
        //could do const instead of let
        let msg = readCString(mem, msg_ptr);
        console.log(`${msg}: ${value}`);
    },
    printFlt: (msg_ptr, value) => {
        const mem = wasmMemU8;
        let msg = readCString(mem, msg_ptr);
        console.log(`${msg}: ${value}`);
    },

    printf: (msg_ptr) => {
        const mem = wasmMemU8;
        let msg = readCString(mem, msg_ptr);
        console.log(`${msg}`);
    },

    // Arc cosine — JS Math.acos returns radians, same as C acosf
    acosf: (x) => Math.acos(x),
    cosf: (x) => Math.cos(x),
    sinf: (x) => Math.sin(x),
    tanf: (x) => Math.tan(x),
    atan2: (y,x) => Math.atan2(y,x),
    fabsf: (v) => Math.abs(v),

    timingNow: () => GetPerformanceNowSeconds(),
    AssertJS:(expression, msg_ptr, file_ptr, line, func_ptr) => {
        if(!expression){
            const mem = wasmMemU8;
            let msg  = readCString(mem, msg_ptr);
            let file = readCString(mem, file_ptr);
            let func = readCString(mem, func_ptr);
            let str = `ASSERT! ${msg} | FILE: ${file} | LINE: ${line} | FUNC: ${func}();`
            console.log(`${str}`);
            let err = new Error(str);
            MakeErrorDebugElement(err as Error);
            running = false;
            throw err;
        }
    },
    // UploadTextureArrayLayer(void* data, u32 pixelSize, u32 width, u32 height, u32 textureType, u32 textureArrayIndex);



};

const imports: WasmImports = {
    env: envImports,
};

async function InitWasm() : Promise<WebAssembly.Instance>{


    const path = './web_website.wasm';
    try{
        const result = await WebAssembly.instantiateStreaming(fetch(path), imports);
        // console.log(WebAssembly.Module.imports(result.module));
        // console.log(WebAssembly.Module.exports(result.module));
        return result.instance;

    }catch(err){
        const response = await fetch(path);
        const bytes = await response.arrayBuffer();
        console.log(`wasm size: ${bytes.byteLength}`);
        const result = await WebAssembly.instantiate(bytes, imports);
        // console.log(WebAssembly.Module.imports(result.module));
        // console.log(WebAssembly.Module.exports(result.module));
        return result.instance;
    }

}

let FontFileArrayBuffer : ArrayBuffer;
let FontFileU8Array : Uint8Array;
let FontFileSize : number;
async function LoadFontFileFromServer(path : string, wasmMemU8 : Uint8Array) {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    FontFileArrayBuffer = await response.arrayBuffer();
    FontFileU8Array = new Uint8Array(FontFileArrayBuffer);
    FontFileSize = FontFileU8Array.length >>> 0;
    console.log(`loaded FontFile file, size: ${FontFileSize}`);

    wasmMemU8.set(FontFileU8Array, fileBufferBase);
    // console.log(num32);
    // wasmExports.ProcessFontFileFile(fileBufferBase, num32);
    // console.log(`Loaded ${path}: ${FontFileU8Array.length} bytes`);


  } catch (error) {
    console.error('Failed to load file:', error);
  }
}



function AllocateFontMetricsMem(metrics : font_metrics){
    metrics.atlasSize = new Float32Array(2);
    metrics.nonStandardGlyphMappings = new Uint32Array(4);
    metrics.atlasSize = new Float32Array(2);
    metrics.leftSideBearing  = new Float32Array(MAX_ASCII);
    metrics.advanceWidth     = new Float32Array(MAX_ASCII);
    metrics.ymin             = new Float32Array(MAX_ASCII);
    metrics.ymax             = new Float32Array(MAX_ASCII);
    metrics.atlasMin         = new Float32Array(MAX_ASCII*2);
    metrics.atlasMax         = new Float32Array(MAX_ASCII*2);
}
function FillFontMetricsStruct(metrics : font_metrics, packedMetricsView : DataView){
   let readOffset = 0;
    metrics.size                         = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    metrics.atlasSize[0]                 = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    metrics.atlasSize[1]                 = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    metrics.ascent                       = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    metrics.descent                      = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    metrics.linegap                      = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    metrics.advanceWidthMax              = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    metrics.textureArrayIndex            = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    metrics.glyphCount                   = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    metrics.nonStandardGlyphMappings[0]  = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    metrics.nonStandardGlyphMappings[1]  = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    metrics.nonStandardGlyphMappings[2]  = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    metrics.nonStandardGlyphMappings[3]  = packedMetricsView.getUint32 (readOffset, true); readOffset += 4;
    for(let i = 0; i < metrics.glyphCount; i++){
        metrics.leftSideBearing[i]       = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        // console.log(`left side bearing ${i} : ${fontMetricsDefault.leftSideBearing[i]}`);
        metrics.advanceWidth   [i]       = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        // console.log(`advanceWidth ${i} : ${fontMetricsDefault.advanceWidth[i]}`);
        metrics.ymin           [i]       = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        metrics.ymax           [i]       = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        metrics.atlasMin       [i*2 + 0] = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        metrics.atlasMin       [i*2 + 1] = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        metrics.atlasMax       [i*2 + 0] = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
        metrics.atlasMax       [i*2 + 1] = packedMetricsView.getFloat32(readOffset, true); readOffset += 4;
    }
}

let fontMetricsDefault          : font_metrics = {} as font_metrics;
AllocateFontMetricsMem(fontMetricsDefault);

let fontMetricsDefaultSmaller   : font_metrics = {} as font_metrics;
AllocateFontMetricsMem(fontMetricsDefaultSmaller);

let fontAtlas = new Uint8Array(512*512);
const atlasView = new DataView(
    fontAtlas.buffer,
    fontAtlas.byteOffset,
    fontAtlas.byteLength,
);

let fontMetricsMax = (13 * 4) + (MAX_ASCII * 8 * 4); 
let fontMetricsMem      = new ArrayBuffer(fontMetricsMax);
let fontMetricsU8View   = new Uint8Array(fontMetricsMem);

let fontMetricsView = new DataView(
    fontMetricsU8View.buffer,
    fontMetricsU8View.byteOffset,
    fontMetricsU8View.byteLength,
);

async function main(){
    console.log("MAIN!");


    let wst : wgpu_state;
    try{
        wst = await InitWgpuState();
    }catch(error){
        MakeErrorDebugElement(error as Error);
        throw error;
    }

    configure(wst);

    // let wasm : WebAssembly.Instance;
    // try{
        // console.log("attempting to load wasm!");
        // wasm = await InitWasm();
    // }catch(error){
        // MakeErrorDebugElement(error as Error);
        // throw error;
    // }

    // let wasmExports : WasmExports = wasm.exports as WasmExports;

    // const dataEnd = Number(wasmExports.__data_end.value);
    // const heapBaseExport = Number(wasmExports.__heap_base.value);

    // console.log("__data_end =", dataEnd);
    // console.log("__heap_base =", heapBaseExport);

    // wasmExports.initHeap(heapBase);
    
    let currentTime = GetPerformanceNowSeconds();

    //LOAD TEXT HERE    
    // await LoadFontFileFromServer("./defaultFont.bin", wasmMemU8);


    // console.log(`js currentTime : ${currentTime}`);
    // wasmExports.setCurrentTime(currentTime);
    // wasmExports.SetWindowSize(canvas.width, canvas.height);
    // let ppm = canvas.getBoundingClientRect().height / 22;
    // wasmExports.init();
    // wasmExports.SetCanvasPixelInfo(ppm);

    //tell the engine to process the FontFile file
    
    //disable right click context menu on canvas
    canvas.addEventListener('contextmenu', (e) =>{
        e.preventDefault();    
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        mouseX = (e.clientX - rect.left) * dpr;
        mouseY = (e.clientY - rect.top) * dpr;

        // wasmExports.AppendMouseMoveEvent(mouseX, mouseY);
    });

    canvas.addEventListener('mousedown', (e) => {
        console.log(`mouse down ${e.button}`);
        const newLocal = mouseleft = 1;
        // wasmExports.AppendMouseDownEvent(e.button);

    });

    canvas.addEventListener('mouseup', (e) => {
        console.log(`mouse up ${e.button}`);
        mouseleft = 0;
        // wasmExports.AppendMouseUpEvent(e.button);

    });

    canvas.addEventListener('keydown', (e) => {
        console.log(`key down ${e.keyCode}`);
        // wasmExports.AppendKeyDownEvent(e.keyCode);

    });

    canvas.addEventListener('keyup', (e) => {
        console.log(`key up ${e.keyCode}`);
        // wasmExports.AppendKeyUpEvent(e.keyCode);

    });


    // drawCommandsMemOffset = wasmExports.GetDrawCommands();
    // console.log(`draw commands memory offset: ${drawCommandsMemOffset}`);



    wst.device.addEventListener("uncapturederror", (event) => {
        MakeErrorDebugElement(new Error(`Uncaptured WebGPU error: ${event.error.message}`));
        console.error("Uncaptured WebGPU error:", event.error); 
        running = false;
    });


    wst.deviceLimits = wst.device.limits;
    wst.queue = wst.device.queue;

    window.addEventListener("resize", (event) => {
        configure(wst);
        // wasmExports.SetWindowSize(canvas.width, canvas.height);

    });

    wst.patternTexture          = CreateTexture(wst, 256,            256,            1, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT, wst.textureFormat);
    wst.fontAtlasTextureArray   = CreateTexture(wst, 512,            512,            2, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT, "r8unorm");
    wst.screenSpaceTextureArray = CreateTexture(wst, 512,            512,            2, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT, wst.textureFormat);
    wst.captureTexture          = CreateTexture(wst, canvas.width,   canvas.height,  1, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT, wst.textureFormat);
    wst.offscreenTexture        = CreateTexture(wst, canvas.width,   canvas.height,  1, GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT, wst.textureFormat);
    populateTexMem(wst);
    wst.patternTextureView          = CreateTextureView(wst.patternTexture, 1);
    wst.fontAtlasTextureArrayView   = CreateTextureView(wst.fontAtlasTextureArray, 2);
    wst.screenSpaceTextureArrayView = CreateTextureView(wst.screenSpaceTextureArray, 2);
    wst.captureTextureView          = CreateTextureView(wst.captureTexture, 1);
    wst.offscreenTextureView        = CreateTextureView(wst.offscreenTexture, 1);

    CreateSampler(wst);
    CreateDepthTexture(wst);
    CreateDepthTextureView(wst);
    InitBuffers(wst);

    InitBindings3d(wst);
    InitPipeline3d(wst);

    InitBindingLayoutBlit(wst);
    InitPipelineBlit(wst);

    CreateScreenSpaceBindings(wst);
    ReloadBindGroupScreenSpaceTextures(wst);
    ReloadBindGroupScreenSpaceFont(wst);
    InitPipelineScreenSpace(wst);
    InitPipelineScreenSpaceTest(wst);

    // drawCommandsMemOffset           = wasmExports.GetDrawCommands();
    // drawCommandsShapesOffset        = drawCommandsMemOffset + wasmExports.GetDrawCommandsShapesOffset();
    // drawCommandsShapesCountOffset   = drawCommandsMemOffset + wasmExports.GetDrawCommandsShapesCountOffset();
    // drawCommandsTextOffset          = drawCommandsMemOffset + wasmExports.GetDrawCommandsTextOffset();
    // drawCommandsTextCountOffset     = drawCommandsMemOffset + wasmExports.GetDrawCommandsTextCountOffset();
    // console.log(`drawCommandsMemOffset          : ${drawCommandsMemOffset}`);
    // console.log(`drawCommandsShapesOffset       : ${drawCommandsShapesOffset}`);
    // console.log(`drawCommandsShapesCountOffset  : ${drawCommandsShapesCountOffset}`);
    // console.log(`drawCommandsTextOffset         : ${drawCommandsTextOffset}`);
    // console.log(`drawCommandsTextCountOffset    : ${drawCommandsTextCountOffset}`);
    //call update once as a test for debugging
    // wasmExports.setCurrentTime(currentTime);
    // wasmExports.update();
    

    // let fileOffset                  : number = 0;
    // console.log(`ReadFontFileBinary()`);

    // const fontFileView = new DataView(
    //     FontFileU8Array.buffer,
    //     FontFileU8Array.byteOffset,
    //     FontFileU8Array.byteLength,
    // );

    
    // const fontMagicNumber = fontFileView.getUint32(fileOffset, true);       fileOffset += 4;
    // if(fontMagicNumber != 0xFACFACFF){throw new Error("FONT MAGIC NUMBER IS NOT 0xFACRACFF !!");}
    // const fontVersionNumber = fontFileView.getUint32(fileOffset, true);     fileOffset += 4;
    // if(fontVersionNumber != 1){throw new Error("FONT VERSION NUMBER IS NOT 1 !!");}
    
    // console.log(`fileoffset before: ${fileOffset}`);
    
    // let atlasOffset = 0;
    // fileOffset = ReadFontFileBinaryAtlas(fontFileView, FontFileSize, fileOffset, atlasView, atlasOffset, 512*512);

    // wst.device.queue.writeTexture({
    //     texture: wst.fontAtlasTextureArray,
    //     mipLevel: 0,
    //     origin: {x: 0, y: 0, z: 0}
    // },
    // atlasView.buffer as ArrayBuffer,
    // {
    //     offset: 0,
    //     bytesPerRow: 512,
    //     rowsPerImage: 512,
    // },
    // {
    //     width: 512,
    //     height: 512,
    //     depthOrArrayLayers: 1,
    // });


    // Assert(fileOffset != -2, "FAILED TO READ BINARY FONT FILE ATLAS DEFAULT!");
    // fileOffset = ReadFontFileBinaryMetrics(fontFileView, FontFileSize, fileOffset, fontMetricsView);
    // Assert(fileOffset != -2, "FAILED TO READ BINARY FONT FILE! METRICS");

    // wasmMemU8.set(fontMetricsU8View, fileBufferBase);
    // let metricsSize = fontMetricsView.getUint32(0,true);
    // // wasmExports.LoadFontMetricsFromJS(fileBufferBase, metricsSize, 0);
    
    // FillFontMetricsStruct(fontMetricsDefault, fontMetricsView);



    // console.log(`begin smaller font data read:`);

    // fileOffset = ReadFontFileBinaryAtlas(fontFileView, FontFileSize, fileOffset, atlasView, atlasOffset, 512*512);
    
    // wst.device.queue.writeTexture({
    //     texture: wst.fontAtlasTextureArray,
    //     mipLevel: 0,
    //     origin: {x: 0, y: 0, z: 1}
    // },
    // atlasView.buffer as ArrayBuffer,
    // {
    //     offset: 0,
    //     bytesPerRow: 512,
    //     rowsPerImage: 512,
    // },
    // {
    //     width: 512,
    //     height: 512,
    //     depthOrArrayLayers: 1,
    // });

    // Assert(fileOffset != -2, "FAILED TO READ BINARY FONT FILE! ATLAS SMALLER");
    // fileOffset = ReadFontFileBinaryMetrics(fontFileView, FontFileSize, fileOffset, fontMetricsView);
    // Assert(fileOffset != -2, "FAILED TO READ BINARY FONT FILE! METRICS SMALLER");

    // console.log(`fileoffset after: ${fileOffset}`);


    // wasmMemU8.set(fontMetricsU8View, fileBufferBase);
    // let metricsSizeSmaller = fontMetricsView.getUint32(0,true);
    // wasmExports.LoadFontMetricsFromJS(fileBufferBase, metricsSizeSmaller, 1);

    // FillFontMetricsStruct(fontMetricsDefaultSmaller, fontMetricsView);
    
    //end smaller font unpacking

    mouseX = canvas.width * 0.5;
    mouseY = canvas.height * 0.5;

    //enter game loop
    gameLoop(wst/* , wasmExports */);
}




main().catch(err => {
    console.log("main catch error path");
    MakeErrorDebugElement(err);
});



function MakeErrorDebugElement(err: Error){

    
    const ui = document.getElementById("ui");
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.textContent = err.message;
    panel.style.color = "white";
    if(!ui)throw new Error("COULDNT GET UI ELEMENT!");
    ui.appendChild(panel);

}


function DrawText(wst : wgpu_state, metrics : font_metrics,   buf : string,xStart : number,yStart:number){
    let len = buf.length;
    let posX = 1 + xStart;
    let baseline    = metrics.ascent;
    let lineHeight  = metrics.ascent - metrics.descent + metrics.linegap;
    let lineNum = 0;
    // console.log(`DrawText() Web`);
    // console.log(`len:       ${len}`);
    // console.log(`posX:      ${posX}`);
    // console.log(`baseline:  ${baseline}`);
    // console.log(`lineHeight:${lineHeight}`);
    // console.log(`lineNum:   ${lineNum}`);

    for (let i = 0; i < len; i++)
    {
        // console.log(`index: ${i}, char: ${buf[i]}`);

        let c = buf.charCodeAt(i);
        if(c == 0)break;
        let index = c - 32;

        
        let lineStart = lineHeight * lineNum;  
        let startX = posX + metrics.leftSideBearing[index];

        if (c == 32)//c is space
        {
            posX += metrics.advanceWidth[index];
        }
        else
        {
            if(c == 10){//10 == newline == \n
                // Assert(!"NOT IMPLEMENTED!\n");
                index = metrics.nonStandardGlyphMappings[0];
                startX = posX + metrics.leftSideBearing[index];
                // posX = 1;
                // lineNum++;
                posX += metrics.advanceWidth[index];
                
            }else{
                posX += metrics.advanceWidth[index];
            }

            let startY = yStart + baseline + lineStart - metrics.ymax[index];
            
            // console.log(`yStart   : ${yStart}`);
            // console.log(`baseline : ${baseline}`);
            // console.log(`lineStart: ${lineStart}`);
            // console.log(`ymax     : ${metrics.ymax[index]}`);
            // console.log(`startY   : ${startY}`);

            let minx = metrics.atlasMin[index*2 + 0];
            let miny = metrics.atlasMin[index*2 + 1];
            let maxx = metrics.atlasMax[index*2 + 0];
            let maxy = metrics.atlasMax[index*2 + 1];

            let width = maxx - minx;
            let height =  maxy - miny;
            let posx = startX + width * 0.5;
            let posy = startY + height * 0.5;
            let sizex = width;
            let sizey = height;
            let texIndexx =  1;
            let texIndexy =  metrics.textureArrayIndex;
            let uvminx = minx / 512.0;
            let uvminy = miny / 512.0;
            let uvmaxx = maxx / 512.0;
            let uvmaxy = maxy / 512.0;

            // console.log(`width      :${width}`);
            // console.log(`height     :${height}`);
            // console.log(`posx       :${posx}`);
            // console.log(`posy       :${posy}`);
            // console.log(`sizex      :${sizex}`);
            // console.log(`sizey      :${sizey}`);
            // console.log(`texIndexx  :${texIndexx}`);
            // console.log(`texIndexy  :${texIndexy}`);
            // console.log(`uvminx     :${uvminx}`);
            // console.log(`uvminy     :${uvminy}`);
            // console.log(`uvmaxx     :${uvmaxx}`);
            // console.log(`uvmaxy     :${uvmaxy}`);
            color[0] = 1.0;
            color[1] = 1.0;
            color[2] = 1.0;
            color[3] = 1.0;
            let shapeIndex = 0;
            AppendInstance(wst, posx, posy, 0, sizex, sizey, color, uvminx, uvminy, uvmaxx, uvmaxy, shapeIndex, texIndexx, texIndexy);
        }
    }
    xStart = posX;
}




