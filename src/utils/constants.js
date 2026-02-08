// Google Sheets configuration
export const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
export const DRIVE_FOLDER_ID = process.env.REACT_APP_DRIVE_FOLDER_ID;

// Google Sheets ranges
export const SHEETS = {
  PETS: 'Pets',
  MEDICAL_HISTORY: 'MedicalHistory',
  VETS: 'Vets'
};

// Google API Scopes
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

// Pet species options
export const SPECIES = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'];

// Pet sex options
export const SEX_OPTIONS = ['Macho', 'Hembra'];

// Date format
export const DATE_FORMAT = 'YYYY-MM-DD';
