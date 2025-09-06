import { create } from "zustand";
import type { Hero } from "@rules/hero";
import type { PathResult } from "@rules/pathfinding";
import { createHero, moveHero, resetHeroMovement } from "@rules/hero";
import { findPath } from "@rules/pathfinding";

export type AdventureState = {
  hero: Hero;
  currentTurn: number;
  selectedHero: Hero | null;
  pathPreview: PathResult | null;
  plannedPath: PathResult | null; // Persistent path across turns
  endTurn: () => void;
  selectHero: (hero: Hero) => void;
  previewPath: (targetX: number, targetY: number, tileSize: number) => void;
  clearPathPreview: () => void;
  executeMovement: (tileSize: number) => void;
  setPlannedPath: (path: PathResult | null) => void;
};

export const useAdventure = create<AdventureState>((set, get) => ({
  hero: createHero("hero1", "Hero", 640, 360), // Start at center of screen
  currentTurn: 1,
  selectedHero: null,
  pathPreview: null,
  plannedPath: null,

  endTurn: () => {
    const state = get();
    const newHero = resetHeroMovement(state.hero);

    // Recalculate the remaining path from the new hero position
    let updatedPlannedPath = null;
    if (state.plannedPath && state.plannedPath.path.length > 0) {
      // Find where the hero is in the planned path and slice from there
      const heroIndex = state.plannedPath.path.findIndex(
        (point) =>
          Math.abs(point.x - state.hero.x) < 1 &&
          Math.abs(point.y - state.hero.y) < 1
      );

      if (heroIndex >= 0 && heroIndex < state.plannedPath.path.length - 1) {
        const remainingPath = state.plannedPath.path.slice(heroIndex + 1);
        if (remainingPath.length > 0) {
          updatedPlannedPath = {
            ...state.plannedPath,
            path: remainingPath,
            totalCost: remainingPath.length - 1,
            turnsNeeded: Math.ceil(
              (remainingPath.length - 1) / newHero.maxMovementPoints
            ),
          };
        }
      }
    }

    set({
      currentTurn: state.currentTurn + 1,
      hero: newHero,
      selectedHero: newHero, // Keep hero selected
      pathPreview: updatedPlannedPath, // Show remaining path
      plannedPath: updatedPlannedPath, // Update planned path
    });
  },

  selectHero: (hero: Hero) => {
    set({ selectedHero: hero });
  },

  previewPath: (targetX: number, targetY: number, tileSize: number) => {
    const state = get();
    if (!state.selectedHero) return;

    const pathResult = findPath(
      state.selectedHero,
      targetX,
      targetY,
      tileSize,
      state.selectedHero.maxMovementPoints
    );
    set({
      pathPreview: pathResult,
      plannedPath: pathResult, // Store the full planned path
    });
  },

  clearPathPreview: () => {
    set({ pathPreview: null });
  },

  executeMovement: (tileSize: number) => {
    const state = get();
    console.log("executeMovement called:", {
      hasSelectedHero: !!state.selectedHero,
      hasPathPreview: !!state.pathPreview,
      movementPoints: state.selectedHero?.movementPoints,
      pathLength: state.pathPreview?.path.length,
    });

    if (!state.selectedHero || !state.pathPreview) {
      console.log("executeMovement: Missing selectedHero or pathPreview");
      return;
    }

    // Move hero to the first reachable point in the path
    const maxMoves = state.selectedHero.movementPoints;
    const targetPoint =
      state.pathPreview.path[
        Math.min(maxMoves, state.pathPreview.path.length - 1)
      ];

    console.log(
      "Moving hero from",
      state.selectedHero.x,
      state.selectedHero.y,
      "to",
      targetPoint.x,
      targetPoint.y
    );

    const newHero = moveHero(
      state.selectedHero,
      targetPoint.x,
      targetPoint.y,
      tileSize
    );

    // Calculate remaining path after movement
    const remainingPath = state.pathPreview.path.slice(maxMoves);
    const remainingPathResult =
      remainingPath.length > 0
        ? {
            ...state.pathPreview,
            path: remainingPath,
            totalCost: remainingPath.length - 1,
            turnsNeeded: Math.ceil(
              (remainingPath.length - 1) / newHero.maxMovementPoints
            ),
          }
        : null;

    set({
      hero: newHero,
      selectedHero: newHero,
      pathPreview: remainingPathResult,
      plannedPath: remainingPathResult,
    });
  },

  setPlannedPath: (path: PathResult | null) => {
    set({ plannedPath: path });
  },
}));
