import React from 'react';
import { 
  Database, 
  Download, 
  Terminal, 
  Award,
  Code2
} from 'lucide-react';

export default function Header({ 
  pyodideStatus, 
  onOpenDatasetModal, 
  currentDatasetName,
  currentCode,
  currentSlideTitle,
  completedChallengesCount,
  totalChallengesCount,
  activeMainTab = 'studio',
  onSelectMainTab
}) {
  const handleExportCode = () => {
    const blob = new Blob([
      `# ========================================================\n` +
      `# CodeIQ: NumPy & Machine Learning Corporate Training Code\n` +
      `# Current Topic: ${currentSlideTitle}\n` +
      `# Generated: ${new Date().toLocaleString()}\n` +
      `# ========================================================\n\n` +
      currentCode
    ], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeiq_training_${Date.now()}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="top-header">
      {/* Brand & Title */}
      <div className="brand-section">
        <div className="brand-logo-badge">
          <Code2 size={22} color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">
            <span>CodeIQ</span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span className="highlight-blue">NumPy</span>
            <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>&</span>
            <span className="highlight-green">Machine Learning</span>
          </div>
          <div className="brand-subtitle">
            <span style={{ color: 'var(--color-orange-accent)', fontWeight: 700 }}>Build-Along</span> Studio for Corporate Professionals
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        {/* Runtime Status */}
        <div className={`engine-status-pill ${pyodideStatus.status}`}>
          <Terminal size={14} color={pyodideStatus.status === 'ready' ? 'var(--color-green-primary)' : 'var(--color-orange-primary)'} />
          {pyodideStatus.status === 'ready' ? (
            <span>
              Python: <span className="live-blink-text">Live</span>
            </span>
          ) : (
            <span>Loading Engine...</span>
          )}
        </div>

        {/* Dataset Hub Button */}
        <button 
          className="btn btn-secondary" 
          onClick={onOpenDatasetModal}
          title="Open CSV Dataset Hub & Diagnostic Inspector"
          style={{ borderColor: 'var(--color-blue-border)' }}
        >
          <Database size={15} color="var(--color-blue-accent)" />
          <span>Dataset: <strong>{currentDatasetName}</strong></span>
        </button>

        {/* Progress Badge (Clickable to switch to Assignments) */}
        <button 
          className="btn-outline" 
          onClick={() => onSelectMainTab && onSelectMainTab('assignments')}
          style={{ padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', borderColor: 'var(--color-green-border)', background: 'var(--color-green-bg)', cursor: 'pointer' }}
          title="Click to open Assignments Tab"
        >
          <Award size={15} color="var(--color-green-primary)" />
          <span style={{ color: 'var(--color-green-primary)', fontWeight: 700 }}>Assignments: {completedChallengesCount}/{totalChallengesCount}</span>
        </button>

        {/* Export Code Button */}
        <button 
          className="btn btn-primary" 
          onClick={handleExportCode}
          title="Download Current Code Script (.py)"
        >
          <Download size={14} />
          <span>Export Code</span>
        </button>
      </div>
    </header>
  );
}
