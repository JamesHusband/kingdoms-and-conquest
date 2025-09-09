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

export function moveHeroAlongPath(
  hero: Hero,
  path: { x: number; y: number }[],
  maxSteps: number
): { newHero: Hero; actualPath: { x: number; y: number }[] } {
  const actualPath: { x: number; y: number }[] = [];
  let currentHero = { ...hero };
  let stepsMoved = 0;

  actualPath.push({ x: currentHero.x, y: currentHero.y });

  for (let i = 0; i < path.length && stepsMoved < maxSteps; i++) {
    const nextPoint = path[i];

    const movementCost = 1;

    if (currentHero.movementPoints >= movementCost) {
      currentHero = {
        ...currentHero,
        x: nextPoint.x,
        y: nextPoint.y,
        movementPoints: currentHero.movementPoints - movementCost,
      };
      actualPath.push({ x: nextPoint.x, y: nextPoint.y });
      stepsMoved++;
    } else {
      break;
    }
  }

  return { newHero: currentHero, actualPath };
}
