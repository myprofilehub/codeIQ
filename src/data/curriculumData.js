// Comprehensive 3-Hour Curriculum for NumPy & Machine Learning Basics
// The Curated Hybrid Model:
// - Track 1: NumPy Foundations (Digital Media & Smartwatch Telemetry)
// - Track 2: NumPy Advanced (Photo Filters, Audio & Multi-Channel Sensor Matrices)
// - Track 3: Machine Learning Basics (Uber, Spotify & Netflix with NumPy, Pandas, Scikit-Learn)

import { SLIDE_ASSESSMENTS } from './assessmentData';

export const CURRICULUM_MODULES = [
  {
    id: 'module_1',
    moduleNumber: 1,
    title: 'NumPy Foundations (Digital Media & Health Sensors)',
    duration: '60 mins (Track 1)',
    summary: 'Master the fundamental mechanics of numerical arrays through digital photography and smartwatch telemetry. Learn memory architecture, array creation, sequence sampling, 2D slicing, views vs copies, and SIMD vectorization.',
    slides: [
      {
        id: 'm1_s1',
        conceptImage: '/assets/diagrams/numpy_vs_list.jpg',
        imageCaption: 'Pictorial Concept: Python List (Scattered Heap Pointers) vs NumPy Array (Contiguous SIMD Pixels)',
        title: 'Anatomy of ndarray: Storing 4K Photos in Contiguous Memory',
        timeTag: '00:00 - 00:08',
        storyboard: {
          analogyTitle: '📸 Digital Media Scenario: 4K Smartphone Photos',
          analogyStory: 'A smartphone camera taking an 8-megapixel photo captures 8,000,000 pixel values. In a standard Python list, every single pixel is wrapped in a 28-byte Python object with a scattered memory pointer. Storing a 4K photo in a Python list would consume over 250 MB of RAM and freeze the camera app! A NumPy ndarray stores all 8,000,000 pixels as a single compact, contiguous byte stream of raw uint8 numbers using just 8 MB of RAM. The CPU can load entire scan lines into L1/L2 cache in a single nanosecond.',
          takeaway: 'Key Takeaway: Python lists scatter pointers across RAM. NumPy arrays store uniform raw bytes contiguously in memory for instant CPU cache line prefetching.'
        },
        terminologies: [
          { term: 'ndarray', def: 'N-dimensional array of homogeneous data type (dtype) stored in contiguous RAM.' },
          { term: 'Contiguous Memory', def: 'Elements stored sequentially in RAM addresses with zero pointer overhead.' },
          { term: 'uint8 vs float64', def: 'uint8 uses 1 byte per item (0-255 pixels); float64 uses 8 bytes per item.' }
        ],
        conceptMarkdown: `### Why Python Lists Fail at Scale in Digital Media & Data Science
In standard Python, every number is an **object**:
- A single Python integer requires **28 bytes** (metadata, reference count, type descriptor) just to store one number.
- A list of 1,000,000 numbers is actually a list of **pointers** pointing to scattered memory addresses.

**NumPy arrays (\`ndarray\`)** allocate a **single contiguous block of raw memory**:
- An image pixel stored as \`np.uint8\` uses exactly **1 byte** (values $0$ to $255$).
- Contiguous storage allows the CPU's **L1/L2 cache prefetcher** to load neighboring pixels before they are even requested.
- Enables hardware **SIMD (Single Instruction, Multiple Data)** parallel execution.`,
        visualAscii: `[Python List Memory Layout] - Pointers to Scattered Heap Objects (High RAM, Cache Misses)
RAM Address: 0x100       0x480          0x920
             ┌─────────┐  ┌───────────┐  ┌───────────┐
Pointers:    │  Ptr 0  ├─>│ Int: 255  │  │ Int: 128  │
             ├─────────┤  └───────────┘  └─────▲─────┘
             │  Ptr 1  ├───────────────────────┘
             └─────────┘

[NumPy ndarray Layout] - Contiguous Uniform Byte Stream in Cache Line (Compact, Blazing Fast)
RAM Address: 0x2000    0x2001    0x2002    0x2003
             ┌─────────┬─────────┬─────────┬─────────┐
Raw Bytes:   │   255   │   128   │   64    │    0    │ (8-bit raw image pixels in sequence)
             └─────────┴─────────┴─────────┴─────────┘`,
        syntaxGuide: `import numpy as np

# Create image pixel array (0 to 255)
pixels = np.array([255, 128, 64, 0], dtype=np.uint8)

# Core introspection attributes
print(pixels.ndim)     # Number of dimensions: 1
print(pixels.shape)    # Dimensions tuple: (4,)
print(pixels.dtype)    # Data type: uint8
print(pixels.itemsize) # Bytes per item: 1 byte
print(pixels.nbytes)   # Total memory: 4 bytes (4 * 1)`,
        starterCode: `import numpy as np
import sys

print("=== LIVE DEMO 1.1: IMAGE MEMORY FOOTPRINT COMPARISON ===")
# Simulated 1080p Grayscale Photo: 1920 x 1080 = 2,073,600 pixels
height, width = 1080, 1920
n_pixels = height * width

# 1. Memory cost if stored as standard Python list
py_pixels = [128] * n_pixels
py_memory_bytes = sys.getsizeof(py_pixels) + (sys.getsizeof(128) * n_pixels)

# 2. Memory cost if stored as NumPy uint8 array
np_pixels = np.full((height, width), 128, dtype=np.uint8)
np_memory_bytes = np_pixels.nbytes

print(f"Total Pixels in 1080p Image : {n_pixels:,}")
print(f"Python List RAM Consumption : {py_memory_bytes / (1024**2):.1f} MB")
print(f"NumPy ndarray RAM Usage     : {np_memory_bytes / (1024**2):.2f} MB")
print(f"Memory Saved by NumPy       : {(py_pixels_mem - np_memory_bytes) / py_pixels_mem * 100:.1f}% less RAM! 🚀" if 'py_pixels_mem' in locals() else f"NumPy uses {py_memory_bytes / np_memory_bytes:.0f}x less RAM!")

print("\\n--- Array Introspection ---")
print(f"Shape: {np_pixels.shape} | Dtype: {np_pixels.dtype} | Itemsize: {np_pixels.itemsize} byte")
`,
        solutionCode: `import numpy as np

def calculate_image_memory(height, width, channels=3):
    # Channels=3 for RGB, dtype=uint8 (1 byte per pixel channel)
    img_array = np.zeros((height, width, channels), dtype=np.uint8)
    return (img_array.shape, img_array.size, img_array.nbytes)
`,
        poll: {
          id: 'poll_m1_s1',
          question: 'Why does image processing in computer vision require NumPy contiguous ndarrays instead of Python lists?',
          options: [
            'Python lists convert numbers into strings which loses pixel color accuracy',
            'NumPy stores uniform raw bytes contiguously in memory, allowing hardware CPU cache prefetching and SIMD acceleration',
            'Python lists are limited to a maximum of 1,000 numbers',
            'NumPy arrays automatically compress images into JPEG format'
          ],
          correctIndex: 1,
          explanation: 'NumPy stores elements in a single contiguous memory block without object pointers. This matches how graphics cards and CPU cache lines load image rasters.',
          communityDistribution: [2, 92, 4, 2]
        },
        challenge: {
          id: 'chal_m1_s1',
          title: 'Challenge 1.1: Image Tensor Memory Calculator',
          prompt: 'Write a function `calculate_image_memory(height, width, channels=3)` that creates a 3D NumPy array of shape (height, width, channels) with dtype=np.uint8 and returns (shape, total_elements, total_memory_bytes).',
          initialCode: `import numpy as np

def calculate_image_memory(height, width, channels=3):
    # TODO: Create a 3D array of shape (height, width, channels) with dtype=np.uint8
    # TODO: Return tuple (arr.shape, arr.size, arr.nbytes)
    pass

# Test your function:
print("HD Image Specs:", calculate_image_memory(720, 1280, 3))
`,
          solutionCode: `import numpy as np

def calculate_image_memory(height, width, channels=3):
    arr = np.zeros((height, width, channels), dtype=np.uint8)
    return (arr.shape, arr.size, arr.nbytes)
`,
          testCode: `
shape, size, nbytes = calculate_image_memory(100, 200, 3)
assert shape == (100, 200, 3), f"Expected shape (100, 200, 3), got {shape}"
assert size == 60000, f"Expected size 60,000, got {size}"
assert nbytes == 60000, f"Expected 60,000 bytes for uint8, got {nbytes}"
print("All Challenge 1.1 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s2',
        title: 'Array Creation Routines: The Digital Camera Canvas',
        timeTag: '00:08 - 00:15',
        storyboard: {
          analogyTitle: '📷 Digital Media Scenario: The Blank Camera Sensor Canvas',
          analogyStory: 'When you open a photo editor or initialize a digital camera sensor, the software never creates an empty list and appends pixels one-by-one. Instead, it instantly pre-allocates an entire canvas: a pure black canvas filled with zeros (np.zeros), a pure white canvas filled with 255s (np.full), or an overlay mask of ones (np.ones).',
          takeaway: 'Key Takeaway: Never build arrays using Python list appends. Pre-allocate the entire memory block upfront using np.zeros, np.ones, or np.full.'
        },
        terminologies: [
          { term: 'np.zeros', def: 'Allocates memory and initializes all elements to 0 (black pixels in an image).' },
          { term: 'np.ones', def: 'Allocates memory and initializes all elements to 1.' },
          { term: 'np.full', def: 'Pre-allocates an array filled with a specific constant value (e.g. 255 for pure white).' }
        ],
        conceptMarkdown: `### Built-in Array Constructors for Media & ML
In numerical computing, resizing or appending to an array is an expensive $O(N)$ operation that forces memory re-allocation.
Always **pre-allocate memory upfront**:
- \`np.zeros((rows, cols), dtype)\`: Pure black image or zero-initialized neural network weights.
- \`np.ones((rows, cols))\`: Masking tensors or bias initialization.
- \`np.full(shape, fill_value)\`: Pre-filling an array with a baseline value (e.g., neutral gray = 128).`,
        visualAscii: `np.zeros((2, 3), dtype=np.uint8)      np.full((2, 3), 128, dtype=np.uint8)
(Black Canvas)                        (Neutral Gray Canvas)
┌───┬───┬───┐                         ┌─────┬─────┬─────┐
│ 0 │ 0 │ 0 │                         │ 128 │ 128 │ 128 │
├───┼───┼───┤                         ├─────┼─────┼─────┤
│ 0 │ 0 │ 0 │                         │ 128 │ 128 │ 128 │
└───┴───┴───┘                         └─────┴─────┴─────┘`,
        syntaxGuide: `# Image canvas constructors
black_canvas = np.zeros((480, 640), dtype=np.uint8)
white_canvas = np.full((480, 640), 255, dtype=np.uint8)
mask = np.ones((480, 640), dtype=bool)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 1.2: PRE-ALLOCATING PHOTO CANVASES ===")

# 1. Pure black 3x3 pixel tile (all zeros)
black_tile = np.zeros((3, 3), dtype=np.uint8)
print("Black Tile (np.zeros):\\n", black_tile)

# 2. Pure white 3x3 pixel tile (all 255)
white_tile = np.full((3, 3), 255, dtype=np.uint8)
print("\\nWhite Tile (np.full 255):\\n", white_tile)

# 3. Neutral 50% gray 3x3 tile (all 128)
gray_tile = np.full((3, 3), 128, dtype=np.uint8)
print("\\nNeutral Gray Tile (128):\\n", gray_tile)
`,
        solutionCode: `import numpy as np

def create_image_canvas(height, width, color_value=128):
    return np.full((height, width), color_value, dtype=np.uint8)
`,
        poll: {
          id: 'poll_m1_s2',
          question: 'What is the most memory-efficient way to create a 1000x1000 grayscale image canvas initialized to pure white (255)?',
          options: [
            'Create a Python list using `[255 for _ in range(1000000)]`',
            'Use `np.full((1000, 1000), 255, dtype=np.uint8)`',
            'Create an empty array with `np.empty()` and run two nested for-loops',
            'Append 255 to a NumPy array in a while-loop'
          ],
          correctIndex: 1,
          explanation: '`np.full((1000, 1000), 255, dtype=np.uint8)` pre-allocates exactly 1 MB of memory in a single step and sets every byte to 255 in compiled C.',
          communityDistribution: [4, 91, 3, 2]
        },
        challenge: {
          id: 'chal_m1_s2',
          title: 'Challenge 1.2: Photo Canvas Generator',
          prompt: 'Write a function `create_image_canvas(height, width, color_value=128)` that creates and returns a 2D NumPy array with dtype=np.uint8 pre-filled with `color_value`.',
          initialCode: `import numpy as np

def create_image_canvas(height, width, color_value=128):
    # TODO: Pre-allocate 2D array of shape (height, width) with dtype=np.uint8 filled with color_value
    pass

# Test your function:
canvas = create_image_canvas(4, 5, 200)
print("Canvas:\\n", canvas)
`,
          solutionCode: `import numpy as np

def create_image_canvas(height, width, color_value=128):
    return np.full((height, width), color_value, dtype=np.uint8)
`,
          testCode: `
c = create_image_canvas(10, 20, 255)
assert c.shape == (10, 20), f"Expected shape (10, 20), got {c.shape}"
assert c.dtype == np.uint8, "Dtype must be np.uint8"
assert np.all(c == 255), "All pixels must equal 255"
print("All Challenge 1.2 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s3',
        title: 'Number Sequences & Sampling: Audio Waves & Timestamps',
        timeTag: '00:15 - 00:22',
        storyboard: {
          analogyTitle: '🎵 Audio & Sensor Scenario: Sound Waveform Sampling',
          analogyStory: 'When recording audio on a phone microphone, sound pressure is sampled 44,100 times per second. To plot or process a 1-second audio wave, we generate an exact timeline of 44,100 sample timestamps between 0.0s and 1.0s using np.linspace. If you want steps of fixed duration (e.g. take a reading every 0.1 seconds), you use np.arange.',
          takeaway: 'Key Rule: Use np.arange(start, stop, step) when step size matters. Use np.linspace(start, stop, num_samples) when the exact total number of points matters (e.g., signal sampling and loss curves).'
        },
        terminologies: [
          { term: 'np.arange', def: 'Step-based range generator: np.arange(start, stop, step). Stop is excluded [start, stop).' },
          { term: 'np.linspace', def: 'Sample-count generator: np.linspace(start, stop, num). Stop is included [start, stop].' },
          { term: 'Sampling Rate', def: 'The number of discrete samples captured per second from a continuous signal.' }
        ],
        conceptMarkdown: `### Sampling Signals: \`arange\` vs \`linspace\`
In signal processing, audio engineering, and machine learning:
- **\`np.arange(start, stop, step)\`**: Half-open interval $[start, stop)$. Useful for stepped indices.
- **\`np.linspace(start, stop, num)\`**: Closed interval $[start, stop]$. Essential when you need an **exact count** of evenly spaced evaluation points.`,
        visualAscii: `np.arange(0, 10, 2)           np.linspace(0, 10, 5)
┌───┬───┬───┬───┬───┐         ┌─────┬──────┬─────┬──────┬──────┐
│ 0 │ 2 │ 4 │ 6 │ 8 │         │ 0.0 │ 2.5  │ 5.0 │ 7.5  │ 10.0 │
└───┴───┴───┴───┴───┘         └─────┴──────┴─────┴──────┴──────┘
(Stop 10 is EXCLUDED!)        (Stop 10 is INCLUDED! Exactly 5 points)`,
        syntaxGuide: `# Audio timeline sampling
sampling_rate = 1000 # 1000 samples per second
time_vector = np.linspace(0.0, 1.0, sampling_rate)

# Volume step slider (0% to 100% in 10% steps)
volume_steps = np.arange(0.0, 1.1, 0.1)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 1.3: ARANGE VS LINSPACE ===")

# 1. np.arange: Step-based generation
# Notice that 1.0 is EXCLUDED:
vol_steps = np.arange(0.0, 1.0, 0.2)
print("Volume Steps with arange(0.0, 1.0, 0.2) :", vol_steps)

# 2. np.linspace: Exact sample count
# Notice that 1.0 is INCLUDED:
timestamps = np.linspace(0.0, 1.0, 5)
print("Timestamps with linspace(0.0, 1.0, 5)   :", timestamps)

# 3. Generating a 440 Hz Sine Wave (Concert Pitch A)
t = np.linspace(0, 0.01, 10) # First 10 milliseconds
frequency = 440
audio_signal = np.sin(2 * np.pi * frequency * t)
print("\\nAudio Signal Samples (First 10 ms):\\n", np.round(audio_signal, 3))
`,
        solutionCode: `import numpy as np

def generate_audio_timeline(duration_sec, sample_rate):
    total_samples = int(duration_sec * sample_rate)
    return np.linspace(0.0, duration_sec, total_samples)
`,
        poll: {
          id: 'poll_m1_s3',
          question: 'If you execute `np.linspace(0, 100, 5)`, what is the exact output array?',
          options: [
            '[0, 20, 40, 60, 80]',
            '[0., 25., 50., 75., 100.]',
            '[0, 25, 50, 75]',
            '[20., 40., 60., 80., 100.]'
          ],
          correctIndex: 1,
          explanation: '`np.linspace(0, 100, 5)` generates 5 evenly spaced samples between 0 and 100 inclusive: 0, 25, 50, 75, and 100.',
          communityDistribution: [6, 90, 2, 2]
        },
        challenge: {
          id: 'chal_m1_s3',
          title: 'Challenge 1.3: Audio Timeline Generator',
          prompt: 'Write a function `generate_audio_timeline(duration_sec, sample_rate)` that returns a 1D NumPy array of evenly spaced timestamps starting at 0.0 and ending at duration_sec, containing exactly `int(duration_sec * sample_rate)` samples.',
          initialCode: `import numpy as np

def generate_audio_timeline(duration_sec, sample_rate):
    # TODO: Calculate total_samples = int(duration_sec * sample_rate)
    # TODO: Return linspace from 0.0 to duration_sec with total_samples
    pass

# Test your function:
timeline = generate_audio_timeline(2.0, 5)
print("Timeline:", timeline)
`,
          solutionCode: `import numpy as np

def generate_audio_timeline(duration_sec, sample_rate):
    total_samples = int(duration_sec * sample_rate)
    return np.linspace(0.0, duration_sec, total_samples)
`,
          testCode: `
tl = generate_audio_timeline(1.0, 1000)
assert len(tl) == 1000, f"Expected 1000 samples, got {len(tl)}"
assert tl[0] == 0.0, "Start must be 0.0"
assert tl[-1] == 1.0, "End must be 1.0"
print("All Challenge 1.3 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s4',
        title: 'Random Number Generators: Simulating Camera Sensor Noise',
        timeTag: '00:22 - 00:30',
        storyboard: {
          analogyTitle: '📷 Digital Media Scenario: Grainy Camera Sensor Noise',
          analogyStory: 'When taking photos in low light, smartphone camera sensors produce random digital grain (film noise). To develop noise-reduction algorithms, engineers simulate synthetic Gaussian noise using random generators. Crucially, fixing the random seed ensures every engineer on the team tests their code against the exact same noise pattern, guaranteeing reproducible scientific benchmarks.',
          takeaway: 'Key Rule: Always initialize modern random generators with np.random.default_rng(seed) to ensure deterministic, reproducible results across experiments.'
        },
        terminologies: [
          { term: 'default_rng', def: 'The modern PCG-64 pseudo-random number generator in NumPy.' },
          { term: 'Seed Reproducibility', def: 'Ensuring identical sequences of random numbers across different runs or machines.' },
          { term: 'Gaussian / Normal Noise', def: 'Bell-curve distributed random numbers with mean=0 and standard deviation=1.' }
        ],
        conceptMarkdown: `### The Modern NumPy Random API: \`default_rng(seed)\`
Older NumPy code used \`np.random.seed(42)\` (legacy global state).
Modern best practice uses **isolated generator objects**:
\`\`\`python
rng = np.random.default_rng(seed=42)
noise = rng.normal(loc=0.0, scale=1.0, size=(100, 100))
\`\`\`
This prevents different libraries from conflicting with global random seeds.`,
        visualAscii: `Random Seed = 42 (Reproducible Across Any Computer):
Run 1 on Laptop A: [ 0.496, -0.138,  0.647 ]
Run 2 on Server B: [ 0.496, -0.138,  0.647 ]  <-- Exact identical sequence! Validates ML code!`,
        syntaxGuide: `# Modern Generator
rng = np.random.default_rng(seed=42)

# Uniform noise in [-1.0, 1.0]
uniform_noise = rng.uniform(-1.0, 1.0, size=(5, 5))

# Normal (Gaussian) noise
gaussian_noise = rng.standard_normal(size=(5, 5))`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 1.4: SIMULATING SENSOR NOISE WITH SEEDS ===")

# Create reproducible generator
rng = np.random.default_rng(seed=42)

# Simulate 3x3 low-light sensor noise (mean=0, std=5.0)
sensor_noise = rng.normal(loc=0.0, scale=5.0, size=(3, 3))
print("Synthetic Sensor Noise (seed=42):\\n", np.round(sensor_noise, 2))

# Adding noise to a clean image patch
clean_pixels = np.full((3, 3), 100.0) # Baseline color
noisy_pixels = np.clip(clean_pixels + sensor_noise, 0, 255).astype(np.uint8)

print("\\nClean Pixels :\\n", clean_pixels.astype(np.uint8))
print("Noisy Pixels :\\n", noisy_pixels)
`,
        solutionCode: `import numpy as np

def generate_sensor_noise(shape, seed=42):
    rng = np.random.default_rng(seed)
    return np.round(rng.uniform(-0.5, 0.5, size=shape), 3)
`,
        poll: {
          id: 'poll_m1_s4',
          question: 'Why is setting `np.random.default_rng(seed=42)` standard practice in data science and computer vision pipelines?',
          options: [
            'It makes random number generation 100x faster',
            'It guarantees that random numbers generated are completely reproducible on any machine for debugging and validation',
            'It prevents the computer from generating negative numbers',
            'It encrypts the dataset for security'
          ],
          correctIndex: 1,
          explanation: 'Fixing the random seed creates a deterministic sequence of pseudo-random numbers, ensuring colleagues and CI/CD pipelines get the exact same experimental results.',
          communityDistribution: [3, 93, 2, 2]
        },
        challenge: {
          id: 'chal_m1_s4',
          title: 'Challenge 1.4: Camera Sensor Noise Generator',
          prompt: 'Write a function `generate_sensor_noise(shape, seed=42)` that returns a NumPy array with random values uniformly distributed in [-0.5, 0.5], rounded to 3 decimal places.',
          initialCode: `import numpy as np

def generate_sensor_noise(shape, seed=42):
    # TODO: Initialize generator with seed: np.random.default_rng(seed)
    # TODO: Generate uniform samples in [-0.5, 0.5] with the given shape
    # TODO: Return array rounded to 3 decimal places
    pass

# Test your function:
noise_patch = generate_sensor_noise((3, 3))
print("Noise:\\n", noise_patch)
`,
          solutionCode: `import numpy as np

def generate_sensor_noise(shape, seed=42):
    rng = np.random.default_rng(seed)
    raw = rng.uniform(-0.5, 0.5, size=shape)
    return np.round(raw, 3)
`,
          testCode: `
n = generate_sensor_noise((5, 5), seed=99)
assert n.shape == (5, 5), f"Expected shape (5, 5), got {n.shape}"
assert np.all(n >= -0.5) and np.all(n <= 0.5), "Values must be bounded in [-0.5, 0.5]"
print("All Challenge 1.4 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s5',
        title: 'Dimensionality & Reshaping: Video Frame Transmission',
        timeTag: '00:30 - 00:38',
        storyboard: {
          analogyTitle: '📹 Digital Media Scenario: Streaming Video Frames over the Network',
          analogyStory: 'A computer screen displays video as a 2D grid of pixels (e.g. 1080 rows x 1920 columns). But Wi-Fi and HDMI cables cannot transmit a 2D grid all at once; they transmit data as a continuous 1D stream of bytes through the wire! The sending device flattens the 2D frame into a 1D pixel stream (.ravel), and the television display instantly reshapes it back into a 1080x1920 2D frame on screen.',
          takeaway: 'Key Rule: Reshaping changes the view of dimensions WITHOUT modifying or copying the underlying data bytes in memory.'
        },
        terminologies: [
          { term: '.reshape(rows, cols)', def: 'Changes the dimensional shape of an array without altering total elements.' },
          { term: '-1 Dimension', def: 'Tells NumPy to automatically calculate that dimension based on array length.' },
          { term: '.ravel() vs .flatten()', def: 'ravel returns a zero-copy view; flatten allocates a brand new copy in memory.' }
        ],
        conceptMarkdown: `### Array Reshaping & The \`-1\` Auto-Inference
To reshape an array, the product of the new dimensions must **strictly equal the original total elements**:
$$N_{rows} \\times N_{cols} = \\text{Total Elements}$$

#### The Powerful \`-1\` Dimension Shortcut:
If you have $10,000$ audio samples and want to organize them into $100$ batches without calculating the columns:
\`\`\`python
batches = audio_samples.reshape(100, -1) # NumPy calculates columns = 100 automatically!
\`\`\``,
        visualAscii: `Original 1D Stream (6 elements):
[ 10,  20,  30,  40,  50,  60 ]
              │
              ▼ reshape(2, 3)
2D Video Frame Grid:
Row 0: [ 10,  20,  30 ]
Row 1: [ 40,  50,  60 ]`,
        syntaxGuide: `# Flatten 2D frame to 1D stream
stream = frame_2d.ravel()

# Reshape 1D stream back to (Height, Width)
reconstructed = stream.reshape(1080, 1920)

# Reshape with auto-inference
reconstructed = stream.reshape(1080, -1)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 1.5: RESHAPING VIDEO DATA ===")

# Simulated 1D pixel stream of 12 numbers received over network
pixel_stream = np.array([255, 0, 128, 64, 200, 10, 50, 75, 100, 150, 220, 180], dtype=np.uint8)
print(f"1D Stream (Shape {pixel_stream.shape}):\\n", pixel_stream)

# 1. Reshape into a 3x4 2D Image Tile
image_tile = pixel_stream.reshape(3, 4)
print(f"\\nReshaped to 3x4 Frame (Shape {image_tile.shape}):\\n", image_tile)

# 2. Using -1 to let NumPy infer dimensions
auto_reshaped = pixel_stream.reshape(2, -1)
print(f"\\nAuto-reshaped with (2, -1) -> Shape {auto_reshaped.shape}:\\n", auto_reshaped)

# 3. ravel (Zero-copy View) vs flatten (Deep Copy)
flat_view = image_tile.ravel()
print("\\nFlattened view back to 1D:", flat_view)
`,
        solutionCode: `import numpy as np

def reshape_stream_to_frame(stream, target_rows):
    return stream.reshape(target_rows, -1)
`,
        poll: {
          id: 'poll_m1_s5',
          question: 'If an array `A` has 24 elements, what is the resulting shape of `A.reshape(4, -1)`?',
          options: [
            '(4, 4)',
            '(4, 6)',
            '(6, 4)',
            'An error because -1 is a negative number'
          ],
          correctIndex: 1,
          explanation: 'NumPy automatically calculates the missing dimension: 24 total elements divided by 4 rows = 6 columns. The shape is (4, 6).',
          communityDistribution: [3, 91, 4, 2]
        },
        challenge: {
          id: 'chal_m1_s5',
          title: 'Challenge 1.5: Pixel Stream to Image Frame Reshaper',
          prompt: 'Write a function `reshape_stream_to_frame(stream, target_rows)` that reshapes a 1D pixel stream into a 2D image matrix with `target_rows` and auto-inferred columns using `-1`.',
          initialCode: `import numpy as np

def reshape_stream_to_frame(stream, target_rows):
    # TODO: Reshape stream into (target_rows, -1)
    pass

# Test your function:
test_stream = np.arange(20)
print("Reshaped:\\n", reshape_stream_to_frame(test_stream, 4))
`,
          solutionCode: `import numpy as np

def reshape_stream_to_frame(stream, target_rows):
    return stream.reshape(target_rows, -1)
`,
          testCode: `
raw = np.arange(60)
frame = reshape_stream_to_frame(raw, 6)
assert frame.shape == (6, 10), f"Expected shape (6, 10), got {frame.shape}"
print("All Challenge 1.5 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s6',
        title: 'Multi-Dimensional Slicing: The Instagram Crop Tool',
        timeTag: '00:38 - 00:45',
        storyboard: {
          analogyTitle: '📷 Digital Media Scenario: Cropping a Profile Photo',
          analogyStory: 'When you upload a portrait photo to Instagram and drag the square cropping box over someone’s face, what is happening under the hood? The photo is a 2D array of pixels. The crop tool selects a sub-range of vertical row coordinates [y1:y2] and horizontal column coordinates [x1:x2]. In NumPy, you crop that face with a single line of slicing syntax.',
          takeaway: 'Key Syntax: matrix[row_start:row_end, col_start:col_end] slices rows and columns simultaneously.'
        },
        terminologies: [
          { term: '2D Slicing', def: 'Selecting sub-matrices by specifying ranges across rows and columns separated by a comma.' },
          { term: 'Step Slicing [::2]', def: 'Downsampling an image by taking every 2nd pixel (reducing resolution by 50%).' },
          { term: 'Negative Indices', def: 'Counting from the right edge or bottom of the array (e.g. -1 is the last pixel).' }
        ],
        conceptMarkdown: `### 2D Multi-Axis Slicing Syntax
In Python lists, slicing 2D tables requires awkward list comprehensions:
\`\`\`python
[row[10:50] for row in image[20:60]] # Slow and ugly!
\`\`\`
In NumPy, multi-axis slicing is clean and fast:
\`\`\`python
cropped_face = image[20:60, 10:50] # Rows 20-59, Cols 10-49
\`\`\`

#### Downsampling by Stepping:
\`\`\`python
thumbnail = image[::2, ::2] # Downsample resolution by 50% in both axes
\`\`\``,
        visualAscii: `Image Matrix (5x5 pixels):
        Col 0   Col 1   Col 2   Col 3   Col 4
Row 0: [  10,     11,     12,     13,     14  ]
Row 1: [  20,   [ 21,     22,     23 ],   24  ]  <-- image[1:4, 1:4]
Row 2: [  30,   [ 31,     32,     33 ],   34  ]      Crops the 3x3 square
Row 3: [  40,   [ 41,     42,     43 ],   44  ]      center avatar!
Row 4: [  50,     51,     52,     53,     54  ]`,
        syntaxGuide: `# Crop center 100x100 box
face = photo[50:150, 100:200]

# Extract first 5 rows and all columns
header = photo[:5, :]

# Downsample by 2
low_res = photo[::2, ::2]`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 1.6: CROPPING DIGITAL PHOTO MATRICES ===")

# Create a 6x6 grayscale image (pixel values 0 to 35)
photo = np.arange(36, dtype=np.uint8).reshape(6, 6)
print("Original 6x6 Photo Matrix:\\n", photo)

# 1. Crop Center 4x4 Region: Rows 1 to 5, Columns 1 to 5
cropped_face = photo[1:5, 1:5]
print(f"\\nCropped 4x4 Avatar (Shape {cropped_face.shape}):\\n", cropped_face)

# 2. Downsampling: Take every 2nd row and every 2nd column
downsampled = photo[::2, ::2]
print(f"\\nDownsampled Photo [::2, ::2] (Shape {downsampled.shape}):\\n", downsampled)
`,
        solutionCode: `import numpy as np

def crop_center_patch(image, r_start, r_end, c_start, c_end):
    return image[r_start:r_end, c_start:c_end].copy()
`,
        poll: {
          id: 'poll_m1_s6',
          question: 'Given an image of shape (1080, 1920), what is the resulting shape of `image[::2, ::2]`?',
          options: [
            '(1080, 1920)',
            '(540, 960)',
            '(540, 1920)',
            '(2, 2)'
          ],
          correctIndex: 1,
          explanation: 'Step slicing `::2` takes every second element across rows (1080 / 2 = 540) and columns (1920 / 2 = 960), downsampling resolution by 50%.',
          communityDistribution: [3, 91, 4, 2]
        },
        challenge: {
          id: 'chal_m1_s6',
          title: 'Challenge 1.6: Photo Crop & Downsampler',
          prompt: 'Write a function `crop_and_downsample(image, r1, r2, c1, c2)` that crops the region from rows `r1:r2` and columns `c1:c2`, then downsamples by taking every 2nd pixel in both dimensions. Return a deep copy.',
          initialCode: `import numpy as np

def crop_and_downsample(image, r1, r2, c1, c2):
    # TODO: Crop image[r1:r2, c1:c2]
    # TODO: Downsample by taking [::2, ::2]
    # TODO: Return deep copy
    pass

# Test your function:
test_img = np.arange(100).reshape(10, 10)
print("Result:\\n", crop_and_downsample(test_img, 0, 6, 0, 6))
`,
          solutionCode: `import numpy as np

def crop_and_downsample(image, r1, r2, c1, c2):
    return image[r1:r2, c1:c2][::2, ::2].copy()
`,
          testCode: `
sample = np.arange(100).reshape(10, 10)
res = crop_and_downsample(sample, 0, 6, 0, 8)
assert res.shape == (3, 4), f"Expected shape (3, 4), got {res.shape}"
print("All Challenge 1.6 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s7',
        title: 'The View vs Copy Danger: The Photo Editor Undo Buffer',
        timeTag: '00:45 - 00:52',
        storyboard: {
          analogyTitle: '🖼️ Digital Media Scenario: Overwriting the Camera Roll',
          analogyStory: 'Imagine opening a photo in an editor, cropping your friend’s face to test a sticker on it, and hitting save. To your horror, the original full photo on your phone’s camera roll is permanently altered with the sticker! In NumPy, basic slices are VIEWS into the same original memory buffer. If you draw on a slice, you draw directly on the master photo! To protect the master photo, you must make a photocopy (.copy()).',
          takeaway: 'Golden Rule: Slices are views. Modifying a slice alters the original master array! Always use array.copy() when isolating sub-regions.'
        },
        terminologies: [
          { term: 'View', def: 'A lightweight pointer window sharing the exact same memory buffer as the original array.' },
          { term: 'Copy', def: 'A completely independent duplicate allocation in memory created via array.copy().' },
          { term: '.base', def: 'An ndarray attribute: if array is a view, .base reveals the parent master array.' }
        ],
        conceptMarkdown: `### The Accidental Data Mutation Gotcha
In NumPy, slicing creates a **view** to avoid memory copying overhead:
\`\`\`python
avatar = master_photo[0:50, 0:50] # avatar is a VIEW!
avatar[0, 0] = 0                  # master_photo[0, 0] is MUTATED to 0!
\`\`\`

#### How to Check and Prevent:
1. **Check if an array is a view**: \`avatar.base is not None\`
2. **Prevent mutation**: \`avatar = master_photo[0:50, 0:50].copy()\``,
        visualAscii: `[Master Photo Buffer in RAM]
┌───────┬───────┬───────┬───────┐
│  100  │  200  │  150  │  250  │
└───────┴───────┴───────┴───────┘
    ▲
    │ Slicing without .copy() creates a VIEW pointing to the exact same bytes!
┌───┴───┐
│ avatar│  Modifying avatar[0] = 0 directly mutates Master Photo! ⚠️
└───────┘`,
        syntaxGuide: `# Slicing creates a VIEW (shares memory)
view_slice = data[:10, :]

# Creating an independent COPY (isolated memory)
safe_copy = data[:10, :].copy()

# Inspecting base parent
print(view_slice.base is not None) # True (it is a view!)
print(safe_copy.base is None)      # True (it owns its memory!)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 1.7: VIEW MUTATION VS INDEPENDENT COPY ===")

# Master Image: 4x4 clean canvas of 255s
master_photo = np.full((4, 4), 255, dtype=np.uint8)
print("Master Photo (Before):\\n", master_photo)

# 1. Unsafe Slicing (Creates a VIEW)
avatar_view = master_photo[:2, :2]
avatar_view[0, 0] = 0 # Draws a black pixel

print("\\nModifying avatar_view[0, 0] = 0...")
print("Notice Master Photo was MUTATED!:\\n", master_photo)

# 2. Safe Copying with .copy()
master_photo[0, 0] = 255 # Reset master
safe_avatar = master_photo[:2, :2].copy()
safe_avatar[0, 0] = 42   # Edit copy

print("\\nModifying safe_avatar[0, 0] = 42 (Safe Copy)...")
print("Master Photo remains clean and protected!:\\n", master_photo[0, 0])
`,
        solutionCode: `import numpy as np

def safe_extract_patch(image, r1, r2, c1, c2):
    return image[r1:r2, c1:c2].copy()
`,
        poll: {
          id: 'poll_m1_s7',
          question: 'If you execute `sub = master[10:20, 10:20]` and then modify `sub[0, 0] = 999`, what happens to `master[10, 10]`?',
          options: [
            'Nothing happens; sub is automatically a copy in Python',
            'master[10, 10] is also changed to 999 because basic slicing returns a VIEW sharing memory',
            'NumPy raises a PermissionError',
            'The entire master array is deleted'
          ],
          correctIndex: 1,
          explanation: 'Basic indexing and slicing in NumPy return views into the same memory buffer. Modifying values in a view directly alters the master array.',
          communityDistribution: [6, 90, 2, 2]
        },
        challenge: {
          id: 'chal_m1_s7',
          title: 'Challenge 1.7: Safe Photo Patch Extractor',
          prompt: 'Write a function `safe_extract_patch(image, r1, r2, c1, c2)` that extracts the region `image[r1:r2, c1:c2]` as an independent deep copy so that modifying the patch will never alter the original image.',
          initialCode: `import numpy as np

def safe_extract_patch(image, r1, r2, c1, c2):
    # TODO: Extract sub-region safely using .copy()
    pass

# Test your function:
test_img = np.ones((5, 5))
patch = safe_extract_patch(test_img, 0, 2, 0, 2)
patch[0, 0] = 999
print("Original [0, 0] is preserved as 1.0:", test_img[0, 0])
`,
          solutionCode: `import numpy as np

def safe_extract_patch(image, r1, r2, c1, c2):
    return image[r1:r2, c1:c2].copy()
`,
          testCode: `
master = np.full((10, 10), 100)
patch = safe_extract_patch(master, 2, 5, 2, 5)
patch[0, 0] = 0
assert master[2, 2] == 100, "Modifying patch must NOT mutate master array! Did you call .copy()?"
print("All Challenge 1.7 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm1_s8',
        title: 'SIMD Vectorization: One-Tap Photo Filters (100x Speedup)',
        timeTag: '00:52 - 01:00',
        storyboard: {
          analogyTitle: '🎨 Digital Media Scenario: One-Tap Instagram Filter',
          analogyStory: 'When you tap "Invert Colors" on a 12-megapixel photo on your phone, you expect the filter to appear instantly in 1 millisecond. If the phone ran a standard Python for-loop iterating over all 12,000,000 pixels one-by-one, the phone would freeze and take 4 to 8 seconds! NumPy vectorization uses CPU SIMD (Single Instruction, Multiple Data) hardware registers that process 8 to 16 pixels in parallel in a single CPU clock cycle.',
          takeaway: 'Golden Rule of Data Science: Never loop over numerical arrays. Vectorized expressions run in compiled C/SIMD at 100x speed.'
        },
        terminologies: [
          { term: 'Vectorization', def: 'Executing operations on entire arrays simultaneously at compiled C-speed without Python loops.' },
          { term: 'Universal Functions (ufunc)', def: 'C-level vectorized element-wise math functions (e.g. np.add, np.clip, np.exp).' },
          { term: 'SIMD Acceleration', def: 'Hardware registers (AVX-512, NEON) processing multiple numerical elements in 1 clock cycle.' }
        ],
        conceptMarkdown: `### Benchmarking Vectorized Photo Inversion
To invert a grayscale photo (turn black into white and white into black):
$$\\text{Inverted} = 255 - \\text{Pixel}$$

- **Python Loop**: $\\approx 180 - 250$ milliseconds (slow, laggy)
- **NumPy Vectorization (\`255 - image\`)**: $\\approx 1.2$ milliseconds (**150x Faster!**)`,
        visualAscii: `Python For Loop (Slow, 1 pixel at a time):
Loop 0: Check type -> Dereference pointer -> Compute (255 - p0)
Loop 1: Check type -> Dereference pointer -> Compute (255 - p1)
... Repeat 1,000,000 times!

NumPy SIMD Vectorization (16 pixels processed in 1 single CPU cycle!):
[p0, p1, p2, p3, p4, p5, p6, p7]  <-- Loaded into AVX hardware register
 -    -   -   -   -   -   -   -
[255, 255, 255, 255, 255, 255]
 =    =   =   =   =   =   =   =
[Result computed in 1 nanosecond!]`,
        syntaxGuide: `# Invert colors vectorially
inverted = 255 - image

# Contrast adjustment
contrast = np.clip(image * 1.5, 0, 255).astype(np.uint8)

# Non-linear gamma correction
gamma_corrected = np.power(image / 255.0, 2.2) * 255`,
        starterCode: `import numpy as np
import time

print("=== LIVE DEMO 1.8: VECTORIZED PHOTO INVERSION BENCHMARK ===")
# 500,000 image pixels
N = 500_000
pixels_list = [100] * N
pixels_np = np.full(N, 100, dtype=np.uint8)

# 1. Benchmarking Python For Loop
t0 = time.perf_counter()
loop_out = []
for p in pixels_list:
    loop_out.append(255 - p)
loop_time = time.perf_counter() - t0

# 2. Benchmarking NumPy Vectorized ufunc
t0 = time.perf_counter()
vec_out = 255 - pixels_np
vec_time = time.perf_counter() - t0

speedup = loop_time / vec_time

print(f"Total Pixels Processed : {N:,}")
print(f"Python For-Loop Time   : {loop_time * 1000:.2f} ms")
print(f"NumPy Vectorized Time  : {vec_time * 1000:.2f} ms")
print(f"Speedup Factor         : {speedup:.1f}x Faster! 🚀")
`,
        solutionCode: `import numpy as np

def invert_photo_colors(image):
    return 255 - image
`,
        poll: {
          id: 'poll_m1_s8',
          question: 'Why is `inverted = 255 - photo` up to 100x faster than writing `[255 - p for p in photo]` in Python?',
          options: [
            'Because NumPy operates on strings instead of numbers',
            'NumPy uses compiled C code with CPU SIMD registers to process multiple pixels in parallel per clock cycle, bypassing Python interpreter overhead',
            'Because Python list comprehensions use too much battery',
            'Because 255 is an even number'
          ],
          correctIndex: 1,
          explanation: 'NumPy vectorized ufuncs run in compiled C/SIMD assembly without bytecode interpretation, type checks, or loop overhead.',
          communityDistribution: [2, 94, 2, 2]
        },
        challenge: {
          id: 'chal_m1_s8',
          title: 'Challenge 1.8: Vectorized Color Inverter & Contrast Adjuster',
          prompt: 'Write a vectorized function `apply_photo_filter(image, brightness_gain=1.2)` that inverts the colors (`255 - image`), multiplies by `brightness_gain`, and clips values strictly to [0, 255] as np.uint8 WITHOUT using any for-loops.',
          initialCode: `import numpy as np

def apply_photo_filter(image, brightness_gain=1.2):
    # TODO: Step 1 - Invert: inv = 255 - image
    # TODO: Step 2 - Gain: adjusted = inv * brightness_gain
    # TODO: Step 3 - Clip: return np.clip(adjusted, 0, 255).astype(np.uint8)
    pass

# Test your function:
test_img = np.array([[50, 100], [150, 200]], dtype=np.uint8)
print("Filtered:\\n", apply_photo_filter(test_img))
`,
          solutionCode: `import numpy as np

def apply_photo_filter(image, brightness_gain=1.2):
    inv = 255.0 - image.astype(np.float64)
    adjusted = inv * brightness_gain
    return np.clip(adjusted, 0, 255).astype(np.uint8)
`,
          testCode: `
img = np.array([[0, 255]], dtype=np.uint8)
res = apply_photo_filter(img, 1.0)
assert res[0, 0] == 255, "0 inverted should be 255"
assert res[0, 1] == 0, "255 inverted should be 0"
assert res.dtype == np.uint8, "Output must be uint8"
print("All Challenge 1.8 tests passed successfully! 🎉")
`
        }
      }
    ]
  },
  {
    id: 'module_2',
    moduleNumber: 2,
    title: 'NumPy Advanced (Filters, Audio & Sensor Matrices)',
    duration: '60 mins (Track 2)',
    summary: 'Master multi-dimensional array broadcasting, dimension manipulation (newaxis), smartwatch cardio thresholding (boolean masking), green-screen chroma-keying (np.where), axis aggregations (axis 0 vs 1), matrix dot products, and feature standardization.',
    slides: [
      {
        id: 'm2_s1',
        title: 'The Rules of Broadcasting: Adjusting Photo Brightness',
        timeTag: '01:00 - 01:08',
        storyboard: {
          analogyTitle: '☀️ Digital Media Scenario: Brightening an Entire Photo',
          analogyStory: 'Suppose you have a 1080p photo (1080 rows x 1920 columns) and you want to brighten every pixel by adding +30. Do you need to create another 1080x1920 array filled with millions of 30s? No! NumPy Broadcasting virtually stretches the single number +30 across the entire 2D image matrix without copying memory, performing the addition directly in CPU registers.',
          takeaway: 'Key Broadcasting Rule: Compare dimensions from right to left (trailing). Two dimensions are compatible if they are equal OR if one of them is 1.'
        },
        terminologies: [
          { term: 'Broadcasting', def: 'How NumPy treats arrays with differing shapes during element-wise arithmetic without memory copies.' },
          { term: 'Trailing Dimensions', def: 'Comparing shapes element-by-element starting from the last dimension backwards.' },
          { term: 'Virtual Stretch', def: 'Setting dimension stride to 0 so the CPU re-uses values without duplicating memory.' }
        ],
        conceptMarkdown: `### The 2 Golden Rules of Broadcasting
When operating on arrays \`A\` and \`B\`, NumPy compares shapes **from right to left**:

1. Two dimensions are compatible if:
   - **They are equal**, OR
   - **One of them is 1**.
2. Dimensions of size 1 are virtually stretched to match the other array.

#### Example 1: Photo Brightening
\`\`\`
Image:   (1080, 1920)
Scalar:            (1,)  --> Stretches across all 1080 rows and 1920 cols!
Result:  (1080, 1920)
\`\`\`

#### Example 2: Channel Offsets (3 Color Channels)
\`\`\`
RGB Image:  (1080, 1920, 3)
Tint:                   (3,)  --> Compatible! Stretches across height and width!
\`\`\``,
        visualAscii: `2D Image (3x3 pixels)      +   Scalar (+30)           =  Brightened Image (3x3)
┌─────┬─────┬─────┐           ┌────┐                     ┌─────┬─────┬─────┐
│ 100 │ 120 │ 140 │           │ 30 │                     │ 130 │ 150 │ 170 │
├─────┼─────┼─────┤     +     └────┘ (Virtually          ├─────┼─────┼─────┤
│ 110 │ 130 │ 150 │                  stretched to        │ 140 │ 160 │ 180 │
├─────┼─────┼─────┤                  all 9 pixels!)      ├─────┼─────┼─────┤
│ 120 │ 140 │ 160 │                                      │ 150 │ 170 │ 190 │
└─────┴─────┴─────┘                                      └─────┴─────┴─────┘`,
        syntaxGuide: `# Scalar broadcasting (brightness)
brightened = np.clip(image + 30, 0, 255)

# Row tint broadcasting
# image shape (H, W, 3), tint shape (3,)
tinted = image + np.array([10, 0, -10])`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.1: PHOTO BRIGHTNESS VIA BROADCASTING ===")

# Simulated 3x3 dark photo patch
dark_photo = np.array([
    [40, 50, 60],
    [70, 80, 90],
    [100, 110, 120]
], dtype=np.uint8)

print("Original Dark Photo:\\n", dark_photo)

# 1. Scalar Broadcasting (+40 brightness)
brightened = np.clip(dark_photo.astype(np.int16) + 40, 0, 255).astype(np.uint8)
print("\\nBrightened Photo (+40 broadcasted):\\n", brightened)

# 2. Column-wise gradient offset: shape (1, 3)
column_gradient = np.array([0, 20, 40], dtype=np.int16)
gradient_photo = np.clip(dark_photo.astype(np.int16) + column_gradient, 0, 255).astype(np.uint8)
print("\\nColumn Gradient Applied (Broadcasting (1, 3)):\\n", gradient_photo)
`,
        solutionCode: `import numpy as np

def brighten_photo(image, brightness_val):
    adjusted = image.astype(np.int16) + brightness_val
    return np.clip(adjusted, 0, 255).astype(np.uint8)
`,
        poll: {
          id: 'poll_m2_s1',
          question: 'Can an image of shape (720, 1280, 3) be added to a color offset vector of shape (3,) using broadcasting?',
          options: [
            'No, because the dimensions 720 and 1280 do not match 3',
            'Yes, and the resulting broadcasted shape is (720, 1280, 3)',
            'Yes, but the shape becomes (3, 3, 3)',
            'No, broadcasting only works on 1D arrays'
          ],
          correctIndex: 1,
          explanation: 'Comparing dimensions from right to left: trailing dimension 3 matches 3; dimensions 1280 and 720 match virtual 1s. The shape remains (720, 1280, 3).',
          communityDistribution: [6, 89, 3, 2]
        },
        challenge: {
          id: 'chal_m2_s1',
          title: 'Challenge 2.1: Photo Brightness Broadcaster',
          prompt: 'Write a function `brighten_photo(image, brightness_val)` that adds `brightness_val` to 2D image array `image` using broadcasting, clips values strictly in [0, 255], and returns uint8.',
          initialCode: `import numpy as np

def brighten_photo(image, brightness_val):
    # TODO: Add brightness_val using broadcasting
    # TODO: Clip values to [0, 255] and cast to np.uint8
    pass

# Test your function:
test_img = np.array([[100, 200], [240, 50]], dtype=np.uint8)
print("Brightened:\\n", brighten_photo(test_img, 30))
`,
          solutionCode: `import numpy as np

def brighten_photo(image, brightness_val):
    adjusted = image.astype(np.int16) + brightness_val
    return np.clip(adjusted, 0, 255).astype(np.uint8)
`,
          testCode: `
img = np.array([[240, 250]], dtype=np.uint8)
res = brighten_photo(img, 20)
assert res[0, 0] == 255 and res[0, 1] == 255, "Values > 255 must be clipped to 255"
assert res.dtype == np.uint8, "Output must be uint8"
print("All Challenge 2.1 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s2',
        title: 'Dimension Expansion: Adding Color Channels (np.newaxis)',
        timeTag: '01:08 - 01:15',
        storyboard: {
          analogyTitle: '🎨 Digital Media Scenario: Converting Grayscale to 3D Tensors',
          analogyStory: 'Deep learning vision models (like object detectors in self-driving cars) expect images to have 3 dimensions: (Height, Width, Channels). If you feed a black-and-white photo of shape (480, 640), the neural network crashes because it is missing the 3rd dimension! By using np.newaxis, you add a virtual channel dimension without duplicating pixels, converting (480, 640) into (480, 640, 1).',
          takeaway: 'Key Syntax: arr[:, :, np.newaxis] or np.expand_dims(arr, axis=-1) inserts a new dimension of size 1.'
        },
        terminologies: [
          { term: 'np.newaxis', def: 'Alias for None; used in indexing brackets to increase array dimensionality by 1.' },
          { term: 'np.expand_dims', def: 'Explicit function to insert a new dimension of size 1 at a specified axis position.' },
          { term: 'np.squeeze', def: 'Removes all single-dimensional entries (dimensions of size 1) from an array.' }
        ],
        conceptMarkdown: `### Dimension Manipulation for Model Inputs
Machine learning libraries (PyTorch, TensorFlow, Scikit-learn) strictly check input ranks:
- 1D feature vector: shape \`(N,)\` → needs to become \`(N, 1)\`
- 2D image: shape \`(H, W)\` → needs to become \`(H, W, 1)\`

\`\`\`python
# Converting 2D grayscale image to 3D tensor
tensor_3d = grayscale_img[:, :, np.newaxis] # Shape (H, W, 1)

# Or using expand_dims
tensor_3d = np.expand_dims(grayscale_img, axis=-1)
\`\`\``,
        visualAscii: `Grayscale Image: Shape (3, 3)          After np.newaxis: Shape (3, 3, 1)
┌─────┬─────┬─────┐                   ┌─────┬─────┬─────┐
│ 100 │ 120 │ 140 │                   │[100]│[120]│[140]│  <-- Each pixel is now
├─────┼─────┼─────┤         ───>      ├─────┼─────┼─────┤      a 1-element channel vector!
│ 110 │ 130 │ 150 │                   │[110]│[130]│[150]│      Ready for Computer Vision!
├─────┼─────┼─────┤                   ├─────┼─────┼─────┤
│ 120 │ 140 │ 160 │                   │[120]│[140]│[160]│
└─────┴─────┴─────┘                   └─────┴─────┴─────┘`,
        syntaxGuide: `# Add channel dimension at end
img_3d = img_2d[:, :, np.newaxis] # (H, W, 1)

# Add batch dimension at start
batch_4d = img_3d[np.newaxis, ...] # (1, H, W, 1)

# Remove single-dimensional entries
back_to_2d = np.squeeze(img_3d) # (H, W)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.2: ADDING CHANNEL DIMENSIONS ===")

# 2D Grayscale image patch: (3, 4)
gray_image = np.array([
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120]
], dtype=np.uint8)

print("Original 2D Image Shape:", gray_image.shape)

# 1. Expand to 3D Tensor using np.newaxis
tensor_3d = gray_image[:, :, np.newaxis]
print("After np.newaxis Shape  :", tensor_3d.shape)

# 2. Expand to 4D Batch Tensor (Batch, Height, Width, Channel)
batch_tensor = np.expand_dims(tensor_3d, axis=0)
print("After Batch Expansion   :", batch_tensor.shape)

# 3. Squeeze back to original 2D
squeezed = np.squeeze(batch_tensor)
print("After np.squeeze Shape  :", squeezed.shape)
`,
        solutionCode: `import numpy as np

def convert_to_3d_tensor(img_2d):
    return img_2d[:, :, np.newaxis]
`,
        poll: {
          id: 'poll_m2_s2',
          question: 'If `arr` has shape `(100, 50)`, what is the shape of `arr[:, :, np.newaxis]`?',
          options: [
            '(1, 100, 50)',
            '(100, 50, 1)',
            '(100, 50)',
            '(100, 1, 50)'
          ],
          correctIndex: 1,
          explanation: 'Placing `np.newaxis` in the third indexing position adds a new dimension of size 1 at the end, resulting in shape (100, 50, 1).',
          communityDistribution: [5, 90, 3, 2]
        },
        challenge: {
          id: 'chal_m2_s2',
          title: 'Challenge 2.2: Computer Vision Tensor Reshaper',
          prompt: 'Write a function `convert_to_3d_tensor(img_2d)` that takes a 2D image matrix of shape (H, W) and returns a 3D tensor of shape (H, W, 1) using `np.newaxis` or `np.expand_dims`.',
          initialCode: `import numpy as np

def convert_to_3d_tensor(img_2d):
    # TODO: Expand dimensions to shape (H, W, 1)
    pass

# Test your function:
sample = np.ones((10, 20))
print("Tensor Shape:", convert_to_3d_tensor(sample).shape)
`,
          solutionCode: `import numpy as np

def convert_to_3d_tensor(img_2d):
    return img_2d[:, :, np.newaxis]
`,
          testCode: `
m = np.zeros((480, 640))
t = convert_to_3d_tensor(m)
assert t.shape == (480, 640, 1), f"Expected shape (480, 640, 1), got {t.shape}"
print("All Challenge 2.2 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s3',
        title: 'Boolean Masking & Thresholding: Smartwatch Cardio Detector',
        timeTag: '01:15 - 01:23',
        storyboard: {
          analogyTitle: '⌚ Health Sensor Scenario: Smartwatch Workout Detection',
          analogyStory: 'Your smartwatch records your heart rate once every minute (1,440 readings in 24 hours). The health app wants to find every minute where your heart rate was in the "Cardio Workout Zone" (between 120 and 160 bpm). Instead of writing a slow for-loop with if-statements, NumPy evaluates the condition (hr >= 120) & (hr <= 160) across all 1,440 numbers in 1 microsecond, returning a True/False mask that instantly filters your active workout minutes.',
          takeaway: 'Key Rule: Never write an if-statement inside a loop. Use boolean indexing with bitwise operators (&, |, ~) for instantaneous filtering.'
        },
        terminologies: [
          { term: 'Boolean Mask', def: 'Array of True/False values created by applying relational operators (>, <, ==) to an array.' },
          { term: 'Bitwise Operators (&, |, ~)', def: 'Used for element-wise logical AND, OR, and NOT on boolean arrays.' },
          { term: 'np.count_nonzero', def: 'Efficiently counts the number of True values in a boolean mask.' }
        ],
        conceptMarkdown: `### Filtering Data Without If-Statements
In Python, writing \`if x > 120 and x < 160:\` inside a loop is slow.
In NumPy, **Boolean Masking** applies the condition across the entire array in compiled C:
\`\`\`python
# Create boolean mask
workout_mask = (heart_rates >= 120) & (heart_rates <= 160)

# Filter matching values
workout_readings = heart_rates[workout_mask]
\`\`\`

#### Why Bitwise \`&\` Instead of \`and\`?
- \`and\` tests whether the *entire array object* is True/False (raises \`ValueError\`).
- \`&\` performs the logical AND **element-by-element** across the arrays.`,
        visualAscii: `Heart Rates (bpm):     [ 72,   125,   145,    80,   155,    68 ]
Condition (>= 120):    [ F ,    T ,    T ,    F ,    T ,    F  ] (Boolean Mask)
Result of hr[mask]:    [ 125,  145,  155 ]                       (Active Workout Zone!)`,
        syntaxGuide: `# Filtering with bitwise operators
mask = (sensor >= min_val) & (sensor <= max_val)
valid_data = sensor[mask]

# Count how many minutes in zone
total_minutes = np.sum(mask)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.3: SMARTWATCH WORKOUT ZONE DETECTOR ===")

# Simulated 24-hour smartwatch heart rate readings (bpm)
rng = np.random.default_rng(seed=42)
heart_rates = rng.integers(60, 175, size=24) # One reading per hour

print("24-Hour Heart Rate Telemetry (bpm):\\n", heart_rates)

# 1. Create Boolean Mask for Cardio Zone (120 to 160 bpm)
cardio_mask = (heart_rates >= 120) & (heart_rates <= 160)
print("\\nCardio Zone Mask (True/False):\\n", cardio_mask)

# 2. Filter readings in the zone
active_hours = heart_rates[cardio_mask]
print(f"\\nActive Cardio Hours ({len(active_hours)} hours detected):\\n", active_hours)

# 3. Resting Heart Rate Filter (< 70 bpm)
resting_hours = heart_rates[heart_rates < 70]
print(f"Resting Hours (< 70 bpm): {resting_hours}")
`,
        solutionCode: `import numpy as np

def extract_workout_readings(heart_rates, lower_limit, upper_limit):
    mask = (heart_rates >= lower_limit) & (heart_rates <= upper_limit)
    return heart_rates[mask]
`,
        poll: {
          id: 'poll_m2_s3',
          question: 'Why does writing `(arr > 5) and (arr < 10)` raise a `ValueError` in NumPy?',
          options: [
            'Python keyword `and` evaluates whether the entire array as a whole is truthy, which is ambiguous for multi-element arrays',
            'Because `and` only works on negative numbers',
            'NumPy arrays do not support comparisons',
            'Because `5` is smaller than `10`'
          ],
          correctIndex: 0,
          explanation: 'The Python keyword `and` requires a single boolean truth value. In NumPy, you must use bitwise `&` so comparisons execute element-by-element.',
          communityDistribution: [92, 2, 4, 2]
        },
        challenge: {
          id: 'chal_m2_s3',
          title: 'Challenge 2.3: Cardio Zone Extractor',
          prompt: 'Write a function `extract_workout_readings(heart_rates, lower_limit, upper_limit)` that returns a 1D NumPy array containing only the heart rates between `lower_limit` and `upper_limit` inclusive using boolean masking.',
          initialCode: `import numpy as np

def extract_workout_readings(heart_rates, lower_limit, upper_limit):
    # TODO: Create boolean mask using bitwise &
    # TODO: Return filtered heart rates
    pass

# Test your function:
sample_hr = np.array([65, 125, 135, 80, 155, 60])
print("Workout Zone:", extract_workout_readings(sample_hr, 120, 160))
`,
          solutionCode: `import numpy as np

def extract_workout_readings(heart_rates, lower_limit, upper_limit):
    mask = (heart_rates >= lower_limit) & (heart_rates <= upper_limit)
    return heart_rates[mask]
`,
          testCode: `
hr = np.array([60, 120, 140, 160, 180])
res = extract_workout_readings(hr, 120, 160)
assert list(res) == [120, 140, 160], f"Expected [120, 140, 160], got {list(res)}"
print("All Challenge 2.3 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s4',
        title: 'Vectorized Conditionals: Green Screen Chroma-Keying (np.where)',
        timeTag: '01:23 - 01:30',
        storyboard: {
          analogyTitle: '🎬 Digital Media Scenario: Hollywood Green Screen (Chroma-Key)',
          analogyStory: 'In movie production, actors perform in front of a bright green wall. Special effects software examines every pixel: if a pixel is green, replace it with the background sci-fi spaceship scene; otherwise, keep the original actor’s pixel! In NumPy, np.where executes this exact ternary condition across millions of pixels simultaneously without writing a single if-statement.',
          takeaway: 'Key Syntax: np.where(condition, if_true, if_false) replaces values conditionally across entire arrays in one step.'
        },
        terminologies: [
          { term: 'np.where', def: 'Vectorized ternary conditional: np.where(condition, value_if_true, value_if_false).' },
          { term: 'np.clip', def: 'Restricts array values strictly between a lower and upper bound: np.clip(arr, min, max).' },
          { term: 'Chroma-Keying', def: 'Replacing a specific color channel threshold with an alternate background image.' }
        ],
        conceptMarkdown: `### Conditional Selection with \`np.where\`
Instead of writing nested if-else loops:
\`\`\`python
# Vectorized ternary:
clean_image = np.where(pixel_is_green, background_pixel, actor_pixel)
\`\`\`

#### Capping Outliers with \`np.clip\`:
If a sensor spikes with corrupted noise ($> 255$ or $< 0$):
\`\`\`python
valid_pixels = np.clip(raw_pixels, 0, 255)
\`\`\``,
        visualAscii: `Original Pixel Matrix:   [ 255,   40,   255,   80 ]  (255 = Green Screen background)
Condition (== 255):      [  T ,    F ,    T ,    F ]
np.where(== 255, 0, pix):[   0,   40,     0,   80 ]  (Green background replaced with 0!)`,
        syntaxGuide: `# Conditional replacement
clean = np.where(image > 200, 255, image)

# Bounding values
bounded = np.clip(sensor_data, min_val, max_val)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.4: GREEN SCREEN CHROMA-KEYING WITH NP.WHERE ===")

# Simulated 4x4 image patch where 255 represents the green screen backdrop
actor_frame = np.array([
    [255, 255, 255, 255],
    [255,  80,  90, 255],
    [255, 100, 110, 255],
    [255, 255, 255, 255]
], dtype=np.uint8)

print("Actor in Front of Green Screen (255):\\n", actor_frame)

# 1. Replace green background (255) with 0 (Dark Space Background)
space_background = 0
composite_frame = np.where(actor_frame == 255, space_background, actor_frame)
print("\\nComposite Frame (Green replaced with Space):\\n", composite_frame)

# 2. Outlier Clamping with np.clip
noisy_sensor = np.array([-15, 50, 120, 280, 95])
clamped = np.clip(noisy_sensor, 0, 255)
print("\\nSensor Clamped between 0 and 255:", clamped)
`,
        solutionCode: `import numpy as np

def apply_chroma_key(frame, green_val, replacement_val):
    return np.where(frame == green_val, replacement_val, frame)
`,
        poll: {
          id: 'poll_m2_s4',
          question: 'What is the output of `np.where(np.array([10, 80, 30]) > 50, 1, 0)`?',
          options: [
            '[1, 1, 1]',
            '[0, 1, 0]',
            '[10, 1, 30]',
            '[False, True, False]'
          ],
          correctIndex: 1,
          explanation: 'Only the second element (80) is greater than 50. Therefore, np.where returns 1 for index 1 and 0 for the other indices: [0, 1, 0].',
          communityDistribution: [2, 93, 3, 2]
        },
        challenge: {
          id: 'chal_m2_s4',
          title: 'Challenge 2.4: Chroma-Key Background Replacer',
          prompt: 'Write a function `apply_chroma_key(frame, green_val, replacement_val)` that replaces all pixels matching `green_val` with `replacement_val` using `np.where`.',
          initialCode: `import numpy as np

def apply_chroma_key(frame, green_val, replacement_val):
    # TODO: Use np.where to replace green_val with replacement_val
    pass

# Test your function:
test_mat = np.array([[255, 50], [80, 255]])
print("Replaced:\\n", apply_chroma_key(test_mat, 255, 0))
`,
          solutionCode: `import numpy as np

def apply_chroma_key(frame, green_val, replacement_val):
    return np.where(frame == green_val, replacement_val, frame)
`,
          testCode: `
frame = np.array([[255, 10], [20, 255]])
res = apply_chroma_key(frame, 255, 99)
assert res[0, 0] == 99 and res[1, 1] == 99, "Green pixels must be replaced with 99"
assert res[0, 1] == 10 and res[1, 0] == 20, "Actor pixels must remain unchanged"
print("All Challenge 2.4 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s5',
        title: 'Axis-Wise Aggregations: Weekly Fitness Dashboard (7 Days x 24 Hours)',
        timeTag: '01:30 - 01:38',
        storyboard: {
          analogyTitle: '⌚ Health Sensor Scenario: 7-Day Fitness Step Matrix',
          analogyStory: 'Your fitness band stores hourly step counts as a 2D matrix of shape (7 rows x 24 columns) — 7 days of the week by 24 hours of the day. To calculate your total daily steps, you sum across the 24 hours of each day (horizontal row collapse, axis=1). To find the most active hour of the day across the entire week, you average down the columns across the 7 days (vertical column collapse, axis=0).',
          takeaway: 'Golden Rule: axis=0 collapses rows (downward along columns). axis=1 collapses columns (horizontally along rows).'
        },
        terminologies: [
          { term: 'axis=0', def: 'Aggregates vertically across rows, producing one result per column.' },
          { term: 'axis=1', def: 'Aggregates horizontally across columns, producing one result per row.' },
          { term: 'keepdims=True', def: 'Preserves collapsed dimensions as size 1, enabling seamless broadcasting.' }
        ],
        conceptMarkdown: `### Navigating Matrix Dimensions: \`axis=0\` vs \`axis=1\`
Given a 2D matrix of shape $(7, 24)$:
- **\`np.sum(steps, axis=1)\`**: Sums across the 24 columns for each row → Output shape: **(7,)** (Daily total steps).
- **\`np.mean(steps, axis=0)\`**: Averages down the 7 rows for each hour → Output shape: **(24,)** (Hourly weekly average).

#### Why \`keepdims=True\` Matters for Normalization:
If you subtract the daily mean from each row, \`np.mean(steps, axis=1, keepdims=True)\` outputs shape **(7, 1)**, which cleanly broadcasts against **(7, 24)**!`,
        visualAscii: `Weekly Steps Matrix (7 Days x 24 Hours):
        Hour 0   Hour 1   Hour 2  ...  Hour 23
Day 0: [  50,      0,       0,   ...    120   ]  ──> axis=1 sum = 10,450 steps (Day 0 total)
Day 1: [  80,      0,       0,   ...    300   ]  ──> axis=1 sum = 12,800 steps (Day 1 total)
...
Day 6: [  40,      0,       0,   ...     90   ]  ──> axis=1 sum =  9,200 steps (Day 6 total)
         │        │        │
         ▼        ▼        ▼
       axis=0 mean across all 7 days for each hour! Output shape: (24,)`,
        syntaxGuide: `# Daily totals across 24 hours (collapse cols)
daily_total = np.sum(steps_matrix, axis=1) # Shape (7,)

# Hourly average across 7 days (collapse rows)
hourly_avg = np.mean(steps_matrix, axis=0) # Shape (24,)

# Row-wise normalization with keepdims
daily_mean = np.mean(steps_matrix, axis=1, keepdims=True) # Shape (7, 1)
normalized_steps = steps_matrix - daily_mean`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.5: SMARTWATCH 7x24 STEP MATRIX AGGREGATIONS ===")

# Simulated 7 Days x 24 Hours step matrix
rng = np.random.default_rng(seed=42)
steps_matrix = rng.integers(0, 800, size=(7, 24))

print(f"Steps Matrix Shape (Days x Hours): {steps_matrix.shape}")

# 1. Total steps per day (axis=1: sum across 24 hours)
daily_totals = np.sum(steps_matrix, axis=1)
print("\\nDaily Total Steps (7 Days, axis=1):")
for day_idx, total in enumerate(daily_totals):
    print(f"Day {day_idx + 1}: {total:,} steps")

# 2. Most active hour of the day across all 7 days (axis=0: mean down rows)
hourly_averages = np.mean(steps_matrix, axis=0)
peak_hour = np.argmax(hourly_averages)
print(f"\\nPeak Activity Hour across the week (axis=0): Hour {peak_hour}:00 with avg {hourly_averages[peak_hour]:.0f} steps")

# 3. keepdims=True demonstration
row_means_keep = np.mean(steps_matrix, axis=1, keepdims=True)
print(f"\\nRow Means with keepdims=True Shape: {row_means_keep.shape} (Ready for broadcasting!)")
`,
        solutionCode: `import numpy as np

def analyze_weekly_steps(steps_matrix):
    daily_totals = np.sum(steps_matrix, axis=1)
    hourly_averages = np.mean(steps_matrix, axis=0)
    return daily_totals, hourly_averages
`,
        poll: {
          id: 'poll_m2_s5',
          question: 'In a matrix of shape (7, 24), what does `np.sum(matrix, axis=1)` compute and what is the output shape?',
          options: [
            'It sums across the 7 rows, producing shape (24,)',
            'It sums across the 24 columns for each row, producing shape (7,)',
            'It sums all 168 numbers into a single number',
            'It raises an AxisError'
          ],
          correctIndex: 1,
          explanation: '`axis=1` collapses along columns (horizontal collapse), computing the sum for each of the 7 rows. The output shape is (7,).',
          communityDistribution: [8, 88, 2, 2]
        },
        challenge: {
          id: 'chal_m2_s5',
          title: 'Challenge 2.5: Fitness Matrix Analyzer',
          prompt: 'Write a function `analyze_weekly_steps(steps_matrix)` that computes and returns a tuple `(daily_totals, hourly_averages)` where `daily_totals` is the sum along `axis=1` and `hourly_averages` is the mean along `axis=0`.',
          initialCode: `import numpy as np

def analyze_weekly_steps(steps_matrix):
    # TODO: Calculate daily_totals = np.sum(steps_matrix, axis=1)
    # TODO: Calculate hourly_averages = np.mean(steps_matrix, axis=0)
    # Return (daily_totals, hourly_averages)
    pass

# Test your function:
test_steps = np.ones((7, 24)) * 100
d_tot, h_avg = analyze_weekly_steps(test_steps)
print("Day 1 total:", d_tot[0], "| Hour 0 avg:", h_avg[0])
`,
          solutionCode: `import numpy as np

def analyze_weekly_steps(steps_matrix):
    daily_totals = np.sum(steps_matrix, axis=1)
    hourly_averages = np.mean(steps_matrix, axis=0)
    return daily_totals, hourly_averages
`,
          testCode: `
mat = np.ones((7, 24)) * 10
d_tot, h_avg = analyze_weekly_steps(mat)
assert d_tot.shape == (7,), f"Expected daily_totals shape (7,), got {d_tot.shape}"
assert h_avg.shape == (24,), f"Expected hourly_averages shape (24,), got {h_avg.shape}"
assert d_tot[0] == 240, f"Expected 240, got {d_tot[0]}"
assert h_avg[0] == 10, f"Expected 10, got {h_avg[0]}"
print("All Challenge 2.5 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s6',
        title: 'Matrix Math & The Dot Product: Converting RGB to Grayscale',
        timeTag: '01:38 - 01:45',
        storyboard: {
          analogyTitle: '🎨 Digital Media Scenario: RGB to Black-and-White Luminance',
          analogyStory: 'Human eyes do not perceive Red, Green, and Blue equally: our eyes are far more sensitive to Green light than Blue! The international standard formula for converting an RGB pixel to Grayscale luminance is a weighted dot product: Luminance = 0.299*Red + 0.587*Green + 0.114*Blue. By taking the matrix dot product (@ operator) of an (N, 3) pixel array with the (3,) weights vector, NumPy converts millions of color pixels to grayscale in one lightning-fast operation.',
          takeaway: 'Key Rule: * is element-wise multiplication. @ (or np.dot) is true matrix multiplication: (N x 3) @ (3 x 1) -> (N x 1).'
        },
        terminologies: [
          { term: 'Element-wise (*)', def: 'Multiplies corresponding elements in arrays of identical shape.' },
          { term: 'Dot Product (@)', def: 'Matrix multiplication computing row-by-column linear combinations.' },
          { term: 'Luminance Vector', def: 'Coefficients [0.299, 0.587, 0.114] representing human perceptual sensitivity to RGB.' }
        ],
        conceptMarkdown: `### Matrix Multiplication vs Element-wise
- **\`A * B\`**: Element-by-element product (requires identical shape).
- **\`A @ B\`**: Linear algebra matrix multiplication.

#### Dimensionality Match Rule:
$$(N \\times 3) \\times (3 \\times 1) \\implies (N \\times 1)$$
$N$ pixels with 3 color channels multiplied by 3 channel weights produces $N$ grayscale values!`,
        visualAscii: `RGB Pixels (3 pixels x 3 channels)       Luminance Weights (3x1)      Grayscale (3x1)
┌───────┬───────┬───────┐                      ┌───────┐                  ┌─────────────┐
│  Red  │ Green │ Blue  │                      │ 0.299 │                  │  Gray Val 1 │
├───────┼───────┼───────┤           @          ├───────┤        =         ├─────────────┤
│  200  │  100  │  50   │                      │ 0.587 │                  │  124.1      │
├───────┼───────┼───────┤                      ├───────┤                  ├─────────────┤
│  10   │  220  │  30   │                      │ 0.114 │                  │  135.5      │
└───────┴───────┴───────┘                      └───────┘                  └─────────────┘`,
        syntaxGuide: `# Grayscale conversion via @ operator
rgb_pixels = image.reshape(-1, 3) # Shape (N, 3)
luminance_weights = np.array([0.299, 0.587, 0.114]) # Shape (3,)
grayscale = rgb_pixels @ luminance_weights # Shape (N,)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.6: RGB TO GRAYSCALE VIA MATRIX DOT PRODUCT ===")

# 3 Sample RGB Pixels: [Red, Green, Blue]
rgb_pixels = np.array([
    [255.0,   0.0,   0.0],  # Pure Red
    [  0.0, 255.0,   0.0],  # Pure Green
    [120.0, 150.0, 200.0]   # Light Sky Blue
])

# Human perceptual luminance weighting coefficients
weights = np.array([0.299, 0.587, 0.114])

# Matrix Dot Product: (3, 3) @ (3,) -> (3,)
grayscale_values = rgb_pixels @ weights

print("Input RGB Pixels (Shape:", rgb_pixels.shape, "):\\n", rgb_pixels)
print("\\nLuminance Weights:", weights)
print("\\nConverted Grayscale Luminance (Shape:", grayscale_values.shape, "):")
for i, g in enumerate(grayscale_values):
    print(f"Pixel {i+1}: Grayscale = {g:.1f}")
`,
        solutionCode: `import numpy as np

def convert_rgb_to_gray(rgb_array):
    weights = np.array([0.299, 0.587, 0.114])
    return rgb_array @ weights
`,
        poll: {
          id: 'poll_m2_s6',
          question: 'If `X` has shape `(1000, 3)` and `w` has shape `(3,)`, what is the output shape of `X @ w`?',
          options: [
            '(1000, 3)',
            '(1000,)',
            '(3, 1000)',
            'Error: cannot multiply 2D matrix with 1D vector'
          ],
          correctIndex: 1,
          explanation: 'NumPy treats the 1D vector (3,) as a column vector (3, 1) during matrix multiplication and flattens the result back to 1D, producing shape (1000,).',
          communityDistribution: [4, 91, 3, 2]
        },
        challenge: {
          id: 'chal_m2_s6',
          title: 'Challenge 2.6: Matrix Dot Product Luminance Converter',
          prompt: 'Write a function `convert_rgb_to_gray(rgb_array)` that multiplies an (N, 3) RGB array by weights `[0.299, 0.587, 0.114]` using the `@` matrix operator and returns the 1D grayscale array.',
          initialCode: `import numpy as np

def convert_rgb_to_gray(rgb_array):
    # TODO: Define weights = np.array([0.299, 0.587, 0.114])
    # TODO: Return rgb_array @ weights
    pass

# Test your function:
test_rgb = np.array([[200, 100, 50], [10, 220, 30]])
print("Grayscale:", convert_rgb_to_gray(test_rgb))
`,
          solutionCode: `import numpy as np

def convert_rgb_to_gray(rgb_array):
    weights = np.array([0.299, 0.587, 0.114])
    return rgb_array @ weights
`,
          testCode: `
pure_green = np.array([[0.0, 100.0, 0.0]])
res = convert_rgb_to_gray(pure_green)
assert np.isclose(res[0], 58.7), f"Expected 58.7, got {res[0]}"
print("All Challenge 2.6 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s7',
        title: 'Fancy Integer Indexing: The Digital Audio Sampler',
        timeTag: '01:45 - 01:52',
        storyboard: {
          analogyTitle: '🎵 Audio & Music Scenario: The Electronic Drum Machine Jukebox',
          analogyStory: 'In an electronic music drum machine, a musician hits drum pads corresponding to sound sample numbers [4, 12, 88]. The sound engine does not play all 100 sounds in order; it jumps directly to those exact track indices! In NumPy, Fancy Integer Indexing lets you pass an array of integer indices [4, 12, 88] to extract specific rows or sensor timestamps instantly in any order.',
          takeaway: 'Key Difference: Basic slicing creates a VIEW. Fancy indexing with an array of integers creates an independent COPY in memory.'
        },
        terminologies: [
          { term: 'Fancy Indexing', def: 'Passing arrays or lists of integers to index multiple elements out of order.' },
          { term: 'np.take', def: 'NumPy function equivalent to fancy indexing along a specific axis.' },
          { term: 'Independent Copy', def: 'Unlike basic slicing, fancy indexing always produces an independent copy in RAM.' }
        ],
        conceptMarkdown: `### Selecting Elements Out-of-Order
When training machine learning models, we shuffle training data by generating a random list of row indices and using **Fancy Indexing**:
\`\`\`python
random_indices = np.array([14, 2, 99, 7])
mini_batch = training_data[random_indices] # Selects exactly those 4 rows!
\`\`\`

#### Important Gotcha:
- \`arr[0:5]\` (Slicing) → **VIEW**
- \`arr[[0, 1, 2, 3, 4]]\` (Fancy Indexing) → **COPY**`,
        visualAscii: `Dataset Rows:
Row 0: [ 10,  10 ]
Row 1: [ 20,  20 ]
Row 2: [ 30,  30 ]
Row 3: [ 40,  40 ]
Row 4: [ 50,  50 ]
              │
              ▼ Fancy Index with [3, 0, 4]
Re-ordered Output Matrix:
Row 3: [ 40,  40 ]
Row 0: [ 10,  10 ]
Row 4: [ 50,  50 ]`,
        syntaxGuide: `# Indexing with integer array
indices = np.array([3, 0, 2])
selected_rows = dataset[indices]

# Permuted mini-batch sampling
shuffled_idx = rng.permutation(len(dataset))
batch = dataset[shuffled_idx[:32]]`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.7: FANCY INTEGER INDEXING ===")

# Sensor telemetry data: 6 readings
sensors = np.array([12.5, 45.2, 88.9, 14.1, 99.4, 23.8])
print("Original Sensor Readings:\\n", sensors)

# 1. Select specific critical indices out-of-order: [4, 1, 0]
target_indices = np.array([4, 1, 0])
selected = sensors[target_indices]
print(f"\\nSelected Indices {target_indices}:\\n", selected)

# 2. Mini-Batch Shuffling Demonstration
dataset_2d = np.array([
    [1, 100],
    [2, 200],
    [3, 300],
    [4, 400],
    [5, 500]
])

shuffle_order = np.array([4, 0, 2])
shuffled_batch = dataset_2d[shuffle_order]
print("\\nShuffled Mini-batch [rows 4, 0, 2]:\\n", shuffled_batch)
`,
        solutionCode: `import numpy as np

def extract_batch_samples(dataset, sample_indices):
    return dataset[sample_indices]
`,
        poll: {
          id: 'poll_m2_s7',
          question: 'Does fancy integer indexing (e.g., `result = data[[0, 2, 4]]`) return a View or an independent Copy?',
          options: [
            'It always returns an independent Copy in memory',
            'It always returns a View pointing to original memory',
            'It returns a View only on even numbers',
            'It creates a read-only pointer'
          ],
          correctIndex: 0,
          explanation: 'Unlike basic slicing with colons (:), fancy indexing with an array or list of integers always allocates and returns an independent copy in memory.',
          communityDistribution: [90, 5, 3, 2]
        },
        challenge: {
          id: 'chal_m2_s7',
          title: 'Challenge 2.7: Mini-Batch Index Selector',
          prompt: 'Write a function `extract_batch_samples(dataset, sample_indices)` that uses fancy integer indexing to extract the rows specified by `sample_indices` from a 2D dataset.',
          initialCode: `import numpy as np

def extract_batch_samples(dataset, sample_indices):
    # TODO: Use fancy indexing to extract rows at sample_indices
    pass

# Test your function:
db = np.array([[10, 20], [30, 40], [50, 60], [70, 80]])
print("Batch:\\n", extract_batch_samples(db, np.array([3, 1])))
`,
          solutionCode: `import numpy as np

def extract_batch_samples(dataset, sample_indices):
    return dataset[sample_indices]
`,
          testCode: `
db = np.array([[1, 2], [3, 4], [5, 6], [7, 8]])
res = extract_batch_samples(db, [2, 0])
assert res[0, 0] == 5 and res[1, 0] == 1, "Rows must match sample indices in order"
print("All Challenge 2.7 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm2_s8',
        title: 'Feature Scaling from Scratch: Smartwatch Steps vs Hours Slept',
        timeTag: '01:52 - 02:00',
        storyboard: {
          analogyTitle: '⌚ Health Sensor Scenario: Daily Steps (10,000) vs Hours Slept (7.5)',
          analogyStory: 'Suppose an AI health score evaluates two features: Steps Taken (5,000 to 15,000) and Hours Slept (4 to 9). Because 10,000 is over a thousand times larger than 7.5, any machine learning model or distance calculation will mistakenly conclude that Steps are 1,000 times more important than Sleep! Feature scaling standardizes both measurements so both features contribute fairly to the model.',
          takeaway: 'Key Rule: Unscaled features distort machine learning models and distance metrics. Standardize using Z-Score: (X - mean) / std along axis=0.'
        },
        terminologies: [
          { term: 'Min-Max Normalization', def: 'Rescales features strictly into the range [0, 1]: (X - X_min) / (X_max - X_min).' },
          { term: 'Z-Score Standardization', def: 'Centers data around mean=0 with standard deviation=1: (X - mu) / sigma.' },
          { term: 'Column-wise Scaling', def: 'Computing statistics independently for each feature column along axis=0.' }
        ],
        conceptMarkdown: `### The Two Core Feature Scaling Formulas
#### Formula 1: Min-Max Normalization (Bounded in $[0, 1]$)
$$X_{norm} = \\frac{X - X_{min}}{X_{max} - X_{min}}$$

#### Formula 2: Z-Score Standardization (Mean = 0, Std = 1)
$$X_{std} = \\frac{X - \\mu}{\\sigma}$$

Both are coded cleanly in **pure NumPy using broadcasting along \`axis=0\`**!`,
        visualAscii: `Unscaled Health Features:
Steps:  [ 5,000 ────────────────────────────────────────── 15,000 ]  <-- Overpowers sleep completely!
Sleep:  [ 4 ─────── 9 ]

After Z-Score Standardization (axis=0):
Steps:  [ -1.5 ────────────── 0 ────────────── +1.5 ]  <-- Both features are balanced on
Sleep:  [ -1.5 ────────────── 0 ────────────── +1.5 ]      a fair, common scale!`,
        syntaxGuide: `# Min-Max Normalization (axis=0 across rows)
x_min = np.min(X, axis=0)
x_max = np.max(X, axis=0)
X_norm = (X - x_min) / (x_max - x_min)

# Z-Score Standardization
mu = np.mean(X, axis=0)
sigma = np.std(X, axis=0)
X_std = (X - mu) / sigma`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 2.8: FEATURE SCALING FROM SCRATCH ===")

# Simulated health feature matrix: [Steps Taken, Hours Slept]
health_data = np.array([
    [ 4_000.0, 5.0],
    [ 8_000.0, 7.5],
    [12_000.0, 8.0],
    [16_000.0, 6.5]
])

print("Raw Unscaled Health Data [Steps, Sleep]:\\n", health_data)

# 1. Min-Max Normalization [0, 1]
f_min = np.min(health_data, axis=0)
f_max = np.max(health_data, axis=0)
norm_data = (health_data - f_min) / (f_max - f_min)

print("\\nMin-Max Scaled [0, 1]:\\n", np.round(norm_data, 3))

# 2. Z-Score Standardization (Mean=0, Std=1)
mu = np.mean(health_data, axis=0)
sigma = np.std(health_data, axis=0)
std_data = (health_data - mu) / sigma

print("\\nZ-Score Standardized (Mean=0, Std=1):\\n", np.round(std_data, 3))
print("Verified Means:", np.round(np.mean(std_data, axis=0), 2))
print("Verified Stds :", np.round(np.std(std_data, axis=0), 2))
`,
        solutionCode: `import numpy as np

def standard_scale_features(X):
    mu = np.mean(X, axis=0)
    sigma = np.std(X, axis=0)
    return (X - mu) / sigma
`,
        poll: {
          id: 'poll_m2_s8',
          question: 'When computing `np.std(X, axis=0)` on a matrix of shape `(500, 2)`, what does `axis=0` mean?',
          options: [
            'It calculates the standard deviation down each column, producing 2 values (one per feature)',
            'It calculates the standard deviation across each row, producing 500 values',
            'It calculates one single scalar standard deviation for all 1000 numbers',
            'It raises an error'
          ],
          correctIndex: 0,
          explanation: '`axis=0` collapses the rows (vertical collapse), computing summary statistics independently for each of the 2 feature columns.',
          communityDistribution: [89, 6, 3, 2]
        },
        challenge: {
          id: 'chal_m2_s8',
          title: 'Challenge 2.8: Feature Standardizer from Scratch',
          prompt: 'Write a function `standard_scale_features(X)` in pure NumPy that standardizes 2D feature matrix `X` to have mean=0 and std=1 along `axis=0` using formula `(X - mean) / std`.',
          initialCode: `import numpy as np

def standard_scale_features(X):
    # TODO: Calculate column means along axis=0
    # TODO: Calculate column std along axis=0
    # TODO: Return (X - mean) / std using broadcasting
    pass

# Test your function:
test_mat = np.array([[10.0, 100.0], [20.0, 200.0], [30.0, 300.0]])
print("Standardized:\\n", standard_scale_features(test_mat))
`,
          solutionCode: `import numpy as np

def standard_scale_features(X):
    mu = np.mean(X, axis=0)
    sigma = np.std(X, axis=0)
    return (X - mu) / sigma
`,
          testCode: `
data = np.array([[10.0, 50.0], [20.0, 100.0], [30.0, 150.0]])
res = standard_scale_features(data)
assert np.allclose(np.mean(res, axis=0), [0.0, 0.0]), "Mean must equal 0.0"
assert np.allclose(np.std(res, axis=0), [1.0, 1.0]), "Std must equal 1.0"
print("All Challenge 2.8 tests passed successfully! 🎉")
`
        }
      }
    ]
  },
  {
    id: 'module_3',
    moduleNumber: 3,
    title: 'Machine Learning Basics (Uber, Spotify & Netflix)',
    duration: '60 mins (Track 3)',
    summary: 'Master practical machine learning fundamentals: data ingestion with Pandas, missing value imputation, reproducible train-test splitting, the Uber trip fare model (Linear Regression with Gradient Descent), the Spotify skip track model (Logistic Regression & Sigmoid), and Netflix churn evaluation metrics.',
    slides: [
      {
        id: 'm3_s1',
        conceptImage: '/assets/diagrams/ml_paradigm.jpg',
        imageCaption: 'Pictorial Architecture: Traditional Software (Manual Rules) vs Machine Learning (Learned Pricing Model from Data)',
        title: 'The Machine Learning Paradigm: Uber Dynamic Pricing vs Hardcoded Rules',
        timeTag: '02:00 - 02:07',
        storyboard: {
          analogyTitle: '🚗 Big Tech Scenario: Uber Ride Pricing',
          analogyStory: 'In traditional programming, an engineer manually writes hardcoded rules: "if rain == True and distance > 5: fare = 25". But what happens when there is rain, traffic, a sports stadium event, and surge demand all at once? Writing 10,000 nested if-else rules is impossible to maintain. In Machine Learning, Uber feeds millions of past completed trips (data and actual fares) into an algorithm, and the algorithm automatically learns the mathematical weight coefficients for traffic, distance, and weather.',
          takeaway: 'Key Difference: Traditional Programming = Rules + Data -> Answers. Machine Learning = Data + Answers -> Learned Rules (Weights).'
        },
        terminologies: [
          { term: 'Supervised Learning', def: 'Training a model on labeled historical data with inputs (X) and ground truth targets (y).' },
          { term: 'Regression vs Classification', def: 'Regression predicts continuous numbers (e.g. Uber fare $); Classification predicts discrete categories (e.g. Churn vs Stay).' },
          { term: 'Feature Matrix (X)', def: '2D matrix of shape (N samples, D features) containing input measurements.' }
        ],
        conceptMarkdown: `### The Paradigm Shift in Software Engineering
$$\\text{Traditional Software: } \\text{Inputs } X + \\text{Hardcoded Rules } \\longrightarrow \\text{Outputs } y$$
$$\\text{Machine Learning: } \\text{Inputs } X + \\text{Historical Outputs } y \\longrightarrow \\text{Learned Parameters } (w, b)$$

#### Problem Formulation for Uber Pricing:
- **Features ($X$)**: \`[DistanceMiles, TripDurationMinutes, SurgeMultiplier]\`
- **Target ($y$)**: \`TripFareInDollars\` (Continuous number → **Regression Task**)`,
        visualAscii: `Traditional Rule-Based Programming:
[Data: 5 Miles, 15 Mins] + [Human Writes 500 If-Else Rules] ──> [Predicted Fare]

Machine Learning Paradigm:
[Data: 5 Miles, 15 Mins] + [Actual Historical Fares] ──> [Algorithm Learns Optimal Weights w and b!]`,
        syntaxGuide: `# Features (X) and Target (y)
X = trips[['distance_miles', 'duration_mins']].to_numpy()
y = trips['fare_amount'].to_numpy()`,
        starterCode: `import numpy as np
import pandas as pd

print("=== LIVE DEMO 3.1: PROBLEM FORMULATION ===")

# Sample Uber trip records
trip_data = {
    'TripID': [101, 102, 103, 104],
    'DistanceMiles': [2.5, 5.0, 1.2, 10.4],
    'DurationMins': [10.0, 22.0, 6.0, 35.0],
    'RainMultiplier': [1.0, 1.2, 1.0, 1.5],
    'TripFare': [12.50, 24.00, 8.50, 48.00]
}
df = pd.DataFrame(trip_data)
print("Uber Trip Database (Pandas DataFrame):\\n", df)

# Extract Feature Matrix X and Target Vector y
X = df[['DistanceMiles', 'DurationMins', 'RainMultiplier']].to_numpy()
y = df['TripFare'].to_numpy()

print(f"\\nFeature Matrix X Shape : {X.shape} (4 trips x 3 features)")
print(f"Target Vector y Shape  : {y.shape} (4 continuous dollar fares)")
`,
        solutionCode: `import numpy as np

def formulate_ml_data(df, feature_cols, target_col):
    X = df[feature_cols].to_numpy()
    y = df[target_col].to_numpy()
    return X, y
`,
        poll: {
          id: 'poll_m3_s1',
          question: 'Which of the following problems is a Regression task rather than a Classification task?',
          options: [
            'Predicting whether an email is Spam or Not Spam',
            'Predicting the dollar fare of an Uber ride based on distance and traffic',
            'Predicting whether a credit card transaction is Fraudulent or Genuine',
            'Predicting whether a patient has Diabetes (Yes or No)'
          ],
          correctIndex: 1,
          explanation: 'Regression predicts a continuous numerical quantity (dollar amount, temperature, price). The other options predict discrete binary categories (Classification).',
          communityDistribution: [2, 93, 3, 2]
        },
        challenge: {
          id: 'chal_m3_s1',
          title: 'Challenge 3.1: Supervised Feature-Target Formulator',
          prompt: 'Write a function `formulate_ml_data(df, feature_cols, target_col)` that takes a Pandas DataFrame, extracts the list of `feature_cols` as a 2D NumPy array `X`, and extracts `target_col` as a 1D NumPy array `y`.',
          initialCode: `import numpy as np
import pandas as pd

def formulate_ml_data(df, feature_cols, target_col):
    # TODO: Convert df[feature_cols] to NumPy array X
    # TODO: Convert df[target_col] to NumPy array y
    # Return (X, y)
    pass

# Test your function:
test_df = pd.DataFrame({'dist': [1, 2], 'time': [5, 10], 'fare': [8, 15]})
X_out, y_out = formulate_ml_data(test_df, ['dist', 'time'], 'fare')
print("X shape:", X_out.shape, "y shape:", y_out.shape)
`,
          solutionCode: `import numpy as np

def formulate_ml_data(df, feature_cols, target_col):
    X = df[feature_cols].to_numpy()
    y = df[target_col].to_numpy()
    return X, y
`,
          testCode: `
import pandas as pd
df = pd.DataFrame({'a': [1, 2], 'b': [3, 4], 'target': [10, 20]})
X, y = formulate_ml_data(df, ['a', 'b'], 'target')
assert X.shape == (2, 2), f"Expected X shape (2, 2), got {X.shape}"
assert y.shape == (2,), f"Expected y shape (2,), got {y.shape}"
assert isinstance(X, np.ndarray) and isinstance(y, np.ndarray), "Outputs must be NumPy arrays"
print("All Challenge 3.1 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s2',
        title: 'Pandas to NumPy Bridge: Loading Netflix Viewing Telemetry',
        timeTag: '02:07 - 02:15',
        storyboard: {
          analogyTitle: '🚚 Big Tech Scenario: The Delivery Truck to Assembly Line',
          analogyStory: 'Pandas is like a delivery truck: it is built for ingesting and organizing tabular CSV files with labeled column names, date timestamps, and metadata. But Machine Learning algorithms are like high-speed robotic assembly lines: they do not care about human column labels; they require pure numerical matrices (NumPy tensors). We use Pandas to inspect the raw data and then convert it (.to_numpy()) for model training.',
          takeaway: 'Key Practice: Use Pandas for reading CSVs and data exploration. Convert to pure NumPy arrays (.to_numpy()) for high-performance mathematical modeling.'
        },
        terminologies: [
          { term: 'pd.read_csv', def: 'Pandas function to parse tabular CSV files into a structured DataFrame.' },
          { term: '.to_numpy()', def: 'Fastest, zero-copy method to extract underlying NumPy array from a Pandas DataFrame.' },
          { term: '.describe()', def: 'Provides summary statistics (mean, std, min, max, quartiles) for all numerical columns.' }
        ],
        conceptMarkdown: `### The Data Science Handoff: Pandas → NumPy
1. **Pandas**: Excellent for file I/O (\`read_csv\`), column filtering, handling string headers, and running exploratory statistical summaries (\`.describe()\`).
2. **NumPy**: The numerical engine where linear algebra, matrix multiplications (\`@\`), loss calculations, and neural network weights execute.`,
        visualAscii: `[Pandas DataFrame] (Human-friendly, labeled columns, string metadata)
Index   UserID   WatchHours   DeviceCode   SubscriptionCost
0       u_101    15.5         1            14.99
1       u_102    42.0         2            19.99
                 │
                 ▼ .to_numpy(dtype=np.float64)
[NumPy Tensor Matrix] (Pure raw numbers in RAM, ready for mathematical dot products!)
[[ 15.5,  1.0,  14.99 ],
 [ 42.0,  2.0,  19.99 ]]`,
        syntaxGuide: `# Ingest tabular CSV with Pandas
df = pd.read_csv('netflix_data.csv')

# Inspect summary statistics
stats = df.describe()

# Bridge to NumPy array
feature_matrix = df[['WatchHours', 'SubscriptionCost']].to_numpy()`,
        starterCode: `import numpy as np
import pandas as pd

print("=== LIVE DEMO 3.2: PANDAS TO NUMPY DATA BRIDGE ===")

# Create sample Netflix telemetry
raw_csv = """UserID,WatchHours,DaysActive,DeviceType,MonthlyFee
101,24.5,18,1,15.99
102,4.0,2,2,9.99
103,48.2,30,1,19.99
104,12.0,10,3,15.99
"""
import io
df = pd.read_csv(io.StringIO(raw_csv))
print("Pandas DataFrame View:\\n", df)

# 1. Quick Data Exploration
print("\\n--- Column Data Types ---")
print(df.dtypes)

# 2. Extracting feature columns to NumPy
features_np = df[['WatchHours', 'DaysActive', 'MonthlyFee']].to_numpy(dtype=np.float64)
print(f"\\nExtracted NumPy Matrix (Shape {features_np.shape}, Dtype {features_np.dtype}):\\n", features_np)
`,
        solutionCode: `import numpy as np

def extract_numpy_matrix(df, columns):
    return df[columns].to_numpy(dtype=np.float64)
`,
        poll: {
          id: 'poll_m3_s2',
          question: 'Why do Machine Learning libraries compute on NumPy arrays rather than Pandas DataFrames during model training?',
          options: [
            'Pandas DataFrames have overhead from managing column names, indices, and series wrappers, while NumPy provides raw contiguous C-arrays for fast matrix algebra',
            'Pandas cannot store numbers with decimal places',
            'NumPy arrays are stored in the cloud while Pandas is local',
            'There is no performance difference'
          ],
          correctIndex: 0,
          explanation: 'NumPy arrays store raw contiguous blocks of memory with uniform data types, allowing CPU SIMD instructions and GPU acceleration without Pandas indexing overhead.',
          communityDistribution: [93, 2, 1, 4]
        },
        challenge: {
          id: 'chal_m3_s2',
          title: 'Challenge 3.2: DataFrame to NumPy Bridge',
          prompt: 'Write a function `extract_numpy_matrix(df, columns)` that extracts the specified `columns` from a Pandas DataFrame as a float64 NumPy array.',
          initialCode: `import numpy as np
import pandas as pd

def extract_numpy_matrix(df, columns):
    # TODO: Extract df[columns] as float64 NumPy array
    pass

# Test your function:
test_df = pd.DataFrame({'x': [1, 2], 'y': [3, 4], 'name': ['a', 'b']})
print("Result:\\n", extract_numpy_matrix(test_df, ['x', 'y']))
`,
          solutionCode: `import numpy as np

def extract_numpy_matrix(df, columns):
    return df[columns].to_numpy(dtype=np.float64)
`,
          testCode: `
import pandas as pd
df = pd.DataFrame({'col1': [10, 20], 'col2': [30, 40]})
arr = extract_numpy_matrix(df, ['col1', 'col2'])
assert isinstance(arr, np.ndarray), "Output must be a numpy ndarray"
assert arr.shape == (2, 2), f"Expected shape (2, 2), got {arr.shape}"
assert arr.dtype == np.float64, "Dtype must be float64"
print("All Challenge 3.2 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s3',
        title: 'Dirty Data & Missing Values: Dropped GPS Signals in Ride Tracking',
        timeTag: '02:15 - 02:22',
        storyboard: {
          analogyTitle: '📍 Big Tech Scenario: Intermittent GPS Signals in Uber Trips',
          analogyStory: 'During an Uber ride, the driver drives into a tunnel or between tall skyscrapers, causing the smartphone to temporarily lose GPS reception for 20 seconds. The dataset now has missing values (NaN) for speed and coordinates. If you drop the entire row, you throw away a real completed trip! Instead, data engineers detect missing values using np.isnan() and impute them with the column mean or median using np.nanmean().',
          takeaway: 'Key Rule: NaNs poison mathematical operations (10 + NaN = NaN). Detect them with np.isnan() and impute them using np.nanmean().'
        },
        terminologies: [
          { term: 'NaN (Not a Number)', def: 'Special IEEE 754 floating-point marker representing missing or corrupted data.' },
          { term: 'np.isnan()', def: 'Vectorized function returning a boolean mask of True where values are NaN.' },
          { term: 'np.nanmean()', def: 'Computes the statistical mean of an array while ignoring all NaN entries.' }
        ],
        conceptMarkdown: `### Detecting & Imputing Missing Data in Pure NumPy
If an array contains even a single \`NaN\`, standard math functions return \`NaN\`:
\`\`\`python
np.mean([10, 20, np.nan]) # Returns NaN!
\`\`\`

#### Pure NumPy Imputation Pipeline:
\`\`\`python
nan_mask = np.isnan(feature_col)      # Find missing values
safe_mean = np.nanmean(feature_col)   # Calculate mean of available numbers
feature_col[nan_mask] = safe_mean     # Impute in-place!
\`\`\``,
        visualAscii: `Raw GPS Speed Data (contains missing NaN from tunnel):
[ 45.0,   52.0,   NaN,   48.0,   NaN,   55.0 ]
                    │
                    ▼ np.isnan() mask: [F, F, T, F, T, F]
Compute mean of valid numbers: (45 + 52 + 48 + 55) / 4 = 50.0 km/h
                    │
                    ▼ Impute in-place:
[ 45.0,   52.0,  50.0,   48.0,  50.0,   55.0 ] (Clean, unbroken dataset!)`,
        syntaxGuide: `# Find NaNs
missing_count = np.sum(np.isnan(X))

# Impute column j with mean
col = X[:, j]
col[np.isnan(col)] = np.nanmean(col)`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 3.3: DETECTING & IMPUTING NANS IN PURE NUMPY ===")

# Simulated GPS trip speed readings with missing values
gps_speeds = np.array([45.0, 52.0, np.nan, 48.0, np.nan, 55.0])
print("Raw GPS Speeds (with NaNs):\\n", gps_speeds)

# 1. Detect missing values
nan_mask = np.isnan(gps_speeds)
print(f"\\nDetected {np.sum(nan_mask)} missing NaN values at indices: {np.where(nan_mask)[0]}")

# 2. Compute safe mean ignoring NaNs
safe_avg_speed = np.nanmean(gps_speeds)
print(f"Safe Average Speed (excluding NaNs): {safe_avg_speed:.1f} km/h")

# 3. In-place Imputation
clean_speeds = gps_speeds.copy()
clean_speeds[nan_mask] = safe_avg_speed
print("\\nClean Imputed Speeds (Zero NaNs):\\n", clean_speeds)
`,
        solutionCode: `import numpy as np

def impute_missing_with_mean(arr):
    clean = arr.copy()
    nan_mask = np.isnan(clean)
    if np.any(nan_mask):
        mean_val = np.nanmean(clean)
        clean[nan_mask] = mean_val
    return clean
`,
        poll: {
          id: 'poll_m3_s3',
          question: 'What is the danger of running `np.mean(data)` if `data` contains even a single `NaN` value?',
          options: [
            'It automatically drops the NaN and computes the correct mean',
            'It returns `NaN` as the result because any arithmetic operation with NaN evaluates to NaN',
            'It replaces the NaN with zero',
            'It raises an uncaught syntax error'
          ],
          correctIndex: 1,
          explanation: 'In floating-point math, any arithmetic operation involving NaN results in NaN. You must use `np.nanmean(data)` to compute statistics while ignoring missing entries.',
          communityDistribution: [5, 91, 2, 2]
        },
        challenge: {
          id: 'chal_m3_s3',
          title: 'Challenge 3.3: Pure NumPy Missing Value Imputer',
          prompt: 'Write a function `impute_missing_with_mean(arr)` that takes a 1D NumPy array with possible NaNs, replaces all NaNs with the mean of the available values (`np.nanmean`), and returns the clean array.',
          initialCode: `import numpy as np

def impute_missing_with_mean(arr):
    # TODO: Copy arr to avoid mutating original
    # TODO: Find NaNs using np.isnan
    # TODO: Replace NaNs with np.nanmean(arr)
    # Return clean array
    pass

# Test your function:
test_arr = np.array([10.0, np.nan, 30.0])
print("Imputed:", impute_missing_with_mean(test_arr))
`,
          solutionCode: `import numpy as np

def impute_missing_with_mean(arr):
    clean = arr.copy()
    nan_mask = np.isnan(clean)
    if np.any(nan_mask):
        clean[nan_mask] = np.nanmean(clean)
    return clean
`,
          testCode: `
arr = np.array([20.0, np.nan, 40.0, np.nan])
res = impute_missing_with_mean(arr)
assert not np.any(np.isnan(res)), "Array must contain zero NaNs"
assert np.isclose(res[1], 30.0) and np.isclose(res[3], 30.0), "NaNs must be replaced with mean (30.0)"
print("All Challenge 3.3 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s4',
        title: 'Train-Test Partitioning from Scratch: Testing Spotify on Unseen Songs',
        timeTag: '02:22 - 02:30',
        storyboard: {
          analogyTitle: '🎵 Big Tech Scenario: Testing Spotify Recommendations on Unseen Music',
          analogyStory: 'If Spotify tests its recommendation algorithm on songs you already listened to yesterday, of course the model will look 100% accurate! But that is cheating (Data Leakage). To see if Spotify can truly predict your music taste in the future, engineers lock away an unseen Holdout Test Set (20% of data) that the model is never allowed to see during training.',
          takeaway: 'Key Rule: Always split data into Training (80%) and Testing (20%) sets before fitting models. Never evaluate a model on data it trained on.'
        },
        terminologies: [
          { term: 'Train/Test Split', def: 'Partitioning data (80% train, 20% test) to validate generalizability on unseen data.' },
          { term: 'Overfitting', def: 'When a model memorizes the training data perfectly but fails on new unseen data.' },
          { term: 'Data Leakage', def: 'Accidentally using information from the test partition during scaling or preprocessing.' }
        ],
        conceptMarkdown: `### The Machine Learning Cardinal Rule: Never Train on Test Data
If a model memorizes training samples ($X_{train}$), training accuracy will be high, but real-world performance will fail.

#### Writing Train-Test Split from Scratch with Pure NumPy:
\`\`\`python
# 1. Shuffle indices reproducibly
rng = np.random.default_rng(seed=42)
shuffled_idx = rng.permutation(len(X))

# 2. Calculate 80% split point
split_point = int(0.8 * len(X))
train_idx = shuffled_idx[:split_point]
test_idx = shuffled_idx[split_point:]

# 3. Partition features and labels
X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]
\`\`\``,
        visualAscii: `Full Dataset (100% of User Listening Sessions):
┌──────────────────────────────────────────────┬───────────────────┐
│              Training Set (80%)              │   Test Set (20%)  │
│        (Model learns weights w and b)        │ (Locked in vault!)│
└──────────────────────────────────────────────┴───────────────────┘
                       │                                     │
                       ▼                                     ▼
                Model Optimizes                     Test True Accuracy!`,
        syntaxGuide: `# Pure NumPy Split
indices = rng.permutation(len(X))
split = int(0.8 * len(X))
X_train, X_test = X[indices[:split]], X[indices[split:]]

# Scikit-learn alternative
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)`,
        starterCode: `import numpy as np
from sklearn.model_selection import train_test_split

print("=== LIVE DEMO 3.4: TRAIN-TEST SPLITTING (NUMPY + SCIKIT-LEARN) ===")

# Simulated dataset of 10 users: [SongTempo, EnergyRating] -> Skipped (1/0)
X = np.array([
    [120, 0.8], [95, 0.4], [130, 0.9], [80, 0.3], [140, 0.7],
    [110, 0.5], [125, 0.6], [90, 0.2], [135, 0.85], [105, 0.45]
])
y = np.array([0, 1, 0, 1, 0, 1, 0, 1, 0, 1])

# 1. Production Standard: Scikit-Learn train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Total Samples : {len(X)}")
print(f"Scikit-Learn Training Set : X={X_train.shape}, y={y_train.shape} (80%)")
print(f"Scikit-Learn Testing Set  : X={X_test.shape}, y={y_test.shape} (20% Holdout)")

# 2. Pure NumPy Mechanics Under the Hood (Shuffling & Slicing)
rng = np.random.default_rng(42)
shuffled_idx = rng.permutation(len(X))
split_point = int(0.8 * len(X))
X_np_train, X_np_test = X[shuffled_idx[:split_point]], X[shuffled_idx[split_point:]]
print(f"NumPy Under-The-Hood Split: X_train={X_np_train.shape}, X_test={X_np_test.shape}")
`,
        solutionCode: `import numpy as np

def train_test_split_np(X, y, test_size=0.25, seed=100):
    rng = np.random.default_rng(seed)
    n = len(X)
    shuffled = rng.permutation(n)
    test_n = int(n * test_size)
    te_idx, tr_idx = shuffled[:test_n], shuffled[test_n:]
    return X[tr_idx], X[te_idx], y[tr_idx], y[te_idx]
`,
        poll: {
          id: 'poll_m3_s4',
          question: 'What is "Data Leakage" in a machine learning workflow?',
          options: [
            'When data is accidentally deleted from a database',
            'When information from the unseen test partition is inadvertently used during data preprocessing or scaling',
            'When a model trains too slowly',
            'When numbers leak into text columns'
          ],
          correctIndex: 1,
          explanation: 'Data leakage happens when statistics or patterns from the test set leak into the training process (e.g., scaling features on the full dataset before splitting).',
          communityDistribution: [2, 94, 2, 2]
        },
        challenge: {
          id: 'chal_m3_s4',
          title: 'Challenge 3.4: Pure NumPy Train-Test Splitter',
          prompt: 'Write a function `train_test_split_np(X, y, test_size=0.25, seed=100)` that returns `(X_train, X_test, y_train, y_test)` using `np.random.default_rng(seed)`.',
          initialCode: `import numpy as np

def train_test_split_np(X, y, test_size=0.25, seed=100):
    # TODO: Shuffle indices with rng.permutation
    # TODO: Split into train and test partitions
    # Return (X_train, X_test, y_train, y_test)
    pass

# Test your function:
X_d = np.arange(20).reshape(10, 2)
y_d = np.arange(10)
X_tr, X_te, y_tr, y_te = train_test_split_np(X_d, y_d, test_size=0.3)
print("Train shape:", X_tr.shape, "Test shape:", X_te.shape)
`,
          solutionCode: `import numpy as np

def train_test_split_np(X, y, test_size=0.25, seed=100):
    rng = np.random.default_rng(seed)
    n = len(X)
    shuffled = rng.permutation(n)
    test_n = int(n * test_size)
    te_idx, tr_idx = shuffled[:test_n], shuffled[test_n:]
    return X[tr_idx], X[te_idx], y[tr_idx], y[te_idx]
`,
          testCode: `
X_d = np.arange(40).reshape(20, 2)
y_d = np.arange(20)
X_tr, X_te, y_tr, y_te = train_test_split_np(X_d, y_d, test_size=0.25, seed=42)
assert len(X_te) == 5, f"Expected 5 test samples, got {len(X_te)}"
assert len(X_tr) == 15, f"Expected 15 train samples, got {len(X_tr)}"
print("All Challenge 3.4 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s5',
        conceptImage: '/assets/diagrams/linear_regression.jpg',
        imageCaption: 'Pictorial Representation: Linear Regression Best-Fit Pricing Line (y = w*X + b) for Uber Dynamic Pricing',
        title: 'Linear Regression Formulation: The Uber Trip Fare Formula',
        timeTag: '02:30 - 02:38',
        storyboard: {
          analogyTitle: '🚗 Big Tech Scenario: Understanding Uber Fare Components',
          analogyStory: 'When you take an Uber, your receipt breaks down your fare: a Base Pickup Fee ($3.50), plus $1.80 per mile traveled, plus $0.35 per minute in traffic. This is the exact linear regression equation: Fare = w1*Distance + w2*Duration + Base. In machine learning, the feature weights (w1, w2) represent the dollar rate per unit of each feature, and the bias (b) is the baseline starting price.',
          takeaway: 'Key Equation: y_hat = X @ w + b computes predictions as a linear combination of features and weights.'
        },
        terminologies: [
          { term: 'Linear Hypothesis', def: 'Predicting target as y = Xw + b (linear combination of inputs).' },
          { term: 'Weights (w)', def: 'Slope parameters representing the rate of change per unit of each feature.' },
          { term: 'Bias (b)', def: 'Intercept parameter representing the baseline target value when all features are 0.' }
        ],
        conceptMarkdown: `### The Linear Regression Equation: $\\hat{y} = Xw + b$
For an individual trip:
$$\\hat{y} = (w_1 \\times \\text{Distance}) + (w_2 \\times \\text{Duration}) + b$$

For a batch of $N$ trips represented as matrix $X$ of shape $(N, 2)$:
$$\ŷ = X @ w + b$$`,
        visualAscii: `Uber Trip Features (X):
Trip 1: [ 5.0 Miles,  15.0 Mins ]
Trip 2: [ 2.0 Miles,   6.0 Mins ]
              @
Learned Weights (w):
[ $1.80 per Mile,  $0.35 per Minute ]
              +
Base Pickup Fee (b):
$3.50
              =
Predicted Fares:
Trip 1: 5.0*1.80 + 15.0*0.35 + 3.50 = $17.75
Trip 2: 2.0*1.80 +  6.0*0.35 + 3.50 =  $9.20`,
        syntaxGuide: `# Linear hypothesis in pure NumPy
predictions = X @ weights + bias

# Using Scikit-learn
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
        starterCode: `import numpy as np
from sklearn.linear_model import LinearRegression

print("=== LIVE DEMO 3.5: UBER FARE PREDICTOR (NUMPY + SCIKIT-LEARN) ===")

# Historical Uber Training Trips: [DistanceMiles, DurationMins] -> Actual Dollar Fares
X_train = np.array([
    [2.0,  6.0],
    [5.0, 15.0],
    [8.0, 22.0],
    [10.0, 28.0],
    [15.0, 40.0]
])
y_train = np.array([9.20, 17.75, 25.60, 31.30, 44.50])

# 1. Scikit-Learn Production Standard
model = LinearRegression()
model.fit(X_train, y_train)

print("Scikit-Learn Learned Weights (w) :", np.round(model.coef_, 2), "($/mile, $/min)")
print(f"Scikit-Learn Learned Intercept(b): \${model.intercept_:.2f} (Base Fare)")

# 2. Predict on New Unseen Trips
X_new = np.array([
    [3.5, 10.0],
    [12.0, 32.0]
])

sklearn_preds = model.predict(X_new)
numpy_preds = X_new @ model.coef_ + model.intercept_

print("\\nTrip Predictions Comparison:")
for i in range(len(X_new)):
    dist, dur = X_new[i]
    print(f"Trip ({dist} mi, {dur} mins) -> Scikit-Learn: \${sklearn_preds[i]:.2f} | NumPy Math: \${numpy_preds[i]:.2f}")
`,
        solutionCode: `import numpy as np

def predict_trip_fare(X, w, b):
    return X @ w + b
`,
        poll: {
          id: 'poll_m3_s5',
          question: 'In the Uber fare formula `Fare = w1 * Distance + w2 * Duration + b`, what does the bias term `b` represent?',
          options: [
            'The total distance of the trip',
            'The baseline starting fare when distance and duration are both zero (base pickup fee)',
            'The average speed of the car',
            'The driver tip percentage'
          ],
          correctIndex: 1,
          explanation: 'The bias term `b` is the intercept: the baseline value of the prediction when all input features are zero.',
          communityDistribution: [3, 93, 2, 2]
        },
        challenge: {
          id: 'chal_m3_s5',
          title: 'Challenge 3.5: Linear Hypothesis Fare Calculator',
          prompt: 'Write a function `predict_trip_fare(X, w, b)` that calculates the linear predictions $\ŷ = X @ w + b$ using matrix multiplication `@`.',
          initialCode: `import numpy as np

def predict_trip_fare(X, w, b):
    # TODO: Implement y_hat = X @ w + b
    pass

# Test your function:
X_test = np.array([[3.0, 10.0]])
print("Fare:", predict_trip_fare(X_test, np.array([2.0, 0.5]), 4.0))
`,
          solutionCode: `import numpy as np

def predict_trip_fare(X, w, b):
    return X @ w + b
`,
          testCode: `
X_in = np.array([[2.0, 10.0], [5.0, 20.0]])
w_in = np.array([2.0, 0.5])
b_in = 3.0
res = predict_trip_fare(X_in, w_in, b_in)
assert np.isclose(res[0], 12.0), f"Expected 12.0, got {res[0]}"
assert np.isclose(res[1], 23.0), f"Expected 23.0, got {res[1]}"
print("All Challenge 3.5 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s6',
        title: 'Loss Minimization & Gradient Descent: Tuning Model Dials',
        timeTag: '02:38 - 02:45',
        storyboard: {
          analogyTitle: '📻 Engineering Scenario: Tuning a Radio Dial to Eliminate Static',
          analogyStory: 'When tuning an old-school radio knob to find a station, you listen to the static noise (error/loss). If turning the knob to the right increases static, you immediately turn it back to the left! In Machine Learning, Gradient Descent measures the prediction error (Mean Squared Error), calculates the slope (gradient), and automatically turns the model’s weight dials in the direction that reduces error until static is minimized.',
          takeaway: 'Key Concept: Gradients indicate the direction of increasing error. We update weights in the negative gradient direction: w = w - learning_rate * gradient.'
        },
        terminologies: [
          { term: 'Mean Squared Error (MSE)', def: 'Average squared difference between predicted fares and actual fares.' },
          { term: 'Gradient', def: 'Vector of partial derivatives showing the direction of steepest increase in loss.' },
          { term: 'Learning Rate (alpha)', def: 'Step size taken at each iteration towards the minimum loss.' }
        ],
        conceptMarkdown: `### Minimizing Loss with Gradient Descent
#### Mean Squared Error (MSE Loss):
$$J(w, b) = \\frac{1}{N} \\sum_{i=1}^N (\\hat{y}_i - y_i)^2$$

#### The Weight Updates:
$$\\frac{\\partial J}{\\partial w} = \\frac{2}{N} X^T (\\hat{y} - y), \\quad \\frac{\\partial J}{\\partial b} = \\frac{2}{N} \\sum (\\hat{y} - y)$$
$$w \\leftarrow w - \\alpha \\frac{\\partial J}{\\partial w}, \\quad b \\leftarrow b - \\alpha \\frac{\\partial J}{\\partial b}$$`,
        visualAscii: `Loss Curve J(w):
  Cost J (Error)
    │        *  <-- Initial weights (High error)
    │         \\
    │          \\  Negative Gradient points downhill!
    │           *
    │            \\
    │             * <-- Minimum Loss (Optimal Uber weights found!)
    └─────────────────────── Weight w`,
        syntaxGuide: `# MSE Loss in pure NumPy
error = y_pred - y_true
mse = np.mean(error ** 2)

# Gradient calculation
dw = (2 / N) * (X.T @ error)
db = (2 / N) * np.sum(error)

# Step update
w -= learning_rate * dw
b -= learning_rate * db`,
        starterCode: `import numpy as np

print("=== LIVE DEMO 3.6: BATCH GRADIENT DESCENT LOOP ===")

# Synthetic data: Distance (miles) -> Fare ($)
X = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
y = np.array([5.5, 8.0, 10.5, 13.0, 15.5]) # True: Fare = 2.5 * dist + 3.0

# Initialize parameters
w = 0.0
b = 0.0
lr = 0.05
epochs = 150
N = len(X)

for epoch in range(1, epochs + 1):
    y_pred = (X * w + b).flatten()
    loss = np.mean((y_pred - y) ** 2)
    
    dw = (2 / N) * np.sum((y_pred - y) * X.flatten())
    db = (2 / N) * np.sum(y_pred - y)
    
    w -= lr * dw
    b -= lr * db
    
    if epoch % 50 == 0:
        print(f"Epoch {epoch:3d} | Loss (MSE): {loss:.4f} | w: {w:.3f} | b: {b:.3f}")

print(f"\\nTrained Model: Fare = {w:.2f} * Distance + {b:.2f}")
`,
        solutionCode: `import numpy as np

def compute_mse_gradients(X, y, w, b):
    N = len(X)
    y_hat = X @ w + b
    error = y_hat - y
    loss = np.mean(error ** 2)
    dw = (2 / N) * (X.T @ error)
    db = (2 / N) * np.sum(error)
    return loss, dw, db
`,
        poll: {
          id: 'poll_m3_s6',
          question: 'If the learning rate (alpha) is set too high (e.g. alpha = 10.0), what happens during Gradient Descent?',
          options: [
            'The model converges in 1 epoch',
            'The parameter updates overshoot the valley and the loss oscillates and diverges (explodes to NaN)',
            'The weights freeze at 0',
            'The bias becomes negative'
          ],
          correctIndex: 1,
          explanation: 'An excessively large learning rate causes updates to step past the minimum and bounce farther away up the sides of the bowl until values overflow.',
          communityDistribution: [3, 92, 3, 2]
        },
        challenge: {
          id: 'chal_m3_s6',
          title: 'Challenge 3.6: Vectorized MSE & Gradient Step',
          prompt: 'Write a function `compute_mse_gradients(X, y, w, b)` that returns a tuple `(loss, dw, db)` where `loss` is the MSE, `dw` is the weight gradient vector, and `db` is the bias gradient scalar.',
          initialCode: `import numpy as np

def compute_mse_gradients(X, y, w, b):
    # TODO: y_hat = X @ w + b
    # TODO: error = y_hat - y
    # TODO: loss = mean(error^2)
    # TODO: dw = (2/N) * (X.T @ error)
    # TODO: db = (2/N) * sum(error)
    # Return (loss, dw, db)
    pass

# Test your function:
X_s = np.array([[1.0], [2.0]])
y_s = np.array([2.0, 4.0])
print("Result:", compute_mse_gradients(X_s, y_s, np.array([1.0]), 0.0))
`,
          solutionCode: `import numpy as np

def compute_mse_gradients(X, y, w, b):
    N = len(X)
    y_hat = X @ w + b
    error = y_hat - y
    loss = np.mean(error ** 2)
    dw = (2 / N) * (X.T @ error)
    db = (2 / N) * np.sum(error)
    return loss, dw, db
`,
          testCode: `
X_in = np.array([[1.0], [2.0]])
y_in = np.array([2.0, 4.0])
w_in = np.array([2.0]) # Perfect weights
b_in = 0.0
loss, dw, db = compute_mse_gradients(X_in, y_in, w_in, b_in)
assert np.isclose(loss, 0.0), f"Expected loss 0.0, got {loss}"
assert np.isclose(dw[0], 0.0), "Gradient dw must be 0 at minimum"
print("All Challenge 3.6 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s7',
        title: 'Logistic Regression & The Sigmoid Curve: Spotify "Skip Track" Predictor',
        timeTag: '02:45 - 02:52',
        storyboard: {
          analogyTitle: '🎵 Big Tech Scenario: Will the User Skip This Song?',
          analogyStory: 'When Spotify queues the next track, it wants to predict: "Will the user skip this song within 30 seconds?" This is a binary classification problem (1 = Skip, 0 = Keep Listening). A linear formula produces unbounded numbers (-10, +50) which cannot represent probabilities. Logistic Regression wraps the linear formula in the Sigmoid activation function, squeezing any raw score into a smooth probability between 0% and 100%.',
          takeaway: 'Key Formula: Sigmoid sigma(z) = 1 / (1 + exp(-z)) maps any real number into a valid probability between 0.0 and 1.0.'
        },
        terminologies: [
          { term: 'Binary Classification', def: 'Predicting one of two categorical outcomes (e.g. 1 = Skip, 0 = Listen).' },
          { term: 'Sigmoid Function (sigma)', def: 'S-shaped activation function mapping raw logits into valid probabilities in (0, 1).' },
          { term: 'Decision Threshold', def: 'Cutoff probability (typically p >= 0.5) where the model triggers a positive prediction.' }
        ],
        conceptMarkdown: `### The Sigmoid Activation Function
$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

Where $z = Xw + b$ is the raw linear logit.

#### Decision Boundary:
- If $\\hat{p} = \\sigma(Xw + b) \\ge 0.5 \\implies \\text{Predict 1 (Skip Track)}$
- If $\\hat{p} < 0.5 \\implies \\text{Predict 0 (Keep Playing)}$`,
        visualAscii: `The Sigmoid Probability Curve:
Probability
1.0 ┤                      ********* (Predict 1: Skip Track)
    │                  ****
0.5 ┤ ─ ─ ─ ─ ─ ─ ─ *** ─ ─ ─ ─ ─ ─ ─ Threshold = 0.5
    │          ****
0.0 ┤ *********                      (Predict 0: Keep Playing)
    └───┬───────────┬───────────┬───> Linear Score z
       -5           0          +5`,
        syntaxGuide: `# Vectorized sigmoid in pure NumPy
def sigmoid(z):
    z_safe = np.clip(z, -250, 250)
    return 1.0 / (1.0 + np.exp(-z_safe))

probabilities = sigmoid(X @ w + b)
predictions = np.where(probabilities >= 0.5, 1, 0)

# Scikit-learn alternative
from sklearn.linear_model import LogisticRegression
clf = LogisticRegression().fit(X_train, y_train)`,
        starterCode: `import numpy as np
from sklearn.linear_model import LogisticRegression

print("=== LIVE DEMO 3.7: SPOTIFY SKIP PREDICTOR (NUMPY + SCIKIT-LEARN) ===")

# Training Songs: [TempoBPM, Acousticness] -> Skipped (1/0)
X_train = np.array([
    [135.0, 0.1], [145.0, 0.15], [128.0, 0.25], # High tempo dance (Listen = 0)
    [ 65.0, 0.8], [ 72.0, 0.90], [ 60.0, 0.85]  # Slow acoustic (Skip = 1)
])
y_train = np.array([0, 0, 0, 1, 1, 1])

# 1. Scikit-Learn Production Standard
clf = LogisticRegression()
clf.fit(X_train, y_train)

# 2. Predict on New Tracks
songs_test = np.array([
    [140.0, 0.1], # Fast EDM track
    [ 70.0, 0.9]  # Slow acoustic track
])

sklearn_classes = clf.predict(songs_test)
sklearn_probs = clf.predict_proba(songs_test)[:, 1] # Probability of Class 1 (Skip)

print("Scikit-Learn Model Predictions:")
for i, (prob, cls) in enumerate(zip(sklearn_probs, sklearn_classes)):
    status = "SKIP (1)" if cls == 1 else "LISTEN (0)"
    print(f"Track {i+1}: Skip Probability = {prob*100:5.1f}% -> Model Action: {status}")

# 3. Pure NumPy Sigmoid Verification: p = 1 / (1 + exp(-(X @ w + b)))
logits = songs_test @ clf.coef_[0] + clf.intercept_[0]
np_probs = 1.0 / (1.0 + np.exp(-np.clip(logits, -250, 250)))
print(f"\\nNumPy Sigmoid Check: {np.round(np_probs * 100, 1)}% (Exact Match!)")
`,
        solutionCode: `import numpy as np

def predict_binary_class(X, w, b, threshold=0.5):
    z = X @ w + b
    p = 1.0 / (1.0 + np.exp(-np.clip(z, -250, 250)))
    return np.where(p >= threshold, 1, 0)
`,
        poll: {
          id: 'poll_m3_s7',
          question: 'What is the exact output of the Sigmoid function when input logit z = 0?',
          options: [
            '0.0',
            '0.5',
            '1.0',
            '-1.0'
          ],
          correctIndex: 1,
          explanation: 'When z = 0, exp(-0) = 1. Therefore sigma(0) = 1 / (1 + 1) = 0.5. This represents the neutral decision threshold.',
          communityDistribution: [4, 91, 4, 1]
        },
        challenge: {
          id: 'chal_m3_s7',
          title: 'Challenge 3.7: Sigmoid Classifier',
          prompt: 'Write a function `predict_binary_class(X, w, b, threshold=0.5)` that computes linear score z = X @ w + b, applies the sigmoid function, and returns a binary array where $p \\ge \\text{threshold}$ is 1, else 0.',
          initialCode: `import numpy as np

def predict_binary_class(X, w, b, threshold=0.5):
    # TODO: Compute z = X @ w + b
    # TODO: Compute p = 1 / (1 + exp(-z))
    # TODO: Return binary array: 1 where p >= threshold, else 0
    pass

# Test your function:
X_t = np.array([[3.0], [-3.0]])
print("Predictions:", predict_binary_class(X_t, np.array([1.0]), 0.0))
`,
          solutionCode: `import numpy as np

def predict_binary_class(X, w, b, threshold=0.5):
    z = X @ w + b
    p = 1.0 / (1.0 + np.exp(-np.clip(z, -250, 250)))
    return np.where(p >= threshold, 1, 0)
`,
          testCode: `
X_in = np.array([[10.0], [-10.0]])
w_in = np.array([1.0])
b_in = 0.0
preds = predict_binary_class(X_in, w_in, b_in)
assert preds[0] == 1 and preds[1] == 0, "z=+10 must predict 1, z=-10 must predict 0"
print("All Challenge 3.7 tests passed successfully! 🎉")
`
        }
      },
      {
        id: 'm3_s8',
        title: 'Model Evaluation & Metrics: Netflix Subscription Churn & The Accuracy Trap',
        timeTag: '02:52 - 03:00',
        storyboard: {
          analogyTitle: '🍿 Big Tech Scenario: The 99% Accuracy Trap in Netflix Churn',
          analogyStory: 'Suppose out of 1,000,000 Netflix subscribers, only 1% (10,000 users) cancel their subscription each month. A completely broken, lazy model that always predicts "Nobody will cancel!" achieves 99.0% Accuracy! But it is 100% useless because it detected zero churners! In machine learning, we must evaluate the Confusion Matrix, Precision, and Recall rather than relying on overall accuracy.',
          takeaway: 'Key Concept: Accuracy is misleading on imbalanced data. Use Precision (quality of positive calls), Recall (quantity of positives caught), and R² for regression.'
        },
        terminologies: [
          { term: 'Confusion Matrix', def: '2x2 table breakdown of True Positives (TP), False Positives (FP), True Negatives (TN), False Negatives (FN).' },
          { term: 'Precision', def: 'Out of all predicted churners, how many actually cancelled? TP / (TP + FP).' },
          { term: 'Recall (Sensitivity)', def: 'Out of all actual churners, how many did the model detect? TP / (TP + FN).' },
          { term: 'R² Score', def: 'Coefficient of determination measuring percentage of variance explained by a regression model (1.0 = perfect).' }
        ],
        conceptMarkdown: `### Classification Metrics (The Confusion Matrix)
- **Accuracy**: \`(TP + TN) / Total\` (Misleading when classes are skewed!)
- **Precision**: \`TP / (TP + FP)\` (Important when False Alarms are costly)
- **Recall**: \`TP / (TP + FN)\` (Critical when Missing a Case is costly, e.g. Fraud or Cancer)

#### Regression Metric: R² Score
$$R^2 = 1 - \\frac{\\sum (y - \\hat{y})^2}{\\sum (y - \\bar{y})^2}$$
R² = 1.0 is perfect; R² = 0.0 means the model just predicts the average.`,
        visualAscii: `The 2x2 Confusion Matrix:
                        Actual Churn (1)        Actual Retained (0)
Predicted Churn (1)       True Positive (TP)      False Positive (FP) [False Alarm]
Predicted Retained (0)    False Negative (FN)     True Negative (TN)  [Silent Churn!]`,
        syntaxGuide: `# Pure NumPy Confusion Matrix
TP = np.sum((y_true == 1) & (y_pred == 1))
FP = np.sum((y_true == 0) & (y_pred == 1))
precision = TP / (TP + FP)
recall = TP / (TP + FN)

# Scikit-learn evaluation metrics
from sklearn.metrics import confusion_matrix, precision_score, recall_score, r2_score`,
        starterCode: `import numpy as np
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score, classification_report

print("=== LIVE DEMO 3.8: EVALUATION METRICS (NUMPY + SCIKIT-LEARN) ===")

# Ground truth vs Model predictions for 10 Netflix users (1 = Churn, 0 = Retained)
y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 0])

# 1. Scikit-Learn Standard Confusion Matrix: [[TN, FP], [FN, TP]]
cm = confusion_matrix(y_true, y_pred)
print("Scikit-Learn Confusion Matrix:\\n", cm)

# 2. Scikit-Learn Metrics
prec = precision_score(y_true, y_pred)
rec = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print(f"Scikit-Learn Precision : {prec * 100:.1f}% (Reliability of positive alarm)")
print(f"Scikit-Learn Recall    : {rec * 100:.1f}% (Percentage of churners caught)")
print(f"Scikit-Learn F1-Score  : {f1:.3f}")

# 3. Comprehensive Industry Classification Report
print("\\n--- Scikit-Learn Classification Report ---")
print(classification_report(y_true, y_pred, target_names=['Retained (0)', 'Churned (1)']))
`,
        solutionCode: `import numpy as np

def calculate_precision_recall(y_true, y_pred):
    TP = np.sum((y_true == 1) & (y_pred == 1))
    FP = np.sum((y_true == 0) & (y_pred == 1))
    FN = np.sum((y_true == 1) & (y_pred == 0))
    prec = TP / (TP + FP) if (TP + FP) > 0 else 0.0
    rec = TP / (TP + FN) if (TP + FN) > 0 else 0.0
    return prec, rec
`,
        poll: {
          id: 'poll_m3_s8',
          question: 'If only 1 in 100 customers churns, why is a model with 99% accuracy potentially useless?',
          options: [
            'Because 99% accuracy is impossible to achieve',
            'A lazy model that predicts "Nobody Churns" gets 99% accuracy while detecting 0% of actual churners (0 Recall)',
            'Accuracy only works for regression models',
            'Because Netflix does not use accuracy'
          ],
          correctIndex: 1,
          explanation: 'On highly imbalanced datasets, overall accuracy reflects the dominant class. A model that never flags a positive case will still have high accuracy but zero recall.',
          communityDistribution: [2, 94, 2, 2]
        },
        challenge: {
          id: 'chal_m3_s8',
          title: 'Challenge 3.8: Precision & Recall Calculator',
          prompt: 'Write a function `calculate_precision_recall(y_true, y_pred)` in pure NumPy that returns a tuple `(precision, recall)`. Handle division by zero safely.',
          initialCode: `import numpy as np

def calculate_precision_recall(y_true, y_pred):
    # TODO: Calculate TP, FP, FN
    # TODO: Calculate precision = TP / (TP + FP)
    # TODO: Calculate recall = TP / (TP + FN)
    # Return (precision, recall)
    pass

# Test your function:
yt = np.array([1, 0, 1, 1, 0])
yp = np.array([1, 0, 0, 1, 0])
print("Metrics:", calculate_precision_recall(yt, yp))
`,
          solutionCode: `import numpy as np

def calculate_precision_recall(y_true, y_pred):
    TP = np.sum((y_true == 1) & (y_pred == 1))
    FP = np.sum((y_true == 0) & (y_pred == 1))
    FN = np.sum((y_true == 1) & (y_pred == 0))
    prec = TP / (TP + FP) if (TP + FP) > 0 else 0.0
    rec = TP / (TP + FN) if (TP + FN) > 0 else 0.0
    return prec, rec
`,
          testCode: `
yt = np.array([1, 1, 0, 0])
yp = np.array([1, 0, 0, 0])
p, r = calculate_precision_recall(yt, yp)
assert np.isclose(p, 1.0), f"Expected precision 1.0, got {p}"
assert np.isclose(r, 0.5), f"Expected recall 0.5, got {r}"
print("All Challenge 3.8 tests passed successfully! 🎉")
`
        }
      }
    ]
  }
];

// Attach curated Code Debugging Challenges and Find-the-Output MCQs to all slides
CURRICULUM_MODULES.forEach((mod) => {
  mod.slides.forEach((slide) => {
    const assess = SLIDE_ASSESSMENTS[slide.id];
    if (assess) {
      slide.debuggingQuestion = assess.debuggingQuestion;
      slide.outputMCQ = assess.outputMCQ;
    }
  });
});
