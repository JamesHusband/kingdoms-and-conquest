import { createMachine } from "xstate";

export const gameMachine = createMachine({
  id: "game",
  initial: "adventure",
  states: {
    adventure: {
      on: { OPEN_TOWN: "town", START_BATTLE: "battle", END_TURN: "endTurn" },
    },
    town: { on: { EXIT_TOWN: "adventure" } },
    battle: { on: { BATTLE_RESOLVED: "adventure" } },
    endTurn: { always: "adventure" },
  },
});
