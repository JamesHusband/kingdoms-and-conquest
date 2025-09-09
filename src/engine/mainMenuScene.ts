import { Application, Container, Text, TextStyle } from "pixi.js";

export function createMainMenuScene(app: Application, onNewGame?: () => void) {
  const scene = new Container();

  const titleStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 42,
    fill: 0xffffff,
    stroke: 0x4a4a4a,
    dropShadow: true,
  });

  const title = new Text({
    text: "KINGDOMS & CONQUEST",
    style: titleStyle,
  });
  title.anchor.set(0.5);
  title.x = app.screen.width / 2;
  title.y = 120;
  scene.addChild(title);

  const buttonStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 24,
    fill: 0xffffff,
    stroke: 0x333333,
  });

  const buttonHoverStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 24,
    fill: 0xffff00,
    stroke: 0x666666,
  });

  const menuItems = [
    { text: "New Game", y: 250 },
    { text: "Load Game", y: 300 },
    { text: "Options", y: 350 },
    { text: "Exit", y: 400 },
  ];

  menuItems.forEach((item, index) => {
    const button = new Text({
      text: item.text,
      style: buttonStyle,
    });
    button.anchor.set(0.5);
    button.x = app.screen.width / 2;
    button.y = item.y;
    button.interactive = true;
    button.cursor = "pointer";

    button.on("pointerover", () => {
      button.style = buttonHoverStyle;
    });
    button.on("pointerout", () => {
      button.style = buttonStyle;
    });

    button.on("pointerdown", () => {
      switch (index) {
        case 0:
          if (onNewGame) {
            onNewGame();
          }
          break;
        case 1:
          console.log("Load Game clicked");
          break;
        case 2:
          console.log("Options clicked");
          break;
        case 3:
          window.close();
          break;
      }
    });

    scene.addChild(button);
  });

  const versionStyle = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 12,
    fill: 0x666666,
  });

  const version = new Text({
    text: "v0.1.0 - Development Build",
    style: versionStyle,
  });
  version.anchor.set(0.5);
  version.x = app.screen.width / 2;
  version.y = app.screen.height - 30;
  scene.addChild(version);

  return scene;
}
