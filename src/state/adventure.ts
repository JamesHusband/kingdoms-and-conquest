import { create } from "zustand";
import type { Hero } from "@rules/hero";
import { createHero, resetHeroMovement } from "@rules/hero";

export type AdventureState = {
  hero: Hero;
  currentTurn: number;
  selectedHero: Hero | null;
  endTurn: () => void;
  selectHero: (hero: Hero) => void;
};

export const useAdventure = create<AdventureState>((set, get) => ({
  hero: createHero("hero1", "Hero", 0, 0),
  currentTurn: 1,
  selectedHero: null,

  endTurn: () => {
    const state = get();
    const newHero = resetHeroMovement(state.hero);

    set({
      currentTurn: state.currentTurn + 1,
      hero: newHero,
      selectedHero: newHero,
    });
  },

  selectHero: (hero: Hero) => {
    set({ selectedHero: hero });
  },
}));
