
export interface CodeSnippet {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export enum TabType {
  ARCHITECTURE = 'architecture',
  CODE = 'code',
  SIMULATOR = 'simulator',
  AI_EXPLAINER = 'ai_explainer'
}
