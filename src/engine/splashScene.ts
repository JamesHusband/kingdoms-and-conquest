import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";

export function createSplashScene(app: Application) {
  const scene = new Container();

  // Background
  const bg = new Graphics();
  bg.rect(0, 0, app.screen.width, app.screen.height);
  bg.fill(0x1a1a2e); // Dark blue background
  scene.addChild(bg);

  // Developer title
  const devTitleStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 36,
    fill: 0xffffff,
    stroke: 0x4a4a4a,
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  const devTitle = new Text({
    text: "FantaKuchen",
    style: devTitleStyle,
  });
  devTitle.anchor.set(0.5);
  devTitle.x = app.screen.width / 2;
  devTitle.y = app.screen.height / 2 - 80;
  scene.addChild(devTitle);

  // Game title
  const titleStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 32,
    fill: 0xcccccc,
    stroke: 0x333333,
    strokeThickness: 1,
  });

  const title = new Text({
    text: "presents",
    style: titleStyle,
  });
  title.anchor.set(0.5);
  title.x = app.screen.width / 2;
  title.y = app.screen.height / 2 - 30;
  scene.addChild(title);

  // Game subtitle
  const gameTitleStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 28,
    fill: 0xffffff,
    stroke: 0x4a4a4a,
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 3,
  });

  const gameTitle = new Text({
    text: "KINGDOMS & CONQUEST",
    style: gameTitleStyle,
  });
  gameTitle.anchor.set(0.5);
  gameTitle.x = app.screen.width / 2;
  gameTitle.y = app.screen.height / 2 + 20;
  scene.addChild(gameTitle);

  // Subtitle
  const subtitleStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 16,
    fill: 0xaaaaaa,
  });

  const subtitle = new Text({
    text: "A Heroes of Might & Magic inspired adventure",
    style: subtitleStyle,
  });
  subtitle.anchor.set(0.5);
  subtitle.x = app.screen.width / 2;
  subtitle.y = app.screen.height / 2 + 60;
  scene.addChild(subtitle);

  // Loading bar background
  const loadingBarBg = new Graphics();
  loadingBarBg.rect(
    app.screen.width / 2 - 150,
    app.screen.height / 2 + 100,
    300,
    8
  );
  loadingBarBg.fill(0x333333);
  scene.addChild(loadingBarBg);

  // Loading bar fill
  const loadingBarFill = new Graphics();
  loadingBarFill.rect(
    app.screen.width / 2 - 150,
    app.screen.height / 2 + 100,
    0,
    8
  );
  loadingBarFill.fill(0x4a9eff);
  scene.addChild(loadingBarFill);

  // Loading text
  const loadingStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 14,
    fill: 0x888888,
  });

  const loading = new Text({
    text: "Loading...",
    style: loadingStyle,
  });
  loading.anchor.set(0.5);
  loading.x = app.screen.width / 2;
  loading.y = app.screen.height / 2 + 130;
  scene.addChild(loading);

  // Animated loading dots and progress bar
  let dotCount = 0;
  let progress = 0;
  const loadingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    progress = Math.min(progress + Math.random() * 15, 100);

    loading.text = "Loading" + ".".repeat(dotCount);

    // Update progress bar
    loadingBarFill.clear();
    loadingBarFill.rect(
      app.screen.width / 2 - 150,
      app.screen.height / 2 + 100,
      (300 * progress) / 100,
      8
    );
    loadingBarFill.fill(0x4a9eff);

    // Complete loading when progress reaches 100%
    if (progress >= 100) {
      clearInterval(loadingInterval);
      loading.text = "Ready!";
    }
  }, 200);

  // Store interval for cleanup
  (scene as any).loadingInterval = loadingInterval;

  return scene;
}
