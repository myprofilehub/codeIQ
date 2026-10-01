import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  Code, 
  Sparkles, 
  Clock, 
  Layers, 
  Tv, 
  Cpu,
  Bookmark,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import PictorialConceptCard from './PictorialConceptCard';

export default function SlideShowModal({
  isOpen,
  onClose,
  currentModule,
  currentSlide,
  slideIndex,
  totalSlidesInModule,
  onPrevSlide,
  onNextSlide,
  onSelectSlideIndex,
  onLoadSlideCode
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't trigger if user is focused on an input/select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        onNextSlide && onNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        onPrevSlide && onPrevSlide();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose && onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNextSlide, onPrevSlide, onClose]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!isOpen || !currentSlide) return null;

  const replaceFrac = (str) => {
    let result = str;
    let count = 0;
    while (result.includes('\\frac') && count < 20) {
      count++;
      const idx = result.indexOf('\\frac');
      const numStart = result.indexOf('{', idx);
      if (numStart === -1) break;
      let depth = 1;
      let numEnd = numStart + 1;
      while (numEnd < result.length && depth > 0) {
        if (result[numEnd] === '{') depth++;
        else if (result[numEnd] === '}') depth--;
        numEnd++;
      }
      if (depth !== 0) break;
      const numerator = result.slice(numStart + 1, numEnd - 1);
      
      const denStart = result.indexOf('{', numEnd - 1);
      if (denStart === -1 || denStart > numEnd + 1) break;
      depth = 1;
      let denEnd = denStart + 1;
      while (denEnd < result.length && depth > 0) {
        if (result[denEnd] === '{') depth++;
        else if (result[denEnd] === '}') depth--;
        denEnd++;
      }
      if (depth !== 0) break;
      const denominator = result.slice(denStart + 1, denEnd - 1);
      
      result = result.slice(0, idx) + '(' + numerator.trim() + ') / (' + denominator.trim() + ')' + result.slice(denEnd);
    }
    return result;
  };

  // Format inline markdown for concept section
  const formatInline = (text) => {
    let clean = replaceFrac(text)
      .replace(/\$R\^2\$/g, 'R²')
      .replace(/R\^2/g, 'R²')
      .replace(/\$\s*\\longrightarrow\s*\$/g, ' ⟶ ')
      .replace(/\$\s*\\rightarrow\s*\$/g, ' → ')
      .replace(/\\longrightarrow/g, ' ⟶ ')
      .replace(/\\rightarrow/g, ' → ')
      .replace(/\\implies/g, ' ⟹ ')
      .replace(/\\times/g, ' × ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\hat\{y\}/g, 'ŷ')
      .replace(/\\bar\{y\}/g, 'ȳ')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/_\{norm\}/g, 'ₙₒᵣₘ')
      .replace(/_\{std\}/g, 'ₛₜ𝒹')
      .replace(/_\{min\}/g, 'ₘᵢₙ')
      .replace(/_\{max\}/g, 'ₘₐₓ')
      .replace(/\^2/g, '²')
      .replace(/\$([^$]+)\$/g, '$1');

    const parts = clean.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="inline-code">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const cleanMathFormula = (raw) => {
    return replaceFrac(raw)
      .replace(/^\$\$|\$\$$/g, '')
      .replace(/R\^2/g, 'R²')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\$\s*\\longrightarrow\s*\$/g, ' ⟶ ')
      .replace(/\$\s*\\rightarrow\s*\$/g, ' → ')
      .replace(/\\longrightarrow/g, ' ⟶ ')
      .replace(/\\rightarrow/g, ' → ')
      .replace(/\\implies/g, ' ⟹ ')
      .replace(/\\times/g, ' × ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\alpha/g, 'α')
      .replace(/\\hat\{y\}_i/g, 'ŷᵢ')
      .replace(/\\hat\{y\}/g, 'ŷ')
      .replace(/y_i/g, 'yᵢ')
      .replace(/\\bar\{y\}/g, 'ȳ')
      .replace(/\\partial/g, '∂')
      .replace(/\\leftarrow/g, ' ← ')
      .replace(/\\quad/g, '   ')
      .replace(/\\sum_\{[^}]+\}\^\{[^}]+\}/g, '∑')
      .replace(/\\sum/g, '∑')
      .replace(/_\{norm\}/g, 'ₙₒᵣₘ')
      .replace(/_\{std\}/g, 'ₛₜ𝒹')
      .replace(/_\{min\}/g, 'ₘᵢₙ')
      .replace(/_\{max\}/g, 'ₘₐₓ')
      .replace(/\^2/g, '²')
      .replace(/\^T/g, 'ᵀ')
      .replace(/\^\{-z\}/g, '⁻ᶻ')
      .replace(/_i/g, 'ᵢ')
      .replace(/\$([^$]+)\$/g, '$1')
      .trim();
  };

  return (
    <div className="slideshow-backdrop">
      {/* Top Presentation Progress Bar */}
      <div className="slideshow-progress-line">
        <div 
          className="slideshow-progress-fill" 
          style={{ width: `${((slideIndex + 1) / totalSlidesInModule) * 100}%` }}
        />
      </div>

      {/* Main Presentation Stage */}
      <div className="slideshow-container">
        {/* Stage Header */}
        <div className="slideshow-header">
          <div className="slideshow-meta-left">
            <span className="slideshow-module-badge">{currentModule.title}</span>
            <span className="slideshow-time-tag">
              <Clock size={13} />
              <span>{currentSlide.timeTag}</span>
            </span>
          </div>

          <div className="slideshow-meta-right">
            <select
              value={slideIndex}
              onChange={(e) => onSelectSlideIndex && onSelectSlideIndex(Number(e.target.value))}
              className="slideshow-select"
            >
              {currentModule.slides.map((s, idx) => (
                <option key={s.id} value={idx}>
                  Slide {idx + 1}: {s.title.split(':')[0]}
                </option>
              ))}
            </select>

            <span className="slideshow-counter">
              {slideIndex + 1} / {totalSlidesInModule}
            </span>

            <button 
              className="slideshow-icon-btn" 
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F11)'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button 
              className="slideshow-close-btn" 
              onClick={onClose}
              title="Exit Slide Show (Esc)"
            >
              <X size={18} />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </div>

        {/* Stage Body: 2-Column Widescreen Presentation Layout */}
        <div className="slideshow-body">
          {/* Left Presentation Column: Concepts & Mathematical Principles */}
          <div className="slideshow-col slideshow-col-text">
            <h1 className="slideshow-slide-title">{currentSlide.title}</h1>

            {/* Storyboard & Real-World Analogy */}
            {currentSlide.storyboard && (
              <div className="storyboard-box" style={{ margin: '4px 0' }}>
                <div className="storyboard-title">
                  <Sparkles size={16} color="var(--color-orange-accent)" />
                  <span>{currentSlide.storyboard.analogyTitle}</span>
                </div>
                <p className="storyboard-text" style={{ fontSize: '0.94rem', lineHeight: '1.6' }}>
                  {currentSlide.storyboard.analogyStory}
                </p>
                {currentSlide.storyboard.takeaway && (
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-blue-primary)', marginTop: '4px' }}>
                    💡 {currentSlide.storyboard.takeaway}
                  </div>
                )}
              </div>
            )}

            {/* Core Terminologies */}
            {currentSlide.terminologies && currentSlide.terminologies.length > 0 && (
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-green-primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Core Terminologies & Concepts
                </div>
                <div className="terminology-container">
                  {currentSlide.terminologies.map((t, idx) => (
                    <div key={idx} className="term-pill" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                      <strong>{t.term}:</strong>
                      <span>{t.def}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mathematical & Conceptual Formulation */}
            <div className="markdown-body" style={{ fontSize: '0.92rem' }}>
              {(() => {
                const lines = currentSlide.conceptMarkdown.split('\n');
                const rendered = [];
                let list = [];

                const flush = () => {
                  if (list.length > 0) {
                    rendered.push(
                      <ul key={`ul-${rendered.length}`} style={{ paddingLeft: '20px', margin: '6px 0' }}>
                        {list.map((it, lIdx) => (
                          <li key={lIdx} style={{ marginBottom: '4px' }}>{formatInline(it)}</li>
                        ))}
                      </ul>
                    );
                    list = [];
                  }
                };

                lines.forEach((rawLine, idx) => {
                  const line = rawLine.trim();
                  if (!line) { flush(); return; }

                  if (line.startsWith('### ')) {
                    flush();
                    rendered.push(
                      <h3 key={idx} style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0 6px 0' }}>
                        {formatInline(line.replace('### ', ''))}
                      </h3>
                    );
                  } else if (line.startsWith('#### ')) {
                    flush();
                    rendered.push(
                      <h4 key={idx} style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--color-blue-primary)', margin: '8px 0 4px 0' }}>
                        {formatInline(line.replace('#### ', ''))}
                      </h4>
                    );
                  } else if (line.startsWith('$$') && line.endsWith('$$')) {
                    flush();
                    rendered.push(
                      <div key={idx} className="math-formula-box" style={{ fontSize: '0.95rem', padding: '10px 14px' }}>
                        <span className="formula-tag">Formulation</span>
                        <span className="formula-content">{cleanMathFormula(line)}</span>
                      </div>
                    );
                  } else if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ')) {
                    list.push(line.replace(/^[-*0-9.]+\s*/, ''));
                  } else {
                    flush();
                    rendered.push(
                      <p key={idx} style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        {formatInline(line)}
                      </p>
                    );
                  }
                });

                flush();
                return rendered;
              })()}
            </div>
          </div>

          {/* Right Presentation Column: Clipart Architecture & Python Blueprint */}
          <div className="slideshow-col slideshow-col-visual">
            {/* Pictorial Concept Architecture */}
            <PictorialConceptCard slide={currentSlide} />

            {/* Python & NumPy Syntax Blueprint */}
            {currentSlide.syntaxGuide && (
              <div className="syntax-card" style={{ marginTop: '10px' }}>
                <div className="syntax-card-title" style={{ fontSize: '0.82rem' }}>
                  <Code size={16} />
                  <span>Python & NumPy Syntax Blueprint</span>
                </div>
                <pre style={{ fontSize: '0.84rem', lineHeight: '1.5' }}>{currentSlide.syntaxGuide}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Floating Presenter Control Dock */}
        <div className="slideshow-dock">
          <button 
            className="dock-nav-btn"
            onClick={onPrevSlide}
            disabled={slideIndex === 0}
            title="Previous Slide (Left Arrow or Backspace)"
          >
            <ChevronLeft size={18} />
            <span>Prev (←)</span>
          </button>

          <div className="dock-indicator">
            <span>Slide {slideIndex + 1} of {totalSlidesInModule}</span>
          </div>

          <button 
            className="dock-nav-btn"
            onClick={onNextSlide}
            disabled={slideIndex === totalSlidesInModule - 1}
            title="Next Slide (Right Arrow or Spacebar)"
          >
            <span>Next (→)</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
