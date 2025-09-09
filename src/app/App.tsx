import { useEffect, useRef, useState } from "react";
import { createPixiApp } from "@engine/pixiApp";
import { createAdventureScene } from "@engine/adventureScene";
import { createSplashScene } from "@engine/splashScene";
import { createMainMenuScene } from "@engine/mainMenuScene";
import {
  createSceneManager,
  addScene,
  addSceneCreator,
  switchToScene,
} from "@engine/sceneManager";
import { createAudioState, loadSound, playMusic } from "@engine/audio";
import { HUD } from "@ui/HUD";
import { AdventureHUD } from "@ui/AdventureHUD";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const [currentScene, setCurrentScene] = useState<string>("splash");

  useEffect(() => {
    if (!canvasRef.current) return;
    let app: any;
    (async () => {
      app = await createPixiApp(canvasRef.current);

      // Create scene manager with callback
      let sceneManager = createSceneManager(app, (sceneName) => {
        setCurrentScene(sceneName);
      });
      let audioState = createAudioState();

      // Create initial scenes (splash and main menu)
      const splashScene = createSplashScene(app);
      const mainMenuScene = createMainMenuScene(app, () => {
        // New Game button clicked - stop menu music and switch to adventure scene
        if (audioState.currentMusic) {
          audioState.currentMusic.pause();
          audioState.currentMusic.currentTime = 0;
        }
        sceneManager = switchToScene(sceneManager, "adventure");
      });

      // Add initial scenes to manager
      sceneManager = addScene(sceneManager, "splash", splashScene);
      sceneManager = addScene(sceneManager, "mainMenu", mainMenuScene);

      // Add scene creator for adventure scene (lazy loading)
      sceneManager = addSceneCreator(sceneManager, "adventure", () => {
        const { root } = createAdventureScene(app);
        // Don't enable panning - we want click-to-move instead
        return root;
      });

      // Start with splash screen
      sceneManager = switchToScene(sceneManager, "splash");

      // After 3 seconds, switch to main menu and start music
      setTimeout(async () => {
        // Load and play menu music
        try {
          audioState = await loadSound(
            audioState,
            "menuMusic",
            "/src/assets/menu-music.mp3"
          );
          audioState = playMusic(audioState, "menuMusic");
        } catch (error) {
          console.warn("Could not load menu music:", error);
        }

        sceneManager = switchToScene(sceneManager, "mainMenu");
      }, 3000);

      // Enable panning only for adventure scene
      // enablePanning(app.stage, canvasRef.current);
    })();
    return () => app?.destroy?.();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* Background div that fills entire screen */}
      <div
        ref={backgroundRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#0f0f23",
          backgroundImage:
            currentScene === "adventure"
              ? "none"
              : "url('/src/assets/menu-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {currentScene === "adventure" ? <AdventureHUD /> : <HUD />}
    </div>
  );
}
