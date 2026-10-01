import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  FileCode2,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function CodeEditor({ 
  code, 
  onChangeCode, 
  onRunCode, 
  onResetCode, 
  isRunning,
  pyodideStatus,
  isFullscreen = false,
  onToggleFullscreen
}) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 18);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    // Run code with Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunCode();
      return;
    }

    // Handle Tab key indentation (4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newCode = code.substring(0, selectionStart) + '    ' + code.substring(selectionEnd);
      onChangeCode(newCode);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + 4;
          textareaRef.current.selectionEnd = selectionStart + 4;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="editor-wrapper">
      {/* Editor Toolbar */}
      <div className="editor-toolbar">
        <div className="editor-tabs">
          <div className="editor-tab">
            <FileCode2 size={14} color="#38bdf8" />
            <span>live_build_along.py</span>
          </div>
        </div>

        <div className="editor-actions">
          <button 
            className="btn btn-outline" 
            onClick={handleCopy}
            title="Copy Code to Clipboard"
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onResetCode}
            title="Clear Live Code Editor to Empty State"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Editor & Output Console (Esc to exit)'}
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <button 
            className="btn btn-success" 
            onClick={onRunCode}
            disabled={isRunning || pyodideStatus.status !== 'ready'}
            title="Execute Code in Browser (Ctrl + Enter)"
            style={{ padding: '5px 14px', fontSize: '0.78rem' }}
          >
            <Play size={13} fill="#ffffff" />
            <span>{isRunning ? 'Running...' : 'Run Code (Ctrl+↵)'}</span>
          </button>
        </div>
      </div>

      {/* Editor Area with Line Numbers */}
      <div className="code-textarea-container">
        <div className="line-numbers" ref={lineNumbersRef}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          placeholder={`# Live coding workspace is empty for trainer live demo.
# Type Python code here or click "Load Lesson Demo Code" in Pillar 1 when ready...`}
        />
      </div>
    </div>
  );
}
