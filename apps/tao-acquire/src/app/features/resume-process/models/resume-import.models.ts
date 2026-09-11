/**
 * Resume import constraints as defined by the campaign API.
 */
export const RESUME_IMPORT_FORM_FIELD = 'Resumes';

export const RESUME_IMPORT_ALLOWED_EXTENSIONS = ['.pdf', '.docx'] as const;

/** 10 MB per file. */
export const RESUME_IMPORT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Minimum and maximum number of files per request. */
export const RESUME_IMPORT_MIN_FILES = 1;
export const RESUME_IMPORT_MAX_FILES = 100;
