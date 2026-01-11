import { Plus, Trash2, Scaling, PlusCircle } from "lucide-react";
import { Vector2D } from "../utils/vector-math";

interface ControlPanelProps {
  vectors: Vector2D[];
  onAddVector: () => void;
  onRemoveVector: (index: number) => void;
  onVectorUpdate: (index: number, vector: Vector2D) => void;
  onScaleVector: (index: number, scale: number) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showVectorSum: boolean;
  setShowVectorSum: (show: boolean) => void;
  vectorScales: number[];
}

export default function ControlPanel({
  vectors,
  onAddVector,
  onRemoveVector,
  onVectorUpdate,
  onScaleVector,
  showGrid,
  setShowGrid,
  showVectorSum,
  setShowVectorSum,
  vectorScales,
}: ControlPanelProps) {
  // Calculate sum of all vectors
  const vectorSum = vectors.reduce(
    (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
    { x: 0, y: 0 }
  );

  return (
    <div className="space-y-5">
      {/* Vector Addition */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-6 border border-blue-900/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-orange-400">
              Vector Addition
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/30 p-3 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={showVectorSum}
              onChange={(e) => setShowVectorSum(e.target.checked)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <div className="flex-1">
              <span className="text-base font-medium">Show Sum Vector</span>
              <p className="text-xs text-blue-300/50">
                See v₁ + v₂ + ... result
              </p>
            </div>
          </label>

          {/* Display the sum */}
          {showVectorSum && vectors.length > 0 && (
            <div className="bg-blue-950/30 p-4 rounded-xl border border-orange-500/30">
              <div className="text-sm text-blue-300/70 mb-2">
                Sum of all vectors:
              </div>
              <div className="font-mono text-lg text-orange-400">
                ({vectorSum.x.toFixed(2)}, {vectorSum.y.toFixed(2)})
              </div>
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-900/30 p-3 rounded-xl transition-all">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <div className="flex-1">
              <span className="text-base font-medium">Show Grid</span>
              <p className="text-xs text-blue-300/50">Coordinate reference</p>
            </div>
          </label>
        </div>
      </div>

      {/* Vectors with Scaling */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-6 border border-blue-900/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Scaling className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-orange-400">
              Vectors & Scaling
            </h2>
          </div>
          <span className="text-xs text-blue-300/50">Drag on canvas</span>
        </div>

        <div className="space-y-4">
          {vectors.map((v, index) => (
            <div
              key={index}
              className="bg-blue-950/30 hover:bg-blue-900/40 p-4 rounded-xl transition-all border border-blue-900/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-orange-400 font-bold text-xl w-12">
                  v{index + 1}
                </span>
                <button
                  onClick={() => onRemoveVector(index)}
                  className="ml-auto text-blue-400 hover:text-orange-400 transition-colors p-2"
                  title="Remove vector"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Vector coordinates */}
              <div className="flex items-center gap-2 mb-3">
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

              {/* Scalar multiplication */}
              <div>
                <label className="text-xs text-blue-400/60 mb-2 block">
                  Scale by:{" "}
                  <span className="text-orange-400 font-mono">
                    {vectorScales[index]?.toFixed(1) || 1}×
                  </span>
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={vectorScales[index] || 1}
                  onChange={(e) =>
                    onScaleVector(index, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-blue-950/50 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-blue-400/40 mt-1">
                  <span>-3×</span>
                  <span>0</span>
                  <span>+3×</span>
                </div>
                {vectorScales[index] !== 1 && (
                  <div className="mt-2 text-xs text-blue-300/70">
                    Scaled: ({(v.x * (vectorScales[index] || 1)).toFixed(2)},{" "}
                    {(v.y * (vectorScales[index] || 1)).toFixed(2)})
                  </div>
                )}
              </div>
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

      {/* Quick Info */}
      <div className="bg-blue-950/40 backdrop-blur-md rounded-2xl p-5 border border-blue-900/30 shadow-2xl">
        <h3 className="text-sm font-medium text-blue-300/70 mb-3">
          Quick Guide
        </h3>
        <ul className="space-y-2 text-xs text-blue-300/60">
          <li>
            • <strong className="text-blue-200">Drag</strong> vector endpoints
            to move them
          </li>
          <li>
            • <strong className="text-blue-200">Scale slider</strong> multiplies
            vector by scalar
          </li>
          <li>
            • <strong className="text-blue-200">Sum vector</strong> shows
            head-to-tail addition
          </li>
          <li>
            • <strong className="text-blue-200">Add vectors</strong> to see
            complex additions
          </li>
        </ul>
      </div>
    </div>
  );
}
