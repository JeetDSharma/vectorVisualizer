import { useRef, useEffect, useState, useCallback } from "react";
import {
  Vector3D,
  add3D,
  scale3D,
  rotateX3D,
  rotateY3D,
  project3D,
} from "../utils/vector-math";

interface VectorCanvas3DProps {
  vectors: Vector3D[];
  vectorScales: number[];
  onVectorUpdate: (index: number, vector: Vector3D) => void;
  showGrid: boolean;
  showVectorSum: boolean;
}

export default function VectorCanvas3D({
  vectors,
  vectorScales,
  onVectorUpdate,
  showGrid,
  showVectorSum,
}: VectorCanvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotationX, setRotationX] = useState(0.4); // Initial tilt
  const [rotationY, setRotationY] = useState(0.6); // Initial rotation
  const [isDraggingView, setIsDraggingView] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const scale = 40;
  const centerX = 400;
  const centerY = 400;

  const rotatePoint = useCallback(
    (v: Vector3D): Vector3D => {
      let rotated = rotateX3D(v, rotationX);
      rotated = rotateY3D(rotated, rotationY);
      return rotated;
    },
    [rotationX, rotationY]
  );

  const worldToScreen = useCallback(
    (v: Vector3D): { x: number; y: number; z: number } => {
      const rotated = rotatePoint(v);
      const projected = project3D(rotated, 8);
      return {
        x: centerX + projected.x * scale,
        y: centerY - projected.y * scale,
        z: rotated.z,
      };
    },
    [rotatePoint]
  );

  const drawGrid3D = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const gridSize = 5;
      const gridLines: Array<{
        start: Vector3D;
        end: Vector3D;
        depth: number;
      }> = [];

      // XY plane grid
      for (let i = -gridSize; i <= gridSize; i++) {
        // Lines parallel to X axis
        const start1 = { x: -gridSize, y: i, z: 0 };
        const end1 = { x: gridSize, y: i, z: 0 };
        const rotated1 = rotatePoint(start1);
        gridLines.push({ start: start1, end: end1, depth: rotated1.z });

        // Lines parallel to Y axis
        const start2 = { x: i, y: -gridSize, z: 0 };
        const end2 = { x: i, y: gridSize, z: 0 };
        const rotated2 = rotatePoint(start2);
        gridLines.push({ start: start2, end: end2, depth: rotated2.z });
      }

      // XZ plane grid (horizontal)
      for (let i = -gridSize; i <= gridSize; i++) {
        const start1 = { x: -gridSize, y: 0, z: i };
        const end1 = { x: gridSize, y: 0, z: i };
        const rotated1 = rotatePoint(start1);
        gridLines.push({ start: start1, end: end1, depth: rotated1.z });

        const start2 = { x: i, y: 0, z: -gridSize };
        const end2 = { x: i, y: 0, z: gridSize };
        const rotated2 = rotatePoint(start2);
        gridLines.push({ start: start2, end: end2, depth: rotated2.z });
      }

      // YZ plane grid
      for (let i = -gridSize; i <= gridSize; i++) {
        const start1 = { x: 0, y: -gridSize, z: i };
        const end1 = { x: 0, y: gridSize, z: i };
        const rotated1 = rotatePoint(start1);
        gridLines.push({ start: start1, end: end1, depth: rotated1.z });

        const start2 = { x: 0, y: i, z: -gridSize };
        const end2 = { x: 0, y: i, z: gridSize };
        const rotated2 = rotatePoint(start2);
        gridLines.push({ start: start2, end: end2, depth: rotated2.z });
      }

      // Sort by depth (painter's algorithm)
      gridLines.sort((a, b) => a.depth - b.depth);

      gridLines.forEach(({ start, end }) => {
        const s1 = worldToScreen(start);
        const s2 = worldToScreen(end);

        const isMainAxis =
          (start.x === 0 && end.x === 0) ||
          (start.y === 0 && end.y === 0) ||
          (start.z === 0 && end.z === 0);

        const opacity = isMainAxis ? 0.4 : 0.15;
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = isMainAxis ? 1.5 : 1;

        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      });
    },
    [worldToScreen, rotatePoint]
  );

  const drawAxes3D = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const axisLength = 6;
      const axes = [
        {
          start: { x: 0, y: 0, z: 0 },
          end: { x: axisLength, y: 0, z: 0 },
          color: "#ef4444",
          label: "x",
        },
        {
          start: { x: 0, y: 0, z: 0 },
          end: { x: 0, y: axisLength, z: 0 },
          color: "#22c55e",
          label: "y",
        },
        {
          start: { x: 0, y: 0, z: 0 },
          end: { x: 0, y: 0, z: axisLength },
          color: "#3b82f6",
          label: "z",
        },
      ];

      axes.forEach(({ start, end, color, label }) => {
        const s1 = worldToScreen(start);
        const s2 = worldToScreen(end);

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(s2.y - s1.y, s2.x - s1.x);
        const arrowLength = 12;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(s2.x, s2.y);
        ctx.lineTo(
          s2.x - arrowLength * Math.cos(angle - Math.PI / 6),
          s2.y - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          s2.x - arrowLength * Math.cos(angle + Math.PI / 6),
          s2.y - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = color;
        ctx.strokeStyle = "rgba(10, 26, 40, 0.8)";
        ctx.lineWidth = 3;
        ctx.strokeText(label, s2.x + 15, s2.y - 10);
        ctx.fillText(label, s2.x + 15, s2.y - 10);
      });
    },
    [worldToScreen]
  );

  const drawVector3D = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      start: Vector3D,
      end: Vector3D,
      color: string,
      lineWidth: number = 3,
      label?: string,
      dashed: boolean = false
    ) => {
      const s1 = worldToScreen(start);
      const s2 = worldToScreen(end);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;

      if (dashed) {
        ctx.setLineDash([8, 4]);
      }

      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.stroke();

      ctx.setLineDash([]);

      const angle = Math.atan2(s2.y - s1.y, s2.x - s1.x);
      const arrowLength = 15;

      ctx.beginPath();
      ctx.moveTo(s2.x, s2.y);
      ctx.lineTo(
        s2.x - arrowLength * Math.cos(angle - Math.PI / 6),
        s2.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        s2.x - arrowLength * Math.cos(angle + Math.PI / 6),
        s2.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s2.x, s2.y, 6, 0, Math.PI * 2);
      ctx.fill();

      if (label) {
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = color;
        ctx.strokeStyle = "rgba(10, 26, 40, 0.8)";
        ctx.lineWidth = 3;
        ctx.strokeText(label, s2.x + 15, s2.y - 15);
        ctx.fillText(label, s2.x + 15, s2.y - 15);
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
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, 800, 800);

    if (showGrid) {
      drawGrid3D(ctx);
    }

    drawAxes3D(ctx);

    // Draw vectors with depth sorting
    const vectorData: Array<{
      vector: Vector3D;
      index: number;
      depth: number;
    }> = [];

    vectors.forEach((v, index) => {
      const scaleValue = vectorScales[index] || 1;
      const scaledV = scale3D(v, scaleValue);
      const rotated = rotatePoint(scaledV);
      vectorData.push({ vector: scaledV, index, depth: rotated.z });
    });

    vectorData.sort((a, b) => a.depth - b.depth);

    let currentPos: Vector3D = { x: 0, y: 0, z: 0 };
    const scaledVectors: Vector3D[] = [];

    vectorData.forEach(({ vector, index }) => {
      const isHovered = hoveredIndex === index;
      const isDragging = draggingIndex === index;

      const color = isDragging ? "#fb923c" : isHovered ? "#fdba74" : "#f97316";
      const lineWidth = isDragging || isHovered ? 4 : 3;

      scaledVectors.push(vector);
      drawVector3D(
        ctx,
        { x: 0, y: 0, z: 0 },
        vector,
        color,
        lineWidth,
        `v${index + 1}`
      );

      if (showVectorSum && vectors.length > 1 && index < vectors.length - 1) {
        drawVector3D(
          ctx,
          currentPos,
          add3D(currentPos, vector),
          "rgba(96, 165, 250, 0.3)",
          2,
          undefined,
          true
        );
      }

      currentPos = add3D(currentPos, vector);
    });

    if (showVectorSum && vectors.length > 0) {
      const sumVector = scaledVectors.reduce((acc, v) => add3D(acc, v), {
        x: 0,
        y: 0,
        z: 0,
      });

      drawVector3D(ctx, { x: 0, y: 0, z: 0 }, sumVector, "#22c55e", 4, "sum");
    }
  }, [
    vectors,
    vectorScales,
    showGrid,
    showVectorSum,
    rotationX,
    rotationY,
    hoveredIndex,
    draggingIndex,
    drawGrid3D,
    drawAxes3D,
    drawVector3D,
    rotatePoint,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a vector
    for (let i = vectors.length - 1; i >= 0; i--) {
      const scaleValue = vectorScales[i] || 1;
      const scaledV = scale3D(vectors[i], scaleValue);
      const screenPos = worldToScreen(scaledV);
      const distance = Math.sqrt(
        Math.pow(x - screenPos.x, 2) + Math.pow(y - screenPos.y, 2)
      );

      if (distance < 15) {
        setDraggingIndex(i);
        return;
      }
    }

    // Otherwise, start rotating the view
    setIsDraggingView(true);
    setLastMousePos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingView) {
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      setRotationY(rotationY + dx * 0.01);
      setRotationX(rotationX + dy * 0.01);
      setLastMousePos({ x, y });
      return;
    }

    if (draggingIndex !== null) {
      // For 3D vector dragging, we keep the z-coordinate constant
      // and adjust x, y based on mouse movement
      const currentVector = vectors[draggingIndex];
      const dx = (x - centerX) / scale;
      const dy = -(y - centerY) / scale;

      // Simple approach: update x and y, keep z
      onVectorUpdate(draggingIndex, { x: dx, y: dy, z: currentVector.z });
      return;
    }

    // Hover detection
    let foundHover = false;
    for (let i = vectors.length - 1; i >= 0; i--) {
      const scaleValue = vectorScales[i] || 1;
      const scaledV = scale3D(vectors[i], scaleValue);
      const screenPos = worldToScreen(scaledV);
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
    setIsDraggingView(false);
  };

  const handleMouseLeave = () => {
    setDraggingIndex(null);
    setHoveredIndex(null);
    setIsDraggingView(false);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="border border-blue-900/50 rounded-2xl cursor-grab active:cursor-grabbing shadow-2xl hover:border-orange-500/30 transition-colors"
      />
      <div className="absolute top-4 left-4 bg-blue-950/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-900/50 text-xs text-blue-300/70">
        <div>Drag canvas to rotate view</div>
        <div>Drag vector endpoints to move</div>
      </div>
    </div>
  );
}
