import React, { useState } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  X, 
  Image as ImageIcon, 
  Camera, 
  Activity, 
  Truck, 
  Layers, 
  Cpu, 
  PieChart, 
  Scale, 
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Lock,
  Sun,
  Zap,
  Filter,
  BarChart3,
  Award,
  Database
} from 'lucide-react';

export default function PictorialConceptCard({ slide }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!slide) return null;

  // 1. If an explicit high-res generated clipart image exists, render it
  if (slide.conceptImage) {
    return (
      <div className="pictorial-architecture-section">
        <div className="pictorial-header">
          <ImageIcon size={14} className="pictorial-icon" />
          <span>Pictorial Concept Architecture</span>
          <span className="pictorial-badge">High-Res Clipart</span>
        </div>

        <div className="pictorial-card">
          <div className="pictorial-img-container" onClick={() => setIsZoomed(true)}>
            <img 
              src={slide.conceptImage} 
              alt={slide.title} 
              className="pictorial-img" 
            />
            <div className="pictorial-zoom-overlay">
              <Maximize2 size={14} />
              <span>Click to Expand</span>
            </div>
          </div>
          
          {slide.imageCaption && (
            <div className="pictorial-caption">
              <Sparkles size={13} className="caption-star" />
              <span>{slide.imageCaption}</span>
            </div>
          )}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {isZoomed && (
          <div className="pictorial-modal-backdrop" onClick={() => setIsZoomed(false)}>
            <div className="pictorial-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="pictorial-modal-header">
                <span className="modal-title">{slide.title}</span>
                <button className="modal-close-btn" onClick={() => setIsZoomed(false)}>
                  <X size={18} />
                </button>
              </div>
              <img src={slide.conceptImage} alt={slide.title} className="modal-full-img" />
              {slide.imageCaption && (
                <div className="modal-caption-text">{slide.imageCaption}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Tailored visual concept clipart cards based on the topic
  const renderTopicClipart = () => {
    // ==========================================
    // TRACK 1: NUMPY FOUNDATIONS
    // ==========================================

    // Slide 1.2: Array Constructors (Black, Gray, White Canvases)
    if (slide.id === 'm1_s2') {
      return (
        <div className="clipart-canvas-row">
          <div className="clipart-tile tile-black">
            <div className="tile-preview" style={{ background: '#000000' }}></div>
            <span className="tile-name">np.zeros</span>
            <span className="tile-desc">Pure Black (0)</span>
          </div>
          <div className="clipart-tile tile-gray">
            <div className="tile-preview" style={{ background: '#808080' }}></div>
            <span className="tile-name">np.full(128)</span>
            <span className="tile-desc">Neutral Gray (128)</span>
          </div>
          <div className="clipart-tile tile-white">
            <div className="tile-preview" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}></div>
            <span className="tile-name">np.full(255)</span>
            <span className="tile-desc">Pure White (255)</span>
          </div>
        </div>
      );
    }

    // Slide 1.3: Sequence Generation (np.arange vs np.linspace)
    if (slide.id === 'm1_s3') {
      return (
        <div className="clipart-seq-card">
          <div className="seq-lane lane-arange">
            <div className="seq-lane-header">
              <span className="seq-badge badge-arange">np.arange(0, 10, 2)</span>
              <span className="seq-rule">Step Size = 2 (Stop 10 is EXCLUDED!)</span>
            </div>
            <div className="seq-ruler">
              <div className="seq-node active"><span className="seq-val">0</span></div>
              <div className="seq-arrow-step">+2</div>
              <div className="seq-node active"><span className="seq-val">2</span></div>
              <div className="seq-arrow-step">+2</div>
              <div className="seq-node active"><span className="seq-val">4</span></div>
              <div className="seq-arrow-step">+2</div>
              <div className="seq-node active"><span className="seq-val">6</span></div>
              <div className="seq-arrow-step">+2</div>
              <div className="seq-node active"><span className="seq-val">8</span></div>
              <div className="seq-arrow-step dashed">+2</div>
              <div className="seq-node excluded"><span className="seq-val">🚫 10</span></div>
            </div>
          </div>

          <div className="seq-lane lane-linspace">
            <div className="seq-lane-header">
              <span className="seq-badge badge-linspace">np.linspace(0, 10, 5)</span>
              <span className="seq-rule">Exact Sample Count = 5 (Stop 10 is INCLUDED!)</span>
            </div>
            <div className="seq-ruler">
              <div className="seq-node lin"><span className="seq-val">0.0</span></div>
              <div className="seq-arrow-lin">Δ 2.5</div>
              <div className="seq-node lin"><span className="seq-val">2.5</span></div>
              <div className="seq-arrow-lin">Δ 2.5</div>
              <div className="seq-node lin"><span className="seq-val">5.0</span></div>
              <div className="seq-arrow-lin">Δ 2.5</div>
              <div className="seq-node lin"><span className="seq-val">7.5</span></div>
              <div className="seq-arrow-lin">Δ 2.5</div>
              <div className="seq-node lin"><span className="seq-val">10.0</span></div>
            </div>
          </div>
        </div>
      );
    }

    // Slide 1.4: Reproducible Random Numbers (np.random.seed)
    if (slide.id === 'm1_s4') {
      return (
        <div className="clipart-seed-card">
          <div className="seed-box-header">
            <div className="seed-badge">
              <Lock size={14} className="lock-icon" />
              <span>np.random.seed(42)</span>
            </div>
            <span className="seed-status">🔒 Deterministic PRNG State Locked</span>
          </div>

          <div className="seed-tape-row">
            <span className="tape-label">Generated Sensor Noise:</span>
            <div className="tape-stream">
              <div className="tape-chip">0.374</div>
              <div className="tape-chip">0.950</div>
              <div className="tape-chip">0.731</div>
              <div className="tape-chip">0.598</div>
              <div className="tape-chip">0.156</div>
            </div>
          </div>

          <div className="seed-guarantee">
            ✅ <strong>Enterprise Reproducibility:</strong> Identical pseudo-random sequence generated across Mac, Windows, Linux, and Cloud VMs.
          </div>
        </div>
      );
    }

    // Slide 1.5: Vector Reshaping (1D Audio Stream to 2D Stereo Matrix)
    if (slide.id === 'm1_s5') {
      return (
        <div className="clipart-reshape-card">
          <div className="reshape-grid">
            <div className="reshape-side">
              <span className="side-title">1D Raw Audio Stream: Shape (6,)</span>
              <div className="stream-1d">
                <span className="stream-cell">s₀</span>
                <span className="stream-cell">s₁</span>
                <span className="stream-cell">s₂</span>
                <span className="stream-cell">s₃</span>
                <span className="stream-cell">s₄</span>
                <span className="stream-cell">s₅</span>
              </div>
            </div>

            <div className="reshape-mid">
              <span className="mid-code">.reshape(2, 3)</span>
              <span className="mid-arrow">➔</span>
              <span className="mid-note">Zero Copy in RAM</span>
            </div>

            <div className="reshape-side">
              <span className="side-title">2D Stereo Channels: Shape (2, 3)</span>
              <div className="matrix-stereo">
                <div className="stereo-row row-left">
                  <span className="channel-lbl">Left Ch:</span>
                  <span className="m-cell">s₀</span>
                  <span className="m-cell">s₁</span>
                  <span className="m-cell">s₂</span>
                </div>
                <div className="stereo-row row-right">
                  <span className="channel-lbl">Right Ch:</span>
                  <span className="m-cell">s₃</span>
                  <span className="m-cell">s₄</span>
                  <span className="m-cell">s₅</span>
                </div>
              </div>
            </div>
          </div>

          <div className="reshape-footer">
            ⚖️ <strong>Dimension Invariant:</strong> Product of dimensions must strictly match total elements: 2 × 3 = 6.
          </div>
        </div>
      );
    }

    // Slide 1.6: 2D Matrix Slicing / Bounding Crop Box
    if (slide.id === 'm1_s6') {
      return (
        <div className="clipart-crop-box">
          <div className="crop-photo-frame">
            <div className="crop-grid">
              {[...Array(25)].map((_, i) => {
                const r = Math.floor(i / 5);
                const c = i % 5;
                const isSelected = r >= 1 && r <= 3 && c >= 1 && c <= 3;
                return (
                  <div key={i} className={`crop-cell ${isSelected ? 'selected' : ''}`}>
                    {isSelected ? 'ROI' : ''}
                  </div>
                );
              })}
            </div>
            <div className="crop-label">ROI Slicing: img[1:4, 1:4] (Cropped Center Face)</div>
          </div>
        </div>
      );
    }

    // Slide 1.7: Views vs Deep Copies (Buffer Mutation Hazard)
    if (slide.id === 'm1_s7') {
      return (
        <div className="clipart-views-card">
          <div className="view-col col-danger">
            <div className="view-col-header">
              <span className="v-badge badge-danger">Slice View (Default)</span>
              <span className="v-warn">⚠️ Shares Original Buffer</span>
            </div>
            <div className="v-flow">
              <div className="v-box master-box">Master Photo RAM Buffer</div>
              <div className="v-arrow-hazard">
                <span>Modifying view MUTATES Master!</span>
              </div>
            </div>
            <div className="v-foot">Zero RAM copied, but high risk of accidental photo corruption.</div>
          </div>

          <div className="view-col col-safe">
            <div className="view-col-header">
              <span className="v-badge badge-safe">.copy() (Deep Duplicate)</span>
              <span className="v-safe">🛡️ 100% Isolated Allocation</span>
            </div>
            <div className="v-flow">
              <div className="v-box master-box">Master Photo Buffer</div>
              <div className="v-box clone-box">Independent Deep Copy</div>
            </div>
            <div className="v-foot">Original photo stays 100% pristine and protected in memory.</div>
          </div>
        </div>
      );
    }

    // Slide 1.8: Vectorized Math vs Python Loops (SIMD Speedup)
    if (slide.id === 'm1_s8') {
      return (
        <div className="clipart-simd-card">
          <div className="simd-lane lane-slow">
            <div className="simd-header">
              <span className="simd-title">🐢 Python For Loop (Scalar Execution)</span>
              <span className="simd-stat slow-stat">100x Slower</span>
            </div>
            <div className="simd-pipeline">
              <div className="pixel-box">p₀ ➔ CPU</div>
              <span className="pipe-arrow">➔</span>
              <div className="pixel-box">p₁ ➔ CPU</div>
              <span className="pipe-arrow">➔</span>
              <div className="pixel-box">p₂ ➔ CPU</div>
            </div>
            <div className="simd-note">Processes 1 pixel at a time with heavy Python interpreter overhead.</div>
          </div>

          <div className="simd-lane lane-fast">
            <div className="simd-header">
              <span className="simd-title">🚀 NumPy Vectorization (Hardware SIMD)</span>
              <span className="simd-stat fast-stat">Instant (Hardware SIMD)</span>
            </div>
            <div className="simd-pipeline-simd">
              <div className="simd-block">
                [ p₀, p₁, p₂, p₃, p₄, p₅, p₆, p₇ ] ➔ Single CPU SIMD Vector Register
              </div>
            </div>
            <div className="simd-note">Processes entire 8-pixel scanline in a single clock cycle!</div>
          </div>
        </div>
      );
    }

    // ==========================================
    // TRACK 2: NUMPY ADVANCED
    // ==========================================

    // Slide 2.1: Broadcasting (Scalar + 2D Image)
    if (slide.id === 'm2_s1') {
      return (
        <div className="clipart-broadcasting-card">
          <div className="bc-formula">
            <div className="bc-box">
              <span className="bc-label">Original Pixels</span>
              <div className="mini-grid">
                <span>100</span><span>120</span>
                <span>140</span><span>160</span>
              </div>
            </div>
            <span className="bc-op">+</span>
            <div className="bc-box bc-scalar">
              <span className="bc-label">Scalar (+30)</span>
              <Sun size={24} className="sun-icon" />
              <span className="scalar-val">+30</span>
            </div>
            <span className="bc-op">=</span>
            <div className="bc-box bc-result">
              <span className="bc-label">Brightened Photo</span>
              <div className="mini-grid grid-result">
                <span>130</span><span>150</span>
                <span>170</span><span>190</span>
              </div>
            </div>
          </div>
          <div className="bc-footer">
            💡 <strong>Broadcasting Magic:</strong> The scalar 30 is automatically stretched across the matrix without copying data.
          </div>
        </div>
      );
    }

    // Slide 2.2: Stacking & Newaxis (3D Color Tensors)
    if (slide.id === 'm2_s2') {
      return (
        <div className="clipart-tensor-card">
          <div className="tensor-layers">
            <div className="t-layer layer-r">
              <span className="l-tag">Red Channel (H, W)</span>
            </div>
            <div className="t-layer layer-g">
              <span className="l-tag">Green Channel (H, W)</span>
            </div>
            <div className="t-layer layer-b">
              <span className="l-tag">Blue Channel (H, W)</span>
            </div>
          </div>
          <div className="tensor-footer">
            Stacked via <code>np.stack([R, G, B], axis=-1)</code> ➔ 3D RGB Tensor (Height, Width, 3).
          </div>
        </div>
      );
    }

    // Slide 2.3: Boolean Masking (Heart Rate Telemetry)
    if (slide.id === 'm2_s3') {
      return (
        <div className="clipart-mask-card">
          <div className="mask-stream">
            <div className="mask-item normal">72 bpm</div>
            <div className="mask-item spike">125 bpm (🚨 Spike)</div>
            <div className="mask-item spike">145 bpm (🚨 Spike)</div>
            <div className="mask-item normal">80 bpm</div>
          </div>
          <div className="mask-footer">
            Filter Condition: <code>rates[rates &gt; 100]</code> ➔ Zero If-Else loops needed!
          </div>
        </div>
      );
    }

    // Slide 2.4: np.where (Green Screen Chromakey Filter)
    if (slide.id === 'm2_s4') {
      return (
        <div className="clipart-where-card">
          <div className="where-flow">
            <div className="where-node node-condition">
              <span className="w-lbl">If Pixel == Green:</span>
            </div>
            <div className="where-branches">
              <div className="w-branch branch-true">
                <span className="b-state">TRUE (Green Background)</span>
                <span className="b-res">➔ Replace with Background Scenery</span>
              </div>
              <div className="w-branch branch-false">
                <span className="b-state">FALSE (Actor/Foreground)</span>
                <span className="b-res">➔ Keep Original Actor Pixel</span>
              </div>
            </div>
          </div>
          <div className="where-footer">
            Syntax: <code>np.where(is_green, studio_backdrop, original_frame)</code>
          </div>
        </div>
      );
    }

    // Slide 2.5: Smartwatch 7x24 Health Telemetry
    if (slide.id === 'm2_s5') {
      return (
        <div className="clipart-smartwatch-card">
          <div className="smartwatch-frame">
            <Activity size={16} className="watch-icon" />
            <span className="watch-title">7 Days × 24 Hours Health Telemetry</span>
            <div className="watch-heatmap-grid">
              {[...Array(28)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="watch-heat-cell"
                  style={{ opacity: 0.3 + (idx % 7) * 0.1 }}
                />
              ))}
            </div>
            <span className="watch-summary">axis=0: Hourly Trends | axis=1: Daily Totals</span>
          </div>
        </div>
      );
    }

    // Slide 2.6: Matrix Multiplication (RGB to Grayscale)
    if (slide.id === 'm2_s6') {
      return (
        <div className="clipart-dot-card">
          <div className="dot-formula">
            <div className="dot-box">[ R, G, B ] (N, 3)</div>
            <span className="dot-symbol">@</span>
            <div className="dot-box dot-weights">[ 0.299, 0.587, 0.114 ]ᵀ (3, 1)</div>
            <span className="dot-symbol">=</span>
            <div className="dot-box dot-res">Grayscale (N, 1)</div>
          </div>
          <div className="dot-footer">
            Calculates weighted human perceptual luminance in a single hardware dot product.
          </div>
        </div>
      );
    }

    // Slide 2.7: Sorting & Top-K Leaderboard
    if (slide.id === 'm2_s7') {
      return (
        <div className="clipart-sort-card">
          <div className="podium-row">
            <div className="podium-item silver">
              <Award size={18} />
              <span>#2: 155 bpm</span>
            </div>
            <div className="podium-item gold">
              <Award size={22} />
              <span>#1: 172 bpm</span>
            </div>
            <div className="podium-item bronze">
              <Award size={16} />
              <span>#3: 145 bpm</span>
            </div>
          </div>
          <div className="sort-footer">
            <code>np.argpartition(rates, -3)[-3:]</code> finds Top 3 in O(N) linear time without sorting all data!
          </div>
        </div>
      );
    }

    // Slide 2.8: Normalization vs Standardization
    if (slide.id === 'm2_s8') {
      return (
        <div className="clipart-scaling-card">
          <div className="scale-col">
            <span className="scale-title">Min-Max Normalization</span>
            <span className="scale-range">[0.0, 1.0] Bounded</span>
            <span className="scale-use">Ideal for image pixels & bounded sensors</span>
          </div>
          <div className="scale-col">
            <span className="scale-title">Z-Score Standardization</span>
            <span className="scale-range">Mean = 0, Std = 1</span>
            <span className="scale-use">Standard normal bell curve for ML models</span>
          </div>
        </div>
      );
    }

    // ==========================================
    // TRACK 3: MACHINE LEARNING BASICS
    // ==========================================

    // Slide 3.2: Pandas to NumPy Bridge
    if (slide.id === 'm3_s2') {
      return (
        <div className="clipart-bridge-flow">
          <div className="bridge-node bridge-pandas">
            <Truck size={20} className="node-icon" />
            <span className="node-title">Pandas DataFrame</span>
            <span className="node-detail">Tabular CSV, headers, string metadata</span>
          </div>
          <div className="bridge-arrow">
            <span>.to_numpy()</span>
            <span className="arrow-symbol">➔</span>
          </div>
          <div className="bridge-node bridge-numpy">
            <Cpu size={20} className="node-icon" />
            <span className="node-title">NumPy Tensor</span>
            <span className="node-detail">Raw numbers in RAM, SIMD accelerated</span>
          </div>
        </div>
      );
    }

    // Slide 3.3: Missing Values & Imputation
    if (slide.id === 'm3_s3') {
      return (
        <div className="clipart-nan-card">
          <div className="nan-row">
            <div className="nan-cell valid">45 mph</div>
            <div className="nan-cell missing">⚠️ NaN (Tunnel Loss)</div>
            <div className="nan-cell valid">52 mph</div>
          </div>
          <div className="nan-arrow">➔ <code>np.nanmean()</code> Imputation ➔</div>
          <div className="nan-row">
            <div className="nan-cell valid">45 mph</div>
            <div className="nan-cell imputed">✅ 48.5 mph (Filled)</div>
            <div className="nan-cell valid">52 mph</div>
          </div>
        </div>
      );
    }

    // Slide 3.4: Train/Test Split
    if (slide.id === 'm3_s4') {
      return (
        <div className="clipart-split-container">
          <div className="split-total-bar">
            <div className="split-train-segment" style={{ width: '80%' }}>
              <span className="segment-label">80% Training Vault</span>
              <span className="segment-desc">(Teaches Model Weights)</span>
            </div>
            <div className="split-test-segment" style={{ width: '20%' }}>
              <span className="segment-label">20% Test</span>
              <span className="segment-desc">(Unseen Audit)</span>
            </div>
          </div>
          <div className="split-legend">
            <span>🛡️ Never evaluate on data the model trained on (prevents overfitting).</span>
          </div>
        </div>
      );
    }

    // Slide 3.6: Gradient Descent Optimization
    if (slide.id === 'm3_s6') {
      return (
        <div className="clipart-gd-card">
          <div className="gd-bowl-visual">
            <svg viewBox="0 0 200 80" className="gd-svg">
              <path d="M 20,15 Q 100,85 180,15" fill="none" stroke="var(--color-blue-primary)" strokeWidth="3" />
              <circle cx="45" cy="38" r="4" fill="var(--color-orange-accent)" />
              <path d="M 45,38 L 75,58" stroke="var(--color-orange-accent)" strokeWidth="2" strokeDasharray="3" />
              <circle cx="100" cy="73" r="5" fill="var(--color-green-primary)" />
            </svg>
          </div>
          <div className="gd-footer">
            Rolling down the loss bowl: <code>w = w - alpha * gradient</code> towards global minimum loss.
          </div>
        </div>
      );
    }

    // Slide 3.7: Logistic Regression (Sigmoid S-Curve)
    if (slide.id === 'm3_s7') {
      return (
        <div className="clipart-sigmoid-card">
          <div className="sigmoid-visual">
            <div className="sigmoid-axis-y">
              <span>1.0 (Churn / Skip)</span>
              <span>0.5 (Decision Threshold)</span>
              <span>0.0 (Stay / Listen)</span>
            </div>
            <div className="sigmoid-curve-box">
              <svg viewBox="0 0 200 80" className="sigmoid-svg">
                <line x1="0" y1="40" x2="200" y2="40" stroke="#cbd5e1" strokeDasharray="4" />
                <path 
                  d="M 10,70 Q 70,70 100,40 T 190,10" 
                  fill="none" 
                  stroke="var(--color-blue-primary)" 
                  strokeWidth="3" 
                />
                <circle cx="100" cy="40" r="4" fill="var(--color-orange-accent)" />
              </svg>
            </div>
          </div>
          <div className="sigmoid-footer">
            <span>P &gt; 0.5 ➔ Positive Category | P &le; 0.5 ➔ Negative Category</span>
          </div>
        </div>
      );
    }

    // Slide 3.8: Confusion Matrix (2x2 Diagnostic Clipart)
    if (slide.id === 'm3_s8') {
      return (
        <div className="clipart-confusion-matrix">
          <div className="cm-row">
            <div className="cm-cell cm-tp">
              <CheckCircle2 size={16} />
              <span className="cm-title">True Positive (TP)</span>
              <span className="cm-val">Predicted Churn & Actually Churned</span>
            </div>
            <div className="cm-cell cm-fp">
              <AlertTriangle size={16} />
              <span className="cm-title">False Positive (FP)</span>
              <span className="cm-val">Predicted Churn, but Stayed</span>
            </div>
          </div>
          <div className="cm-row">
            <div className="cm-cell cm-fn">
              <AlertTriangle size={16} />
              <span className="cm-title">False Negative (FN)</span>
              <span className="cm-val">Predicted Stay, but Churned</span>
            </div>
            <div className="cm-cell cm-tn">
              <ShieldCheck size={16} />
              <span className="cm-title">True Negative (TN)</span>
              <span className="cm-val">Predicted Stay & Actually Stayed</span>
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback Clipart Card
    return (
      <div className="clipart-concept-fallback">
        <div className="fallback-header">
          <Sparkles size={16} className="fallback-icon" />
          <span className="fallback-title">{slide.storyboard?.analogyTitle || slide.title}</span>
        </div>
        <p className="fallback-takeaway">{slide.storyboard?.takeaway || 'Core architectural principle for high-performance computation.'}</p>
      </div>
    );
  };

  return (
    <div className="pictorial-architecture-section">
      <div className="pictorial-header">
        <ImageIcon size={14} className="pictorial-icon" />
        <span>Pictorial Concept Architecture</span>
        <span className="pictorial-badge">Conceptual Clipart</span>
      </div>
      <div className="pictorial-card">
        {renderTopicClipart()}
      </div>
    </div>
  );
}
