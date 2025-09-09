import {
  Graphics,
  Container,
  Text,
  TextStyle,
  FederatedPointerEvent,
} from "pixi.js";
import { findPath } from "@rules/pathfinding";
import type { Hero } from "@rules/hero";

export function createPathPreview(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number,
  currentMovementPoints: number = 5,
  onPathConfirm?: () => void
): Container {
  const container = new Container();

  const path = findPath(hero, targetX, targetY, tileSize);

  if (path.length < 2) {
    return container;
  }

  const cost = path.length;
  const endPoint = path[path.length - 1];

  for (let i = 0; i < path.length; i++) {
    const current = path[i];
    const isAvailable = i < currentMovementPoints;
    const color = isAvailable ? 0xffffff : 0xff0000;

    let direction = { x: 0, y: 0 };
    if (i < path.length - 1) {
      const next = path[i + 1];
      direction = {
        x: next.x - current.x,
        y: next.y - current.y,
      };
    } else if (i > 0) {
      const prev = path[i - 1];
      direction = {
        x: current.x - prev.x,
        y: current.y - prev.y,
      };
    }

    const arrowGraphics = createDirectionalArrow(
      current,
      direction,
      color,
      tileSize
    );
    container.addChild(arrowGraphics);
  }

  const labelStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    fontWeight: "bold",
    fill: cost <= currentMovementPoints ? 0x00ff00 : 0xff0000,
    stroke: { width: 2, color: 0x000000 },
    dropShadow: {
      color: 0x000000,
      blur: 2,
      angle: Math.PI / 4,
      distance: 1,
    },
  });

  const label = new Text({
    text: `${cost} MP`,
    style: labelStyle,
  });

  label.x = endPoint.x + 15;
  label.y = endPoint.y - 15;
  label.anchor.set(0, 0.5);

  container.addChild(label);

  // Add clickable X marker at the end of the path
  const xMarker = createXMarker(endPoint, tileSize, onPathConfirm);
  container.addChild(xMarker);

  return container;
}

export function createPathPreviewFromCurrentPosition(
  hero: Hero,
  path: { x: number; y: number }[],
  _target: { x: number; y: number },
  tileSize: number,
  currentMovementPoints: number = 5,
  onPathConfirm?: () => void
): Container {
  const container = new Container();

  if (path.length < 2) {
    return container;
  }

  // Find the hero's current position in the path
  let heroIndex = -1;
  for (let i = 0; i < path.length; i++) {
    const point = path[i];
    if (Math.abs(point.x - hero.x) < 1 && Math.abs(point.y - hero.y) < 1) {
      heroIndex = i;
      break;
    }
  }

  // If hero is not found in path, or at the end, return empty container
  if (heroIndex === -1 || heroIndex >= path.length - 1) {
    return container;
  }

  // Create path from hero's current position
  const remainingPath = path.slice(heroIndex + 1);
  const cost = remainingPath.length;
  const endPoint = remainingPath[remainingPath.length - 1];

  for (let i = 0; i < remainingPath.length; i++) {
    const current = remainingPath[i];
    const isAvailable = i < currentMovementPoints;
    const color = isAvailable ? 0xffffff : 0xff0000;

    let direction = { x: 0, y: 0 };
    if (i < remainingPath.length - 1) {
      const next = remainingPath[i + 1];
      direction = {
        x: next.x - current.x,
        y: next.y - current.y,
      };
    } else if (i > 0) {
      const prev = remainingPath[i - 1];
      direction = {
        x: current.x - prev.x,
        y: current.y - prev.y,
      };
    }

    const arrowGraphics = createDirectionalArrow(
      current,
      direction,
      color,
      tileSize
    );
    container.addChild(arrowGraphics);
  }

  const labelStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    fontWeight: "bold",
    fill: cost <= currentMovementPoints ? 0x00ff00 : 0xff0000,
    stroke: { width: 2, color: 0x000000 },
    dropShadow: {
      color: 0x000000,
      blur: 2,
      angle: Math.PI / 4,
      distance: 1,
    },
  });

  const label = new Text({
    text: `${cost} MP`,
    style: labelStyle,
  });

  label.x = endPoint.x + 15;
  label.y = endPoint.y - 15;
  label.anchor.set(0, 0.5);

  container.addChild(label);

  // Add clickable X marker at the end of the path
  const xMarker = createXMarker(endPoint, tileSize, onPathConfirm);
  container.addChild(xMarker);

  return container;
}

