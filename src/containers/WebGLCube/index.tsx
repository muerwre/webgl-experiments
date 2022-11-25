import { FC, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { drawCube } from "./utils/draw-cube";

interface WebGLCubeProps {}

const WebGLCube: FC<WebGLCubeProps> = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("webgl2");

    if (!ctx || !canvas.current) {
      return;
    }

    const draw = drawCube(ctx, canvas.current.width, canvas.current.height);
    let interval = 0;

    const startLoop = () =>
      requestAnimationFrame(() => {
        draw();
        interval = startLoop();
      });

    interval = startLoop();

    return () => cancelAnimationFrame(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas width="600" height="400" ref={canvas} className={styles.canvas} />
    </div>
  );
};

export { WebGLCube as WebGLSquare };
