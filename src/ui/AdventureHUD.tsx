import { useAdventure } from "@state/adventure";

export function AdventureHUD() {
  const { hero, currentTurn, selectedHero, pathPreview, plannedPath, endTurn } =
    useAdventure();

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        padding: 12,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
        fontSize: 14,
        minWidth: 200,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <strong>Turn {currentTurn}</strong>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div>
          <strong>{hero.name}</strong>
          {selectedHero && (
            <span style={{ color: "#4a9eff", marginLeft: 8 }}>● Selected</span>
          )}
        </div>
        <div>
          Movement: {hero.movementPoints}/{hero.maxMovementPoints}
        </div>
        <div>
          Position: ({Math.floor(hero.x / 32)}, {Math.floor(hero.y / 32)})
        </div>
        {pathPreview && (
          <div
            style={{
              color: pathPreview.canReach ? "#4a9eff" : "#ff6b6b",
              marginTop: 4,
            }}
          >
            Current: {pathPreview.totalCost} moves, {pathPreview.turnsNeeded}{" "}
            turn
            {pathPreview.turnsNeeded > 1 ? "s" : ""}
          </div>
        )}
        {plannedPath && plannedPath !== pathPreview && (
          <div
            style={{
              color: "#ffa500",
              marginTop: 4,
            }}
          >
            Planned: {plannedPath.totalCost} moves, {plannedPath.turnsNeeded}{" "}
            turn
            {plannedPath.turnsNeeded > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <button
        onClick={endTurn}
        disabled={hero.movementPoints === hero.maxMovementPoints}
        style={{
          padding: "8px 16px",
          backgroundColor:
            hero.movementPoints === hero.maxMovementPoints ? "#666" : "#4a9eff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor:
            hero.movementPoints === hero.maxMovementPoints
              ? "not-allowed"
              : "pointer",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        End Turn
      </button>
    </div>
  );
}