function createDirectionalArrow(
  position: { x: number; y: number },
  direction: { x: number; y: number },
  color: number,
  tileSize: number
): Graphics {
  const graphics = new Graphics();

  const length = Math.sqrt(
    direction.x * direction.x + direction.y * direction.y
  );
  if (length === 0) {
    direction = { x: 1, y: 0 };
  } else {
    direction = { x: direction.x / length, y: direction.y / length };
  }

  const arrowSize = tileSize * 0.3;
  const arrowWidth = arrowSize * 0.6;

  const tipX = position.x + direction.x * arrowSize;
  const tipY = position.y + direction.y * arrowSize;

  const baseX = position.x - direction.x * arrowSize * 0.3;
  const baseY = position.y - direction.y * arrowSize * 0.3;

  const perpX = -direction.y * arrowWidth;
  const perpY = direction.x * arrowWidth;

  const leftWingX = baseX + perpX;
  const leftWingY = baseY + perpY;
  const rightWingX = baseX - perpX;
  const rightWingY = baseY - perpY;

  graphics.beginFill(color);
  graphics.lineStyle(1, 0x000000, 0.8);

  graphics.moveTo(tipX, tipY);
  graphics.lineTo(leftWingX, leftWingY);
  graphics.lineTo(baseX, baseY);
  graphics.lineTo(rightWingX, rightWingY);
  graphics.lineTo(tipX, tipY);

  graphics.endFill();

  return graphics;
}

function createXMarker(
  position: { x: number; y: number },
  tileSize: number,
  onClick?: () => void
): Graphics {
  const graphics = new Graphics();

  const markerSize = tileSize * 0.6;
  const lineWidth = 6;

  graphics.beginFill(0xffffff, 0.9);
  graphics.lineStyle(3, 0x000000, 1);
  graphics.drawCircle(position.x, position.y, markerSize * 0.8);
  graphics.endFill();

  graphics.lineStyle(lineWidth, 0xff0000, 1);

  const halfSize = markerSize * 0.5;
  graphics.moveTo(position.x - halfSize, position.y - halfSize);
  graphics.lineTo(position.x + halfSize, position.y + halfSize);
  graphics.moveTo(position.x + halfSize, position.y - halfSize);
  graphics.lineTo(position.x - halfSize, position.y + halfSize);

  graphics.interactive = true;
  graphics.cursor = "pointer";

  graphics.on("pointerover", () => {
    graphics.clear();

    graphics.beginFill(0xffff00, 0.9);
    graphics.lineStyle(4, 0x000000, 1);
    graphics.drawCircle(position.x, position.y, markerSize * 0.8);
    graphics.endFill();

    graphics.lineStyle(lineWidth + 2, 0xff0000, 1);
    graphics.moveTo(position.x - halfSize, position.y - halfSize);
    graphics.lineTo(position.x + halfSize, position.y + halfSize);
    graphics.moveTo(position.x + halfSize, position.y - halfSize);
    graphics.lineTo(position.x - halfSize, position.y + halfSize);
  });

  graphics.on("pointerout", () => {
    graphics.clear();

    graphics.beginFill(0xffffff, 0.9);
    graphics.lineStyle(3, 0x000000, 1);
    graphics.drawCircle(position.x, position.y, markerSize * 0.8);
    graphics.endFill();

    graphics.lineStyle(lineWidth, 0xff0000, 1);
    graphics.moveTo(position.x - halfSize, position.y - halfSize);
    graphics.lineTo(position.x + halfSize, position.y + halfSize);
    graphics.moveTo(position.x + halfSize, position.y - halfSize);
    graphics.lineTo(position.x - halfSize, position.y + halfSize);
  });

  if (onClick) {
    graphics.on("pointerdown", (event: FederatedPointerEvent) => {
      event.stopPropagation();
      console.log("X marker clicked!");
      onClick();
    });
  } else {
    console.log("X marker created without onClick callback");
  }

  return graphics;
}
