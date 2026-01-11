import { useState } from "react";
import VectorCanvas from "./components/VectorCanvas";
import ControlPanel from "./components/ControlPanel";
import { Vector2D, Matrix2D, identityMatrix } from "./utils/vector-math";

function App() {
  const [vectors, setVectors] = useState<Vector2D[]>([
    { x: 3, y: 2 },
    { x: -2, y: 3 },
  ]);

  const [transformation, setTransformation] = useState<Matrix2D>(
    identityMatrix()
  );
  const [showGrid, setShowGrid] = useState(true);
  const [showBasisVectors, setShowBasisVectors] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVectorUpdate = (index: number, vector: Vector2D) => {
    const newVectors = [...vectors];
    newVectors[index] = vector;
    setVectors(newVectors);
  };

  const addVector = () => {
    setVectors([...vectors, { x: 1, y: 1 }]);
  };

  const removeVector = (index: number) => {
    setVectors(vectors.filter((_, i) => i !== index));
  };

  const animateTransformation = (newMatrix: Matrix2D) => {
    setIsAnimating(true);
    setAnimationProgress(0);

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setAnimationProgress(easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setTransformation(newMatrix);
        setAnimationProgress(1);
      }
    };

    setTransformation(newMatrix);
    animate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Vector Visualizer
          </h1>
          <p className="text-gray-300">
            An interactive playground for understanding linear algebra concepts
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Inspired by 3Blue1Brown's "Essence of Linear Algebra"
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[800px_1fr] gap-8">
          <div className="flex justify-center">
            <VectorCanvas
              vectors={vectors}
              onVectorUpdate={handleVectorUpdate}
              transformation={transformation}
              showGrid={showGrid}
              showBasisVectors={showBasisVectors}
              animationProgress={animationProgress}
            />
          </div>

          <div>
            <ControlPanel
              vectors={vectors}
              transformation={transformation}
              onTransformationChange={animateTransformation}
              onAddVector={addVector}
              onRemoveVector={removeVector}
              onVectorUpdate={handleVectorUpdate}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showBasisVectors={showBasisVectors}
              setShowBasisVectors={setShowBasisVectors}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
