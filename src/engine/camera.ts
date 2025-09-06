import { Container } from "pixi.js";

export function enablePanning(stage: Container, canvas: HTMLCanvasElement) {
  let dragging = false,
    lastX = 0,
    lastY = 0;
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("mouseup", () => (dragging = false));
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX,
      dy = e.clientY - lastY;
    stage.x += dx;
    stage.y += dy;
    lastX = e.clientX;
    lastY = e.clientY;
  });
}
