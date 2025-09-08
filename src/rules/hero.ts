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
    movementPoints: 20,
    maxMovementPoints: 20,
  };
}

export function resetHeroMovement(hero: Hero): Hero {
  return {
    ...hero,
    movementPoints: hero.maxMovementPoints,
  };
}
