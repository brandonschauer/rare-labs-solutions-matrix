# AI Opportunity Map - Solutions Matrix

A visualization tool for mapping AI opportunities in community-focused conservation initiatives. This matrix displays the relevance of AI capabilities for various conservation projects from Rare's Solution Search contests.

## Features

- Interactive matrix visualization of projects vs. AI capabilities
- Hover tooltips showing relevance scores
- Touch-friendly interface for mobile devices
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rare_labs_solutions_matrix
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Data Source

The matrix data comes from Rare's Solution Search contests and has been clustered to reveal patterns across AI capabilities and conservation solutions.

Learn more at [solutionsearch.org](https://solutionsearch.org)

## Technologies

- React 18
- TypeScript
- Vite
- PapaParse (CSV parsing)

