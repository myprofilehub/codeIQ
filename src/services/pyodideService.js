// Service to manage in-browser Pyodide Python execution runtime

let pyodideInstance = null;
let isInitializing = false;
let initPromise = null;

// Callbacks for runtime status
let statusListeners = [];

export function subscribePyodideStatus(listener) {
  statusListeners.push(listener);
  return () => {
    statusListeners = statusListeners.filter((l) => l !== listener);
  };
}

function notifyStatus(status, message) {
  statusListeners.forEach((l) => l({ status, message }));
}

/**
 * Initializes Pyodide WASM runtime with NumPy, Pandas, Scikit-learn, and Matplotlib
 */
export async function getPyodide() {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isInitializing) {
    return initPromise;
  }

  isInitializing = true;
  notifyStatus('loading', 'Initializing in-browser Python (WebAssembly)...');

  initPromise = (async () => {
    try {
      // Ensure loadPyodide is available from CDN script in index.html
      if (typeof window.loadPyodide !== 'function') {
        throw new Error('Pyodide script not loaded. Check your internet connection.');
      }

      notifyStatus('loading', 'Booting Pyodide runtime...');
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      notifyStatus('loading', 'Loading core science packages: NumPy, Pandas, Scikit-learn...');
      await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn', 'micropip']);

      // Configure Python environment for stdout capture and Matplotlib figure interception
      await pyodide.runPythonAsync(`
import sys
import io
import os
import warnings

# Suppress harmless third-party deprecation & future warnings (like Pandas Pyarrow notices)
warnings.filterwarnings('ignore')

# Redirect standard output and error to buffers
class OutputCatcher:
    def __init__(self):
        self.buffer = io.StringIO()
    def write(self, s):
        self.buffer.write(s)
    def flush(self):
        pass
    def get_value(self):
        val = self.buffer.getvalue()
        self.buffer.truncate(0)
        self.buffer.seek(0)
        return val

_stdout_catcher = OutputCatcher()
_stderr_catcher = OutputCatcher()
sys.stdout = _stdout_catcher
sys.stderr = _stderr_catcher

# Setup Matplotlib non-interactive backend
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64

def _get_matplotlib_figures():
    images = []
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=120)
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        images.append("data:image/png;base64," + img_str)
        plt.close(fig)
    return images
`);

      pyodideInstance = pyodide;
      notifyStatus('ready', 'Python 3 runtime ready with NumPy, Pandas & Scikit-learn!');
      return pyodide;
    } catch (err) {
      notifyStatus('error', `Failed to initialize Python runtime: ${err.message}`);
      isInitializing = false;
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Mounts a CSV file string into the virtual filesystem at /uploaded_data.csv and /<filename>
 */
export async function mountCsvDataset(csvContent, filename = 'uploaded_data.csv', setAsDefault = true) {
  const pyodide = await getPyodide();
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  const filePath = `/${cleanFilename}`;
  pyodide.FS.writeFile(filePath, csvContent, { encoding: 'utf8' });
  // Also write to /uploaded_data.csv for standard active curriculum access if requested
  if (setAsDefault) {
    pyodide.FS.writeFile('/uploaded_data.csv', csvContent, { encoding: 'utf8' });
  }
  return filePath;
}

/**
 * Runs user Python code and captures output, execution time, and any generated plots
 */
export async function executePythonCode(code) {
  const pyodide = await getPyodide();
  const startTime = performance.now();

  try {
    // Reset output buffers and warnings filter
    await pyodide.runPythonAsync(`
_stdout_catcher.buffer.truncate(0)
_stdout_catcher.buffer.seek(0)
_stderr_catcher.buffer.truncate(0)
_stderr_catcher.buffer.seek(0)
plt.close('all')
import warnings
warnings.filterwarnings('ignore')
`);

    // Automatically load packages imported in the user code (e.g., seaborn, statsmodels, optuna)
    try {
      if (typeof pyodide.loadPackagesFromImports === 'function') {
        await pyodide.loadPackagesFromImports(code);
      }
    } catch (importErr) {
      console.warn('Auto package resolution notice:', importErr);
    }

    // Execute user code
    await pyodide.runPythonAsync(code);

    // Retrieve stdout, stderr, and plot images
    const stdout = await pyodide.runPythonAsync(`_stdout_catcher.get_value()`);
    const rawStderr = await pyodide.runPythonAsync(`_stderr_catcher.get_value()`);
    const plotImages = await pyodide.runPythonAsync(`_get_matplotlib_figures()`);

    // Filter out benign third-party library warnings from stderr
    const stderr = (rawStderr || '')
      .split('\n')
      .filter((line) => {
        const lower = line.toLowerCase();
        return (
          !lower.includes('pyarrow will become a required dependency') &&
          !lower.includes('pandas/issues/54466') &&
          !lower.includes('deprecationwarning') &&
          !lower.includes('futurewarning')
        );
      })
      .join('\n')
      .trim();

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      success: true,
      stdout: stdout || (plotImages && plotImages.length > 0 ? '' : '>>> Code executed successfully with no print output.'),
      stderr: stderr || '',
      plotImages: plotImages ? Array.from(plotImages) : [],
      executionTimeMs,
    };
  } catch (err) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    let errorMsg = err.message || '';

    // Helpful architectural feedback for heavy native/GPU frameworks
    if (/No module named ['"](torch|tensorflow|keras)['"]/i.test(errorMsg)) {
      errorMsg += `\n\n📌 In-Browser Runtime Note: Heavy deep learning frameworks (PyTorch, TensorFlow) require multi-GB C++/CUDA binaries and dedicated GPU cloud servers, so they cannot run inside a lightweight client-side WebAssembly sandbox. For in-browser training, use NumPy, Scikit-Learn, SciPy, Seaborn, and Statsmodels.`;
    } else if (/No module named ['"](cv2|opencv)['"]/i.test(errorMsg)) {
      errorMsg += `\n\n📌 In-Browser Runtime Note: OpenCV (cv2) relies on native C++ desktop binaries. For in-browser matrix and image manipulation, use NumPy array slicing or PIL (Pillow).`;
    } else if (/No module named ['"](xgboost|lightgbm|catboost)['"]/i.test(errorMsg)) {
      errorMsg += `\n\n📌 In-Browser Runtime Note: Native gradient boosting libraries (XGBoost/LightGBM) require multi-threaded C++ OpenMP binaries. For in-browser ensemble modeling, use Scikit-Learn's GradientBoostingRegressor/Classifier or RandomForest.`;
    }

    return {
      success: false,
      stdout: '',
      stderr: errorMsg,
      plotImages: [],
      executionTimeMs,
    };
  }
}

/**
 * Executes a coding challenge test suite
 */
export async function runChallengeTest(userCode, testSuiteCode) {
  const pyodide = await getPyodide();
  const startTime = performance.now();

  try {
    await pyodide.runPythonAsync(`
_stdout_catcher.buffer.truncate(0)
_stdout_catcher.buffer.seek(0)
_stderr_catcher.buffer.truncate(0)
_stderr_catcher.buffer.seek(0)
`);

    // Run user code first
    await pyodide.runPythonAsync(userCode);

    // Then run test assertions
    await pyodide.runPythonAsync(testSuiteCode);

    const stdout = await pyodide.runPythonAsync(`_stdout_catcher.get_value()`);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      passed: true,
      stdout: stdout || 'All unit test assertions passed successfully! Great work!',
      error: null,
      executionTimeMs,
    };
  } catch (err) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      passed: false,
      stdout: '',
      error: err.message,
      executionTimeMs,
    };
  }
}
