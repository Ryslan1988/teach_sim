import axios from 'axios'
import { candidates, questions } from '@/data/mock'
import type { Candidate, Question } from '@/types/game'

const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout: 8000 })
const useMocks = String(import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true'

const wait = (ms = 220) => new Promise(resolve => setTimeout(resolve, ms))

export const gameApi = {
  async getCandidates(): Promise<Candidate[]> {
    if (useMocks) { await wait(); return structuredClone(candidates) }
    return (await http.get('/v1/candidates')).data
  },
  async getQuestions(): Promise<Question[]> {
    if (useMocks) { await wait(); return structuredClone(questions) }
    return (await http.get('/v1/questions')).data
  },
  async submitAnswer(gameId: string, questionId: number, answerId: string) {
    if (useMocks) { await wait(120); return { gameId, questionId, answerId, accepted: true } }
    return (await http.post(`/v1/games/${gameId}/answers`, { questionId, answerId })).data
  },
  async finishGame(gameId: string, teamIds: string[]) {
    if (useMocks) { await wait(200); return { gameId, teamIds, status: 'FINISHED' } }
    return (await http.post(`/v1/games/${gameId}/finish`, { teamIds })).data
  }
}
