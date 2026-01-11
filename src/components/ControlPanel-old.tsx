import { useState } from "react";
import {
  RotateCw,
  Maximize2,
  Move,
  Grid,
  Eye,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  Vector2D,
  Matrix2D,
  identityMatrix,
  rotationMatrix,
  scalingMatrix,
  shearMatrix,
  determinant,
  calculateEigenvalues,
  calculateEigenvector,
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
      case "rotate45":
        matrix = rotationMatrix(Math.PI / 4);
        break;
      case "scale2":
        matrix = scalingMatrix(2, 2);
        break;
      case "scaleX":
        matrix = scalingMatrix(2, 1);
        break;
      case "scaleY":
        matrix = scalingMatrix(1, 2);
        break;
      case "shearX":
        matrix = shearMatrix(1, 0);
        break;
      case "shearY":
        matrix = shearMatrix(0, 1);
        break;
      case "reflection":
        matrix = { a: -1, b: 0, c: 0, d: 1 };
        break;
      case "projection":
        matrix = { a: 1, b: 0, c: 0, d: 0 };
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
  const eigenvalues = calculateEigenvalues(transformation);
  const eigenvector1 = calculateEigenvector(
    transformation,
    eigenvalues.lambda1
  );
  const eigenvector2 = calculateEigenvector(
    transformation,
    eigenvalues.lambda2
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-5 border border-blue-900/30 shadow-2xl">
        <h2 className="text-sm font-medium mb-4 flex items-center gap-2 text-blue-300/70 uppercase tracking-wider">
          <Eye className="w-5 h-5" />
          Display Options
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/30 p-2 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="w-4 h-4 rounded accent-orange-500"
            />
            <Grid className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Show Grid</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/30 p-2 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={showBasisVectors}
              onChange={(e) => setShowBasisVectors(e.target.checked)}
              className="w-4 h-4 rounded accent-orange-500"
            />
            <Move className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Show Basis Vectors (î, ĵ)</span>
          </label>
        </div>
      </div>

      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-5 border border-blue-900/30 shadow-2xl">
        <h2 className="text-sm font-medium mb-4 flex items-center gap-2 text-blue-300/70 uppercase tracking-wider">
          <Sparkles className="w-5 h-5" />
          Preset Transformations
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset("rotate90")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <RotateCw className="w-4 h-4" />
            Rotate 90°
          </button>

          <button
            onClick={() => applyPreset("rotate45")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <RotateCw className="w-4 h-4" />
            Rotate 45°
          </button>

          <button
            onClick={() => applyPreset("scale2")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <Maximize2 className="w-4 h-4" />
            Scale 2x
          </button>

          <button
            onClick={() => applyPreset("scaleX")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            Scale X
          </button>

          <button
            onClick={() => applyPreset("scaleY")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            Scale Y
          </button>

          <button
            onClick={() => applyPreset("shearX")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <Move className="w-4 h-4" />
            Shear X
          </button>

          <button
            onClick={() => applyPreset("shearY")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            <Move className="w-4 h-4" />
            Shear Y
          </button>

          <button
            onClick={() => applyPreset("reflection")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            Reflect X
          </button>

          <button
            onClick={() => applyPreset("projection")}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 disabled:bg-blue-900/20 disabled:text-blue-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-orange-500/30 hover:border-orange-500/50"
          >
            Project to X
          </button>

          <button
            onClick={resetTransformation}
            disabled={isAnimating}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:text-gray-600 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-white/20 col-span-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Identity
          </button>
        </div>
      </div>

      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-5 border border-blue-900/30 shadow-2xl">
        <h2 className="text-sm font-medium mb-4 text-blue-300/70 uppercase tracking-wider">
          Custom Matrix
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-blue-400/60 mb-1.5 font-normal">
                a (top-left)
              </label>
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
                className="w-full bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-400/60 mb-1.5 font-normal">
                b (top-right)
              </label>
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
                className="w-full bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-400/60 mb-1.5 font-normal">
                c (bottom-left)
              </label>
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
                className="w-full bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-400/60 mb-1.5 font-normal">
                d (bottom-right)
              </label>
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
                className="w-full bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>

          <button
            onClick={applyCustomMatrix}
            disabled={isAnimating}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white disabled:bg-blue-900/20 disabled:text-blue-600 px-4 py-2.5 rounded-xl transition-all text-sm font-medium shadow-lg"
          >
            Apply Custom Matrix
          </button>
        </div>
      </div>

      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-5 border border-blue-900/30 shadow-2xl">
        <h2 className="text-sm font-medium mb-4 text-blue-300/70 uppercase tracking-wider">
          Transformation Info
        </h2>

        <div className="space-y-2.5 text-sm font-mono">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-blue-300/60 font-normal">Matrix:</span>
            <div>
              <div>
                [{transformation.a.toFixed(2)}, {transformation.b.toFixed(2)}]
              </div>
              <div>
                [{transformation.c.toFixed(2)}, {transformation.d.toFixed(2)}]
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="text-blue-300/60 font-normal">Determinant:</span>
            <span className={det < 0 ? "text-blue-400" : "text-orange-400"}>
              {det.toFixed(3)}
            </span>
          </div>

          {!isNaN(eigenvalues.lambda1) && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-blue-300/60 font-normal">
                  Eigenvalue λ₁:
                </span>
                <span className="text-orange-400">
                  {eigenvalues.lambda1.toFixed(3)}
                </span>
              </div>

              {eigenvector1 && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-blue-300/60 font-normal">
                    Eigenvector v₁:
                  </span>
                  <span className="text-orange-400">
                    [{eigenvector1.x.toFixed(2)}, {eigenvector1.y.toFixed(2)}]
                  </span>
                </div>
              )}

              {!isNaN(eigenvalues.lambda2) &&
                eigenvalues.lambda1 !== eigenvalues.lambda2 && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-blue-300/60 font-normal">
                        Eigenvalue λ₂:
                      </span>
                      <span className="text-orange-400">
                        {eigenvalues.lambda2.toFixed(3)}
                      </span>
                    </div>

                    {eigenvector2 && (
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-blue-300/60 font-normal">
                          Eigenvector v₂:
                        </span>
                        <span className="text-orange-400">
                          [{eigenvector2.x.toFixed(2)},{" "}
                          {eigenvector2.y.toFixed(2)}]
                        </span>
                      </div>
                    )}
                  </>
                )}
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-5 border border-blue-900/30 shadow-2xl">
        <h2 className="text-sm font-medium mb-4 flex items-center gap-2 text-blue-300/70 uppercase tracking-wider">
          <Move className="w-5 h-5" />
          Vectors
        </h2>

        <div className="space-y-2.5">
          {vectors.map((v, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-950/30 hover:bg-blue-900/40 p-3 rounded-xl transition-all border border-blue-900/30"
            >
              <span className="text-orange-400 font-medium w-8 text-sm">
                v{index + 1}
              </span>
              <input
                type="number"
                step="0.1"
                value={v.x.toFixed(2)}
                onChange={(e) =>
                  onVectorUpdate(index, {
                    ...v,
                    x: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-blue-950/50 px-2 py-1.5 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-sm transition-all"
                placeholder="x"
              />
              <input
                type="number"
                step="0.1"
                value={v.y.toFixed(2)}
                onChange={(e) =>
                  onVectorUpdate(index, {
                    ...v,
                    y: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-20 bg-blue-950/50 px-2 py-1.5 rounded-lg border border-blue-900/50 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 focus:outline-none text-sm transition-all"
                placeholder="y"
              />
              <button
                onClick={() => onRemoveVector(index)}
                className="ml-auto text-blue-400 hover:text-orange-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            onClick={onAddVector}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-2.5 rounded-xl transition-all text-sm font-medium shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Vector
          </button>
        </div>
      </div>
    </div>
  );
}
