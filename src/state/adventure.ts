import { create } from "zustand";
import type { Hero } from "@rules/hero";
import { createHero, resetHeroMovement, moveHeroAlongPath } from "@rules/hero";

export type AdventureState = {
  hero: Hero;
  currentTurn: number;
  selectedHero: Hero | null;
  currentPath: { x: number; y: number }[] | null;
  currentTarget: { x: number; y: number } | null;
  endTurn: () => void;
  selectHero: (hero: Hero) => void;
  moveHeroAlongPath: (
    path: { x: number; y: number }[],
    maxSteps: number
  ) => void;
  setCurrentPath: (
    path: { x: number; y: number }[],
    target: { x: number; y: number }
  ) => void;
  clearCurrentPath: () => void;
  refreshPathDisplay: (callback?: () => void) => void;
};

export const useAdventure = create<AdventureState>((set, get) => ({
  hero: createHero("hero1", "Hero", 0, 0),
  currentTurn: 1,
  selectedHero: null,
  currentPath: null,
  currentTarget: null,

  endTurn: () => {
    const state = get();
    const newHero = resetHeroMovement(state.hero);

    set({
      currentTurn: state.currentTurn + 1,
      hero: newHero,
      selectedHero: newHero,
      // Keep the current path and target - they will be updated by the UI
    });

    // Trigger path display refresh if there's an active path
    if (state.currentPath && state.currentTarget) {
      // Call the refresh function to update the path display
      setTimeout(() => {
        const currentState = get();
        if (currentState.refreshPathDisplay) {
          currentState.refreshPathDisplay();
        }
      }, 0);
    }
  },

  selectHero: (hero: Hero) => {
    set({ selectedHero: hero });
  },

  moveHeroAlongPath: (path: { x: number; y: number }[], maxSteps: number) => {
    const state = get();
    console.log(
      "moveHeroAlongPath called with path length:",
      path.length,
      "maxSteps:",
      maxSteps
    );
    console.log(
      "Current state - selectedHero:",
      !!state.selectedHero,
      "currentPath:",
      !!state.currentPath,
      "currentTarget:",
      !!state.currentTarget
    );

    if (state.selectedHero) {
      // Consider the provided path to be the remaining path from the hero's current position
      const remainingPath = path;

      if (remainingPath.length === 0) {
        // Already at the end
        console.log("No remaining path, clearing current path");
        set({ currentPath: null, currentTarget: null });
        return;
      }

      console.log(
        "Moving along remaining path of length:",
        remainingPath.length
      );

      const { newHero, actualPath } = moveHeroAlongPath(
        state.selectedHero,
        remainingPath,
        maxSteps
      );

      // Steps consumed this tick (actualPath includes starting position)
      const stepsConsumed = Math.max(0, actualPath.length - 1);

      // New remaining path after consuming steps
      const newRemainingPath = remainingPath.slice(stepsConsumed);

      const reachedEnd = newRemainingPath.length === 0;

      set({
        hero: newHero,
        selectedHero: newHero,
        currentPath: reachedEnd ? null : state.currentPath, // Keep the full path
        currentTarget: reachedEnd ? null : state.currentTarget,
      });

      console.log(
        "After movement - reachedEnd:",
        reachedEnd,
        "newRemainingPath length:",
        newRemainingPath.length
      );
      console.log(
        "Setting currentPath to:",
        newRemainingPath.length > 0
          ? `${newRemainingPath.length} steps`
          : "null"
      );

      console.log("Hero moved along path:", actualPath);
    }
  },

  setCurrentPath: (
    path: { x: number; y: number }[],
    target: { x: number; y: number }
  ) => {
    set({
      currentPath: path,
      currentTarget: target,
    });
  },

  clearCurrentPath: () => {
    set({
      currentPath: null,
      currentTarget: null,
    });
  },

  refreshPathDisplay: (callback?: () => void) => {
    // This function will be called by the UI to refresh the path display
    if (callback) {
      callback();
    }
    console.log("Path display refresh requested");
  },
}));
