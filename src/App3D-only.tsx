import { useState } from "react";
import VectorCanvas from "./components/VectorCanvas3D";
import ControlPanel from "./components/ControlPanel3D";
import { Vector3D } from "./utils/vector-math";

function App() {
  const [vectors, setVectors] = useState<Vector3D[]>([
    { x: 3, y: 2, z: 1 },
    { x: 1, y: 3, z: 2 },
  ]);

  const [vectorScales, setVectorScales] = useState<number[]>([1, 1]);
  const [showGrid, setShowGrid] = useState(true);
  const [showVectorSum, setShowVectorSum] = useState(true);

  const handleVectorUpdate = (index: number, vector: Vector3D) => {
    const newVectors = [...vectors];
    newVectors[index] = vector;
    setVectors(newVectors);
  };

  const handleScaleVector = (index: number, scale: number) => {
    const newScales = [...vectorScales];
    newScales[index] = scale;
    setVectorScales(newScales);
  };

  const addVector = () => {
    setVectors([...vectors, { x: 1, y: 1, z: 1 }]);
    setVectorScales([...vectorScales, 1]);
  };

  const removeVector = (index: number) => {
    setVectors(vectors.filter((_, i) => i !== index));
    setVectorScales(vectorScales.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628] text-white">
      <div className="max-w-[1800px] mx-auto px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-100 to-blue-300 bg-clip-text text-transparent tracking-tight">
            3D Vector Addition & Scaling
          </h1>
          <p className="text-blue-300/60 text-base">
            Master vectors in 3D space • Rotate the view • Add & scale in all
            dimensions
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[820px_1fr] gap-6 items-start">
          <div className="flex justify-center">
            <VectorCanvas
              vectors={vectors}
              vectorScales={vectorScales}
              onVectorUpdate={handleVectorUpdate}
              showGrid={showGrid}
              showVectorSum={showVectorSum}
            />
          </div>

          <div className="xl:sticky xl:top-6">
            <ControlPanel
              vectors={vectors}
              vectorScales={vectorScales}
              onAddVector={addVector}
              onRemoveVector={removeVector}
              onVectorUpdate={handleVectorUpdate}
              onScaleVector={handleScaleVector}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showVectorSum={showVectorSum}
              setShowVectorSum={setShowVectorSum}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
