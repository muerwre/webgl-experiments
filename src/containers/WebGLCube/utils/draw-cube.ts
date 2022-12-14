import { createShader } from "./create-shader";
import vxShader from "./vertex.glsl?raw";
import fgShader from "./fragment.glsl?raw";

// learn this: https://gamedev.stackexchange.com/questions/153078/what-can-i-do-with-the-4th-component-of-gl-position
// https://open.gl/transformations
// 1. https://www.youtube.com/watch?v=kB0ZVUrI4Aw
// 2. https://www.youtube.com/watch?v=3yLL9ADo-ko
export const drawCube = (
  gl: WebGL2RenderingContext,
  width: number,
  height: number
) => {
  // Initializing viewport
  gl.viewport(0, 0, width, height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const prg = gl.createProgram();
  if (!prg) {
    throw new Error("Can't init programm");
  }

  // Setting up VERTEX and FRAGMENT shaders
  const vx = createShader(gl, vxShader, gl.VERTEX_SHADER);
  gl.attachShader(prg, vx);
  const fx = createShader(gl, fgShader, gl.FRAGMENT_SHADER);
  gl.attachShader(prg, fx);
  gl.linkProgram(prg);

  if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
    throw new Error("Could not initialise shaders");
  }

  const vertexPosition = gl.getAttribLocation(prg, "aVertexPosition");

  const vertices = [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
    -1, 1, 1,
  ];

  const indices = [
    2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
    3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
  ];

  //The following code snippet creates a vertex buffer and binds the vertices to it
  const squareVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  //The following code snippet creates a vertex buffer and binds the indices to it
  const squareIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  // drawing
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.enable(gl.DEPTH_TEST);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, width, height);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  let i = 0;
  let speed = 0.01;

  return () => {
    gl.useProgram(prg);

    const angle = i * 3.14;
    const scale = i * 0.25 + 0.25;

    gl.uniform1f(gl.getUniformLocation(prg, "slide"), scale);
    gl.uniform1f(gl.getUniformLocation(prg, "aspect"), height / width);
    gl.uniform4fv(gl.getUniformLocation(prg, "rotation"), [
      Math.cos(angle),
      -Math.sin(angle),
      Math.sin(angle),
      Math.cos(angle),
    ]);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    if (i > 1 || i < 0) {
      speed = -speed;
    }

    i += speed;
  };
};
