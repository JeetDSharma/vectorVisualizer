export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Matrix2D {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const add = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

export const subtract = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

export const scale = (v: Vector2D, scalar: number): Vector2D => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

export const magnitude = (v: Vector2D): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

export const normalize = (v: Vector2D): Vector2D => {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
};

export const dot = (v1: Vector2D, v2: Vector2D): number => {
  return v1.x * v2.x + v1.y * v2.y;
};

export const applyMatrix = (v: Vector2D, m: Matrix2D): Vector2D => ({
  x: m.a * v.x + m.b * v.y,
  y: m.c * v.x + m.d * v.y,
});

export const multiplyMatrices = (m1: Matrix2D, m2: Matrix2D): Matrix2D => ({
  a: m1.a * m2.a + m1.b * m2.c,
  b: m1.a * m2.b + m1.b * m2.d,
  c: m1.c * m2.a + m1.d * m2.c,
  d: m1.c * m2.b + m1.d * m2.d,
});

export const identityMatrix = (): Matrix2D => ({
  a: 1,
  b: 0,
  c: 0,
  d: 1,
});

export const rotationMatrix = (angle: number): Matrix2D => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    a: cos,
    b: -sin,
    c: sin,
    d: cos,
  };
};

export const scalingMatrix = (sx: number, sy: number): Matrix2D => ({
  a: sx,
  b: 0,
  c: 0,
  d: sy,
});

export const shearMatrix = (shx: number, shy: number): Matrix2D => ({
  a: 1,
  b: shx,
  c: shy,
  d: 1,
});

export const determinant = (m: Matrix2D): number => {
  return m.a * m.d - m.b * m.c;
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const lerpVector = (
  v1: Vector2D,
  v2: Vector2D,
  t: number
): Vector2D => ({
  x: lerp(v1.x, v2.x, t),
  y: lerp(v1.y, v2.y, t),
});

export const lerpMatrix = (
  m1: Matrix2D,
  m2: Matrix2D,
  t: number
): Matrix2D => ({
  a: lerp(m1.a, m2.a, t),
  b: lerp(m1.b, m2.b, t),
  c: lerp(m1.c, m2.c, t),
  d: lerp(m1.d, m2.d, t),
});

export const calculateEigenvalues = (
  m: Matrix2D
): { lambda1: number; lambda2: number } => {
  const trace = m.a + m.d;
  const det = determinant(m);
  const discriminant = trace * trace - 4 * det;

  if (discriminant < 0) {
    return { lambda1: NaN, lambda2: NaN };
  }

  const sqrtDisc = Math.sqrt(discriminant);
  return {
    lambda1: (trace + sqrtDisc) / 2,
    lambda2: (trace - sqrtDisc) / 2,
  };
};

export const calculateEigenvector = (
  m: Matrix2D,
  lambda: number
): Vector2D | null => {
  if (isNaN(lambda)) return null;

  const mat = {
    a: m.a - lambda,
    b: m.b,
    c: m.c,
    d: m.d - lambda,
  };

  if (Math.abs(mat.b) > 0.0001) {
    return normalize({ x: -mat.b, y: mat.a });
  } else if (Math.abs(mat.c) > 0.0001) {
    return normalize({ x: -mat.d, y: mat.c });
  } else if (Math.abs(mat.a) < 0.0001 && Math.abs(mat.d) < 0.0001) {
    return { x: 1, y: 0 };
  }

  return null;
};

// 3D Vector operations
export const add3D = (v1: Vector3D, v2: Vector3D): Vector3D => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
  z: v1.z + v2.z,
});

export const scale3D = (v: Vector3D, scalar: number): Vector3D => ({
  x: v.x * scalar,
  y: v.y * scalar,
  z: v.z * scalar,
});

export const magnitude3D = (v: Vector3D): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

export const normalize3D = (v: Vector3D): Vector3D => {
  const mag = magnitude3D(v);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
};

export const dot3D = (v1: Vector3D, v2: Vector3D): number => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

export const cross3D = (v1: Vector3D, v2: Vector3D): Vector3D => ({
  x: v1.y * v2.z - v1.z * v2.y,
  y: v1.z * v2.x - v1.x * v2.z,
  z: v1.x * v2.y - v1.y * v2.x,
});

// 3D Rotation matrices
export const rotateX3D = (v: Vector3D, angle: number): Vector3D => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x,
    y: v.y * cos - v.z * sin,
    z: v.y * sin + v.z * cos,
  };
};

export const rotateY3D = (v: Vector3D, angle: number): Vector3D => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos + v.z * sin,
    y: v.y,
    z: -v.x * sin + v.z * cos,
  };
};

export const rotateZ3D = (v: Vector3D, angle: number): Vector3D => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
    z: v.z,
  };
};

// Simple perspective projection
export const project3D = (
  v: Vector3D,
  cameraDistance: number = 5
): { x: number; y: number } => {
  const scale = cameraDistance / (cameraDistance + v.z);
  return {
    x: v.x * scale,
    y: v.y * scale,
  };
};
