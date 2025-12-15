// src/components/Matrix.tsx

import React, { useMemo, useState, useRef, useEffect } from "react";
import type { Capability, Project } from "../types/matrix";

interface TooltipData {
  project: Project;
  capability: Capability;
  score: number;
  x: number;
  y: number;
}

interface CellTooltipProps {
  data: TooltipData | null;
  onClose: () => void;
}

const CellTooltip: React.FC<CellTooltipProps> = ({ data, onClose }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listeners for click outside
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [data, onClose]);

  if (!data) return null;

  // Format score: relevance_score * 100, rounded to 1 decimal
  const formattedScore = (data.score * 100).toFixed(1);

  // Calculate tooltip position (prefer above, but adjust if near viewport edges)
  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    left: `${data.x}px`,
    top: `${data.y - 10}px`,
    transform: "translate(-50%, -100%)",
    background: "#333",
    color: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
    zIndex: 1000,
    maxWidth: "280px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    pointerEvents: "auto",
  };

  // Adjust if tooltip would go off top of screen
  if (data.y < 150) {
    tooltipStyle.top = `${data.y + 25}px`;
    tooltipStyle.transform = "translate(-50%, 0)";
  }

  return (
    <div ref={tooltipRef} style={tooltipStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
            {data.project.name}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#ccc", marginBottom: "0.5rem" }}>
            {data.capability.label}
          </div>
          <div style={{ fontWeight: 500 }}>
            Score: {formattedScore}
          </div>
          {/* Future-ready: room for additional content */}
          {/* <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#ccc" }}>
            [Reason text or additional content here]
          </div> */}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.25rem",
            lineHeight: 1,
            padding: 0,
            opacity: 0.7,
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close tooltip"
        >
          ×
        </button>
      </div>
      {/* Tooltip arrow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: data.y < 150 ? "-6px" : "auto",
          top: data.y >= 150 ? "-6px" : "auto",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: data.y < 150 ? "6px solid #333" : "none",
          borderBottom: data.y >= 150 ? "6px solid #333" : "none",
        }}
      />
    </div>
  );
};

interface MatrixProps {
  projects: Project[];
  capabilities: Capability[];
  values: number[][];
  isLoading?: boolean;
  error?: string | null;
}

export const Matrix: React.FC<MatrixProps> = ({
  projects,
  capabilities,
  values,
  isLoading = false,
  error = null,
}) => {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect if device supports touch
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);
  const { minScore, maxScore } = useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (let r = 0; r < values.length; r += 1) {
      for (let c = 0; c < (values[r]?.length ?? 0); c += 1) {
        const v = values[r][c];
        if (!Number.isFinite(v)) continue;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { minScore: 0, maxScore: 0 };
    }

    return { minScore: min, maxScore: max };
  }, [values]);

  const normalizeScore = (score: number): number => {
    if (!Number.isFinite(score) || maxScore === minScore) {
      return 0;
    }
    return (score - minScore) / (maxScore - minScore);
  };

  // Simple blue tint using HSL.
  // Feel free to swap in Rare brand hex-based mixing later.
  const getCellColor = (score: number): string => {
    const t = normalizeScore(score); // 0–1
    const lightness = 95 - t * 45; // 95% (very light) -> 50% (strong)
    const saturation = 60; // %
    const hue = 205; // "blueish"
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  if (isLoading) {
    return <div>Loading matrix…</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading matrix: {error}</div>;
  }

  if (!projects.length || !capabilities.length) {
    return <div>No matrix data available.</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      {/* Simple title/legend area */}
      <div style={{ marginBottom: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>AI Opportunity Map – Solutions Matrix</h2>
        <p style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: "#555" }}>
          Each square shows how relevant an AI capability is for a given
          project. Darker blue indicates higher relevance.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `minmax(160px, 240px) repeat(${capabilities.length}, 1fr)`,
          borderCollapse: "collapse",
          border: "1px solid #e0e0e0",
          fontSize: "0.75rem",
        }}
      >
        {/* Top-left corner cell */}
        <div
          style={{
            position: "sticky",
            left: 0,
            zIndex: 2,
            background: "#fafafa",
            borderBottom: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
            padding: "0.5rem",
            fontWeight: 600,
          }}
        >
          Project / Capability
        </div>

        {/* Column headers */}
        {capabilities.map((cap) => (
          <div
            key={cap.id}
            style={{
              padding: "0.25rem 0.5rem",
              borderBottom: "1px solid #e0e0e0",
              fontWeight: 600,
              background: "#fafafa",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              minHeight: "80px",
              height: "100%",
            }}
            title={cap.label}
          >
            {cap.label}
          </div>
        ))}

        {/* Rows */}
        {projects.map((project, rowIndex) => (
          <React.Fragment key={project.id}>
            {/* Row header */}
            <div
              style={{
                position: "sticky",
                left: 0,
                zIndex: 1,
                background: "#ffffff",
                borderBottom: "1px solid #f0f0f0",
                borderRight: "1px solid #e0e0e0",
                padding: "0.25rem 0.5rem",
                fontWeight: 500,
                maxHeight: "3rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={project.name}
            >
              {project.name}
            </div>

            {/* Cells */}
            {capabilities.map((cap, colIndex) => {
              const rawScore = values[rowIndex]?.[colIndex];
              const hasScore = Number.isFinite(rawScore);
              const bgColor = hasScore
                ? getCellColor(rawScore as number)
                : "#ffffff";

              const handleCellInteraction = (
                event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
              ) => {
                if (!hasScore) return;

                const rect = event.currentTarget.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top;

                setTooltipData({
                  project,
                  capability: cap,
                  score: rawScore as number,
                  x,
                  y,
                });
              };

              const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
                if (!isTouchDevice && hasScore) {
                  handleCellInteraction(event);
                }
              };

              const handleMouseLeave = () => {
                // Only auto-hide on hover devices, not touch devices
                if (!isTouchDevice) {
                  setTooltipData(null);
                }
              };

              const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
                if (hasScore) {
                  event.preventDefault(); // Prevent default touch behavior
                  handleCellInteraction(event);
                }
              };

              return (
                <div
                  key={`${project.id}-${cap.id}`}
                  style={{
                    minHeight: "18px",
                    borderBottom: "1px solid #f5f5f5",
                    borderRight: "1px solid #f5f5f5",
                    backgroundColor: bgColor,
                    borderRadius: "3px",
                    cursor: hasScore ? "pointer" : "default",
                    position: "relative",
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <CellTooltip
        data={tooltipData}
        onClose={() => setTooltipData(null)}
      />
    </div>
  );
};
