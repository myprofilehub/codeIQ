import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  BookOpen, 
  Sparkles, 
  Lightbulb,
  Cpu,
  Bookmark,
  CheckCircle2,
  Play
} from 'lucide-react';
import PictorialConceptCard from './PictorialConceptCard';
import SlideShowModal from './SlideShowModal';

export default function SlideDeck({ 
  currentModule, 
  currentSlide, 
  slideIndex, 
  totalSlidesInModule, 
  onPrevSlide, 
  onNextSlide, 
  onSelectSlideIndex, 
  onLoadSlideCode 
}) {
  const [isSlideShowOpen, setIsSlideShowOpen] = useState(false);

  // Global hotkey to open presentation mode (F5 or P)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'F5' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsSlideShowOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  if (!currentSlide) return null;

  return (
    <div className="workspace-column" style={{ width: '100%' }}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-header-title">
          <BookOpen size={16} color="var(--color-blue-accent)" />
          <span style={{ color: 'var(--text-primary)' }}>Pillar 1: Visual Slides & Concepts</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn-slideshow-trigger"
            onClick={() => setIsSlideShowOpen(true)}
            title="Launch Fullscreen Slide Show Mode (F5 or P)"
          >
            <Play size={11} fill="currentColor" />
            <span>Slide Show</span>
          </button>

          <select
            value={slideIndex}
            onChange={(e) => onSelectSlideIndex && onSelectSlideIndex(Number(e.target.value))}
            style={{ 
              padding: '3px 8px', 
              borderRadius: '4px', 
              border: '1.5px solid var(--border-medium)', 
              background: '#ffffff', 
              color: 'var(--color-blue-primary)', 
              fontSize: '0.75rem', 
              fontWeight: 700,
              cursor: 'pointer',
              maxWidth: '180px'
            }}
            title="Jump directly to any lesson in this module"
          >
            {currentModule.slides.map((s, idx) => (
              <option key={s.id} value={idx}>
                {idx + 1}. {s.title.split(':')[0]}
              </option>
            ))}
          </select>
          <span className="slide-counter">
            ({slideIndex + 1}/{totalSlidesInModule})
          </span>
        </div>
      </div>

      {/* Slide Scrollable Content */}
      <div className="panel-content">
        <div className="slide-card">
          {/* Header Metadata */}
          <div className="slide-header-badge">
            <span className="slide-tag">Module {currentModule.moduleNumber}: {currentModule.title.split('&')[0]}</span>
            <span className="slide-time-tag">⏱ {currentSlide.timeTag}</span>
          </div>

          {/* Slide Title */}
          <h2 className="slide-title">{currentSlide.title}</h2>

          {/* ========================================================
              STORYBOARD & REAL-WORLD ANALOGY BOX (Core requirement)
              ======================================================== */}
          {currentSlide.storyboard && (
            <div className="storyboard-box">
              <div className="storyboard-title">
                <Lightbulb size={16} color="var(--color-orange-accent)" />
                <span>{currentSlide.storyboard.analogyTitle}</span>
              </div>
              <p className="storyboard-text">
                {currentSlide.storyboard.analogyStory}
              </p>
              <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-green-primary)', fontWeight: 700, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{currentSlide.storyboard.takeaway}</span>
              </div>
            </div>
          )}

          {/* Terminology Badges (Green theme) */}
          {currentSlide.terminologies && currentSlide.terminologies.length > 0 && (
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-green-primary)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Core Terminologies & Technical Jargon
              </div>
              <div className="terminology-container">
                {currentSlide.terminologies.map((t, idx) => (
                  <div key={idx} className="term-pill" title={t.def}>
                    <strong>{t.term}:</strong>
                    <span>{t.def}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concept Explanation Markdown */}
          <div className="markdown-body">
            {(() => {
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

              const formatInline = (text) => {
                // Clean up LaTeX tokens if present
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

                // Parse `code` and **bold**
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

              // Split content by lines to isolate headers, formulas, lists, and text cleanly
              const lines = currentSlide.conceptMarkdown.split('\n');
              const renderedElements = [];
              let currentList = [];

              const flushList = () => {
                if (currentList.length > 0) {
                  renderedElements.push(
                    <ul key={`list-${renderedElements.length}`} style={{ paddingLeft: '18px', margin: '6px 0' }}>
                      {currentList.map((item, lIdx) => (
                        <li key={lIdx} style={{ marginBottom: '4px' }}>
                          {formatInline(item)}
                        </li>
                      ))}
                    </ul>
                  );
                  currentList = [];
                }
              };

              lines.forEach((rawLine, idx) => {
                const line = rawLine.trim();
                if (!line) {
                  flushList();
                  return;
                }

                if (line.startsWith('### ')) {
                  flushList();
                  renderedElements.push(
                    <h3 key={idx} style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0 6px 0' }}>
                      {formatInline(line.replace('### ', ''))}
                    </h3>
                  );
                } else if (line.startsWith('#### ')) {
                  flushList();
                  renderedElements.push(
                    <h4 key={idx} style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-blue-primary)', margin: '8px 0 4px 0' }}>
                      {formatInline(line.replace('#### ', ''))}
                    </h4>
                  );
                } else if (line.startsWith('$$') && line.endsWith('$$')) {
                  flushList();
                  renderedElements.push(
                    <div key={idx} className="math-formula-box">
                      <span className="formula-tag">Formulation</span>
                      <span className="formula-content">{cleanMathFormula(line)}</span>
                    </div>
                  );
                } else if (line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                  currentList.push(line.replace(/^[-*0-9.]+\s*/, ''));
                } else {
                  flushList();
                  renderedElements.push(
                    <p key={idx} style={{ marginBottom: '6px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                      {formatInline(line)}
                    </p>
                  );
                }
              });

              flushList();
              return renderedElements;
            })()}
          </div>

          {/* Pictorial Concept Architecture (Clipart & Visual Infographics) */}
          <PictorialConceptCard slide={currentSlide} />

          {/* Syntax Cheat Sheet (Green left border) */}
          {currentSlide.syntaxGuide && (
            <div className="syntax-card">
              <div className="syntax-card-title">
                <Code size={14} />
                <span>Python & NumPy Syntax Blueprint</span>
              </div>
              <pre>{currentSlide.syntaxGuide}</pre>
            </div>
          )}

          {/* Action: Load Starter Code into Live Editor */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
            <button 
              className="btn btn-primary"
              onClick={onLoadSlideCode}
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.86rem' }}
            >
              <Code size={16} />
              <span>Load Lesson Demo Code into Live Editor ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Footer */}
      <div className="slide-nav-bar">
        <button 
          className="btn btn-secondary" 
          onClick={onPrevSlide}
          disabled={slideIndex === 0}
          style={{ opacity: slideIndex === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="slide-counter">
          {currentSlide.timeTag}
        </span>

        <button 
          className="btn btn-secondary" 
          onClick={onNextSlide}
          disabled={slideIndex === totalSlidesInModule - 1}
          style={{ opacity: slideIndex === totalSlidesInModule - 1 ? 0.4 : 1 }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Fullscreen Presentation Mode (Slide Show) */}
      <SlideShowModal 
        isOpen={isSlideShowOpen}
        onClose={() => setIsSlideShowOpen(false)}
        currentModule={currentModule}
        currentSlide={currentSlide}
        slideIndex={slideIndex}
        totalSlidesInModule={totalSlidesInModule}
        onPrevSlide={onPrevSlide}
        onNextSlide={onNextSlide}
        onSelectSlideIndex={onSelectSlideIndex}
        onLoadSlideCode={onLoadSlideCode}
      />
    </div>
  );
}
