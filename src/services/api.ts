import axios from 'axios'
import { candidates as mockCandidates, questions as mockQuestions } from '@/data/mock'
import type { AnswerEvaluation, Candidate, InterviewResult, Question } from '@/types/game'

interface GenerateQuestionRequest {
  technology: string
  level: string
  difficulty: number
  previousQuestions: string[]
  candidates: Array<{
    id: string
    name: string
    level: string
    personality: string
  }>
}

interface GeneratedQuestionResponse {
  question: string
  correctAnswer: string
  answers: Array<{
    candidateId: string
    answer: string
    correct: boolean
    reaction: string
  }>
  explanation: string
  difficulty: number
}

interface InterviewAnswerDto {
  question: string
  answer: string
  correct: boolean
}

interface InterviewResultRequest {
  interviewId: number
  position: string
  declaredLevel: string
  answers: InterviewAnswerDto[]
}

interface InterviewResultResponse {
  totalScore: number
  level: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  summary: string
}

interface PrepareQuestionInput {
  fallback: Question
  candidates: Candidate[]
  previousQuestions: string[]
  level?: string
  difficulty?: number
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api'
const aiBaseUrl = (import.meta.env.VITE_AI_API_BASE_URL as string | undefined) || apiBaseUrl
const apiTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || 3500)
const aiTimeout = Number(import.meta.env.VITE_AI_TIMEOUT_MS || 20000)
const http = axios.create({ baseURL: apiBaseUrl, timeout: apiTimeout })
const aiHttp = axios.create({ baseURL: aiBaseUrl, timeout: aiTimeout })

const wait = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))
const clone = <T>(value: T): T => structuredClone(value)

function fallbackNotice(operation: string, error: unknown) {
  if (!import.meta.env.DEV) return
  const detail = axios.isAxiosError(error) ? `${error.code || error.response?.status || 'request failed'}` : error instanceof Error ? error.message : 'invalid response'
  console.info(`[integration fallback] ${operation}: ${detail}`)
}

function isCandidateList(value: unknown): value is Candidate[] {
  return Array.isArray(value) && value.length > 0 && value.every(candidate => {
    if (!candidate || typeof candidate !== 'object') return false
    const item = candidate as Partial<Candidate>
    return typeof item.id === 'string'
      && typeof item.name === 'string'
      && typeof item.role === 'string'
      && typeof item.initials === 'string'
      && typeof item.accent === 'string'
      && Array.isArray(item.skills)
  })
}

function isQuestionList(value: unknown): value is Question[] {
  return Array.isArray(value) && value.length > 0 && value.every(question => {
    if (!question || typeof question !== 'object') return false
    const item = question as Partial<Question>
    return Number.isFinite(item.id)
      && typeof item.title === 'string'
      && typeof item.category === 'string'
      && Array.isArray(item.answers)
      && item.answers.length === 4
  })
}

function isGeneratedQuestion(value: unknown): value is GeneratedQuestionResponse {
  if (!value || typeof value !== 'object') return false
  const response = value as Partial<GeneratedQuestionResponse>
  return Boolean(
    response.question?.trim()
    && response.correctAnswer?.trim()
    && Array.isArray(response.answers)
    && response.answers.length === 4
    && response.answers.filter(answer => answer?.correct).length === 1
    && response.answers.every(answer => typeof answer?.candidateId === 'string' && answer.candidateId.trim() && typeof answer.answer === 'string' && answer.answer.trim()),
  )
}

function isInterviewResult(value: unknown): value is InterviewResultResponse {
  if (!value || typeof value !== 'object') return false
  const response = value as Partial<InterviewResultResponse>
  return Number.isFinite(response.totalScore)
    && typeof response.level === 'string'
    && Array.isArray(response.strengths)
    && Array.isArray(response.weaknesses)
    && Array.isArray(response.recommendations)
    && typeof response.summary === 'string'
}

function localEvaluation(question: Question, answerId: string): AnswerEvaluation {
  const answer = question.answers.find(option => option.id === answerId)
  const correct = Boolean(answer?.correct)
  return {
    correct,
    score: correct ? 100 : 25,
    explanation: question.explanation || (correct ? 'Выбран технически сильный ответ.' : 'В ответе есть техническая ошибка.'),
    feedback: correct ? 'Продолжайте оценивать аргументацию и компромиссы.' : 'Сверьте ответ с эталоном и проверьте ключевое техническое утверждение.',
    source: question.source || 'mock',
  }
}

