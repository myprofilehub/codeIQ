import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Bug, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Award, 
  Sparkles, 
  Lightbulb, 
  RefreshCw,
  Code2,
  Terminal,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPollPanel({ 
  currentSlide, 
  currentCode, 
  onLoadCodeToEditor,
  onRunTest,
  isTesting,
  onSwitchToAssignments
}) {
  // State for Conceptual Poll
  const [selectedPollOption, setSelectedPollOption] = useState(null);
  const [hasSubmittedPoll, setHasSubmittedPoll] = useState(false);

  // State for Find the Output MCQ
  const [selectedOutputOption, setSelectedOutputOption] = useState(null);
  const [hasSubmittedOutput, setHasSubmittedOutput] = useState(false);

  // State for Debugging Challenge
  const [debugTestResult, setDebugTestResult] = useState(null);
  const [isVerifyingDebug, setIsVerifyingDebug] = useState(false);
  const [showDebugHint, setShowDebugHint] = useState(false);

  // Reset selections when slide changes
  useEffect(() => {
    setSelectedPollOption(null);
    setHasSubmittedPoll(false);
    setSelectedOutputOption(null);
    setHasSubmittedOutput(false);
    setDebugTestResult(null);
    setShowDebugHint(false);
  }, [currentSlide?.id]);

  const poll = currentSlide?.poll;
  const debuggingQuestion = currentSlide?.debuggingQuestion;
  const outputMCQ = currentSlide?.outputMCQ;

  // Poll submission handler
  const handleSelectPollOption = (idx) => {
    if (hasSubmittedPoll) return;
    setSelectedPollOption(idx);
    setHasSubmittedPoll(true);

    if (idx === poll.correctIndex) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  // Find the Output MCQ submission handler
  const handleSelectOutputOption = (idx) => {
    if (hasSubmittedOutput) return;
    setSelectedOutputOption(idx);
    setHasSubmittedOutput(true);

    if (idx === outputMCQ.correctIndex) {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.8 },
      });
    }
  };

  // Verify Debug Fix handler
  const handleVerifyDebugFix = async () => {
    if (!debuggingQuestion) return;
    setIsVerifyingDebug(true);
    try {
      const res = await onRunTest(currentCode, debuggingQuestion.testCode);
      setDebugTestResult(res);
      if (res && res.passed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 }
        });
      }
    } catch (err) {
      setDebugTestResult({ passed: false, error: err.message });
    } finally {
      setIsVerifyingDebug(false);
    }
  };

  return (
    <div className="workspace-column" style={{ width: '100%' }}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-header-title">
          <Award size={16} color="var(--color-orange-accent)" />
          <span>Pillar 3: Active Assessment</span>
        </div>
        {onSwitchToAssignments && (
          <button
            className="btn btn-outline"
            onClick={onSwitchToAssignments}
            title="Open dedicated Assignment tab"
            style={{ padding: '2px 8px', fontSize: '0.72rem' }}
          >
            <span>Assignments Tab</span>
            <ArrowRight size={11} />
          </button>
        )}
      </div>

      <div className="panel-content">
        {/* =========================================
            SECTION 1: LIVE CONCEPTUAL POLL / MCQ
            ========================================= */}
        {poll && (
          <div className="quiz-card">
            <div className="quiz-type-badge">
              <HelpCircle size={13} />
              <span>1. Live Conceptual Poll</span>
            </div>

            <h3 className="quiz-question">{poll.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {poll.options.map((opt, idx) => {
                const isSelected = selectedPollOption === idx;
                const isCorrect = idx === poll.correctIndex;
                let btnClass = 'poll-option-btn';

                if (hasSubmittedPoll) {
                  if (isCorrect) btnClass += ' correct';
                  else if (isSelected) btnClass += ' incorrect';
                } else if (isSelected) {
                  btnClass += ' selected';
                }

                const percent = poll.communityDistribution ? poll.communityDistribution[idx] : 25;

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelectPollOption(idx)}
                    disabled={hasSubmittedPoll}
                  >
                    {hasSubmittedPoll && (
                      <div 
                        className="poll-bar" 
                        style={{ 
                          width: `${percent}%`,
                          backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.1)'
                        }} 
                      />
                    )}

                    <div className="poll-text">
                      <span style={{ fontWeight: 600, marginRight: '6px' }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </div>

                    {hasSubmittedPoll && (
                      <span className="poll-percent" style={{ color: isCorrect ? '#34d399' : '#94a3b8' }}>
                        {percent}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Post-Poll Feedback & Explanation */}
            {hasSubmittedPoll && (
              <div className="quiz-explanation">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: selectedPollOption === poll.correctIndex ? '#34d399' : '#fb7185', marginBottom: '4px' }}>
                  {selectedPollOption === poll.correctIndex ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={15} />
                      <span>Incorrect Choice</span>
                    </>
                  )}
                </div>
                <div>{poll.explanation}</div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            SECTION 2: CODE DEBUGGING CHALLENGE
            ========================================= */}
        {debuggingQuestion && (
          <div className="debug-card">
            <div className="quiz-type-badge" style={{ color: '#15803d', borderColor: 'rgba(22, 163, 74, 0.35)', backgroundColor: 'rgba(22, 163, 74, 0.1)' }}>
              <Bug size={13} color="#15803d" />
              <span>2. Code Debugging Challenge</span>
            </div>

            <h3 className="challenge-title" style={{ color: '#000000' }}>
              {debuggingQuestion.title}
            </h3>

            <div className="debug-scenario-text">
              {debuggingQuestion.scenario}
            </div>

            {/* Buggy Snippet Preview */}
            <div className="debug-code-box">
              <div className="debug-code-header">
                <span>⚠️ Buggy Code Snippet:</span>
              </div>
              <pre className="debug-code-pre">
                {debuggingQuestion.buggyCode}
              </pre>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => onLoadCodeToEditor(debuggingQuestion.buggyCode)}
                style={{ justifyContent: 'center' }}
                title="Loads this broken snippet into the live code editor so you can fix it"
              >
                <Code2 size={14} color="var(--color-orange-accent)" />
                <span>Load Buggy Code to Live Editor</span>
              </button>

              <button 
                className="btn btn-primary"
                onClick={handleVerifyDebugFix}
                disabled={isVerifyingDebug}
                style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', borderColor: '#ea580c' }}
                title="Runs automated tests to verify your fix in the live editor"
              >
                {isVerifyingDebug ? <RefreshCw size={14} className="spin" /> : <Play size={14} fill="#ffffff" />}
                <span>{isVerifyingDebug ? 'Testing Fix in Pyodide...' : '🧪 Verify My Bug Fix'}</span>
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setShowDebugHint(!showDebugHint)}
                style={{ padding: '4px 8px', fontSize: '0.74rem', justifyContent: 'center', borderColor: '#334155' }}
              >
                <Lightbulb size={12} color="#f59e0b" />
                <span>{showDebugHint ? 'Hide Debug Hint' : 'Show Debug Hint & Fix'}</span>
              </button>
            </div>

            {/* Debug Hint & Solution Explanation */}
            {showDebugHint && (
              <div className="debug-hint-box">
                <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>
                  💡 Debug Clue:
                </div>
                <div style={{ marginBottom: '6px' }}>{debuggingQuestion.hint}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                  <strong>Root Cause: </strong>{debuggingQuestion.solutionExplanation}
                </div>
              </div>
            )}

            {/* Verification Result Alert */}
            {debugTestResult && (
              <div className={`test-result-box ${debugTestResult.passed ? 'passed' : 'failed'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                  {debugTestResult.passed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                  <span>{debugTestResult.passed ? 'Bug Fixed! All Assertions Passed! 🎉' : 'Fix Incomplete / Assertion Failed:'}</span>
                </div>
                <div>{debugTestResult.passed ? debugTestResult.stdout : debugTestResult.error}</div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            SECTION 3: FIND THE OUTPUT BASED MCQ
            ========================================= */}
        {outputMCQ && (
          <div className="output-mcq-card">
            <div className="quiz-type-badge" style={{ color: '#1e3a8a', borderColor: 'rgba(30, 58, 138, 0.35)', backgroundColor: 'rgba(30, 58, 138, 0.08)' }}>
              <Search size={13} color="#1e3a8a" />
              <span>3. Find the Output (Code Tracing)</span>
            </div>

            <h3 className="quiz-question" style={{ marginBottom: '8px' }}>
              {outputMCQ.question}
            </h3>

            {/* Code Snippet Box */}
            <div className="mcq-code-snippet-box">
              <pre className="mcq-code-snippet-pre">
                {outputMCQ.codeSnippet}
              </pre>
            </div>

            {/* 4 Clickable Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {outputMCQ.options.map((opt, idx) => {
                const isSelected = selectedOutputOption === idx;
                const isCorrect = idx === outputMCQ.correctIndex;
                let btnClass = 'poll-option-btn';

                if (hasSubmittedOutput) {
                  if (isCorrect) btnClass += ' correct';
                  else if (isSelected) btnClass += ' incorrect';
                } else if (isSelected) {
                  btnClass += ' selected';
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelectOutputOption(idx)}
                    disabled={hasSubmittedOutput}
                  >
                    <div className="poll-text">
                      <span style={{ fontWeight: 600, marginRight: '6px', color: '#94a3b8' }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{opt}</code>
                    </div>

                    {hasSubmittedOutput && isCorrect && (
                      <CheckCircle2 size={16} color="#34d399" />
                    )}
                    {hasSubmittedOutput && isSelected && !isCorrect && (
                      <XCircle size={16} color="#fb7185" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Breakdown */}
            {hasSubmittedOutput && (
              <div className="quiz-explanation" style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: selectedOutputOption === outputMCQ.correctIndex ? '#34d399' : '#fb7185', marginBottom: '4px' }}>
                  {selectedOutputOption === outputMCQ.correctIndex ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Exact Output Match!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={15} />
                      <span>Incorrect Output</span>
                    </>
                  )}
                </div>
                <div>{outputMCQ.explanation}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
