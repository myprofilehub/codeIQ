# CodeIQ: Interactive NumPy & Machine Learning Corporate Training Studio

An engaging, enterprise-grade, browser-based **Build-Along Studio** designed for a **3-Hour Intensive Corporate Training Session** covering NumPy from first principles to Applied Machine Learning.

---

## 🌟 Key Architecture & Highlights

1. **Unified Build-Along Workflow (No Mode Toggles)**:
   - **Pillar 1: Concept & Syntax (Left Panel)**: Presentation slides with visual memory diagrams, mathematical formulas, key terminology cards, syntax cheat-sheets, and a 1-click **"Load into Live Editor ➔"** action.
   - **Pillar 2: Live Hands-On Implementation (Center Panel)**: In-browser Python live code editor (with syntax highlighting, line numbers, Tab-indentation, and `Ctrl + Enter` execution) executing via **Pyodide WebAssembly**. Trainees write code directly in the browser with **zero local installation required**.
   - **Pillar 3: Active Assessment Checkpoints (Right Panel)**: Live conceptual multiple-choice polls with simulated corporate audience distribution stats and in-depth explanations, paired with **Hands-on Coding Challenges** validated with client-side automated unit test assertions (`Test My Code`).

2. **Strictly Raw CSV Dataset Hub & Diagnostic Inspector**:
   - The uploaded CSV remains **100% raw and untouched in memory** (`/uploaded_data.csv`).
   - The **Diagnostic Inspector** acts as a read-only data health "X-ray", highlighting missing values (`NaN` counts), categorical columns, and feature scale disparities.
   - **Student-Led Preprocessing**: Trainees actively write the pure NumPy code in the live editor to impute missing values, scale features using broadcasting, and partition train/test sets from scratch.

3. **3-Hour Comprehensive Curriculum Breakdown**:
   - **Module 1 (00:00 - 00:50)**: NumPy Foundations & Vectorization (`ndarray` memory anatomy vs Python lists, creation routines, 2D indexing/slicing, vectorization vs loops benchmark).
   - **Module 2 (00:50 - 01:40)**: Advanced NumPy, Broadcasting & Feature Scaling (Broadcasting rules, boolean masking, `@` matrix dot product, manual Min-Max & Z-Score standardization).
   - **Module 3 (01:50 - 02:40)**: Machine Learning Fundamentals & Workflow (Reproducible Train/Test split in pure NumPy, Linear Regression & Gradient Descent loss minimization, Logistic Regression & Sigmoid activation, Model Evaluation: MSE, R², Confusion Matrix).
   - **Module 4 (02:40 - 03:00)**: Capstone Mini-Project on Raw CSV Data (End-to-end hands-on project: load raw CSV, diagnose, impute, scale, fit model, predict, evaluate).

---

## 🚀 Running Locally

The dev server is currently running at:
```bash
http://localhost:5174/
```

To run manually:
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build verification
npm run build
```
