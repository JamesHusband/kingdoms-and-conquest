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
    });

    if (state.currentPath && state.currentTarget) {
      setTimeout(() => {
        const currentState = get();
        if (
          currentState.refreshPathDisplay &&
          currentState.currentPath &&
          currentState.currentTarget
        ) {
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

    if (state.selectedHero) {
      const remainingPath = path;

      if (remainingPath.length === 0) {
        set({ currentPath: null, currentTarget: null });
        return;
      }

      const { newHero, actualPath } = moveHeroAlongPath(
        state.selectedHero,
        remainingPath,
        maxSteps
      );

      const stepsConsumed = Math.max(0, actualPath.length - 1);

      const newRemainingPath = remainingPath.slice(stepsConsumed);

      const reachedEnd = newRemainingPath.length === 0;
      const hasNoMovementPoints = newHero.movementPoints === 0;
      const shouldClearPath = reachedEnd && hasNoMovementPoints;

      set({
        hero: newHero,
        selectedHero: newHero,
        currentPath: shouldClearPath ? null : state.currentPath,
        currentTarget: shouldClearPath ? null : state.currentTarget,
      });
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
    if (callback) {
      callback();
    }
  },
}));
