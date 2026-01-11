import { useRef, useEffect, useState, useCallback } from "react";
import {
  Vector2D,
  Matrix2D,
  applyMatrix,
  identityMatrix,
  lerpMatrix,
} from "../utils/vector-math";

interface VectorCanvasProps {
  vectors: Vector2D[];
  onVectorUpdate: (index: number, vector: Vector2D) => void;
  transformation: Matrix2D;
  showGrid: boolean;
  showBasisVectors: boolean;
  animationProgress: number;
}

export default function VectorCanvas({
  vectors,
  onVectorUpdate,
  transformation,
  showGrid,
  showBasisVectors,
  animationProgress,
}: VectorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scale = 40;
  const centerX = 400;
  const centerY = 400;

  const worldToScreen = useCallback((v: Vector2D): { x: number; y: number } => {
    return {
      x: centerX + v.x * scale,
      y: centerY - v.y * scale,
    };
  }, []);

  const screenToWorld = useCallback((x: number, y: number): Vector2D => {
    return {
      x: (x - centerX) / scale,
      y: -(y - centerY) / scale,
    };
  }, []);

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, matrix: Matrix2D) => {
      // Draw grid lines with better visibility
      for (let i = -10; i <= 10; i++) {
        for (let j = -10; j <= 10; j++) {
          const p1 = applyMatrix({ x: i, y: j }, matrix);
          const p2 = applyMatrix({ x: i + 1, y: j }, matrix);
          const p3 = applyMatrix({ x: i, y: j + 1 }, matrix);

          const s1 = worldToScreen(p1);
          const s2 = worldToScreen(p2);
          const s3 = worldToScreen(p3);

          // Thicker lines for axes through origin
          const isMainGridLine = i === 0 || j === 0;
          ctx.strokeStyle = isMainGridLine
            ? "rgba(59, 130, 246, 0.4)"
            : "rgba(59, 130, 246, 0.15)";
          ctx.lineWidth = isMainGridLine ? 1.5 : 1;

          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s3.x, s3.y);
          ctx.stroke();
        }
      }

      // Draw coordinate labels for main axes
      ctx.fillStyle = "rgba(147, 197, 253, 0.5)";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";

      for (let i = -8; i <= 8; i += 2) {
        if (i === 0) continue;
        const xPos = applyMatrix({ x: i, y: 0 }, matrix);
        const yPos = applyMatrix({ x: 0, y: i }, matrix);
        const xScreen = worldToScreen(xPos);
        const yScreen = worldToScreen(yPos);

        ctx.fillText(String(i), xScreen.x, xScreen.y + 15);
        ctx.fillText(String(i), yScreen.x - 15, yScreen.y);
      }
    },
    [worldToScreen]
  );

  const drawAxes = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw main axes with 3B1B blue color
    ctx.strokeStyle = "rgba(96, 165, 250, 0.4)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(800, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, 800);
    ctx.stroke();

    // Add axis labels
    ctx.fillStyle = "rgba(147, 197, 253, 0.7)";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("x", 780, centerY - 10);
    ctx.fillText("y", centerX + 15, 20);
  }, []);

  const drawVector = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      v: Vector2D,
      color: string,
      lineWidth: number = 2,
      label?: string
    ) => {
      const start = worldToScreen({ x: 0, y: 0 });
      const end = worldToScreen(v);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const arrowLength = 15;

      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle - Math.PI / 6),
        end.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle + Math.PI / 6),
        end.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Draw endpoint circle for better visibility
      ctx.beginPath();
      ctx.arc(end.x, end.y, 6, 0, Math.PI * 2);
      ctx.fill();

      if (label) {
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = color;
        ctx.strokeStyle = "rgba(10, 26, 40, 0.8)";
        ctx.lineWidth = 3;
        ctx.strokeText(label, end.x + 15, end.y - 15);
        ctx.fillText(label, end.x + 15, end.y - 15);
      }
    },
    [worldToScreen]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 800);

    // 3B1B dark blue background
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, 800, 800);

    const currentMatrix = lerpMatrix(
      identityMatrix(),
      transformation,
      animationProgress
    );

    if (showGrid) {
      drawGrid(ctx, currentMatrix);
    }

    drawAxes(ctx);

    if (showBasisVectors) {
      const iHat = applyMatrix({ x: 1, y: 0 }, currentMatrix);
      const jHat = applyMatrix({ x: 0, y: 1 }, currentMatrix);
      // Red for î, green for ĵ - classic 3B1B
      drawVector(ctx, iHat, "#ef4444", 4, "î");
      drawVector(ctx, jHat, "#22c55e", 4, "ĵ");
    }

    vectors.forEach((v, index) => {
      const transformedV = applyMatrix(v, currentMatrix);
      const isHovered = hoveredIndex === index;
      const isDragging = draggingIndex === index;

      // 3B1B orange for vectors, brighter when interacting
      const color = isDragging ? "#fb923c" : isHovered ? "#fdba74" : "#f97316";
      const lineWidth = isDragging || isHovered ? 4 : 3;

      drawVector(ctx, transformedV, color, lineWidth, `v${index + 1}`);
    });
  }, [
    vectors,
    transformation,
    showGrid,
    showBasisVectors,
    animationProgress,
    hoveredIndex,
    draggingIndex,
    drawGrid,
    drawAxes,
    drawVector,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentMatrix = lerpMatrix(
      identityMatrix(),
      transformation,
      animationProgress
    );

    for (let i = vectors.length - 1; i >= 0; i--) {
      const transformedV = applyMatrix(vectors[i], currentMatrix);
      const screenPos = worldToScreen(transformedV);
      const distance = Math.sqrt(
        Math.pow(x - screenPos.x, 2) + Math.pow(y - screenPos.y, 2)
      );

      if (distance < 15) {
        setDraggingIndex(i);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = screenToWorld(x, y);

    if (draggingIndex !== null) {
      onVectorUpdate(draggingIndex, worldPos);
      return;
    }

    const currentMatrix = lerpMatrix(
      identityMatrix(),
      transformation,
      animationProgress
    );
    let foundHover = false;

    for (let i = vectors.length - 1; i >= 0; i--) {
      const transformedV = applyMatrix(vectors[i], currentMatrix);
      const screenPos = worldToScreen(transformedV);
      const distance = Math.sqrt(
        Math.pow(x - screenPos.x, 2) + Math.pow(y - screenPos.y, 2)
      );

      if (distance < 15) {
        setHoveredIndex(i);
        foundHover = true;
        break;
      }
    }

    if (!foundHover) {
      setHoveredIndex(null);
    }
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const handleMouseLeave = () => {
    setDraggingIndex(null);
    setHoveredIndex(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="border border-blue-900/50 rounded-2xl cursor-crosshair shadow-2xl hover:border-orange-500/30 transition-colors"
    />
  );
}
