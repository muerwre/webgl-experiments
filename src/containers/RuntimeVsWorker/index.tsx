import { useCallback, useEffect, useRef, useState } from "react";
import Worker from "../../workers/SampleWorker";
import WorkerBuilder from "../../workers/WorkerBuilder";
import styles from "./styles.module.scss";

const instance = new WorkerBuilder(Worker);

const drawDots = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  count: number,
  width: number,
  height: number
) => {
  for (let i = 0; i < count; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = "coral";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;

    ctx.arc(Math.random() * width, Math.random() * height, 4, 0, 360);
    ctx.fill();
    ctx.stroke();
  }
};

function RuntimeVsWorker() {
  const [counter, setCounter] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const listener = (event: MessageEvent) => {
      const ctx = canvas.current?.getContext("2d");

      if (!ctx) {
        console.log(`Can't get context, sorry`);
        return;
      }

      ctx.drawImage(event.data as ImageBitmap, 0, 0);
    };

    instance.onmessage = listener;

    return () => {
      instance.onmessage = null;
    };
  }, []);

  useEffect(() => {
    setCounter(0);
    const timeout = setInterval(() => {
      setCounter((v) => v + 1);
    }, 100);

    return () => clearInterval(timeout);
  }, []);

  const clearCanvas = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");

    if (!ctx) {
      return;
    }

    const { width, height } = canvas.current!.getBoundingClientRect();

    ctx.clearRect(0, 0, width, height);
  }, []);

  const dispatch = useCallback(async () => {
    if (!canvas.current) {
      return;
    }

    clearCanvas();

    const image = await createImageBitmap(canvas.current);

    instance.postMessage(image, { transfer: [image] });
  }, [clearCanvas]);

  const realtime = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");

    if (!ctx) {
      return;
    }

    clearCanvas();

    const { width, height } = canvas.current!.getBoundingClientRect();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drawDots(ctx, 200000, width, height);
      });
    });
  }, [clearCanvas]);

  return (
    <div className={styles.wrapper}>
      <div>
        <b>{counter}</b> &lt;&mdash; watch this timer
      </div>

      <div className={styles.canvas}>
        <canvas width="400" height="400" ref={canvas} />
      </div>

      <button onClick={realtime}>Runtime (blocking)</button>
      <button onClick={dispatch}>Worker (non-blocking)</button>
    </div>
  );
}

export default RuntimeVsWorker;
