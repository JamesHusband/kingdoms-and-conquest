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

export function resetHeroMovement(hero: Hero): Hero {
  return {
    ...hero,
    movementPoints: hero.maxMovementPoints,
  };
}

export function moveHero(
  hero: Hero,
  targetX: number,
  targetY: number,
  tileSize: number
): Hero {
  const deltaX = Math.abs(targetX - hero.x);
  const deltaY = Math.abs(targetY - hero.y);
  const movementCost =
    Math.round(deltaX / tileSize) + Math.round(deltaY / tileSize);

  if (movementCost <= hero.movementPoints) {
    return {
      ...hero,
      x: targetX,
      y: targetY,
      movementPoints: hero.movementPoints - movementCost,
    };
  }

  return hero;
}
