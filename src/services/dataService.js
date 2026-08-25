/**
 * Data Service & Default Dataset Loader
 * Provides synthetic dataset, CSV parsing, and validation.
 */

export const REQUIRED_COLUMNS = ['Student_ID', 'Gender', 'Department', 'Attendance', 'Study_Hours', 'Marks'];

export const generateDefaultDataset = () => {
  const departments = ['Computer Science', 'Data Science', 'Electrical', 'Mechanical'];
  const genders = ['Male', 'Female'];
  const dataset = [];

  for (let i = 1; i <= 200; i++) {
    const id = `S10${i < 10 ? '0' + i : i}`;
    const gender = genders[(i + (i % 2)) % 2];
    const dept = departments[(i + (i % 4)) % 4];
    
    let attendance = +(60 + (i * 0.19) % 38).toFixed(1);
    let studyHours = +(2 + (i * 0.04) % 8).toFixed(1);
    let marks = +(45 + (i * 0.27) % 54).toFixed(1);

    // Inject intentional anomalies for cleaning demo
    if (i === 15) attendance = null;
    if (i === 32) studyHours = null;
    if (i === 48) marks = null;
    if (i === 77) studyHours = -4.5;
    if (i === 91) marks = -55.0;

    dataset.push({
      Student_ID: id,
      Gender: gender,
      Department: dept,
      Attendance: attendance,
      Study_Hours: studyHours,
      Marks: marks
    });
  }

  // Inject 3 duplicate rows
  dataset.push({ ...dataset[4] });
  dataset.push({ ...dataset[18] });
  dataset.push({ ...dataset[35] });

  return dataset;
};

export const validateColumns = (dataset) => {
  if (!dataset || dataset.length === 0) return { isValid: false, missing: REQUIRED_COLUMNS };
  const firstRow = dataset[0];
  const keys = Object.keys(firstRow);
  const missing = REQUIRED_COLUMNS.filter(col => !keys.includes(col));
  return {
    isValid: missing.length === 0,
    missing
  };
};

export const parseCSVText = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const rowObj = {};

    headers.forEach((h, idx) => {
      let val = values[idx];
      if (val === '' || val === undefined || val === 'NaN' || val === 'null') {
        val = null;
      } else if (!isNaN(val)) {
        val = parseFloat(val);
      }
      rowObj[h] = val;
    });

    rows.push(rowObj);
  }

  return rows;
};
