import React, { useState, useRef, useEffect } from "react";
import { useAdventure } from "@state/adventure";

export function AdventureHUD() {
  const { hero, currentTurn, selectedHero, endTurn } = useAdventure();
  const [position, setPosition] = useState({ x: 12, y: 12 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={panelRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        padding: 12,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
        fontSize: 14,
        minWidth: 200,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        border: "1px solid rgba(255,255,255,0.2)",
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
          Position: {Math.floor(hero.x / 32)},{Math.floor(hero.y / 32)}
        </div>
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
