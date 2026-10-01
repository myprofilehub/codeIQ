// Pre-loaded realistic sample datasets for hands-on NumPy and ML preprocessing
export const SAMPLE_DATASETS = [
  {
    id: 'employee_salary_raw',
    name: 'employee_salary_raw.csv',
    filename: 'employee_salary_raw.csv',
    description: 'Real-world HR dataset with unscaled features, outliers, and missing values (NaN) to practice imputation and normalization.',
    recommendedFor: 'Preprocessing & Linear Regression',
    columns: ['EmployeeID', 'YearsExperience', 'Age', 'DepartmentCode', 'CurrentSalary'],
    csvContent: `EmployeeID,YearsExperience,Age,DepartmentCode,CurrentSalary
101,1.1,23.0,1,39343
102,1.3,25.0,2,46205
103,1.5,NaN,1,37731
104,2.0,26.0,3,43525
105,2.2,28.0,2,39891
106,2.9,29.0,1,56642
107,3.0,NaN,3,60150
108,3.2,31.0,2,54445
109,3.2,32.0,1,64445
110,3.7,33.0,1,57189
111,3.9,34.0,2,63218
112,4.0,35.0,3,55794
113,4.0,36.0,1,56957
114,4.1,NaN,2,57081
115,4.5,38.0,3,61111
116,4.9,39.0,1,67938
117,5.1,40.0,2,66029
118,5.3,41.0,3,83088
119,5.9,42.0,1,81363
120,6.0,43.0,2,93940
121,6.8,44.0,3,91738
122,7.1,45.0,1,98273
123,7.9,46.0,2,101302
124,8.2,47.0,3,113812
125,8.7,48.0,1,109431
126,9.0,49.0,2,105582
127,9.5,51.0,3,116969
128,9.6,52.0,1,112635
129,10.3,54.0,2,122391
130,10.5,55.0,3,121872`,
    diagnostics: {
      totalRows: 30,
      totalColumns: 5,
      missingValues: { Age: 3 },
      scaleDisparities: 'YearsExperience (1.1 - 10.5) vs CurrentSalary (37,731 - 122,391) -> Ratio ~1:10,000. Needs Z-Score or Min-Max scaling.',
      categoricalCols: ['DepartmentCode'],
      targetCol: 'CurrentSalary'
    }
  },
  {
    id: 'customer_churn_raw',
    name: 'customer_churn_raw.csv',
    filename: 'customer_churn_raw.csv',
    description: 'Subscription usage data for logistic regression and classification evaluation metrics.',
    recommendedFor: 'Classification & Evaluation Metrics',
    columns: ['CustomerID', 'TenureMonths', 'MonthlySpend', 'SupportTickets', 'ContractPeriod', 'Churned'],
    csvContent: `CustomerID,TenureMonths,MonthlySpend,SupportTickets,ContractPeriod,Churned
201,1,29.85,3,1,1
202,34,56.95,0,12,0
203,2,53.85,4,1,1
204,45,42.30,1,24,0
205,8,70.70,5,1,1
206,22,89.10,2,12,0
207,10,29.75,2,1,1
208,28,104.80,1,12,0
209,62,56.15,0,24,0
210,13,55.20,3,1,1
211,16,85.50,4,1,1
212,58,90.25,0,24,0
213,49,100.35,1,24,0
214,25,20.20,0,12,0
215,69,113.25,0,24,0
216,3,75.30,5,1,1
217,52,60.65,1,24,0
218,4,45.20,3,1,1
219,30,80.85,1,12,0
220,12,95.40,4,1,1
221,60,25.10,0,24,0
222,7,78.90,3,1,1
223,38,65.40,1,12,0
224,2,30.50,4,1,1
225,44,72.10,0,24,0`,
    diagnostics: {
      totalRows: 25,
      totalColumns: 6,
      missingValues: {},
      scaleDisparities: 'TenureMonths (1 - 69) vs MonthlySpend (20.2 - 113.25).',
      categoricalCols: ['ContractPeriod'],
      targetCol: 'Churned (Binary: 0 = Retained, 1 = Churned)'
    }
  },
  {
    id: 'sensor_matrix_data',
    name: 'sensor_matrix_data.csv',
    filename: 'sensor_matrix_data.csv',
    description: 'Multi-channel industrial thermal and pressure sensor telemetry for practicing 2D NumPy slicing, boolean masking, and axis aggregations.',
    recommendedFor: 'NumPy 2D Array & Vectorized Math',
    columns: ['TimestampSec', 'Sensor_Alpha', 'Sensor_Beta', 'Sensor_Gamma', 'Sensor_Delta'],
    csvContent: `TimestampSec,Sensor_Alpha,Sensor_Beta,Sensor_Gamma,Sensor_Delta
0,24.5,101.3,45.2,12.1
10,24.8,101.4,45.9,12.0
20,25.1,102.0,46.5,12.3
30,26.4,103.1,48.2,12.8
40,28.9,105.4,52.1,14.5
50,31.2,108.2,58.4,16.2
60,32.0,109.5,60.1,17.0
70,30.5,107.8,57.2,15.8
80,28.1,104.9,51.0,14.1
90,26.0,102.8,47.8,13.0
100,25.0,101.5,46.0,12.2`,
    diagnostics: {
      totalRows: 11,
      totalColumns: 5,
      missingValues: {},
      scaleDisparities: 'Sensors across different calibrated units.',
      categoricalCols: [],
      targetCol: 'None (Unsupervised telemetry)'
    }
  }
];
