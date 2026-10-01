import React from 'react';
import { 
  Terminal, 
  Trash2, 
  Zap, 
  AlertCircle, 
  BarChart3, 
  Image as ImageIcon 
} from 'lucide-react';

export default function OutputConsole({ 
  stdout, 
  stderr, 
  executionTimeMs, 
  plotImages, 
  onClearConsole 
}) {
  return (
    <div className="console-wrapper">
      {/* Console Header */}
      <div className="console-header">
        <div className="console-title">
          <Terminal size={14} color="var(--color-blue-accent)" />
          <span>Interactive Output Console & Plots</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {executionTimeMs !== null && (
            <span style={{ fontSize: '0.74rem', color: 'var(--color-green-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={13} color="var(--color-green-accent)" />
              <span>{executionTimeMs} ms</span>
            </span>
          )}

          <button 
            className="btn-outline" 
            onClick={onClearConsole}
            title="Clear Console Output"
            style={{ padding: '2px 6px', fontSize: '0.72rem', border: 'none', cursor: 'pointer', background: 'transparent' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Console Content Area */}
      <div className="console-content">
        {/* Render Generated Matplotlib Figures */}
        {plotImages && plotImages.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-blue-primary)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <BarChart3 size={14} />
              <span>Generated Matplotlib Plot</span>
            </div>
            {plotImages.map((imgSrc, idx) => (
              <div key={idx} className="plot-container">
                <img src={imgSrc} alt={`Generated plot ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}

        {/* Stdout Text */}
        {stdout ? (
          <div>{stdout}</div>
        ) : (
          !stderr && (!plotImages || plotImages.length === 0) && (
            <div style={{ color: '#475569', fontStyle: 'italic' }}>
              Terminal output will appear here when you click "Run Code" (or press Ctrl + Enter)...
            </div>
          )
        )}

        {/* Stderr Error Display */}
        {stderr && (
          <div className="console-error">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
              <AlertCircle size={14} />
              <span>Python Traceback / Error:</span>
            </div>
            <div>{stderr}</div>
          </div>
        )}
      </div>
    </div>
  );
}
