// src/types/matrix.ts

export interface Project {
  id: string;
  name: string;
  description?: string;
  meta: Record<string, unknown>;
}

export interface Capability {
  id: string;        // e.g. column key from the CSV
  label: string;     // human-friendly, for now same as id
}

export interface MatrixData {
  projects: Project[];
  capabilities: Capability[];
  // values[rowIndex][colIndex] = numeric score (can be NaN if missing)
  values: number[][];
}
