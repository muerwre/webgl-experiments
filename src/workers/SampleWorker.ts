export default () => {
  const drawDots = (
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    count: number,
    width: number,
    height: number
  ) => {
    for (let i = 0; i < count; i += 1) {
      ctx.beginPath();
      ctx.fillStyle = "cyan";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.5;

      ctx.arc(Math.random() * width, Math.random() * height, 4, 0, 360);
      ctx.fill();
      ctx.stroke();
    }
  };

  self.onmessage = (message: MessageEvent) => {
    const data = message.data;

    if (!(data instanceof ImageBitmap)) {
      return;
    }

    const canvas = new OffscreenCanvas(data.width, data.height);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error(`Can't get context`);
    }

    ctx.drawImage(data, 0, 0);

    drawDots(ctx, 200000, data.width, data.height);

    createImageBitmap(canvas).then((image) => {
      self.postMessage(image, { transfer: [image] });
    });
  };
};