export const gameApi = {
  async getCandidates(): Promise<Candidate[]> {
    try {
      const { data } = await http.get<unknown>('/v1/candidates')
      if (!isCandidateList(data)) throw new Error('Некорректный список кандидатов')
      return clone(data)
    } catch (error) {
      fallbackNotice('candidate list', error)
      await wait()
      return clone(mockCandidates)
    }
  },

  async getQuestions(): Promise<Question[]> {
    try {
      const { data } = await http.get<unknown>('/v1/questions')
      if (!isQuestionList(data)) throw new Error('Некорректный список вопросов')
      return clone(data.map(question => ({ ...question, source: question.source || 'integration' })))
    } catch (error) {
      fallbackNotice('question templates', error)
      await wait()
      return clone(mockQuestions.map(question => ({ ...question, source: 'mock' as const })))
    }
  },

  async prepareInterviewQuestion(input: PrepareQuestionInput): Promise<Question> {
    const selectedCandidates = input.candidates.slice(0, 4)
    if (selectedCandidates.length !== 4) return clone({ ...input.fallback, source: 'mock' })

    const request: GenerateQuestionRequest = {
      technology: input.fallback.category || 'Software Engineering',
      level: input.level || 'MIDDLE+',
      difficulty: Math.min(10, Math.max(1, input.difficulty || 5)),
      previousQuestions: input.previousQuestions,
      candidates: selectedCandidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        level: 'MIDDLE+',
        personality: candidate.summary || candidate.skills.join(', ') || 'спокойный технический специалист',
      })),
    }

    let generated: GeneratedQuestionResponse
    try {
      const { data } = await aiHttp.post<GeneratedQuestionResponse>('/v1/ai/questions/generate', request)
      if (!isGeneratedQuestion(data)) throw new Error('AI вернул некорректный вопрос')
      const requestedIds = new Set(selectedCandidates.map(candidate => candidate.id))
      const responseIds = new Set(data.answers.map(answer => answer.candidateId))
      if (responseIds.size !== 4 || [...requestedIds].some(id => !responseIds.has(id))) throw new Error('AI вернул ответы не для выбранных кандидатов')
      generated = data
    } catch (error) {
      fallbackNotice(`question ${input.fallback.id}`, error)
      return clone({ ...input.fallback, source: 'mock' })
    }

    const generatedAnswers = new Map(generated.answers.map(answer => [answer.candidateId, answer]))

    return {
      id: input.fallback.id,
      title: generated.question.trim(),
      category: input.fallback.category,
      timeLimit: input.fallback.timeLimit || 45,
      correctAnswer: generated.correctAnswer.trim(),
      explanation: generated.explanation?.trim() || '',
      source: 'integration',
      answers: selectedCandidates.map((candidate, index) => {
        const generatedAnswer = generatedAnswers.get(candidate.id)!
        return {
          id: input.fallback.answers[index]?.id || `${input.fallback.id}-${index + 1}`,
          candidateId: candidate.id,
          text: generatedAnswer.answer.trim(),
          correct: generatedAnswer.correct,
        }
      }),
    }
  },

  async evaluateAnswer(question: Question, answerId: string): Promise<AnswerEvaluation> {
    return localEvaluation(question, answerId)
  },

  async generateInterviewResult(request: InterviewResultRequest): Promise<InterviewResult> {
    try {
      const { data } = await aiHttp.post<InterviewResultResponse>('/v1/ai/interviews/result', request)
      if (!isInterviewResult(data)) throw new Error('AI вернул некорректный итог интервью')
      return { ...data, totalScore: Math.round(data.totalScore), source: 'integration' }
    } catch (error) {
      fallbackNotice(`interview result ${request.interviewId}`, error)
      const correct = request.answers.filter(answer => answer.correct).length
      const totalScore = Math.round(correct / Math.max(request.answers.length, 1) * 100)
      return {
        totalScore,
        level: totalScore >= 80 ? 'SENIOR' : totalScore >= 60 ? 'MIDDLE' : 'JUNIOR',
        strengths: correct ? [`Верно разобрано ${correct} из ${request.answers.length} технических ситуаций`] : [],
        weaknesses: correct < request.answers.length ? ['Часть технических решений требует дополнительной проверки'] : [],
        recommendations: ['Разбирать не только правильность решения, но и его компромиссы'],
        summary: `Локальная оценка: ${totalScore}/100. AI-сервис недоступен, поэтому использован резервный расчёт.`,
        source: 'mock',
      }
    }
  },

  async submitAnswer(gameId: string, questionId: number, answerId: string) {
    try {
      return (await http.post(`/v1/games/${gameId}/answers`, { questionId, answerId })).data
    } catch (error) {
      fallbackNotice(`submit answer ${questionId}`, error)
      await wait(80)
      return { gameId, questionId, answerId, accepted: true, source: 'mock' }
    }
  },

  async finishGame(gameId: string, teamIds: string[]) {
    try {
      return (await http.post(`/v1/games/${gameId}/finish`, { teamIds })).data
    } catch (error) {
      fallbackNotice(`finish game ${gameId}`, error)
      await wait()
      return { gameId, teamIds, status: 'FINISHED', source: 'mock' }
    }
  },
}
