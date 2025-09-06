import { Application, Container } from "pixi.js";

export type SceneName = "splash" | "mainMenu" | "adventure" | "town" | "battle";

export type SceneState = {
  app: Application;
  currentScene: Container | null;
  scenes: Map<SceneName, Container>;
  sceneCreators: Map<SceneName, () => Container>;
  onSceneChange?: (sceneName: SceneName) => void;
};

export function createSceneManager(
  app: Application,
  onSceneChange?: (sceneName: SceneName) => void
): SceneState {
  return {
    app,
    currentScene: null,
    scenes: new Map(),
    sceneCreators: new Map(),
    onSceneChange,
  };
}

export function addScene(
  state: SceneState,
  name: SceneName,
  scene: Container
): SceneState {
  return {
    ...state,
    scenes: new Map(state.scenes).set(name, scene),
  };
}

export function addSceneCreator(
  state: SceneState,
  name: SceneName,
  creator: () => Container
): SceneState {
  return {
    ...state,
    sceneCreators: new Map(state.sceneCreators).set(name, creator),
  };
}

export function switchToScene(state: SceneState, name: SceneName): SceneState {
  // Remove current scene
  if (state.currentScene) {
    state.app.stage.removeChild(state.currentScene);
  }

  // Get or create the scene
  let newScene = state.scenes.get(name);
  if (!newScene) {
    // Try to create the scene using a creator function
    const creator = state.sceneCreators.get(name);
    if (creator) {
      newScene = creator();
      // Cache the created scene
      const newScenes = new Map(state.scenes);
      newScenes.set(name, newScene);
      state = { ...state, scenes: newScenes };
    }
  }

  if (newScene) {
    state.app.stage.addChild(newScene);
  }

  const newState = {
    ...state,
    currentScene: newScene || null,
  };

  // Trigger scene change callback
  if (state.onSceneChange) {
    state.onSceneChange(name);
  }

  return newState;
}

export function getCurrentScene(state: SceneState): Container | null {
  return state.currentScene;
}
