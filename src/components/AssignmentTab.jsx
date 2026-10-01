import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Code2, 
  Sparkles, 
  RotateCcw, 
  Search, 
  Filter, 
  ExternalLink, 
  Check, 
  Copy, 
  Lightbulb, 
  ArrowRight,
  BookOpen,
  Terminal,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AssignmentTab({
  curriculumModules,
  completedChallenges,
  onChallengePassed,
  onRunTest,
  isTesting,
  onLoadChallengeToEditor,
  onSwitchToStudio
}) {
  // Extract all 24 challenges with module context
  const allAssignments = [];
  curriculumModules.forEach((mod) => {
    mod.slides.forEach((slide, sIdx) => {
      if (slide.challenge) {
        allAssignments.push({
          ...slide.challenge,
          moduleNumber: mod.moduleNumber,
          moduleTitle: mod.title,
          slideIndex: sIdx,
          slideId: slide.id,
          slideTitle: slide.title,
          trackName: `Track ${mod.moduleNumber}`
        });
      }
    });
  });

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    allAssignments[0]?.id || null
  );
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('all'); // 'all' | 1 | 2 | 3
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [searchQuery, setSearchQuery] = useState('');

  // Per-assignment code workspace in assignment tab
  const [assignmentCodeMap, setAssignmentCodeMap] = useState({});
  const [assignmentTestResults, setAssignmentTestResults] = useState({});
  const [copied, setCopied] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const selectedAssignment = allAssignments.find((a) => a.id === selectedAssignmentId) || allAssignments[0];
  const isSelectedCompleted = selectedAssignment && completedChallenges[selectedAssignment.id];

  // Current code for selected assignment
  const currentAssignmentCode = (selectedAssignment && assignmentCodeMap[selectedAssignment.id]) !== undefined
    ? assignmentCodeMap[selectedAssignment.id]
    : (selectedAssignment?.initialCode || '');

  const setCodeForCurrent = (newCode) => {
    if (!selectedAssignment) return;
    setAssignmentCodeMap((prev) => ({ ...prev, [selectedAssignment.id]: newCode }));
  };

  // Filter assignments
  const filteredAssignments = allAssignments.filter((item) => {
    if (selectedTrackFilter !== 'all' && item.moduleNumber !== selectedTrackFilter) {
      return false;
    }
    const isDone = !!completedChallenges[item.id];
    if (selectedStatusFilter === 'completed' && !isDone) return false;
    if (selectedStatusFilter === 'pending' && isDone) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchPrompt = item.prompt.toLowerCase().includes(q);
      if (!matchTitle && !matchPrompt) return false;
    }
    return true;
  });

  const totalCount = allAssignments.length;
  const completedCount = Object.keys(completedChallenges).length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  // Test Runner inside Assignment tab
  const handleTestRun = async () => {
    if (!selectedAssignment) return;
    const testCode = selectedAssignment.testCode;
    const userCode = currentAssignmentCode;

    const res = await onRunTest(userCode, testCode);
    setAssignmentTestResults((prev) => ({ ...prev, [selectedAssignment.id]: res }));

    if (res && res.passed) {
      onChallengePassed(selectedAssignment.id);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentAssignmentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadAndOpenInStudio = () => {
    if (!selectedAssignment) return;
    onLoadChallengeToEditor(currentAssignmentCode);
    onSwitchToStudio();
  };

  return (
    <div className="assignment-tab-container">
      {/* Top Banner & Progress Bar */}
      <div className="assignment-banner">
        <div className="assignment-banner-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div className="badge-pill" style={{ background: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }}>
                <Award size={13} color="#0284c7" />
                <span>Assignment Portal</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>3-Hour Hands-On Practice Suite</span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Practical Coding Assignments & Automated Assertions
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
              All 24 real-world coding challenges across NumPy Foundations, Advanced Sensor Matrices, and Machine Learning with Scikit-Learn.
            </p>
          </div>

          {/* Progress Widget */}
          <div className="assignment-progress-widget">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Overall Completion</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#16a34a' }}>
                {completedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="assignment-progress-bar-bg">
              <div 
                className="assignment-progress-bar-fill" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
              <span style={{ color: '#0284c7' }}>Track 1: {allAssignments.filter(a => a.moduleNumber === 1 && completedChallenges[a.id]).length}/8</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: '#ea580c' }}>Track 2: {allAssignments.filter(a => a.moduleNumber === 2 && completedChallenges[a.id]).length}/8</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: '#16a34a' }}>Track 3: {allAssignments.filter(a => a.moduleNumber === 3 && completedChallenges[a.id]).length}/8</span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="assignment-filters-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Filter Track:</span>
            {[
              { id: 'all', label: 'All Tracks (24)' },
              { id: 1, label: 'Track 1: Foundations (8)' },
              { id: 2, label: 'Track 2: Advanced (8)' },
              { id: 3, label: 'Track 3: ML Basics (8)' }
            ].map((t) => (
              <button
                key={t.id}
                className={`filter-btn ${selectedTrackFilter === t.id ? 'active' : ''}`}
                onClick={() => setSelectedTrackFilter(t.id)}
              >
                {t.label}
              </button>
            ))}

            <div style={{ height: '18px', width: '1px', background: '#cbd5e1', margin: '0 4px' }} />

            <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Status:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'completed', label: 'Passed ✅' },
              { id: 'pending', label: 'Pending ⏳' }
            ].map((s) => (
              <button
                key={s.id}
                className={`filter-btn ${selectedStatusFilter === s.id ? 'active' : ''}`}
                onClick={() => setSelectedStatusFilter(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="assignment-search-box">
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search assignments by topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="assignment-workbench-grid">
        {/* Left Column: Assignment Master List */}
        <div className="assignment-list-pane">
          <div className="assignment-list-header">
            <span>Assignments List ({filteredAssignments.length})</span>
          </div>

          <div className="assignment-list-scroll">
            {filteredAssignments.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No assignments match the selected filters.
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const isSelected = selectedAssignment?.id === assignment.id;
                const isPassed = !!completedChallenges[assignment.id];

                return (
                  <button
                    key={assignment.id}
                    className={`assignment-card-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAssignmentId(assignment.id);
                      setShowSolution(false);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className={`track-pill track-${assignment.moduleNumber}`}>
                        Track {assignment.moduleNumber} • Slide {assignment.slideIndex + 1}
                      </span>
                      {isPassed ? (
                        <span className="status-badge passed">
                          <CheckCircle2 size={12} />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="status-badge pending">
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="assignment-card-title">
                      {assignment.title}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      {assignment.slideTitle}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Assignment Detail & Code Testing Workbench */}
        {selectedAssignment ? (
          <div className="assignment-detail-pane">
            {/* Detail Header */}
            <div className="assignment-detail-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className={`track-pill track-${selectedAssignment.moduleNumber}`}>
                    {selectedAssignment.trackName}: {selectedAssignment.moduleTitle}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Lecture Reference: {selectedAssignment.slideTitle}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  {selectedAssignment.title}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isSelectedCompleted && (
                  <div className="status-badge passed" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={14} />
                    <span>Challenge Completed</span>
                  </div>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={handleLoadAndOpenInStudio}
                  title="Load this assignment into the Live Studio 3-pillar editor"
                >
                  <ExternalLink size={13} color="var(--color-blue-accent)" />
                  <span>Open in Live Studio</span>
                </button>
              </div>
            </div>

            {/* Prompt & Specifications Box */}
            <div className="assignment-prompt-box">
              <div style={{ fontWeight: 700, color: '#0284c7', marginBottom: '6px', fontSize: '0.85rem' }}>
                📋 Assignment Specification:
              </div>
              <p style={{ margin: 0, color: '#1e293b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {selectedAssignment.prompt.replace(/\\hat\{y\}/g, 'ŷ').replace(/\\ge/g, '≥').replace(/\\le/g, '≤')}
              </p>
            </div>

            {/* Interactive Code Editor in Assignment Tab */}
            <div className="assignment-code-section">
              <div className="assignment-editor-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={14} color="#0284c7" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Solution Workspace (Python / NumPy / Scikit-Learn)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn btn-outline"
                    onClick={handleCopyCode}
                    style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                  >
                    {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setCodeForCurrent(selectedAssignment.initialCode)}
                    style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                    title="Reset to original assignment starter code"
                  >
                    <RotateCcw size={12} />
                    <span>Reset Template</span>
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowSolution(!showSolution)}
                    style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                  >
                    <Lightbulb size={12} color="#f59e0b" />
                    <span>{showSolution ? 'Hide Solution' : 'Solution Code'}</span>
                  </button>
                </div>
              </div>

              {/* Solution reveal if toggled */}
              {showSolution && selectedAssignment.solutionCode && (
                <div className="assignment-solution-box">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>
                    💡 Verified Solution Reference:
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.8rem', color: '#78350f', fontFamily: 'monospace', fontWeight: 600 }}>
                    {selectedAssignment.solutionCode}
                  </pre>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCodeForCurrent(selectedAssignment.solutionCode)}
                    style={{ marginTop: '8px', fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    Load Solution into Editor
                  </button>
                </div>
              )}

              <textarea
                className="assignment-code-textarea"
                value={currentAssignmentCode}
                onChange={(e) => setCodeForCurrent(e.target.value)}
                spellCheck={false}
                placeholder="# Write your assignment solution function here..."
              />

              {/* Action Bar */}
              <div className="assignment-action-bar">
                <button
                  className="btn btn-success"
                  onClick={handleTestRun}
                  disabled={isTesting}
                  style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {isTesting ? <RefreshCw size={14} className="spin" /> : <Play size={14} fill="#ffffff" />}
                  <span>{isTesting ? 'Running Pyodide Unit Tests...' : '🧪 Run Automated Test Assertions'}</span>
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleLoadAndOpenInStudio}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <span>Open & Run in Live Studio</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Test Output Box */}
              {assignmentTestResults[selectedAssignment.id] && (() => {
                const res = assignmentTestResults[selectedAssignment.id];
                return (
                  <div className={`assignment-test-result-box ${res.passed ? 'passed' : 'failed'}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
                      {res.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      <span>{res.passed ? 'All Automated Test Assertions Passed! 🎉' : 'Assertion Failure / Error:'}</span>
                    </div>
                    <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {res.passed ? res.stdout : res.error}
                    </pre>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Select an assignment from the list on the left.
          </div>
        )}
      </div>
    </div>
  );
}
