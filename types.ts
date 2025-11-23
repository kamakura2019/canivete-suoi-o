export enum ToolType {
  GENERATOR = 'GENERATOR',
  REFINER = 'REFINER',
  PERSONA = 'PERSONA',
  ANALYZER = 'ANALYZER',
  IMAGE_EDITOR = 'IMAGE_EDITOR'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemContext: string;
}

export interface GeneratedResult {
  content: string;
  type: 'text' | 'image';
  metadata?: {
    tokens?: number;
    model?: string;
  };
}

export interface PromptRequestPayload {
  input: string;
  category: Category;
  toolType: ToolType;
  image?: string; // base64 string
  complexity?: 'simple' | 'medium' | 'advanced';
}