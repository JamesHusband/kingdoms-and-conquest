import { Application, Container, Graphics } from "pixi.js";
import {
  createHeroSprite,
  updateHeroPosition,
  updateHeroSelection,
} from "@engine/heroRenderer";
import { createPathPreview } from "@engine/pathRenderer";
import { useAdventure } from "@state/adventure";

export function createAdventureScene(app: Application, opts = { tile: 32 }) {
  const root = new Container();

  // Calculate cols and rows based on app.screen dimensions to fill the entire screen
  const cols = Math.ceil(app.screen.width / opts.tile);
  const rows = Math.ceil(app.screen.height / opts.tile);

  // simple generated checkerboard map
  const g = new Graphics();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const shade = (x + y) % 2 === 0 ? 0x2b2b2b : 0x333333;
      g.rect(x * opts.tile, y * opts.tile, opts.tile, opts.tile).fill(shade);
    }
  }
  root.addChild(g);

  // Add hero
  const { hero } = useAdventure.getState();
  const heroSprite = createHeroSprite(hero, opts.tile);
  root.addChild(heroSprite);

  // Path preview container
  const pathContainer = new Container();
  root.addChild(pathContainer);

  // Track click state for second click execution
  let hasPathPreview = false;

  // Make the root interactive for click handling
  root.interactive = true;
  root.on("pointerdown", (event) => {
    const {
      selectedHero,
      selectHero,
      previewPath,
      executeMovement,
      clearPathPreview,
    } = useAdventure.getState();
    const localPos = event.data.getLocalPosition(root);

    // Snap to tile grid
    const targetX =
      Math.floor(localPos.x / opts.tile) * opts.tile + opts.tile / 2;
    const targetY =
      Math.floor(localPos.y / opts.tile) * opts.tile + opts.tile / 2;

    // Check if clicking on hero
    const heroDistance = Math.sqrt(
      (localPos.x - hero.x) ** 2 + (localPos.y - hero.y) ** 2
    );
    if (heroDistance < opts.tile * 0.5) {
      // Clicked on hero - select it
      selectHero(hero);
      updateHeroSelection(heroSprite, true);
      clearPathPreview();
      pathContainer.removeChildren();
      hasPathPreview = false;
      return;
    }

    if (selectedHero) {
      const { pathPreview } = useAdventure.getState();

      console.log("Click state:", {
        hasPathPreview,
        pathPreview: !!pathPreview,
        targetX,
        targetY,
      });

      if (pathPreview && hasPathPreview) {
        // Second click - execute movement (click anywhere to execute)
        console.log("Executing movement...");
        executeMovement(opts.tile);

        // Get the updated hero from state after movement
        const { hero: updatedHero } = useAdventure.getState();
        console.log("Updated hero position:", updatedHero.x, updatedHero.y);
        updateHeroPosition(heroSprite, updatedHero);
        updateHeroSelection(heroSprite, true); // Keep selection highlight

        // Keep path preview for remaining movement
        pathContainer.removeChildren();
        const { pathPreview: remainingPath } = useAdventure.getState();
        if (remainingPath) {
          const pathSprite = createPathPreview(remainingPath, opts.tile);
          pathContainer.addChild(pathSprite);
        }
        hasPathPreview = remainingPath !== null;
      } else {
        // First click - show path preview
        console.log("Showing path preview...");
        previewPath(targetX, targetY, opts.tile);

        // Update path preview display
        pathContainer.removeChildren();
        const { pathPreview: newPathPreview } = useAdventure.getState();
        if (newPathPreview) {
          const pathSprite = createPathPreview(newPathPreview, opts.tile);
          pathContainer.addChild(pathSprite);
        }
        hasPathPreview = newPathPreview !== null;
      }
    }
  });

  return { root, tileSize: opts.tile, heroSprite, pathContainer };
}
