import { Graphics, Container } from "pixi.js";
import type { Hero } from "@rules/hero";

export function createHeroSprite(hero: Hero, tileSize: number): Container {
  const container = new Container();

  // Selection highlight (initially hidden)
  const selectionHighlight = new Graphics();
  selectionHighlight.circle(0, 0, tileSize * 0.4);
  selectionHighlight.stroke({ width: 3, color: 0xffff00 }); // Yellow highlight
  selectionHighlight.visible = false;

  // Hero body (simple circle for now)
  const body = new Graphics();
  body.circle(0, 0, tileSize * 0.3);
  body.fill(0x4a9eff); // Blue color
  body.stroke({ width: 2, color: 0xffffff });

  // Hero position
  container.x = hero.x;
  container.y = hero.y;

  container.addChild(selectionHighlight);
  container.addChild(body);

  // Store references for easy access
  (container as any).heroData = hero;
  (container as any).selectionHighlight = selectionHighlight;

  return container;
}

export function updateHeroPosition(heroSprite: Container, hero: Hero): void {
  console.log("updateHeroPosition called:", {
    oldX: heroSprite.x,
    oldY: heroSprite.y,
    newX: hero.x,
    newY: hero.y,
  });
  heroSprite.x = hero.x;
  heroSprite.y = hero.y;
  (heroSprite as any).heroData = hero;
  console.log("Hero sprite position updated to:", heroSprite.x, heroSprite.y);
}

export function updateHeroSelection(
  heroSprite: Container,
  isSelected: boolean
): void {
  const selectionHighlight = (heroSprite as any).selectionHighlight;
  if (selectionHighlight) {
    selectionHighlight.visible = isSelected;
  }
}
