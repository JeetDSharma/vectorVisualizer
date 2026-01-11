import { useState } from "react";
import {
  RotateCw,
  Maximize2,
  Move,
  Grid,
  Plus,
  Trash2,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  Vector2D,
  Matrix2D,
  identityMatrix,
  rotationMatrix,
  scalingMatrix,
  shearMatrix,
  determinant,
} from "../utils/vector-math";

interface ControlPanelProps {
  vectors: Vector2D[];
  transformation: Matrix2D;
  onTransformationChange: (matrix: Matrix2D) => void;
  onAddVector: () => void;
  onRemoveVector: (index: number) => void;
  onVectorUpdate: (index: number, vector: Vector2D) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showBasisVectors: boolean;
  setShowBasisVectors: (show: boolean) => void;
  isAnimating: boolean;
}

export default function ControlPanel({
  vectors,
  transformation,
  onTransformationChange,
  onAddVector,
  onRemoveVector,
  onVectorUpdate,
  showGrid,
  setShowGrid,
  showBasisVectors,
  setShowBasisVectors,
  isAnimating,
}: ControlPanelProps) {
  const [customMatrix, setCustomMatrix] = useState<Matrix2D>({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
  });

  const applyPreset = (name: string) => {
    let matrix: Matrix2D;
    switch (name) {
      case "rotate90":
        matrix = rotationMatrix(Math.PI / 2);
        break;
      case "scale2":
        matrix = scalingMatrix(2, 2);
        break;
      case "shearX":
        matrix = shearMatrix(1, 0);
        break;
      case "reflection":
        matrix = { a: -1, b: 0, c: 0, d: 1 };
        break;
      default:
        matrix = identityMatrix();
    }
    onTransformationChange(matrix);
  };

  const resetTransformation = () => {
    onTransformationChange(identityMatrix());
  };

  const applyCustomMatrix = () => {
    onTransformationChange(customMatrix);
  };

  const det = determinant(transformation);

  return (
    <div className="space-y-5">
      {/* Grid & Basis Controls - Most Important */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-6 border border-blue-900/30 shadow-2xl">
        <h2 className="text-lg font-semibold mb-5 text-orange-400">
          Visualization
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/30 p-3 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <Grid className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-base font-medium">Grid</span>
              <p className="text-xs text-blue-300/50">
                See how space transforms
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/30 p-3 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={showBasisVectors}
              onChange={(e) => setShowBasisVectors(e.target.checked)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <Move className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-base font-medium">
                Basis Vectors (î, ĵ)
              </span>
              <p className="text-xs text-blue-300/50">
                Red î and green ĵ unit vectors
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Vectors - Core Feature */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-6 border border-blue-900/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-orange-400">Vectors</h2>
          <span className="text-xs text-blue-300/50">
            Drag endpoints on canvas
          </span>
        </div>

        <div className="space-y-3">
          {vectors.map((v, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-blue-950/30 hover:bg-blue-900/40 p-4 rounded-xl transition-all border border-blue-900/30"
            >
              <span className="text-orange-400 font-bold text-lg w-10">
                v{index + 1}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1">
                  <label className="text-xs text-blue-400/60 mb-1 block">
                    x
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={v.x.toFixed(2)}
                    onChange={(e) =>
                      onVectorUpdate(index, {
                        ...v,
                        x: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-base transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-blue-400/60 mb-1 block">
                    y
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={v.y.toFixed(2)}
                    onChange={(e) =>
                      onVectorUpdate(index, {
                        ...v,
                        y: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-base transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => onRemoveVector(index)}
                className="text-blue-400 hover:text-orange-400 transition-colors p-2"
                title="Remove vector"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            onClick={onAddVector}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-3 rounded-xl transition-all text-base font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Vector
          </button>
        </div>
      </div>

      {/* Simple Transformations */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-6 border border-blue-900/30 shadow-2xl">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-orange-400">
            Quick Transforms
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => applyPreset("rotate90")}
            disabled={isAnimating}
            className="flex flex-col items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-4 py-4 rounded-xl transition-all font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-sm">Rotate 90°</span>
          </button>

          <button
            onClick={() => applyPreset("scale2")}
            disabled={isAnimating}
            className="flex flex-col items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-4 py-4 rounded-xl transition-all font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <Maximize2 className="w-6 h-6" />
            <span className="text-sm">Scale 2x</span>
          </button>

          <button
            onClick={() => applyPreset("shearX")}
            disabled={isAnimating}
            className="flex flex-col items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-4 py-4 rounded-xl transition-all font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <Move className="w-6 h-6" />
            <span className="text-sm">Shear</span>
          </button>

          <button
            onClick={() => applyPreset("reflection")}
            disabled={isAnimating}
            className="flex flex-col items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-4 py-4 rounded-xl transition-all font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <span className="text-sm">Reflect</span>
          </button>
        </div>

        <button
          onClick={resetTransformation}
          disabled={isAnimating}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:text-gray-600 px-4 py-3 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-white/20"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Custom Matrix */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-6 border border-blue-900/30 shadow-2xl">
        <h2 className="text-lg font-semibold mb-2 text-orange-400">
          Custom Matrix
        </h2>
        <p className="text-xs text-blue-300/50 mb-5">
          Define your own transformation
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-blue-300/70 mb-2 font-medium">
                î becomes
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.1"
                  value={customMatrix.a}
                  onChange={(e) =>
                    setCustomMatrix({
                      ...customMatrix,
                      a: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-base transition-all"
                  placeholder="x"
                />
                <input
                  type="number"
                  step="0.1"
                  value={customMatrix.c}
                  onChange={(e) =>
                    setCustomMatrix({
                      ...customMatrix,
                      c: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-base transition-all"
                  placeholder="y"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-blue-300/70 mb-2 font-medium">
                ĵ becomes
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.1"
                  value={customMatrix.b}
                  onChange={(e) =>
                    setCustomMatrix({
                      ...customMatrix,
                      b: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-base transition-all"
                  placeholder="x"
                />
                <input
                  type="number"
                  step="0.1"
                  value={customMatrix.d}
                  onChange={(e) =>
                    setCustomMatrix({
                      ...customMatrix,
                      d: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-blue-950/50 px-3 py-2 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-base transition-all"
                  placeholder="y"
                />
              </div>
            </div>
          </div>

          <button
            onClick={applyCustomMatrix}
            disabled={isAnimating}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white disabled:bg-blue-900/20 disabled:text-blue-600 px-4 py-3 rounded-xl transition-all text-base font-medium shadow-lg"
          >
            Apply
          </button>

          {/* Show determinant */}
          <div className="flex items-center justify-between p-3 bg-blue-950/30 rounded-lg border border-blue-900/30">
            <span className="text-sm text-blue-300/70">Area Scaling</span>
            <span
              className={`text-base font-mono font-bold ${
                det < 0 ? "text-blue-400" : "text-orange-400"
              }`}
            >
              {det.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
