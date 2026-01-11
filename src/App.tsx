import { useState } from "react";
import VectorCanvas2D from "./components/VectorCanvas";
import VectorCanvas3D from "./components/VectorCanvas3D";
import ControlPanel2D from "./components/ControlPanel";
import ControlPanel3D from "./components/ControlPanel3D";
import { Vector2D, Vector3D } from "./utils/vector-math";
import { Box, Square } from "lucide-react";

type Mode = "2D" | "3D";

function App() {
  const [mode, setMode] = useState<Mode>("2D");

  // 2D state
  const [vectors2D, setVectors2D] = useState<Vector2D[]>([
    { x: 3, y: 2 },
    { x: 2, y: 3 },
  ]);
  const [vectorScales2D, setVectorScales2D] = useState<number[]>([1, 1]);

  // 3D state
  const [vectors3D, setVectors3D] = useState<Vector3D[]>([
    { x: 3, y: 2, z: 1 },
    { x: 1, y: 3, z: 2 },
  ]);
  const [vectorScales3D, setVectorScales3D] = useState<number[]>([1, 1]);

  // Shared state
  const [showGrid, setShowGrid] = useState(true);
  const [showVectorSum, setShowVectorSum] = useState(true);

  // 2D handlers
  const handleVectorUpdate2D = (index: number, vector: Vector2D) => {
    const newVectors = [...vectors2D];
    newVectors[index] = vector;
    setVectors2D(newVectors);
  };

  const handleScaleVector2D = (index: number, scale: number) => {
    const newScales = [...vectorScales2D];
    newScales[index] = scale;
    setVectorScales2D(newScales);
  };

  const addVector2D = () => {
    setVectors2D([...vectors2D, { x: 1, y: 1 }]);
    setVectorScales2D([...vectorScales2D, 1]);
  };

  const removeVector2D = (index: number) => {
    setVectors2D(vectors2D.filter((_, i) => i !== index));
    setVectorScales2D(vectorScales2D.filter((_, i) => i !== index));
  };

  // 3D handlers
  const handleVectorUpdate3D = (index: number, vector: Vector3D) => {
    const newVectors = [...vectors3D];
    newVectors[index] = vector;
    setVectors3D(newVectors);
  };

  const handleScaleVector3D = (index: number, scale: number) => {
    const newScales = [...vectorScales3D];
    newScales[index] = scale;
    setVectorScales3D(newScales);
  };

  const addVector3D = () => {
    setVectors3D([...vectors3D, { x: 1, y: 1, z: 1 }]);
    setVectorScales3D([...vectorScales3D, 1]);
  };

  const removeVector3D = (index: number) => {
    setVectors3D(vectors3D.filter((_, i) => i !== index));
    setVectorScales3D(vectorScales3D.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628] text-white">
      <div className="max-w-[1800px] mx-auto px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent tracking-tight">
            {mode === "2D" ? "2D" : "3D"} Vector Addition & Scaling
          </h1>
          <p className="text-blue-300/60 text-base mb-4">
            {mode === "2D"
              ? "Master vectors in 2D space • Add & scale in two dimensions"
              : "Master vectors in 3D space • Rotate the view • Add & scale in all dimensions"}
          </p>

          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setMode("2D")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                mode === "2D"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-blue-950/40 text-blue-300 hover:bg-blue-950/60 border border-blue-900/30"
              }`}
            >
              <Square className="w-5 h-5" />
              2D Mode
            </button>
            <button
              onClick={() => setMode("3D")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                mode === "3D"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-blue-950/40 text-blue-300 hover:bg-blue-950/60 border border-blue-900/30"
              }`}
            >
              <Box className="w-5 h-5" />
              3D Mode
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[820px_1fr] gap-6 items-start">
          <div className="flex justify-center">
            {mode === "2D" ? (
              <VectorCanvas2D
                vectors={vectors2D}
                vectorScales={vectorScales2D}
                onVectorUpdate={handleVectorUpdate2D}
                showGrid={showGrid}
                showVectorSum={showVectorSum}
              />
            ) : (
              <VectorCanvas3D
                vectors={vectors3D}
                vectorScales={vectorScales3D}
                onVectorUpdate={handleVectorUpdate3D}
                showGrid={showGrid}
                showVectorSum={showVectorSum}
              />
            )}
          </div>

          <div className="xl:sticky xl:top-6">
            {mode === "2D" ? (
              <ControlPanel2D
                vectors={vectors2D}
                vectorScales={vectorScales2D}
                onAddVector={addVector2D}
                onRemoveVector={removeVector2D}
                onVectorUpdate={handleVectorUpdate2D}
                onScaleVector={handleScaleVector2D}
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showVectorSum={showVectorSum}
                setShowVectorSum={setShowVectorSum}
              />
            ) : (
              <ControlPanel3D
                vectors={vectors3D}
                vectorScales={vectorScales3D}
                onAddVector={addVector3D}
                onRemoveVector={removeVector3D}
                onVectorUpdate={handleVectorUpdate3D}
                onScaleVector={handleScaleVector3D}
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showVectorSum={showVectorSum}
                setShowVectorSum={setShowVectorSum}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
