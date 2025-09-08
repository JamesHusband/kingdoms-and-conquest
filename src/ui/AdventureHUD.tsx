import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAdventure } from "@state/adventure";

export function AdventureHUD() {
  const { hero, currentTurn, selectedHero, endTurn } = useAdventure();
  const [position, setPosition] = useState({ x: 12, y: 12 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleEndTurn = () => {
    if (hero.movementPoints > 0) {
      setShowConfirmDialog(true);
    } else {
      endTurn();
    }
  };

  const confirmEndTurn = () => {
    endTurn();
    setShowConfirmDialog(false);
  };

  const cancelEndTurn = () => {
    setShowConfirmDialog(false);
  };

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
        onClick={handleEndTurn}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4a9eff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        End Turn
      </button>

      {showConfirmDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.9)",
              color: "#fff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>
              End Turn Confirmation
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "14px" }}>
              One or more of your heroes still has movement points. Are you sure
              you want to end your turn?
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={confirmEndTurn}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4a9eff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Yes, End Turn
              </button>
              <button
                onClick={cancelEndTurn}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
