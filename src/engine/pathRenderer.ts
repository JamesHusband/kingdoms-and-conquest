import { Graphics, Container, Text, TextStyle } from "pixi.js";
import type { PathResult, PathPoint } from "@rules/pathfinding";

export function createPathPreview(
  pathResult: PathResult,
  tileSize: number
): Container {
  const container = new Container();

  if (pathResult.path.length < 2) {
    return container;
  }

  const path = pathResult.path;
  const maxMovementPoints = 5; // This should come from hero data

  // Create path lines
  const pathGraphics = new Graphics();

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    // Determine line color based on movement cost
    const isWithinMovement = i < maxMovementPoints;
    const color = isWithinMovement ? 0xffffff : 0x8b0000; // White or dark red

    // Draw dashed line
    drawDashedLine(
      pathGraphics,
      current.x,
      current.y,
      next.x,
      next.y,
      color,
      4,
      4
    );
  }

  container.addChild(pathGraphics);

  // Add turn count label if path takes multiple turns
  if (pathResult.turnsNeeded > 1) {
    const labelStyle = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 12,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 2,
    });

    const label = new Text({
      text: `${pathResult.turnsNeeded} turns`,
      style: labelStyle,
    });

    // Position label at the end of the path
    const endPoint = path[path.length - 1];
    label.x = endPoint.x + 10;
    label.y = endPoint.y - 10;

    container.addChild(label);
  }

  return container;
}

function drawDashedLine(
  graphics: Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: number,
  dashLength: number,
  gapLength: number
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const dashCount = Math.floor(distance / (dashLength + gapLength));

  const unitX = dx / distance;
  const unitY = dy / distance;

  for (let i = 0; i < dashCount; i++) {
    const startX = x1 + (dashLength + gapLength) * i * unitX;
    const startY = y1 + (dashLength + gapLength) * i * unitY;
    const endX = startX + dashLength * unitX;
    const endY = startY + dashLength * unitY;

    graphics.moveTo(startX, startY);
    graphics.lineTo(endX, endY);
  }

  graphics.stroke({ width: 2, color });
}
