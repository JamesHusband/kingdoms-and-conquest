import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { createHeroSprite, updateHeroSelection } from "@engine/heroRenderer";
import { createPathPreview } from "@engine/pathRenderer";
import { useAdventure } from "@state/adventure";

function gridToWorld(gridX: number, gridY: number, tileSize: number) {
  return {
    x: gridX * tileSize + tileSize / 2,
    y: gridY * tileSize + tileSize / 2,
  };
}

function createGridBackground(
  cols: number,
  rows: number,
  tileSize: number
): Graphics {
  const tiles = new Graphics();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const shade = (x + y) % 2 === 0 ? 0x2b2b2b : 0x333333;
      tiles.rect(x * tileSize, y * tileSize, tileSize, tileSize).fill(shade);
    }
  }
  return tiles;
}

function createGridLabels(
  cols: number,
  rows: number,
  tileSize: number,
  root: Container
): void {
  const labelStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fill: 0xffffff,
    stroke: { width: 1, color: 0x000000 },
  });

  for (let x = 0; x < Math.min(cols, 52); x++) {
    const label = new Text({ text: x.toString(), style: labelStyle });
    label.x = x * tileSize + tileSize / 2 - 6;
    label.y = 2;
    root.addChild(label);
  }

  for (let y = 0; y < Math.min(rows, 50); y++) {
    const label = new Text({ text: y.toString(), style: labelStyle });
    label.x = 2;
    label.y = y * tileSize + tileSize / 2 - 6;
    root.addChild(label);
  }
}

function createHero(
  centerX: number,
  centerY: number,
  tileSize: number
): Container {
  const { hero } = useAdventure.getState();
  const heroSprite = createHeroSprite(hero, tileSize);
  const centerWorld = gridToWorld(centerX, centerY, tileSize);
  heroSprite.x = centerWorld.x;
  heroSprite.y = centerWorld.y;

  const { hero: currentHero } = useAdventure.getState();
  if (currentHero.x !== centerWorld.x || currentHero.y !== centerWorld.y) {
    useAdventure.setState({
      hero: { ...currentHero, x: centerWorld.x, y: centerWorld.y },
    });
  }

  return heroSprite;
}

function setupClickHandling(
  root: Container,
  heroSprite: Container,
  pathContainer: Container,
  tileSize: number
): void {
  root.interactive = true;
  root.on("pointerdown", (event) => {
    const { selectHero } = useAdventure.getState();
    const localPos = event.data.getLocalPosition(root);

    const targetX = Math.floor(localPos.x / tileSize) * tileSize + tileSize / 2;
    const targetY = Math.floor(localPos.y / tileSize) * tileSize + tileSize / 2;

    const heroDistance = Math.sqrt(
      (localPos.x - heroSprite.x) ** 2 + (localPos.y - heroSprite.y) ** 2
    );

    if (heroDistance < tileSize * 0.5) {
      selectHero(useAdventure.getState().hero);
      updateHeroSelection(heroSprite, true);
      pathContainer.removeChildren();
      return;
    }

    const { selectedHero } = useAdventure.getState();
    if (selectedHero) {
      pathContainer.removeChildren();

      const heroGridX = Math.floor(selectedHero.x / tileSize);
      const heroGridY = Math.floor(selectedHero.y / tileSize);
      const targetGridX = Math.floor(targetX / tileSize);
      const targetGridY = Math.floor(targetY / tileSize);
      const deltaX = Math.abs(targetGridX - heroGridX);
      const deltaY = Math.abs(targetGridY - heroGridY);
      const cost = Math.max(deltaX, deltaY);

      const pathSprite = createPathPreview(
        selectedHero,
        targetX,
        targetY,
        tileSize,
        selectedHero.movementPoints
      );
      pathContainer.addChild(pathSprite);
    }
  });
}

export function createAdventureScene(app: Application, opts = { tile: 32 }) {
  const root = new Container();
  const cols = Math.ceil(app.screen.width / opts.tile);
  const rows = Math.ceil(app.screen.height / opts.tile);

  const gridBackground = createGridBackground(cols, rows, opts.tile);
  root.addChild(gridBackground);

  createGridLabels(cols, rows, opts.tile, root);

  const pathContainer = new Container();
  root.addChild(pathContainer);

  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  const heroSprite = createHero(centerX, centerY, opts.tile);
  root.addChild(heroSprite);

  setupClickHandling(root, heroSprite, pathContainer, opts.tile);

  return { root, tileSize: opts.tile, heroSprite, pathContainer };
}
