export type UniversityStatus = 'active' | 'coming_soon';

export interface University {
  id: string;
  name: string;
  fullName: string;
  shortDesc: string;
  badge: string;
  logoAccent: string; // Tailwind gradient/color class
  status: UniversityStatus;
  totalQuestions: number;
  timeLimitMinutes: number;
  negativeMarking: boolean;
  subjects: {
    name: string;
    mcqCount: number;
    color: string;
  }[];
  passingCriteria?: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQ {
  id: string;
  universityId: string;
  subject: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserStats {
  totalAttempted: number;
  correctAnswers: number;
  mockTestsTaken: number;
  avgAccuracy: number;
  streakDays: number;
  subjectAccuracy: Record<string, number>;
}
