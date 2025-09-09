import type { Hero } from "./hero";

export interface PathPoint {
  x: number;
  y: number;
}

export function findPath(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number
): PathPoint[] {
  const startX = Math.floor(hero.x / tileSize);
  const startY = Math.floor(hero.y / tileSize);
  const endX = Math.floor(targetX / tileSize);
  const endY = Math.floor(targetY / tileSize);

  const path = findGridPath(startX, startY, endX, endY);

  const worldPath = path.map((point) => ({
    x: point.x * tileSize + tileSize / 2,
    y: point.y * tileSize + tileSize / 2,
  }));

  return worldPath;
}

function findGridPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): PathPoint[] {
  const path: PathPoint[] = [];

  const dx = endX - startX;
  const dy = endY - startY;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  if (steps === 0) {
    return [{ x: startX, y: startY }];
  }

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(startX + dx * t);
    const y = Math.round(startY + dy * t);
    path.push({ x, y });
  }

  return path;
}
