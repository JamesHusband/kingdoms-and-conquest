import { create } from "zustand";

type PlayerID = string;
export type GameState = {
  day: number;
  currentPlayer: PlayerID;
  players: PlayerID[];
  endTurn: () => void;
};

export const useGame = create<GameState>((set, get) => ({
  day: 1,
  players: ["p1"],
  currentPlayer: "p1",
  endTurn: () => {
    const day = get().day + 1;
    set({ day });
    // TODO: weekly growth on day % 7 === 1, reset movement, income tick, etc.
  },
}));
