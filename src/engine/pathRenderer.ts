import { Graphics, Container, Text, TextStyle } from "pixi.js";
import { findPath } from "@rules/pathfinding";
import type { Hero } from "@rules/hero";

export function createPathPreview(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number,
  currentMovementPoints: number = 5
): Container {
  const container = new Container();

  const path = findPath(hero, targetX, targetY, tileSize);

  if (path.length < 2) {
    return container;
  }

  const cost = path.length;

  const pathGraphics = new Graphics();

  const endPoint = path[path.length - 1];

  for (let i = 0; i < path.length; i++) {
    const current = path[i];

    const color = i < currentMovementPoints ? 0xffffff : 0xff0000;

    const dashLength = tileSize * 0.8;
    const dashWidth = 4;

    pathGraphics.rect(
      current.x - dashLength / 2,
      current.y - dashWidth / 2,
      dashLength,
      dashWidth
    );
    pathGraphics.fill(color);
  }

  container.addChild(pathGraphics);

  const labelStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fill: cost <= currentMovementPoints ? 0x00ff00 : 0xff0000,
    stroke: { width: 1, color: 0x000000 },
  });

  const label = new Text({
    text: `${cost} MP`,
    style: labelStyle,
  });

  label.x = endPoint.x + 10;
  label.y = endPoint.y - 10;

  container.addChild(label);

  return container;
}
