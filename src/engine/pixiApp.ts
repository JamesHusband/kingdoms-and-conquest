import { Application } from "pixi.js";

export async function createPixiApp(canvas: HTMLCanvasElement) {
  const app = new Application();
  await app.init({
    view: canvas,
    resizeTo: window,
    antialias: false,
    backgroundAlpha: 0, // Make canvas transparent
  });
  return app;
}
