import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import Header from './components/Header';
import SlideDeck from './components/SlideDeck';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import QuizPollPanel from './components/QuizPollPanel';
import AssignmentTab from './components/AssignmentTab';
import DatasetModal from './components/DatasetModal';

import { CURRICULUM_MODULES } from './data/curriculumData';
import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { 
  getPyodide, 
  executePythonCode, 
  runChallengeTest, 
  mountCsvDataset, 
  subscribePyodideStatus 
} from './services/pyodideService';

export default function App() {
  // Navigation & Curriculum State
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [activeMainTab, setActiveMainTab] = useState('studio'); // 'studio' | 'assignments'

  const currentModule = CURRICULUM_MODULES[currentModuleIdx];
  const currentSlide = currentModule.slides[currentSlideIdx];

  // Code Editor & Execution State (Starts empty for live demo coding!)
  const [code, setCode] = useState('');
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [executionTimeMs, setExecutionTimeMs] = useState(null);
  const [plotImages, setPlotImages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Pyodide Status
  const [pyodideStatus, setPyodideStatus] = useState({
    status: 'loading',
    message: 'Starting in-browser Python (WebAssembly)...'
  });

  // Fullscreen Editor & Console Workspace State
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  // Assessment & Challenge State
  const [completedChallenges, setCompletedChallenges] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Dataset State
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [currentDataset, setCurrentDataset] = useState(SAMPLE_DATASETS[0]);

  // Total challenges count across all modules
  const allChallenges = CURRICULUM_MODULES.flatMap((m) => m.slides.map((s) => s.challenge)).filter(Boolean);
  const totalChallengesCount = allChallenges.length;
  const completedChallengesCount = Object.keys(completedChallenges).length;

  // Initialize Pyodide and mount initial dataset on startup
  useEffect(() => {
    const unsubscribe = subscribePyodideStatus((statusObj) => {
      setPyodideStatus(statusObj);
    });

    (async () => {
      try {
        await getPyodide();
        // Pre-mount all 3 built-in sample datasets so any can be loaded directly by filename
        for (const ds of SAMPLE_DATASETS) {
          await mountCsvDataset(ds.csvContent, ds.filename, false);
        }
        // Set the primary default active dataset as /uploaded_data.csv
        await mountCsvDataset(SAMPLE_DATASETS[0].csvContent, 'uploaded_data.csv', true);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    })();

    return () => unsubscribe();
  }, []);

  // When slide changes, reset test outputs only (trainer's typed code in editor is preserved!)
  useEffect(() => {
    setTestResult(null);
  }, [currentModuleIdx, currentSlideIdx]);

  // Handle Escape key to exit fullscreen workspace
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isEditorFullscreen) {
        setIsEditorFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isEditorFullscreen]);

  // Code Execution Handler
  const handleRunCode = async () => {
    setIsRunning(true);
    setStderr('');
    try {
      const result = await executePythonCode(code);
      setStdout(result.stdout);
      setStderr(result.stderr);
      setExecutionTimeMs(result.executionTimeMs);
      setPlotImages(result.plotImages);
    } catch (err) {
      setStderr(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Run Challenge Unit Test Handler
  const handleRunTest = async (userCode, testCode) => {
    setIsTesting(true);
    try {
      const result = await runChallengeTest(userCode, testCode);
      setTestResult(result);
      if (result.stdout) {
        setStdout((prev) => prev ? `${prev}\n\n[Test Output]:\n${result.stdout}` : `[Test Output]:\n${result.stdout}`);
      }
      return result;
    } catch (err) {
      const errRes = { passed: false, error: err.message, stdout: '' };
      setTestResult(errRes);
      return errRes;
    } finally {
      setIsTesting(false);
    }
  };

  const handleChallengePassed = (challengeId) => {
    setCompletedChallenges((prev) => ({ ...prev, [challengeId]: true }));
  };

  // Slide Navigation Handlers
  const handlePrevSlide = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
    } else if (currentModuleIdx > 0) {
      const prevModIdx = currentModuleIdx - 1;
      setCurrentModuleIdx(prevModIdx);
      setCurrentSlideIdx(CURRICULUM_MODULES[prevModIdx].slides.length - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIdx < currentModule.slides.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
    } else if (currentModuleIdx < CURRICULUM_MODULES.length - 1) {
      setCurrentModuleIdx(currentModuleIdx + 1);
      setCurrentSlideIdx(0);
    }
  };

  const handleSelectModule = (modIdx) => {
    setCurrentModuleIdx(modIdx);
    setCurrentSlideIdx(0);
  };

  const handleMountAndInject = async (dataset, codeTemplate) => {
    setCurrentDataset(dataset);
    await mountCsvDataset(dataset.csvContent, dataset.filename);
    setCode(codeTemplate);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        pyodideStatus={pyodideStatus}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        currentDatasetName={currentDataset.filename || currentDataset.name}
        currentCode={code}
        currentSlideTitle={currentSlide.title}
        completedChallengesCount={completedChallengesCount}
        totalChallengesCount={totalChallengesCount}
        activeMainTab={activeMainTab}
        onSelectMainTab={setActiveMainTab}
      />

      {/* 3-Hour Curriculum Module Timeline Bar with Assignment Tab next to M3 */}
      <div className="module-progress-bar">
        {CURRICULUM_MODULES.map((mod, idx) => (
          <button
            key={mod.id}
            className={`module-tab-btn ${activeMainTab === 'studio' && currentModuleIdx === idx ? 'active' : ''}`}
            onClick={() => {
              handleSelectModule(idx);
              setActiveMainTab('studio');
            }}
          >
            <span className="module-badge">M{mod.moduleNumber}</span>
            <span>{mod.title}</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({mod.duration.split(' ')[0]})</span>
          </button>
        ))}

        {/* Dedicated Assignment Tab placed right next to M3 */}
        <button
          className={`module-tab-btn assignment-tab-btn ${activeMainTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('assignments')}
          title="Open all 24 Hands-on Course Coding Assignments & Automated Test Suites"
        >
          <span className="module-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={11} />
            <span>ASSIGNMENTS</span>
          </span>
          <span>Assignment Practice</span>
          <span style={{ fontSize: '0.72rem', color: activeMainTab === 'assignments' ? 'var(--color-blue-primary)' : '#64748b', fontWeight: 700 }}>
            ({completedChallengesCount}/{totalChallengesCount})
          </span>
        </button>
      </div>

      {activeMainTab === 'assignments' ? (
        /* DEDICATED ASSIGNMENT PORTAL TAB (ALL 24 CHALLENGES) */
        <AssignmentTab
          curriculumModules={CURRICULUM_MODULES}
          completedChallenges={completedChallenges}
          onChallengePassed={handleChallengePassed}
          onRunTest={handleRunTest}
          isTesting={isTesting}
          onLoadChallengeToEditor={(chalCode) => setCode(chalCode)}
          onSwitchToStudio={() => setActiveMainTab('studio')}
        />
      ) : (
        /* MAIN 3-PILLAR INTERACTIVE LIVE STUDIO */
        <main className="main-workspace">
          {/* PILLAR 1: CONCEPTUAL SLIDES & SYNTAX */}
          <SlideDeck
            currentModule={currentModule}
            currentSlide={currentSlide}
            slideIndex={currentSlideIdx}
            totalSlidesInModule={currentModule.slides.length}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
            onSelectSlideIndex={(idx) => setCurrentSlideIdx(idx)}
            onLoadSlideCode={() => setCode(currentSlide.starterCode)}
          />

          {/* PILLAR 2: HANDS-ON LIVE CODE EDITOR & CONSOLE */}
          <div className={`workspace-column ${isEditorFullscreen ? 'fullscreen-workspace' : ''}`} style={{ width: '100%' }}>
            <CodeEditor
              code={code}
              onChangeCode={setCode}
              onRunCode={handleRunCode}
              onResetCode={() => setCode('')}
              onShowSolution={() => setCode(currentSlide.solutionCode || currentSlide.starterCode)}
              isRunning={isRunning}
              pyodideStatus={pyodideStatus}
              isFullscreen={isEditorFullscreen}
              onToggleFullscreen={() => setIsEditorFullscreen(!isEditorFullscreen)}
            />
            <OutputConsole
              stdout={stdout}
              stderr={stderr}
              executionTimeMs={executionTimeMs}
              plotImages={plotImages}
              onClearConsole={() => {
                setStdout('');
                setStderr('');
                setPlotImages([]);
              }}
            />
          </div>

          {/* PILLAR 3: ACTIVE ASSESSMENT (POLLS, DEBUGGING & FIND-THE-OUTPUT MCQ) */}
          <QuizPollPanel
            currentSlide={currentSlide}
            currentCode={code}
            onLoadCodeToEditor={(c) => setCode(c)}
            onRunTest={handleRunTest}
            isTesting={isTesting}
            onSwitchToAssignments={() => setActiveMainTab('assignments')}
          />
        </main>
      )}

      {/* CSV Dataset Hub Modal */}
      <DatasetModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        currentDataset={currentDataset}
        onSelectDataset={setCurrentDataset}
        onMountAndInjectCode={handleMountAndInject}
      />
    </div>
  );
}
