export type CandidateRole = 'Frontend Developer' | 'Backend Developer' | 'DevOps Engineer' | 'QA Engineer' | 'Product Designer' | 'Data Engineer' | 'Solutions Architect' | 'Engineering Manager' | 'Mobile Developer' | 'Platform Engineer' | 'Security Engineer' | 'QA Automation' | 'ML Engineer' | 'Tech Lead' | 'Product Engineer' | 'Principal Engineer' | 'Developer Advocate' | 'Research Engineer'

export interface Candidate {
  id: string
  name: string
  role: CandidateRole
  initials: string
  accent: string
  skills: string[]
  answers: number
  summary?: string
  experience?: string
  availability?: string
  portraitIndex?: number
}

export interface AnswerOption {
  id: string
  candidateId: string
  text: string
  correct: boolean
}

export type ContentSource = 'integration' | 'mock'

export interface AnswerEvaluation {
  correct: boolean
  score: number
  explanation: string
  feedback: string
  source: ContentSource
}

export interface InterviewResult {
  totalScore: number
  level: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  summary: string
  source: ContentSource
}

export interface Question {
  id: number
  title: string
  category: string
  timeLimit: number
  answers: AnswerOption[]
  correctAnswer?: string
  explanation?: string
  source?: ContentSource
}

export interface GameResult {
  correct: number
  total: number
  score: number
  bestStreak: number
}
