import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import {
  createHeroSprite,
  updateHeroSelection,
  updateHeroPosition,
} from "@engine/heroRenderer";
import {
  createPathPreview,
  createPathPreviewFromCurrentPosition,
} from "@engine/pathRenderer";
import { useAdventure } from "@state/adventure";
import { findPath } from "@rules/pathfinding";

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

function refreshPathDisplay(
  heroSprite: Container,
  pathContainer: Container,
  tileSize: number
): void {
  const { selectedHero, currentPath, currentTarget } = useAdventure.getState();

  if (!selectedHero || !currentPath || !currentTarget) {
    // Clear any existing path display when there's no current path
    pathContainer.removeChildren();
    return;
  }

  // Double-check that the path still exists (it might have been cleared between the check and now)
  const currentState = useAdventure.getState();
  if (!currentState.currentPath || !currentState.currentTarget) {
    pathContainer.removeChildren();
    return;
  }

  // Clear existing path display
  pathContainer.removeChildren();

  // Create updated path preview from current position
  const pathSprite = createPathPreviewFromCurrentPosition(
    selectedHero,
    currentPath,
    currentTarget,
    tileSize,
    selectedHero.movementPoints,
    () => {
      continuePathMovement(heroSprite, pathContainer, tileSize, currentTarget);
    }
  );

  pathContainer.addChild(pathSprite);
}

function continuePathMovement(
  heroSprite: Container,
  pathContainer: Container,
  tileSize: number,
  target: { x: number; y: number }
): void {
  const { selectedHero, currentPath, moveHeroAlongPath } =
    useAdventure.getState();

  if (!selectedHero || !currentPath) {
    return;
  }

  let heroIndex = -1;
  for (let i = 0; i < currentPath.length; i++) {
    const point = currentPath[i];
    if (
      Math.abs(point.x - selectedHero.x) < 1 &&
      Math.abs(point.y - selectedHero.y) < 1
    ) {
      heroIndex = i;
      break;
    }
  }

  const remainingPath =
    heroIndex >= 0 ? currentPath.slice(heroIndex + 1) : currentPath;

  moveHeroAlongPath(remainingPath, selectedHero.movementPoints);

  const { selectedHero: updatedHero, currentPath: newPath } =
    useAdventure.getState();

  if (updatedHero) {
    console.log(
      "About to update hero position from",
      selectedHero.x,
      selectedHero.y,
      "to",
      updatedHero.x,
      updatedHero.y
    );
    updateHeroPosition(heroSprite, updatedHero);
    console.log("Hero position updated, checking if path needs updating");

    if (newPath) {
      pathContainer.removeChildren();
      const pathSprite = createPathPreviewFromCurrentPosition(
        updatedHero,
        newPath,
        target,
        tileSize,
        updatedHero.movementPoints,
        () => continuePathMovement(heroSprite, pathContainer, tileSize, target)
      );
      pathContainer.addChild(pathSprite);
    } else {
      // Path completed - clear the path display and don't create any new path preview
      pathContainer.removeChildren();
      console.log("Path completed, hero should be at final destination");
      console.log("Final hero position:", updatedHero.x, updatedHero.y);
      return; // Exit early to prevent any further processing
    }
  } else {
    console.log("No updatedHero found");
  }
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

    const { selectedHero, setCurrentPath, clearCurrentPath } =
      useAdventure.getState();
    if (selectedHero) {
      pathContainer.removeChildren();

      clearCurrentPath();

      const path = findPath(selectedHero, targetX, targetY, tileSize);

      const pathSprite = createPathPreview(
        selectedHero,
        targetX,
        targetY,
        tileSize,
        selectedHero.movementPoints,
        () => {
          setCurrentPath(path, { x: targetX, y: targetY });

          continuePathMovement(heroSprite, pathContainer, tileSize, {
            x: targetX,
            y: targetY,
          });
        }
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
  pathContainer.interactive = true;
  root.addChild(pathContainer);

  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  const heroSprite = createHero(centerX, centerY, opts.tile);
  root.addChild(heroSprite);

  setupClickHandling(root, heroSprite, pathContainer, opts.tile);

  // Set up path refresh callback
  useAdventure.setState({
    refreshPathDisplay: (callback?: () => void) => {
      if (callback) {
        callback();
      } else {
        refreshPathDisplay(heroSprite, pathContainer, opts.tile);
      }
    },
  });

  return { root, tileSize: opts.tile, heroSprite, pathContainer };
}
