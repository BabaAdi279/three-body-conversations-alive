
declare module 'three' {
  export class Scene {
    add(...objects: any[]): void;
  }
  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    position: Vector3;
    lookAt(vector: Vector3): void;
    aspect: number;
    updateProjectionMatrix(): void;
  }
  export class WebGLRenderer {
    constructor(options?: {antialias?: boolean, alpha?: boolean});
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    domElement: HTMLCanvasElement;
  }
  export class Vector3 {
    constructor(x: number, y: number, z: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): Vector3;
  }
  export class BoxGeometry {
    constructor(width?: number, height?: number, depth?: number);
    dispose(): void;
  }
  export class SphereGeometry {
    constructor(radius: number, widthSegments?: number, heightSegments?: number);
    dispose(): void;
  }
  export class Mesh {
    constructor(geometry: any, material: any);
    position: Vector3;
    rotation: {x: number, y: number, z: number};
    scale: {x: number, y: number, z: number};
    geometry: any;
    material: Material;
  }
  export class MeshBasicMaterial {
    constructor(options: {color?: number | string, wireframe?: boolean});
    dispose(): void;
  }
  export class MeshPhongMaterial {
    constructor(options: {
      color?: number | string,
      emissive?: number | string,
      emissiveIntensity?: number,
      specular?: number | string,
      wireframe?: boolean
    });
    dispose(): void;
  }
  export class Material {
    constructor();
    dispose(): void;
  }
  export class Color {
    constructor(color: number | string);
  }
  export class AmbientLight {
    constructor(color?: number | string, intensity?: number);
  }
  export class DirectionalLight {
    constructor(color?: number | string, intensity?: number);
    position: Vector3;
  }
  export class Group {
    constructor();
    add(...objects: any[]): void;
    rotation: {x: number, y: number, z: number};
    position: Vector3;
  }
}
