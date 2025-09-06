export interface Hero {
  id: string;
  name: string;
  x: number;
  y: number;
  movementPoints: number;
  maxMovementPoints: number;
}

export function createHero(
  id: string,
  name: string,
  x: number,
  y: number
): Hero {
  return {
    id,
    name,
    x,
    y,
    movementPoints: 5,
    maxMovementPoints: 5,
  };
}

export function moveHero(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number
): Hero {
  const distance = Math.abs(targetX - hero.x) + Math.abs(targetY - hero.y);
  const movementCost = Math.ceil(distance / tileSize);

  if (movementCost <= hero.movementPoints) {
    return {
      ...hero,
      x: targetX,
      y: targetY,
      movementPoints: hero.movementPoints - movementCost,
    };
  }

  return hero; // Can't move, return unchanged
}

export function resetHeroMovement(hero: Hero): Hero {
  return {
    ...hero,
    movementPoints: hero.maxMovementPoints,
  };
}

export function canHeroMove(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number
): boolean {
  const distance = Math.abs(targetX - hero.x) + Math.abs(targetY - hero.y);
  const movementCost = Math.ceil(distance / tileSize);
  return movementCost <= hero.movementPoints;
}
