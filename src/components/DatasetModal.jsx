import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  X, 
  UploadCloud, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Code, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';

export default function DatasetModal({ 
  isOpen, 
  onClose, 
  currentDataset, 
  onSelectDataset,
  onMountAndInjectCode 
}) {
  const [activeDataset, setActiveDataset] = useState(currentDataset || SAMPLE_DATASETS[0]);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [diagnosticReport, setDiagnosticReport] = useState(null);

  // Parse active dataset whenever it changes
  React.useEffect(() => {
    if (!activeDataset) return;

    Papa.parse(activeDataset.csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;
        const columns = results.meta.fields || [];

        // Compute diagnostics on the raw CSV data
        const nanCounts = {};
        columns.forEach((col) => {
          let nans = 0;
          rows.forEach((r) => {
            const val = r[col];
            if (val === undefined || val === null || val === '' || val === 'NaN' || val === 'nan') {
              nans++;
            }
          });
          if (nans > 0) nanCounts[col] = nans;
        });

        setParsedPreview(rows.slice(0, 7));
        setDiagnosticReport({
          rowCount: rows.length,
          colCount: columns.length,
          columns,
          nanCounts,
          description: activeDataset.description,
          diagnostics: activeDataset.diagnostics
        });
      }
    });
  }, [activeDataset]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const customDataset = {
        id: `custom_${Date.now()}`,
        name: file.name,
        filename: file.name,
        description: 'Custom trainee uploaded CSV dataset for hands-on preprocessing and ML.',
        recommendedFor: 'Custom Hands-On Modeling',
        csvContent: csvText,
        diagnostics: null
      };
      setActiveDataset(customDataset);
      onSelectDataset(customDataset);
    };
    reader.readAsText(file);
  };

  const handleMountAndApply = () => {
    onSelectDataset(activeDataset);
    const pythonSnippet = 
`import pandas as pd
import numpy as np

# 1. Load the RAW, UNTOUCHED dataset mounted in memory:
df = pd.read_csv('/uploaded_data.csv')
print("--- Raw Dataset Initial Preview ---")
print(df.head())
print(f"Dataset Shape: {df.shape}")

# 2. Extract features into pure NumPy array:
# TODO: Write your student-led data preprocessing pipeline below!
# - Detect and impute missing values (NaNs)
# - Standardize or normalize feature columns
# - Split into train/test partitions
`;
    onMountAndInjectCode(activeDataset, pythonSnippet);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="dataset-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={22} color="var(--color-blue-accent)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                CSV Dataset Hub & Diagnostic Inspector
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Inspect raw dataset health, detect NaNs, and mount into the in-browser Python workspace
              </p>
            </div>
          </div>
          <button className="btn-outline" onClick={onClose} style={{ padding: '4px', border: 'none', cursor: 'pointer', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Pedagogical Banner */}
          <div className="diagnostic-alert">
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-orange-primary)' }}>Strictly Raw & Untouched Data (Pedagogical Rule):</strong>
              <div style={{ color: '#334155', marginTop: '2px' }}>
                Datasets are loaded without automated preprocessing. The Diagnostic Inspector below acts as an exploratory diagnostic tool so trainees can identify data quality issues and write pure NumPy code to clean, impute, scale, and split the data.
              </div>
            </div>
          </div>

          {/* Dataset Selector Grid */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Select Training Dataset:
            </div>
            <div className="dataset-grid">
              {SAMPLE_DATASETS.map((ds) => (
                <div 
                  key={ds.id} 
                  className={`dataset-choice-card ${activeDataset?.id === ds.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveDataset(ds);
                    onSelectDataset(ds);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <code style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--color-blue-primary)', fontFamily: 'monospace', background: 'var(--color-blue-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-blue-border)' }}>
                      {ds.filename || ds.name}
                    </code>
                    <FileText size={16} color={activeDataset?.id === ds.id ? 'var(--color-blue-accent)' : 'var(--text-muted)'} />
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{ds.description}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-orange-primary)', fontWeight: 700 }}>Recommended: {ds.recommendedFor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom File Upload Dropzone */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Or Upload Custom Corporate CSV:
            </div>
            <label className="dropzone" style={{ display: 'block' }}>
              <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
              <UploadCloud size={28} color="var(--color-blue-accent)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Click or drag & drop custom .csv file here
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Files are processed 100% locally in your browser (no server upload)
              </div>
            </label>
          </div>

          {/* Diagnostic Inspector & Raw Preview */}
          {diagnosticReport && (
            <div className="diagnostic-container">
              <div className="diagnostic-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="var(--color-orange-accent)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Diagnostic Inspection: {activeDataset.filename}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-blue-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {diagnosticReport.rowCount} rows × {diagnosticReport.colCount} columns
                </div>
              </div>

              {/* Data Health Findings */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {/* Missing values diagnosis */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Missing Values (NaNs)</div>
                  {Object.keys(diagnosticReport.nanCounts).length > 0 ? (
                    <div style={{ color: '#b91c1c', fontSize: '0.82rem', fontWeight: 700 }}>
                      ⚠️ {Object.entries(diagnosticReport.nanCounts).map(([col, cnt]) => `${col}: ${cnt} NaNs`).join(', ')}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--color-green-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
                      ✓ Clean: 0 missing values detected
                    </div>
                  )}
                </div>

                {/* Scale Disparities diagnosis */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Feature Scale Disparities</div>
                  <div style={{ color: 'var(--color-orange-primary)', fontSize: '0.78rem', fontWeight: 600 }}>
                    {activeDataset.diagnostics?.scaleDisparities || 'Check column ranges in table below'}
                  </div>
                </div>

                {/* Target Column */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1.5px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Target Column for ML</div>
                  <div style={{ color: 'var(--color-blue-primary)', fontSize: '0.82rem', fontWeight: 700 }}>
                    {activeDataset.diagnostics?.targetCol || 'User Defined'}
                  </div>
                </div>
              </div>

              {/* Raw 5-Row Data Preview Table */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                <table className="data-table-preview">
                  <thead>
                    <tr>
                      {diagnosticReport.columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPreview && parsedPreview.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {diagnosticReport.columns.map((col, cIdx) => {
                          const val = row[col];
                          const isNan = val === undefined || val === null || val === '' || val === 'NaN' || val === 'nan';
                          return (
                            <td key={cIdx} className={isNan ? 'nan-cell' : ''}>
                              {isNan ? 'NaN (Missing)' : val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '16px 20px', background: '#ffffff', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Virtual Memory Path: <code style={{ color: 'var(--color-blue-primary)', background: 'var(--color-blue-bg)', border: '1px solid var(--color-blue-border)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>/{activeDataset?.filename || 'uploaded_data.csv'}</code>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleMountAndApply}>
              <Sparkles size={14} />
              <span>Mount Dataset & Load Preprocessing Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
