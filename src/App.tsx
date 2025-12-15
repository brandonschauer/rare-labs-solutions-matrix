// src/App.tsx

import React from "react";
import { useMatrixData } from "./hooks/useMatrixData";
import { Matrix } from "./components/Matrix";

const App: React.FC = () => {
  const { projects, capabilities, values, isLoading, error } = useMatrixData();

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ marginBottom: "0.25rem" }}>AI Opportunity Map</h1>
        <p style={{ margin: 0, color: "#555", maxWidth: "640px" }}>
          This is a map of opportunity spaces for AI in community-focused
          conservation initiatives. Learn more here or contact Rare.
        </p>
      </header>

      <Matrix
        projects={projects}
        capabilities={capabilities}
        values={values}
        isLoading={isLoading}
        error={error}
      />

      <footer style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#666" }}>
        <p style={{ margin: 0 }}>
          Data comes from Rare&apos;s Solution Search contests and has been
          clustered to reveal patterns across AI capabilities and conservation
          solutions. Learn more at{" "}
          <a
            href="https://solutionsearch.org"
            target="_blank"
            rel="noreferrer"
          >
            solutionsearch.org
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default App;
