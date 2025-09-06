import type { Hero } from "./hero";

export interface PathPoint {
  x: number;
  y: number;
}

export interface PathResult {
  path: PathPoint[];
  totalCost: number;
  turnsNeeded: number;
  canReach: boolean;
}

export function findPath(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number,
  maxMovementPoints: number
): PathResult {
  const startX = Math.floor(hero.x / tileSize);
  const startY = Math.floor(hero.y / tileSize);
  const endX = Math.floor(targetX / tileSize);
  const endY = Math.floor(targetY / tileSize);

  // Simple A* pathfinding for grid-based movement
  const path = findGridPath(startX, startY, endX, endY);

  // Convert grid path back to world coordinates
  const worldPath = path.map((point) => ({
    x: point.x * tileSize + tileSize / 2,
    y: point.y * tileSize + tileSize / 2,
  }));

  const totalCost = path.length - 1; // Cost is number of moves
  const turnsNeeded = Math.ceil(totalCost / maxMovementPoints);
  const canReach = totalCost <= maxMovementPoints;

  return {
    path: worldPath,
    totalCost,
    turnsNeeded,
    canReach,
  };
}

function findGridPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): PathPoint[] {
  // Simple straight-line path for now (can be enhanced with A* later)
  const path: PathPoint[] = [];

  const dx = endX - startX;
  const dy = endY - startY;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  if (steps === 0) {
    return [{ x: startX, y: startY }];
  }

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(startX + dx * t);
    const y = Math.round(startY + dy * t);
    path.push({ x, y });
  }

  return path;
}

export function getPathSegmentCost(
  path: PathPoint[],
  startIndex: number,
  maxCost: number
): number {
  let cost = 0;
  for (let i = startIndex; i < path.length - 1; i++) {
    cost++;
    if (cost >= maxCost) break;
  }
  return cost;
}
