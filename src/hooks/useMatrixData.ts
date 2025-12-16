// src/hooks/useMatrixData.ts

import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { MatrixData, Project, Capability } from "../types/matrix";

// Adjust this to match your real CSV location
// Use import.meta.env.BASE_URL to work with GitHub Pages subdirectory
// BASE_URL is '/rare-labs-solutions-matrix/' when deployed to GitHub Pages
const CSV_URL = `${import.meta.env.BASE_URL}bertin_matrix_projects_vs_capabilities_clustered_for_webpage.csv`;

// Adjust these to match the actual project-level columns in your CSV.
// Every other column will be treated as an AI capability.
const PROJECT_META_COLUMNS = [
  "solution_id",
  "solution_short_name",
  "solution_short_desc",
  "submission_languages",
];

interface RawRow {
  [key: string]: unknown;
}

interface UseMatrixDataResult extends MatrixData {
  isLoading: boolean;
  error: string | null;
}

export function useMatrixData(): UseMatrixDataResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [values, setValues] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    console.log('Loading CSV from:', CSV_URL);
    console.log('BASE_URL:', import.meta.env.BASE_URL);

    Papa.parse<RawRow>(CSV_URL, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawRows = (results.data || []) as RawRow[];

          console.log(`CSV parsing complete. Total rows: ${rawRows.length}`);

          if (rawRows.length === 0) {
            throw new Error("CSV loaded but contains no data rows.");
          }

          // Determine capability columns from the header fields in the first row
          const firstRow = rawRows[0];
          const allColumns = Object.keys(firstRow);

          const capabilityColumns = allColumns.filter(
            (col) => !PROJECT_META_COLUMNS.includes(col)
          );

          console.log(`Found ${capabilityColumns.length} capability columns`);

          // Extract labels from the second CSV row (rawRows[0] is the first data row, which corresponds to row 2 in CSV)
          // Use the second row's values as display labels for capabilities
          const labelRow = rawRows[0];

          // Filter out rows that don't have a solution_id (metadata rows)
          // Start from index 1 because index 0 is the label row
          const dataRows = rawRows.filter(
            (row, index) => {
              // Skip the first row (label row) and rows without solution_id
              if (index === 0) return false;
              return row["solution_id"] !== null && row["solution_id"] !== undefined && row["solution_id"] !== "";
            }
          );

          console.log(`Data rows with solution_id: ${dataRows.length}`);

          if (dataRows.length === 0) {
            throw new Error("CSV loaded but contains no rows with solution_id.");
          }

          const capabilities: Capability[] = capabilityColumns.map((col) => {
            // Get the label from the second row (label row), fallback to column name if empty
            const label = labelRow[col];
            const displayLabel = 
              label && typeof label === 'string' && label.trim() !== '' 
                ? label.trim() 
                : col;
            
            return {
              id: col,
              label: displayLabel,
            };
          });

          const projects: Project[] = dataRows.map((row, rowIndex) => {
            const id =
              (row["solution_id"] as string) ?? `row_${String(rowIndex)}`;
            const name =
              (row["solution_short_name"] as string) ??
              (row["solution_id"] as string) ??
              `Project ${rowIndex + 1}`;
            const description =
              (row["solution_short_desc"] as string) ?? undefined;

            const meta: Record<string, unknown> = {};
            for (const col of PROJECT_META_COLUMNS) {
              if (row[col] !== undefined) {
                meta[col] = row[col];
              }
            }

            return { id, name, description, meta };
          });

          const values: number[][] = dataRows.map((row) =>
            capabilityColumns.map((col) => {
              const rawValue = row[col];

              if (rawValue === null || rawValue === undefined) {
                return NaN;
              }

              const num =
                typeof rawValue === "number"
                  ? rawValue
                  : Number(String(rawValue).trim());

              return Number.isFinite(num) ? num : NaN;
            })
          );

          console.log(`Created ${projects.length} projects, ${capabilities.length} capabilities`);
          console.log(`Sample project:`, projects[0]);
          console.log(`Sample capabilities:`, capabilities.slice(0, 3));

          setProjects(projects);
          setCapabilities(capabilities);
          setValues(values);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setError(
            err instanceof Error ? err.message : "Unknown error parsing CSV."
          );
          setIsLoading(false);
        }
      },
      error: (err) => {
        console.error(err);
        setError(err.message ?? "Failed to load CSV.");
        setIsLoading(false);
      },
    });
  }, []);

  return { projects, capabilities, values, isLoading, error };
}
