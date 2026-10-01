// Comprehensive Assessment Data: Code Debugging Challenges & Find-the-Output MCQs
// Mapped by slide ID (m1_s1 through m3_s8) across all 3 curriculum tracks.

export const SLIDE_ASSESSMENTS = {
  // =========================================================================
  // TRACK 1: NUMPY FOUNDATIONS (DIGITAL MEDIA & SMARTWATCH SENSORS)
  // =========================================================================
  m1_s1: {
    debuggingQuestion: {
      id: 'debug_m1_s1',
      title: 'Fix 8-Bit Pixel Inversion Overflow Bug',
      scenario: 'A photo filter engineer attempted to invert an 8-bit grayscale image (`inverted = 255 - img`). However, they created the array with signed integer arithmetic without proper casting, causing negative values or unexpected wrapping.',
      buggyCode: `import numpy as np

# Broken image inversion function
def invert_grayscale_photo(raw_pixels):
    # BUG: raw_pixels is uint8, but subtracting 256 or improper typing can cause wrapping
    # Goal: return inverted pixel values where 0 becomes 255 and 255 becomes 0
    return 255 - raw_pixels

# Test case
pixels = np.array([0, 100, 200, 255], dtype=np.uint8)
inverted = invert_grayscale_photo(pixels)
print("Inverted pixels:", inverted)
`,
      hint: 'In NumPy uint8 arithmetic, `255 - raw_pixels` works, but if someone uses signed integers or `np.uint8(256) - raw_pixels`, it wraps around. Ensure `np.subtract(255, raw_pixels, dtype=np.uint8)` or `255 - raw_pixels` returns exact uint8 with values [255, 155, 55, 0].',
      testCode: `
pixels = np.array([0, 50, 150, 255], dtype=np.uint8)
inv = invert_grayscale_photo(pixels)
assert inv[0] == 255 and inv[-1] == 0, f"Expected 255 and 0, got {inv[0]} and {inv[-1]}"
assert inv[1] == 205, f"Expected 205, got {inv[1]}"
assert inv.dtype == np.uint8, f"Expected uint8 dtype, got {inv.dtype}"
print("Debug Challenge 1.1 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'NumPy supports vectorized scalar subtraction `255 - raw_pixels`. Explicitly keeping `dtype=np.uint8` ensures memory efficiency (1 byte per pixel) without overflow.'
    },
    outputMCQ: {
      id: 'mcq_m1_s1',
      question: 'What is the output of the following code regarding NumPy array memory and dtype?',
      codeSnippet: `import numpy as np

arr = np.array([1, 2, 3], dtype=np.uint8)
print(arr.itemsize, arr.nbytes)`,
      options: [
        '1 3',
        '8 24',
        '4 12',
        '1 28'
      ],
      correctIndex: 0,
      explanation: 'For `np.uint8`, each element occupies exactly 1 byte (`itemsize = 1`). Since there are 3 elements, `nbytes = 3 * 1 = 3`. In contrast, a Python list would consume over 100 bytes with pointer overhead!'
    }
  },

  m1_s2: {
    debuggingQuestion: {
      id: 'debug_m1_s2',
      title: 'Fix Shape Mismatch in Smartwatch Telemetry Reshaping',
      scenario: 'A sensor data pipeline receives a 1D flat buffer of 24 heart rate readings and tries to reshape it into a 2D matrix of (7 readings, 4 hours). But 7 * 4 = 28 != 24, throwing a ValueError!',
      buggyCode: `import numpy as np

# Broken reshaping function
def format_sensor_stream(flat_buffer):
    # BUG: Buffer has 24 elements, but reshaping to (7, 4) causes ValueError!
    # Goal: Reshape into 6 time intervals by 4 sensor channels
    return flat_buffer.reshape(7, 4)

sensor_data = np.arange(24)
matrix = format_sensor_stream(sensor_data)
print("Reshaped Matrix:\\n", matrix)
`,
      hint: 'The product of dimensions in `reshape(rows, cols)` MUST exactly equal the total number of elements (size=24). Change dimensions to `(6, 4)` or use `-1` (e.g. `flat_buffer.reshape(6, -1)`).',
      testCode: `
raw = np.arange(24)
res = format_sensor_stream(raw)
assert res.shape == (6, 4), f"Expected shape (6, 4), got {res.shape}"
assert res.size == 24, "Total elements must be 24"
print("Debug Challenge 1.2 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'NumPy requires total element count to be conserved during reshape. Using `flat_buffer.reshape(6, 4)` or `flat_buffer.reshape(6, -1)` resolves the mismatch.'
    },
    outputMCQ: {
      id: 'mcq_m1_s2',
      question: 'What is printed after executing this code snippet?',
      codeSnippet: `import numpy as np

sensor_mat = np.zeros((3, 5), dtype=np.int32)
print(sensor_mat.shape, sensor_mat.ndim, sensor_mat.size)`,
      options: [
        '(3, 5) 2 15',
        '(5, 3) 2 15',
        '(3, 5) 15 2',
        '[3, 5] 2 8'
      ],
      correctIndex: 0,
      explanation: '`shape` is the tuple of dimensions `(3, 5)`, `ndim` is the number of axes `2`, and `size` is the total number of elements `3 * 5 = 15`.'
    }
  },

  m1_s3: {
    debuggingQuestion: {
      id: 'debug_m1_s3',
      title: 'Fix Sequence Sampling Interval in Sensor Telemetry',
      scenario: 'An IoT engineer wants to sample exactly 11 timestamp markers between 0 and 10 seconds (including 0 and 10). They used `np.arange(0, 10, 1)`, which excludes 10 and only generates 10 points!',
      buggyCode: `import numpy as np

# Broken sequence generator
def generate_telemetry_timestamps(start_sec, stop_sec, num_samples):
    # BUG: arange excludes stop boundary and does not guarantee exact sample count
    return np.arange(start_sec, stop_sec, 1)

timestamps = generate_telemetry_timestamps(0, 10, 11)
print(f"Count: {len(timestamps)}, Last: {timestamps[-1]}")
`,
      hint: 'When you need an exact number of evenly spaced samples including both endpoints, use `np.linspace(start_sec, stop_sec, num_samples)` instead of `np.arange`.',
      testCode: `
ts = generate_telemetry_timestamps(0, 10, 11)
assert len(ts) == 11, f"Expected 11 samples, got {len(ts)}"
assert ts[0] == 0.0 and ts[-1] == 10.0, f"Endpoints must be 0 and 10, got {ts[0]} and {ts[-1]}"
print("Debug Challenge 1.3 Fixed Successfully! 🎉")
`,
      solutionExplanation: '`np.linspace(start, stop, num_samples)` guarantees inclusive endpoints and exactly `num_samples` points, whereas `np.arange` is half-open `[start, stop)`. '
    },
    outputMCQ: {
      id: 'mcq_m1_s3',
      question: 'What is the exact output of `np.arange(1, 10, 3)`?',
      codeSnippet: `import numpy as np

arr = np.arange(1, 10, 3)
print(arr)`,
      options: [
        '[1 4 7]',
        '[1 4 7 10]',
        '[1 3 6 9]',
        '[3 6 9]'
      ],
      correctIndex: 0,
      explanation: '`np.arange(1, 10, 3)` starts at 1, steps by 3 (1, 4, 7), and stops strictly before 10. Thus 10 is excluded, producing `[1, 4, 7]`.'
    }
  },

  m1_s4: {
    debuggingQuestion: {
      id: 'debug_m1_s4',
      title: 'Fix Inverted Coordinate Slicing in Photo Cropping',
      scenario: 'A mobile photo editor app receives a 2D image matrix of shape (height, width). An engineer tried to crop rows 2 to 5 and columns 1 to 4, but wrote `photo[1:4, 2:5]` instead of `photo[2:5, 1:4]`, transposing the crop region.',
      buggyCode: `import numpy as np

# Broken crop function
def crop_photo_region(img, r_start, r_end, c_start, c_end):
    # BUG: Row and Column slice coordinates are inverted!
    return img[c_start:c_end, r_start:r_end]

# 6x6 image
image = np.arange(36).reshape(6, 6)
cropped = crop_photo_region(image, 2, 5, 1, 4)
print("Cropped Shape:", cropped.shape)
`,
      hint: 'In NumPy 2D arrays, indexing convention is strictly `array[row_slice, col_slice]`. Change the index to `img[r_start:r_end, c_start:c_end]`.',
      testCode: `
img = np.arange(36).reshape(6, 6)
crop = crop_photo_region(img, 2, 5, 1, 4)
assert crop.shape == (3, 3), f"Expected shape (3, 3), got {crop.shape}"
assert crop[0, 0] == img[2, 1], f"Expected top-left element {img[2, 1]}, got {crop[0, 0]}"
print("Debug Challenge 1.4 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'NumPy matrices follow standard mathematical matrix convention `(rows, columns)`: row indexing comes first, column indexing second.'
    },
    outputMCQ: {
      id: 'mcq_m1_s4',
      question: 'Given array `m = np.arange(16).reshape(4, 4)`, what is `m[1:3, ::2]`?',
      codeSnippet: `import numpy as np

m = np.arange(16).reshape(4, 4)
print(m[1:3, ::2])`,
      options: [
        '[[ 4  6]\n [ 8 10]]',
        '[[ 1  3]\n [ 5  7]]',
        '[[ 4  5]\n [ 8  9]]',
        '[[ 0  2]\n [ 8 10]]'
      ],
      correctIndex: 0,
      explanation: 'Row slice `1:3` selects rows 1 and 2: row 1 is `[4, 5, 6, 7]` and row 2 is `[8, 9, 10, 11]`. Column slice `::2` takes every second column (columns 0 and 2). This yields `[[4, 6], [8, 10]]`.'
    }
  },

  m1_s5: {
    debuggingQuestion: {
      id: 'debug_m1_s5',
      title: 'Fix Memory Mutation Bug (View vs Copy in Photo Thumbnail)',
      scenario: 'A photo thumbnail generator takes a slice of the main photo and brightens it. But because basic slicing creates a VIEW (shared memory), the high-res original photo is unintentionally permanently altered!',
      buggyCode: `import numpy as np

# Broken thumbnail filter
def create_brightened_thumbnail(original_photo):
    # BUG: Slicing creates a VIEW! Modifying thumbnail mutates original_photo!
    thumbnail = original_photo[0:2, 0:2]
    thumbnail = thumbnail + 50 # Or in-place mutation
    thumbnail[:] = 255
    return thumbnail

photo = np.zeros((4, 4), dtype=np.int32)
thumb = create_brightened_thumbnail(photo)
print("Original photo modified? Top-left is:", photo[0, 0])
`,
      hint: 'Basic slicing in NumPy returns a memory VIEW. To prevent mutating the original array, call `.copy()` immediately after slicing: `thumbnail = original_photo[0:2, 0:2].copy()`.',
      testCode: `
orig = np.zeros((4, 4), dtype=np.int32)
thumb = create_brightened_thumbnail(orig)
assert orig[0, 0] == 0, f"Original array was mutated! Expected 0, got {orig[0, 0]}"
assert thumb[0, 0] == 255, "Thumbnail should be modified"
print("Debug Challenge 1.5 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Adding `.copy()` forces NumPy to allocate a distinct block of RAM, severing the shared data buffer between the slice and the original array.'
    },
    outputMCQ: {
      id: 'mcq_m1_s5',
      question: 'What is printed by the following code?',
      codeSnippet: `import numpy as np

a = np.array([10, 20, 30])
b = a[:2]
b[0] = 99
print(a[0])`,
      options: [
        '99',
        '10',
        'Error: array is read-only',
        'None'
      ],
      correctIndex: 0,
      explanation: 'Basic slice `b = a[:2]` creates a view that points to the exact same RAM addresses as `a`. Changing `b[0] = 99` directly mutates `a[0]` in-place to 99!'
    }
  },

  m1_s6: {
    debuggingQuestion: {
      id: 'debug_m1_s6',
      title: 'Fix Slow Python Loop in Video Frame Brightness Adjustment',
      scenario: 'A developer wrote a nested Python `for` loop to multiply every pixel in a video frame by 1.2. The code runs 80x slower than real-time video playback and fails on large frames. Replace it with vectorized SIMD code.',
      buggyCode: `import numpy as np

# Slow nested loop filter
def apply_brightness_boost(frame, factor):
    # BUG: Extremely slow nested loops instead of NumPy vectorized broadcast
    h, w = frame.shape
    out = np.zeros_like(frame)
    for r in range(h):
        for c in range(w):
            out[r, c] = frame[r, c] * factor
    return out

img = np.ones((100, 100)) * 50
boosted = apply_brightness_boost(img, 1.5)
print("Boosted sample:", boosted[0, 0])
`,
      hint: 'NumPy automatically vectorizes arithmetic across all elements with SIMD hardware instructions. Simply return `frame * factor`.',
      testCode: `
img = np.ones((50, 50)) * 40
res = apply_brightness_boost(img, 2.0)
assert np.allclose(res, 80.0), "All elements must be multiplied by factor"
print("Debug Challenge 1.6 Fixed Successfully! 🎉")
`,
      solutionExplanation: '`frame * factor` executes in low-level C using CPU vector registers (AVX/NEON), replacing millions of Python bytecode evaluations with a single memory sweep.'
    },
    outputMCQ: {
      id: 'mcq_m1_s6',
      question: 'What is the result of `np.array([2, 4, 6]) * 3`?',
      codeSnippet: `import numpy as np

arr = np.array([2, 4, 6])
print(arr * 3)`,
      options: [
        '[ 6 12 18]',
        '[2, 4, 6, 2, 4, 6, 2, 4, 6]',
        '[ 5  7  9]',
        'Error: cannot multiply array by integer'
      ],
      correctIndex: 0,
      explanation: 'In NumPy, `*` performs element-wise vectorized multiplication. (In plain Python, multiplying a list `[2, 4, 6] * 3` repeats the list 3 times, but NumPy arrays perform mathematical vectorization).'
    }
  },

  m1_s7: {
    debuggingQuestion: {
      id: 'debug_m1_s7',
      title: 'Fix Axis Inversion in Patient Heart Rate Aggregation',
      scenario: 'A clinical dashboard stores heart rate readings in a 2D array of shape `(patients, hours) = (5, 24)`. To compute the average heart rate for each patient, the developer used `axis=0`, which averaged across patients instead of across hours!',
      buggyCode: `import numpy as np

# Broken axis aggregation
def compute_patient_daily_averages(sensor_matrix):
    # sensor_matrix shape: (num_patients, 24_hours)
    # BUG: axis=0 collapses rows, giving 24 hourly averages instead of 5 patient averages!
    return sensor_matrix.mean(axis=0)

data = np.arange(120).reshape(5, 24)
averages = compute_patient_daily_averages(data)
print(f"Result shape: {averages.shape} (Expected: (5,))")
`,
      hint: 'In a 2D array of shape (patients, hours), `axis=0` collapses patients (rows). To collapse hours across columns for each patient, use `axis=1`.',
      testCode: `
data = np.arange(120).reshape(5, 24)
res = compute_patient_daily_averages(data)
assert res.shape == (5,), f"Expected shape (5,), got {res.shape}"
assert np.isclose(res[0], np.mean(data[0, :])), "First patient average incorrect"
print("Debug Challenge 1.7 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Rule of thumb: `axis=1` collapses across columns (horizontal reduction), leaving one aggregated value per row (patient).'
    },
    outputMCQ: {
      id: 'mcq_m1_s7',
      question: 'Given matrix `x = np.array([[10, 20], [30, 40]])`, what is `x.sum(axis=0)`?',
      codeSnippet: `import numpy as np

x = np.array([[10, 20],
              [30, 40]])
print(x.sum(axis=0))`,
      options: [
        '[40 60]',
        '[30 70]',
        '100',
        '[[40 60]]'
      ],
      correctIndex: 0,
      explanation: '`axis=0` sums vertically along columns: `10 + 30 = 40` and `20 + 40 = 60`, resulting in 1D array `[40, 60]`.'
    }
  },

  m1_s8: {
    debuggingQuestion: {
      id: 'debug_m1_s8',
      title: 'Fix Non-Vectorized math.sin in Audio Tone Generation',
      scenario: 'An audio engineer tried generating a 440 Hz concert pitch tone by calling Python standard library `math.sin()` on a NumPy timestamp array, triggering a `TypeError: only size-1 arrays can be converted to Python scalars`.',
      buggyCode: `import numpy as np
import math

# Broken tone synthesizer
def synthesize_sine_tone(frequencies, sample_rate, duration):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    # BUG: math.sin only accepts a single scalar float, not a NumPy array!
    # return math.sin(2 * math.pi * frequencies * t)
    return np.array([math.sin(2 * math.pi * 440 * x) for x in t]) # Slow and bug-prone

audio = synthesize_sine_tone(440, 8000, 0.01)
print("Audio samples count:", len(audio))
`,
      hint: 'Replace Python standard `math.sin` with NumPy universal function `np.sin(2 * np.pi * frequency * t)` which operates directly on ndarrays at native C speed.',
      testCode: `
audio = synthesize_sine_tone(440, 8000, 0.01)
assert isinstance(audio, np.ndarray), "Result must be a NumPy ndarray"
assert len(audio) == 80, f"Expected 80 samples, got {len(audio)}"
assert np.isclose(audio[0], 0.0), "Sine at t=0 must be 0"
print("Debug Challenge 1.8 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'NumPy ufuncs like `np.sin`, `np.exp`, `np.log` execute compiled C loops that handle entire arrays without Python overhead or TypeErrors.'
    },
    outputMCQ: {
      id: 'mcq_m1_s8',
      question: 'What is the output of `np.clip(np.array([-5, 10, 25]), 0, 20)`?',
      codeSnippet: `import numpy as np

arr = np.array([-5, 10, 25])
print(np.clip(arr, 0, 20))`,
      options: [
        '[ 0 10 20]',
        '[-5 10 20]',
        '[ 0 10 25]',
        '[ 0 20 20]'
      ],
      correctIndex: 0,
      explanation: '`np.clip(a, a_min, a_max)` clamps all values below 0 up to 0, leaves values in [0, 20] untouched, and clamps values above 20 down to 20. Hence `[-5, 10, 25]` becomes `[0, 10, 20]`.'
    }
  },

  // =========================================================================
  // TRACK 2: NUMPY ADVANCED (PHOTO FILTERS, AUDIO & MULTI-CHANNEL SENSORS)
  // =========================================================================
  m2_s1: {
    debuggingQuestion: {
      id: 'debug_m2_s1',
      title: 'Fix Broadcasting Dimension Error in Photo Color Grading',
      scenario: 'A photo filter adds RGB tint adjustments `[+10, -5, +20]` to an image matrix of shape `(100, 100, 3)`. The developer created tint with shape `(3, 1)`, resulting in `ValueError: operands could not be broadcast together with shapes (100,100,3) (3,1)`.',
      buggyCode: `import numpy as np

# Broken color tinting
def apply_rgb_tint(image_rgb, tint_values):
    # image_rgb shape: (H, W, 3)
    # tint_values: e.g. [10, -5, 20]
    # BUG: If tint is shaped (3, 1), it cannot broadcast with trailing dimension 3!
    tint_matrix = np.array(tint_values).reshape(3, 1)
    return image_rgb + tint_matrix

img = np.ones((10, 10, 3), dtype=np.float32) * 100
# tint = apply_rgb_tint(img, [10, -5, 20]) # Causes ValueError
`,
      hint: 'In NumPy broadcasting, trailing dimensions must align. To broadcast across `(H, W, 3)`, the tint vector must have shape `(3,)` or `(1, 1, 3)`. Change `tint_values` to `np.array(tint_values)` or `reshape(1, 1, 3)`.',
      testCode: `
img = np.ones((5, 5, 3), dtype=np.float32) * 100
res = apply_rgb_tint(img, [10, -5, 20])
assert res.shape == (5, 5, 3), f"Expected shape (5, 5, 3), got {res.shape}"
assert np.allclose(res[0, 0], [110, 95, 120]), "Tint values did not apply correctly"
print("Debug Challenge 2.1 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'NumPy aligns shapes from right to left. `(H, W, 3)` aligns with `(3,)` or `(1, 1, 3)`, cleanly broadcasting across all rows and columns.'
    },
    outputMCQ: {
      id: 'mcq_m2_s1',
      question: 'Can arrays of shape `(4, 1)` and `(1, 6)` broadcast together, and what is the output shape?',
      codeSnippet: `import numpy as np

a = np.ones((4, 1))
b = np.ones((1, 6))
c = a + b
print(c.shape)`,
      options: [
        '(4, 6)',
        '(6, 4)',
        'ValueError (shapes incompatible)',
        '(4, 1, 6)'
      ],
      correctIndex: 0,
      explanation: 'Under NumPy broadcasting rules, any dimension with size 1 stretches to match the other array. The 1 in axis 1 stretches to 6, and the 1 in axis 0 stretches to 4, yielding `(4, 6)`.'
    }
  },

  m2_s2: {
    debuggingQuestion: {
      id: 'debug_m2_s2',
      title: 'Fix keepdims in 3D Accelerometer Vector Normalization',
      scenario: 'To calculate unit directional vectors from 3D smartwatch accelerometer data `(N, 3)`, an engineer divides each reading by its Euclidean magnitude `np.linalg.norm(accel, axis=1)`. But without `keepdims=True`, the norm has shape `(N,)` instead of `(N, 1)`, causing a broadcast failure in matrix pipelines.',
      buggyCode: `import numpy as np

# Broken normalization
def normalize_accelerometer_vectors(accel):
    # accel shape: (N, 3)
    # BUG: norm has shape (N,), which causes shape issues in downstream column operations
    magnitude = np.linalg.norm(accel, axis=1) # Missing keepdims=True!
    return accel / magnitude.reshape(-1, 1) # Fix or use keepdims=True

data = np.array([[3.0, 0.0, 4.0], [0.0, 5.0, 12.0]])
unit_vectors = normalize_accelerometer_vectors(data)
print("Unit vectors:\\n", unit_vectors)
`,
      hint: 'Use `keepdims=True` in `np.linalg.norm(accel, axis=1, keepdims=True)`. This preserves the 2D shape `(N, 1)`, allowing clean division `accel / magnitude`.',
      testCode: `
data = np.array([[3.0, 0.0, 4.0], [0.0, 5.0, 12.0]])
res = normalize_accelerometer_vectors(data)
assert res.shape == (2, 3), f"Expected shape (2, 3), got {res.shape}"
norms = np.linalg.norm(res, axis=1)
assert np.allclose(norms, [1.0, 1.0]), "Magnitudes must be unit 1.0"
print("Debug Challenge 2.2 Fixed Successfully! 🎉")
`,
      solutionExplanation: '`keepdims=True` keeps the collapsed axis as length 1, producing `(N, 1)` directly and enabling immediate broadcasting without manual reshaping.'
    },
    outputMCQ: {
      id: 'mcq_m2_s2',
      question: 'Given an array `arr` of shape `(10, 4, 3)`, what is the shape of `arr.mean(axis=1, keepdims=True)`?',
      codeSnippet: `import numpy as np

arr = np.zeros((10, 4, 3))
res = arr.mean(axis=1, keepdims=True)
print(res.shape)`,
      options: [
        '(10, 1, 3)',
        '(10, 3)',
        '(1, 4, 3)',
        '(10, 4, 1)'
      ],
      correctIndex: 0,
      explanation: 'Reducing across `axis=1` with `keepdims=True` retains the reduced dimension as size 1, resulting in `(10, 1, 3)`. Without keepdims, it would be `(10, 3)`.'
    }
  },

  m2_s3: {
    debuggingQuestion: {
      id: 'debug_m2_s3',
      title: 'Fix Mismatched Index Arrays in Audio Equalizer Bands',
      scenario: 'To extract specific frequency channels from a spectrogram matrix `(channels, freqs)`, an engineer passed index arrays of different lengths: `matrix[[0, 1], [2, 4, 6]]`, throwing `IndexError: shape mismatch: indexing arrays could not be broadcast together`.',
      buggyCode: `import numpy as np

# Broken fancy indexing
def extract_frequency_pins(spectrogram):
    # spectrogram shape: (4 channels, 8 frequencies)
    # BUG: Attempting to index with mismatched list lengths
    # Goal: Extract (channel 0, freq 2), (channel 1, freq 4), and (channel 2, freq 6)
    row_idx = [0, 1]       # Length 2
    col_idx = [2, 4, 6]    # Length 3 -> IndexError!
    return spectrogram[row_idx, col_idx]

spec = np.arange(32).reshape(4, 8)
# pins = extract_frequency_pins(spec) # Throws IndexError
`,
      hint: 'In NumPy fancy indexing, when you provide coordinate arrays `arr[x, y]`, `x` and `y` must have identical lengths (or be broadcastable). Set `row_idx = [0, 1, 2]` to match `col_idx = [2, 4, 6]`.',
      testCode: `
spec = np.arange(32).reshape(4, 8)
res = extract_frequency_pins(spec)
assert len(res) == 3, f"Expected 3 extracted points, got {len(res)}"
assert res[0] == spec[0, 2] and res[1] == spec[1, 4] and res[2] == spec[2, 6], "Values do not match coordinates"
print("Debug Challenge 2.3 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Coordinate fancy indexing pairs element-by-element: `(row_idx[i], col_idx[i])`. Both index arrays must have matching dimensions.'
    },
    outputMCQ: {
      id: 'mcq_m2_s3',
      question: 'What is the shape of the result when indexing array `a = np.arange(20).reshape(4, 5)` with `a[[0, 2], [1, 3]]`?',
      codeSnippet: `import numpy as np

a = np.arange(20).reshape(4, 5)
res = a[[0, 2], [1, 3]]
print(res)`,
      options: [
        '[ 1 13]',
        '[[ 1  3]\n [11 13]]',
        '[ 0 10]',
        '(2, 2)'
      ],
      correctIndex: 0,
      explanation: 'Fancy indexing with two 1D coordinate arrays selects point `(0, 1)` which is 1, and point `(2, 3)` which is `2*5 + 3 = 13`. The output is 1D array `[1, 13]`.'
    }
  },

  m2_s4: {
    debuggingQuestion: {
      id: 'debug_m2_s4',
      title: 'Fix Python `and` Keyword in Arrhythmia Detection Mask',
      scenario: 'To detect critical cardiac events where Heart Rate > 120 AND SpO2 < 92, an analyst wrote `(hr > 120) and (spo2 < 92)`. This raises `ValueError: The truth value of an array with more than one element is ambiguous. Use a.any() or a.all()`.',
      buggyCode: `import numpy as np

# Broken arrhythmia detector
def detect_arrhythmia_events(heart_rates, spo2_levels):
    # BUG: Python logical 'and' does not work on ndarrays! Must use bitwise '&' with parens
    mask = (heart_rates > 120) and (spo2_levels < 92)
    return heart_rates[mask]

hr = np.array([75, 135, 90, 140, 110])
spo2 = np.array([98, 89, 95, 90, 96])
# events = detect_arrhythmia_events(hr, spo2) # Throws ValueError
`,
      hint: 'Replace Python keyword `and` with NumPy bitwise operator `&`, and ensure both conditions are enclosed in parentheses: `mask = (heart_rates > 120) & (spo2_levels < 92)`.',
      testCode: `
hr = np.array([75, 135, 90, 140, 110])
spo2 = np.array([98, 89, 95, 90, 96])
res = detect_arrhythmia_events(hr, spo2)
assert len(res) == 2, f"Expected 2 detected events, got {len(res)}"
assert np.array_equal(res, [135, 140]), f"Expected [135, 140], got {res}"
print("Debug Challenge 2.4 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Python `and` evaluates the truth value of the entire container object, which is ambiguous for arrays. NumPy requires bitwise `&` (AND), `|` (OR), and `~` (NOT) for element-wise boolean operations.'
    },
    outputMCQ: {
      id: 'mcq_m2_s4',
      question: 'Given `arr = np.array([5, 12, 18, 25])`, what is `arr[(arr > 10) & (arr < 20)]`?',
      codeSnippet: `import numpy as np

arr = np.array([5, 12, 18, 25])
print(arr[(arr > 10) & (arr < 20)])`,
      options: [
        '[12 18]',
        '[True, False]',
        '[18 25]',
        '[ 5 25]'
      ],
      correctIndex: 0,
      explanation: 'The mask checks which elements are strictly greater than 10 AND less than 20. Only 12 and 18 satisfy both conditions, returning `[12, 18]`.'
    }
  },

  m2_s5: {
    debuggingQuestion: {
      id: 'debug_m2_s5',
      title: 'Fix Arguments in Audio Dynamic Range Compression (np.where)',
      scenario: 'To prevent microphone distortion, a sound engineer wants to clamp decibels above 90 dB down to 90 dB, while leaving all other values untouched. They wrote `np.where(audio > 90, audio, 90)`, which actually did the opposite: replaced low values with 90!',
      buggyCode: `import numpy as np

# Broken audio compressor
def compress_audio_peaks(audio_levels, threshold=90):
    # BUG: np.where(condition, if_true, if_false) arguments are swapped!
    # Currently: if audio > 90, keep audio; else set to 90!
    return np.where(audio_levels > threshold, audio_levels, threshold)

decibels = np.array([65, 88, 95, 110, 72])
compressed = compress_audio_peaks(decibels, 90)
print("Compressed output:", compressed) # Shows [90, 90, 95, 110, 90] - WRONG!
`,
      hint: 'The syntax for `np.where(condition, x, y)` is: if condition is True take `x`, else take `y`. When `audio_levels > threshold` is True, you want `threshold`, otherwise keep `audio_levels`: `np.where(audio_levels > threshold, threshold, audio_levels)`. Or use `np.clip(audio_levels, None, threshold)`.',
      testCode: `
decibels = np.array([65, 88, 95, 110, 72])
res = compress_audio_peaks(decibels, 90)
assert np.max(res) <= 90, f"Max value must be 90, got {np.max(res)}"
assert res[0] == 65 and res[1] == 88, "Values below 90 must not be changed"
assert res[2] == 90 and res[3] == 90, "Values above 90 must be capped at 90"
print("Debug Challenge 2.5 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'In `np.where(cond, val_if_true, val_if_false)`, the second argument is what to assign when the condition matches. To clamp peaks down to 90, place 90 in the second argument.'
    },
    outputMCQ: {
      id: 'mcq_m2_s5',
      question: 'What is the output of `np.where(np.array([1, -2, 3, -4]) > 0, 1, 0)`?',
      codeSnippet: `import numpy as np

arr = np.array([1, -2, 3, -4])
print(np.where(arr > 0, 1, 0))`,
      options: [
        '[1 0 1 0]',
        '[True False True False]',
        '[ 1 -2  3 -4]',
        '[0 1 0 1]'
      ],
      correctIndex: 0,
      explanation: 'Where `arr > 0` is True (indices 0 and 2), 1 is chosen; where False (indices 1 and 3), 0 is chosen. Result: `[1, 0, 1, 0]`.'
    }
  },

  m2_s6: {
    debuggingQuestion: {
      id: 'debug_m2_s6',
      title: 'Fix Non-Tuple Argument in np.concatenate for Multi-Sensor Fusion',
      scenario: 'To fuse accelerometer data `accel` and gyroscope data `gyro` along columns, an engineer wrote `np.concatenate(accel, gyro, axis=1)`. This throws `TypeError: only integer scalar arrays can be converted to a scalar index` or `TypeError: concatenate() takes at most 2 arguments`.',
      buggyCode: `import numpy as np

# Broken sensor fusion
def fuse_sensor_channels(accel_stream, gyro_stream):
    # accel_stream: shape (N, 3)
    # gyro_stream: shape (N, 3)
    # BUG: np.concatenate expects a single TUPLE or LIST of arrays as its first argument!
    return np.concatenate(accel_stream, gyro_stream, axis=1)

a = np.ones((5, 3))
g = np.zeros((5, 3))
# fused = fuse_sensor_channels(a, g) # Throws TypeError
`,
      hint: '`np.concatenate` requires a sequence (tuple or list) as the first argument: `np.concatenate((accel_stream, gyro_stream), axis=1)`. Notice the extra parentheses around `(accel_stream, gyro_stream)`.',
      testCode: `
a = np.ones((5, 3))
g = np.zeros((5, 3))
res = fuse_sensor_channels(a, g)
assert res.shape == (5, 6), f"Expected shape (5, 6), got {res.shape}"
assert np.all(res[:, :3] == 1) and np.all(res[:, 3:] == 0), "Data channels corrupted"
print("Debug Challenge 2.6 Fixed Successfully! 🎉")
`,
      solutionExplanation: '`np.concatenate((a, b), axis=1)` accepts a tuple of arrays. Forgetting the tuple wrapper is one of the most common errors in data pipelines.'
    },
    outputMCQ: {
      id: 'mcq_m2_s6',
      question: 'Given two 1D arrays `x = np.array([1, 2])` and `y = np.array([3, 4])`, what is `np.stack([x, y], axis=0).shape` versus `np.concatenate([x, y]).shape`?',
      codeSnippet: `import numpy as np

x = np.array([1, 2])
y = np.array([3, 4])
s = np.stack([x, y], axis=0)
c = np.concatenate([x, y])
print(s.shape, c.shape)`,
      options: [
        '(2, 2) (4,)',
        '(4,) (2, 2)',
        '(2, 2) (2, 2)',
        '(4,) (4,)'
      ],
      correctIndex: 0,
      explanation: '`np.stack` creates a brand new axis, stacking two (2,) arrays into `(2, 2)`. `np.concatenate` glues them along the existing axis, producing `(4,)`.'
    }
  },

  m2_s7: {
    debuggingQuestion: {
      id: 'debug_m2_s7',
      title: 'Fix Element-Wise `*` vs Matrix Multiplication `@` in Audio Mixing',
      scenario: 'To mix a 4-channel audio buffer `(100 samples, 4 channels)` down to stereo `(100 samples, 2 channels)` using a `(4, 2)` mixing matrix, a technician wrote `audio * mix_matrix`. This raises `ValueError: operands could not be broadcast together with shapes (100,4) (4,2)`.',
      buggyCode: `import numpy as np

# Broken audio channel mixer
def mix_audio_to_stereo(audio_buffer, mix_weights):
    # audio_buffer: (100, 4)
    # mix_weights: (4, 2)
    # BUG: Used element-wise * instead of matrix dot product @!
    return audio_buffer * mix_weights

audio = np.random.randn(10, 4)
weights = np.array([
    [0.7, 0.0],
    [0.0, 0.7],
    [0.5, 0.5],
    [0.3, 0.3]
])
# stereo = mix_audio_to_stereo(audio, weights) # Throws ValueError
`,
      hint: 'In linear algebra, combining channels is matrix multiplication: `audio_buffer @ mix_weights`. Replace `*` with the `@` operator (or `np.matmul`).',
      testCode: `
audio = np.ones((10, 4))
weights = np.ones((4, 2)) * 0.5
res = mix_audio_to_stereo(audio, weights)
assert res.shape == (10, 2), f"Expected stereo shape (10, 2), got {res.shape}"
assert np.allclose(res, 2.0), f"Expected 4 * 0.5 = 2.0, got {res[0, 0]}"
print("Debug Challenge 2.7 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'In NumPy: `*` is element-wise Hadamard product (requires broadcastable shapes). `@` is true linear algebraic matrix multiplication: $(100, 4) \\times (4, 2) \\rightarrow (100, 2)$.'
    },
    outputMCQ: {
      id: 'mcq_m2_s7',
      question: 'Given matrix $A$ of shape `(3, 5)` and matrix $B$ of shape `(5, 2)`, what is `(A @ B).shape`?',
      codeSnippet: `import numpy as np

A = np.ones((3, 5))
B = np.ones((5, 2))
C = A @ B
print(C.shape)`,
      options: [
        '(3, 2)',
        '(5, 5)',
        '(2, 3)',
        'ValueError'
      ],
      correctIndex: 0,
      explanation: 'Matrix multiplication requires inner dimensions to match $(3, \\mathbf{5}) \\times (\\mathbf{5}, 2)$. The resulting matrix takes outer dimensions $(3, 2)$.'
    }
  },

  m2_s8: {
    debuggingQuestion: {
      id: 'debug_m2_s8',
      title: 'Fix Non-Square Matrix in np.linalg.inv Acoustic Inversion',
      scenario: 'An acoustic calibration system attempts to invert a transfer matrix `H` using `np.linalg.inv(H)`. But `H` has shape `(5, 3)` (more microphones than sources), causing `numpy.linalg.LinAlgError: Last 2 dimensions of the array must be square`.',
      buggyCode: `import numpy as np

# Broken acoustic matrix inversion
def solve_acoustic_system(H, y):
    # H: shape (5, 3) - rectangular!
    # BUG: np.linalg.inv only works on square (N, N) invertible matrices!
    # H_inv = np.linalg.inv(H) # Throws LinAlgError!
    # Goal: Use Moore-Penrose pseudo-inverse or np.linalg.pinv
    return np.linalg.inv(H) @ y

H = np.array([[1.0, 2.0, 0.5], [0.5, 1.0, 1.5], [2.0, 0.0, 1.0], [1.0, 1.0, 1.0], [0.0, 2.0, 1.0]])
y = np.ones(5)
# x = solve_acoustic_system(H, y) # LinAlgError
`,
      hint: 'Rectangular matrices do not have standard inverses. Use the Moore-Penrose pseudo-inverse `np.linalg.pinv(H)` or least-squares solver `np.linalg.lstsq(H, y, rcond=None)[0]`.',
      testCode: `
H = np.array([[1.0, 2.0, 0.5], [0.5, 1.0, 1.5], [2.0, 0.0, 1.0], [1.0, 1.0, 1.0], [0.0, 2.0, 1.0]])
y = np.ones(5)
res = solve_acoustic_system(H, y)
assert res.shape == (3,), f"Expected shape (3,), got {res.shape}"
print("Debug Challenge 2.8 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'For non-square matrices (overdetermined systems), `np.linalg.pinv(H)` computes $(H^T H)^{-1} H^T$, finding the optimal least-squares solution.'
    },
    outputMCQ: {
      id: 'mcq_m2_s8',
      question: 'What is the mathematical property of the matrix returned by `np.eye(3)` in matrix multiplication?',
      codeSnippet: `import numpy as np

A = np.array([[2, 4], [1, 3], [5, 0]])
I = np.eye(3)
print(np.allclose(I @ A, A))`,
      options: [
        'True',
        'False',
        'ValueError',
        'None'
      ],
      correctIndex: 0,
      explanation: '`np.eye(3)` creates the $3 \\times 3$ Identity matrix $I$. Multiplying any compatible matrix by the Identity matrix leaves it unchanged: $I @ A = A$.'
    }
  },

  // =========================================================================
  // TRACK 3: MACHINE LEARNING BASICS (UBER, SPOTIFY, NETFLIX + SCIKIT-LEARN)
  // =========================================================================
  m3_s1: {
    debuggingQuestion: {
      id: 'debug_m3_s1',
      title: 'Fix Target Column Leakage in Feature Matrix Formulation',
      scenario: 'In building the Uber Trip Fare pricing model, an engineer extracted the feature matrix $X$ using `df.to_numpy()`. But they forgot to drop the target column `TripFare`, causing the model to train on its own answers (100% data leakage)!',
      buggyCode: `import numpy as np
import pandas as pd

# Broken feature extractor
def prepare_uber_features(df):
    # df has columns: ['DistanceMiles', 'DurationMins', 'SurgeMultiplier', 'TripFare']
    # BUG: Including TripFare in X means the model memorizes the target!
    X = df.to_numpy()
    y = df['TripFare'].to_numpy()
    return X, y

data = {
    'DistanceMiles': [2.5, 5.0, 1.2],
    'DurationMins': [10.0, 22.0, 6.0],
    'SurgeMultiplier': [1.0, 1.2, 1.0],
    'TripFare': [12.50, 24.00, 8.50]
}
df_trips = pd.DataFrame(data)
X, y = prepare_uber_features(df_trips)
print("X shape:", X.shape) # Has 4 columns instead of 3!
`,
      hint: 'Drop `TripFare` from features using `df.drop(columns=[\'TripFare\']).to_numpy()`, or explicitly select only feature columns: `df[[\'DistanceMiles\', \'DurationMins\', \'SurgeMultiplier\']].to_numpy()`.',
      testCode: `
import pandas as pd
data = {
    'DistanceMiles': [2.5, 5.0],
    'DurationMins': [10.0, 22.0],
    'SurgeMultiplier': [1.0, 1.2],
    'TripFare': [12.50, 24.00]
}
df_trips = pd.DataFrame(data)
X, y = prepare_uber_features(df_trips)
assert X.shape == (2, 3), f"Expected X shape (2, 3), got {X.shape}"
assert y.shape == (2,), f"Expected y shape (2,), got {y.shape}"
print("Debug Challenge 3.1 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'In supervised ML, the feature matrix $X$ must strictly contain explanatory predictors. Including the target $y$ inside $X$ ruins model generalizability.'
    },
    outputMCQ: {
      id: 'mcq_m3_s1',
      question: 'Which of the following problems is a Regression task rather than a Classification task?',
      codeSnippet: `# Scenarios:
# 1. Netflix: Will user cancel subscription this month? (Yes / No)
# 2. Spotify: Will user skip this song within 30s? (Yes / No)
# 3. Uber: Predicting continuous trip fare in dollars ($18.45)
# 4. Email: Is this incoming email spam or ham?`,
      options: [
        'Uber: Predicting continuous trip fare in dollars',
        'Netflix: Predicting user subscription churn',
        'Spotify: Predicting skip vs keep playing',
        'Email: Spam vs Ham filtering'
      ],
      correctIndex: 0,
      explanation: 'Regression predicts continuous numerical quantities (e.g. dollars, temperature, duration). Classification predicts discrete categorical labels (e.g. Yes/No, Churn/Stay).'
    }
  },

  m3_s2: {
    debuggingQuestion: {
      id: 'debug_m3_s2',
      title: 'Fix String Columns Causing object Dtype in Pandas to NumPy Bridge',
      scenario: 'When converting a Netflix viewing DataFrame into a NumPy array for ML, non-numeric string columns (`UserCountry`, `DeviceType`) were included. This forced the entire NumPy array into `dtype=object`, which breaks mathematical operations like `X.mean()` or `X @ w`!',
      buggyCode: `import numpy as np
import pandas as pd

# Broken feature matrix conversion
def extract_numeric_features(df):
    # df contains numeric columns and string columns
    # BUG: df.to_numpy() turns everything into object dtype!
    return df.to_numpy()

df = pd.DataFrame({
    'HoursWatched': [12.5, 3.0, 45.2],
    'DaysActive': [5, 1, 28],
    'UserCountry': ['US', 'IN', 'UK'] # String column!
})
X = extract_numeric_features(df)
print("Extracted dtype:", X.dtype) # dtype('O') - Object!
`,
      hint: 'Select only numeric columns before calling `.to_numpy()`: `df.select_dtypes(include=[np.number]).to_numpy(dtype=np.float64)`.',
      testCode: `
import pandas as pd
df = pd.DataFrame({
    'HoursWatched': [12.5, 3.0],
    'DaysActive': [5, 1],
    'UserCountry': ['US', 'IN']
})
res = extract_numeric_features(df)
assert res.shape == (2, 2), f"Expected shape (2, 2) without country, got {res.shape}"
assert res.dtype == np.float64 or res.dtype == np.float32, f"Expected float dtype, got {res.dtype}"
print("Debug Challenge 3.2 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Machine learning algorithms require clean numeric matrices of `float64` or `float32`. Using `df.select_dtypes(include=[np.number])` filters out non-numeric object types.'
    },
    outputMCQ: {
      id: 'mcq_m3_s2',
      question: 'What happens when a DataFrame containing both floats and strings is converted via `df.to_numpy()`?',
      codeSnippet: `import pandas as pd

df = pd.DataFrame({'val': [1.5, 2.0], 'label': ['A', 'B']})
arr = df.to_numpy()
print(arr.dtype)`,
      options: [
        'object',
        'float64',
        'string',
        'ValueError'
      ],
      correctIndex: 0,
      explanation: 'NumPy requires all elements in an array to share a homogeneous type. When mixing strings and floats, NumPy defaults to `object` pointers, disabling vector acceleration.'
    }
  },

  m3_s3: {
    debuggingQuestion: {
      id: 'debug_m3_s3',
      title: 'Fix NaN Equality Comparison Bug (`== np.nan`) in GPS Imputation',
      scenario: 'An IoT engineer attempted to find and impute missing GPS coordinates using `if val == np.nan:`. But according to the IEEE 754 floating point standard, `np.nan == np.nan` evaluates to `False`! The imputation loop never replaced any NaNs!',
      buggyCode: `import numpy as np

# Broken NaN imputation
def impute_missing_gps(sensor_readings, fill_value=0.0):
    # BUG: sensor_readings == np.nan ALWAYS returns all False!
    # NaNs can never be compared with == !
    cleaned = sensor_readings.copy()
    cleaned[cleaned == np.nan] = fill_value
    return cleaned

gps_data = np.array([12.5, np.nan, 14.2, np.nan, 18.0])
fixed = impute_missing_gps(gps_data, fill_value=0.0)
print("Still has NaNs?", np.isnan(fixed).any()) # Prints True!
`,
      hint: 'In NumPy and Python, never compare with `== np.nan`. Use the universal boolean mask function `np.isnan(sensor_readings)`: `cleaned[np.isnan(cleaned)] = fill_value`.',
      testCode: `
gps_data = np.array([12.5, np.nan, 14.2, np.nan, 18.0])
res = impute_missing_gps(gps_data, fill_value=99.0)
assert not np.isnan(res).any(), "Result still contains NaNs!"
assert res[1] == 99.0 and res[3] == 99.0, "NaNs were not replaced with fill_value"
print("Debug Challenge 3.3 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Under IEEE 754 float specifications, NaN is not equal to anything, including itself (`np.nan == np.nan` is `False`). You must always use `np.isnan(x)`.'
    },
    outputMCQ: {
      id: 'mcq_m3_s3',
      question: 'What is the boolean result of `np.nan == np.nan` versus `np.isnan(np.nan)`?',
      codeSnippet: `import numpy as np

print(np.nan == np.nan, np.isnan(np.nan))`,
      options: [
        'False True',
        'True True',
        'False False',
        'True False'
      ],
      correctIndex: 0,
      explanation: 'By definition in IEEE 754 standard, `NaN != NaN` is always True, so `np.nan == np.nan` evaluates to `False`. The dedicated function `np.isnan(...)` must be used to test for missing values.'
    }
  },

  m3_s4: {
    debuggingQuestion: {
      id: 'debug_m3_s4',
      title: 'Fix Train-Test Unpacking Order Bug with Scikit-Learn',
      scenario: 'An analyst called `train_test_split(X, y)` from `sklearn.model_selection`, but unpacked the returned tuple into `(X_train, y_train, X_test, y_test)` instead of `(X_train, X_test, y_train, y_test)`, causing a catastrophic shape mismatch during model training!',
      buggyCode: `import numpy as np
from sklearn.model_selection import train_test_split

# Broken train-test split unpacking
def partition_dataset(X, y, test_size=0.2):
    # BUG: train_test_split returns (X_train, X_test, y_train, y_test)!
    # Unpacking into (X_train, y_train, X_test, y_test) swaps X_test and y_train!
    X_train, y_train, X_test, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
    return X_train, X_test, y_train, y_test

X = np.arange(40).reshape(20, 2)
y = np.arange(20)
# X_tr, X_te, y_tr, y_te = partition_dataset(X, y)
`,
      hint: 'The correct return signature of `sklearn.model_selection.train_test_split(X, y)` is `X_train, X_test, y_train, y_test`. Correct the variable ordering.',
      testCode: `
from sklearn.model_selection import train_test_split
X = np.arange(40).reshape(20, 2)
y = np.arange(20)
X_tr, X_te, y_tr, y_te = partition_dataset(X, y, test_size=0.25)
assert X_tr.shape == (15, 2), f"Expected X_tr shape (15, 2), got {X_tr.shape}"
assert X_te.shape == (5, 2), f"Expected X_te shape (5, 2), got {X_te.shape}"
assert y_tr.shape == (15,), f"Expected y_tr shape (15,), got {y_tr.shape}"
assert y_te.shape == (5,), f"Expected y_te shape (5,), got {y_te.shape}"
print("Debug Challenge 3.4 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Scikit-learn always returns splits in alternating train-then-test pairs for each input: `X_train, X_test, y_train, y_test`.'
    },
    outputMCQ: {
      id: 'mcq_m3_s4',
      question: 'When running `train_test_split(X, y, test_size=0.2)` on 100 samples, what are the lengths of `X_train` and `X_test`?',
      codeSnippet: `from sklearn.model_selection import train_test_split
import numpy as np

X = np.zeros((100, 3))
y = np.zeros(100)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(len(X_train), len(X_test))`,
      options: [
        '80 20',
        '20 80',
        '50 50',
        '80 80'
      ],
      correctIndex: 0,
      explanation: '`test_size=0.2` reserves 20% of the 100 samples for evaluation (20 samples), leaving 80% for training (80 samples).'
    }
  },

  m3_s5: {
    debuggingQuestion: {
      id: 'debug_m3_s5',
      title: 'Fix 1D Feature Vector Error in Scikit-Learn LinearRegression',
      scenario: 'When fitting a simple linear regression model for Uber pricing using `sklearn.linear_model.LinearRegression()`, the engineer passed a 1D NumPy array `distance_miles`. Scikit-Learn raised `ValueError: Expected 2D array, got 1D array instead: array=[ 2.5  5.   7.2]`. Fix it using `.reshape(-1, 1)`.',
      buggyCode: `import numpy as np
from sklearn.linear_model import LinearRegression

# Broken model training function
def train_simple_uber_model(distances, fares):
    # distances is a 1D array of shape (N,)
    # fares is a 1D array of shape (N,)
    # BUG: Scikit-learn feature matrix X MUST be a 2D array of shape (N, num_features)!
    model = LinearRegression()
    model.fit(distances, fares) # Throws ValueError: Expected 2D array!
    return model

dist = np.array([2.5, 5.0, 7.2, 10.0])
fares = np.array([12.0, 22.5, 31.0, 42.0])
# model = train_simple_uber_model(dist, fares)
`,
      hint: 'In Scikit-learn, $X$ must always be a 2D matrix. Use `distances.reshape(-1, 1)` before calling `model.fit(X, fares)`.',
      testCode: `
from sklearn.linear_model import LinearRegression
dist = np.array([2.0, 4.0, 6.0, 8.0])
fares = np.array([10.0, 18.0, 26.0, 34.0])
model = train_simple_uber_model(dist, fares)
assert isinstance(model, LinearRegression), "Must return a trained LinearRegression instance"
pred = model.predict([[5.0]])
assert np.isclose(pred[0], 22.0), f"Expected predicted fare 22.0, got {pred[0]}"
print("Debug Challenge 3.5 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Scikit-learn expects feature matrix $X$ to have shape `(n_samples, n_features)`. Even for a single feature, it must be 2D `(n_samples, 1)`.'
    },
    outputMCQ: {
      id: 'mcq_m3_s5',
      question: 'Given a trained Scikit-learn model with `model.coef_ = np.array([2.5])` and `model.intercept_ = 3.0`, what is the predicted fare for a 4.0 mile trip?',
      codeSnippet: `# Equation: y_pred = coef_ * distance + intercept_
# coef_ = 2.5
# intercept_ = 3.0
# distance = 4.0`,
      options: [
        '13.0',
        '10.0',
        '15.5',
        '7.0'
      ],
      correctIndex: 0,
      explanation: 'Linear regression computes $\\hat{y} = w \\times x + b$. Here: $2.5 \\times 4.0 + 3.0 = 10.0 + 3.0 = 13.0$.'
    }
  },

  m3_s6: {
    debuggingQuestion: {
      id: 'debug_m3_s6',
      title: 'Fix Exploding Gradient Bug in Custom Optimization Loop',
      scenario: 'In writing a custom gradient descent optimizer for Uber fare prediction, an engineer added the gradient instead of subtracting it: `weights = weights + learning_rate * grad`. Instead of minimizing loss, the error exploded to infinity (`nan` / `inf`)!',
      buggyCode: `import numpy as np

# Broken gradient descent step
def gradient_descent_step(X, y, weights, bias, lr=0.01):
    N = len(y)
    y_hat = X @ weights + bias
    error = y_hat - y
    
    dw = (2 / N) * (X.T @ error)
    db = (2 / N) * np.sum(error)
    
    # BUG: Adding gradients increases loss! We must SUBTRACT the gradient!
    new_weights = weights + lr * dw
    new_bias = bias + lr * db
    return new_weights, new_bias

X = np.array([[2.0], [4.0]])
y = np.array([10.0, 20.0])
w, b = gradient_descent_step(X, y, np.array([1.0]), 0.0)
print("Updated weight:", w)
`,
      hint: 'Gradient descent minimizes cost by moving in the opposite direction of the gradient. Change `+` to `-`: `new_weights = weights - lr * dw` and `new_bias = bias - lr * db`.',
      testCode: `
X = np.array([[2.0], [4.0]])
y = np.array([10.0, 20.0])
w, b = gradient_descent_step(X, y, np.array([1.0]), 0.0, lr=0.05)
# Initial error was negative (y_hat < y), so gradient was negative. Subtracting negative gradient must INCREASE weight towards 5.0!
assert w[0] > 1.0, f"Weight should move closer to true value 5.0, got {w[0]}"
print("Debug Challenge 3.6 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Gradients point in the direction of steepest ascent (increasing loss). Gradient Descent moves downhill by subtracting: $w \\leftarrow w - \\alpha \\nabla J$.'
    },
    outputMCQ: {
      id: 'mcq_m3_s6',
      question: 'Given actual targets `y = [10, 20]` and model predictions `y_hat = [12, 19]`, what is the Mean Squared Error (MSE)?',
      codeSnippet: `from sklearn.metrics import mean_squared_error
import numpy as np

y_true = np.array([10, 20])
y_pred = np.array([12, 19])
mse = mean_squared_error(y_true, y_pred)
print(mse)`,
      options: [
        '2.5',
        '5.0',
        '1.0',
        '3.0'
      ],
      correctIndex: 0,
      explanation: 'Errors: $(12 - 10)^2 = 4$ and $(19 - 20)^2 = 1$. The sum is $4 + 1 = 5$. The mean over 2 samples is $5 / 2 = 2.5$.'
    }
  },

  m3_s7: {
    debuggingQuestion: {
      id: 'debug_m3_s7',
      title: 'Fix Sigmoid Overflow and Missing Probabilities in Logistic Regression',
      scenario: 'A developer implementing Spotify song skip prediction called `1 / (1 + np.exp(-z))`. For large negative scores ($z = -1000$), `np.exp(1000)` threw `RuntimeWarning: overflow encountered in exp`. Also, when calling Scikit-learn, they used `.predict()` instead of `.predict_proba()` to get continuous skip probabilities.',
      buggyCode: `import numpy as np
from sklearn.linear_model import LogisticRegression

# Broken probability calculation
def compute_spotify_skip_probability(model, song_features):
    # song_features: 2D array of shape (N, D)
    # BUG: model.predict() only returns discrete 0 or 1, not probabilities!
    # Goal: Return the continuous probability of skipping (class 1)
    return model.predict(song_features)

X_train = np.array([[120, 0.2], [80, 0.8], [140, 0.1], [70, 0.9]])
y_train = np.array([0, 1, 0, 1]) # 1 = Skip, 0 = Listen
clf = LogisticRegression().fit(X_train, y_train)

skip_prob = compute_spotify_skip_probability(clf, np.array([[75, 0.85]]))
print("Returned:", skip_prob) # Currently returns array([1]) instead of probability e.g. 0.88!
`,
      hint: 'In Scikit-learn `LogisticRegression`, call `model.predict_proba(song_features)[:, 1]` to retrieve the predicted probability for class 1 (Skip).',
      testCode: `
from sklearn.linear_model import LogisticRegression
X_train = np.array([[120, 0.2], [80, 0.8], [140, 0.1], [70, 0.9]])
y_train = np.array([0, 1, 0, 1])
clf = LogisticRegression().fit(X_train, y_train)
prob = compute_spotify_skip_probability(clf, np.array([[75, 0.85]]))
assert 0.0 <= prob[0] <= 1.0, f"Must return probability between 0 and 1, got {prob[0]}"
print("Debug Challenge 3.7 Fixed Successfully! 🎉")
`,
      solutionExplanation: '`model.predict()` applies the 0.5 threshold to return binary classes (0 or 1). `model.predict_proba()` returns the raw probabilities `[P(y=0), P(y=1)]`.'
    },
    outputMCQ: {
      id: 'mcq_m3_s7',
      question: 'What is the output of the Sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ when input logit $z = 0$?',
      codeSnippet: `import numpy as np

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

print(sigmoid(0))`,
      options: [
        '0.5',
        '0.0',
        '1.0',
        '-1.0'
      ],
      correctIndex: 0,
      explanation: 'Since $e^{-0} = 1$, we get $\\sigma(0) = \\frac{1}{1 + 1} = 0.5$. This is the neutral midpoint decision boundary in Logistic Regression.'
    }
  },

  m3_s8: {
    debuggingQuestion: {
      id: 'debug_m3_s8',
      title: 'Fix Inverted Arguments in Scikit-Learn confusion_matrix',
      scenario: 'To evaluate a Netflix subscription churn model, an engineer called `confusion_matrix(y_pred, y_true)`. But Scikit-Learn expects `confusion_matrix(y_true, y_pred)`! This swapped the False Positives and False Negatives, giving completely misleading precision and recall metrics.',
      buggyCode: `import numpy as np
from sklearn.metrics import confusion_matrix, precision_score

# Broken evaluation metric function
def evaluate_netflix_churn(y_actual, y_predicted):
    # BUG: Scikit-learn confusion_matrix signature is strictly (y_true, y_pred)!
    # Passing (y_predicted, y_actual) inverts the confusion matrix axes!
    cm = confusion_matrix(y_predicted, y_actual)
    return cm

actual = np.array([0, 0, 0, 1, 1])
pred   = np.array([0, 0, 1, 1, 1])
cm = evaluate_netflix_churn(actual, pred)
print("Confusion Matrix:\\n", cm)
`,
      hint: 'In Scikit-learn metrics (`confusion_matrix`, `precision_score`, `recall_score`), the first argument is ALWAYS ground truth `y_true`, and the second argument is `y_pred`. Change to `confusion_matrix(y_actual, y_predicted)`.',
      testCode: `
from sklearn.metrics import confusion_matrix
actual = np.array([0, 0, 0, 1, 1])
pred   = np.array([0, 0, 1, 1, 1])
cm = evaluate_netflix_churn(actual, pred)
# With y_true=[0,0,0,1,1] and y_pred=[0,0,1,1,1]:
# TN=2, FP=1, FN=0, TP=2
assert cm[0, 0] == 2 and cm[0, 1] == 1, f"Expected TN=2, FP=1, got {cm[0]}"
assert cm[1, 0] == 0 and cm[1, 1] == 2, f"Expected FN=0, TP=2, got {cm[1]}"
print("Debug Challenge 3.8 Fixed Successfully! 🎉")
`,
      solutionExplanation: 'Scikit-learn standard: `confusion_matrix(y_true, y_pred)` has rows representing actual classes and columns representing predicted classes: `[[TN, FP], [FN, TP]]`.'
    },
    outputMCQ: {
      id: 'mcq_m3_s8',
      question: 'A Netflix churn model has True Positives (TP) = 80, False Positives (FP) = 20, False Negatives (FN) = 0, and True Negatives (TN) = 900. What is the Precision?',
      codeSnippet: `# Precision Formula: TP / (TP + FP)
# TP = 80 (Actual churners caught)
# FP = 20 (Active users falsely flagged)
# FN = 0
# TN = 900`,
      options: [
        '0.80 (80%)',
        '1.00 (100%)',
        '0.98 (98%)',
        '0.20 (20%)'
      ],
      correctIndex: 0,
      explanation: 'Precision measures prediction reliability: $\\text{Precision} = \\frac{TP}{TP + FP} = \\frac{80}{80 + 20} = \\frac{80}{100} = 0.80$ (80%). Recall would be $\\frac{80}{80 + 0} = 1.0$ (100%).'
    }
  }
};
