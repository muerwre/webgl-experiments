export const createShader = (
  gl: WebGL2RenderingContext,
  sourceCode: string,
  type: number
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(`Can't init shader`);
  }

  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    throw `Could not compile WebGL program. \n\n${info}`;
  }

  return shader;
};
