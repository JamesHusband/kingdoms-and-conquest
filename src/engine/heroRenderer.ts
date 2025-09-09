import { Graphics, Container } from "pixi.js";
import type { Hero } from "@rules/hero";

interface HeroContainer extends Container {
  heroData: Hero;
  selectionHighlight: Graphics;
}

export function createHeroSprite(hero: Hero, tileSize: number): Container {
  const container = new Container();

  const selectionHighlight = new Graphics();
  selectionHighlight.circle(0, 0, tileSize * 0.4);
  selectionHighlight.stroke({ width: 3, color: 0xffff00 });
  selectionHighlight.visible = false;

  const body = new Graphics();
  body.circle(0, 0, tileSize * 0.3);
  body.fill(0x4a9eff);
  body.stroke({ width: 2, color: 0xffffff });

  container.x = hero.x;
  container.y = hero.y;

  container.addChild(selectionHighlight);
  container.addChild(body);

  (container as HeroContainer).heroData = hero;
  (container as HeroContainer).selectionHighlight = selectionHighlight;

  return container;
}

export function updateHeroPosition(heroSprite: Container, hero: Hero): void {
  heroSprite.x = hero.x;
  heroSprite.y = hero.y;
  (heroSprite as HeroContainer).heroData = hero;

  heroSprite.visible = true;
  heroSprite.alpha = 1;

  if (heroSprite.parent) {
    heroSprite.parent.sortChildren();
  }
}

export function updateHeroSelection(
  heroSprite: Container,
  isSelected: boolean
): void {
  const selectionHighlight = (heroSprite as HeroContainer).selectionHighlight;
  if (selectionHighlight) {
    selectionHighlight.visible = isSelected;
  }
}
