
export interface Hotspot {
  id: number;
  title: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
  category?: 'inner' | 'outer' | 'structure';
}

export interface MirrorState {
  activePointId: number | null;
  hoveredPointId: number | null;
}
