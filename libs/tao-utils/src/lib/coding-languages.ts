export type CodingLanguage =
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'java'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'sql'
  | 'html'
  | 'css'
  | 'json'
  | 'shell'
  | 'yaml';

export interface CodingLanguageConfig {
  id: CodingLanguage;
  monacoId: string;
  label: string;
  fileName: string;
  icon: string;
}

export const CODING_LANGUAGE_CONFIGS: Record<CodingLanguage, CodingLanguageConfig> = {
  c: { id: 'c', monacoId: 'c', label: 'C', fileName: 'solution.c', icon: 'C' },
  cpp: { id: 'cpp', monacoId: 'cpp', label: 'C++', fileName: 'solution.cpp', icon: 'C++' },
  csharp: {
    id: 'csharp',
    monacoId: 'csharp',
    label: 'C#',
    fileName: 'Solution.cs',
    icon: 'C#',
  },
  java: { id: 'java', monacoId: 'java', label: 'Java', fileName: 'Solution.java', icon: 'Java' },
  python: {
    id: 'python',
    monacoId: 'python',
    label: 'Python',
    fileName: 'solution.py',
    icon: 'Py',
  },
  javascript: {
    id: 'javascript',
    monacoId: 'javascript',
    label: 'JavaScript',
    fileName: 'solution.js',
    icon: 'JS',
  },
  typescript: {
    id: 'typescript',
    monacoId: 'typescript',
    label: 'TypeScript',
    fileName: 'solution.ts',
    icon: 'TS',
  },
  go: { id: 'go', monacoId: 'go', label: 'Go', fileName: 'solution.go', icon: 'Go' },
  rust: { id: 'rust', monacoId: 'rust', label: 'Rust', fileName: 'main.rs', icon: 'Rs' },
  php: { id: 'php', monacoId: 'php', label: 'PHP', fileName: 'solution.php', icon: 'PHP' },
  ruby: { id: 'ruby', monacoId: 'ruby', label: 'Ruby', fileName: 'solution.rb', icon: 'Rb' },
  swift: { id: 'swift', monacoId: 'swift', label: 'Swift', fileName: 'solution.swift', icon: 'Sw' },
  kotlin: {
    id: 'kotlin',
    monacoId: 'kotlin',
    label: 'Kotlin',
    fileName: 'Solution.kt',
    icon: 'Kt',
  },
  sql: { id: 'sql', monacoId: 'sql', label: 'SQL', fileName: 'solution.sql', icon: 'SQL' },
  html: { id: 'html', monacoId: 'html', label: 'HTML', fileName: 'index.html', icon: 'HTML' },
  css: { id: 'css', monacoId: 'css', label: 'CSS', fileName: 'styles.css', icon: 'CSS' },
  json: { id: 'json', monacoId: 'json', label: 'JSON', fileName: 'solution.json', icon: 'JSN' },
  shell: { id: 'shell', monacoId: 'shell', label: 'Shell', fileName: 'solution.sh', icon: 'Sh' },
  yaml: { id: 'yaml', monacoId: 'yaml', label: 'YAML', fileName: 'solution.yaml', icon: 'YML' },
};

export function getCodingLanguageConfig(language: string): CodingLanguageConfig | undefined {
  return Object.prototype.hasOwnProperty.call(CODING_LANGUAGE_CONFIGS, language)
    ? CODING_LANGUAGE_CONFIGS[language as CodingLanguage]
    : undefined;
}
