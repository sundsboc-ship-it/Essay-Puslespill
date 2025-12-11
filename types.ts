export enum BlockType {
  INTRODUCTION = 'INTRODUCTION',
  CLAIM = 'CLAIM', // Rødt
  EVIDENCE = 'EVIDENCE', // Blått
  REFLECTION = 'REFLECTION', // Grønt
  CONCLUSION = 'CONCLUSION'
}

export enum SentenceType {
  CLAIM = 'CLAIM',
  EVIDENCE = 'EVIDENCE',
  REFLECTION = 'REFLECTION',
  NEUTRAL = 'NEUTRAL'
}

export interface EssayBlock {
  id: string;
  type: BlockType;
  title: string;
  content: string;
  order: number;
}

export interface AnalyzedSentence {
  text: string;
  type: SentenceType;
  suggestion?: string;
}

export interface AnalysisResult {
  sentences: AnalyzedSentence[];
  feedback: string;
  balanceScore: {
    claim: number;
    evidence: number;
    reflection: number;
  };
}