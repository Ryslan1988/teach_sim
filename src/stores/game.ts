import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { gameApi } from '@/services/api'
import type { Candidate, Question } from '@/types/game'
import { projectProblems, technologies } from '@/data/project'

export const useGameStore = defineStore('game', () => {
  const gameId = ref(crypto.randomUUID())
  const candidates = ref<Candidate[]>([])
  const questions = ref<Question[]>([])
  const currentIndex = ref(0)
  const selectedAnswerIds = ref<string[]>([])
  const teamIds = ref<string[]>([])
  const interviewIds = ref<string[]>([])
  const selectedTechIds = ref<string[]>([])
  const issueSelections = ref<Record<number, string>>({})
  const loading = ref(false)
  const mode = ref<'career' | 'quick'>('career')

  const currentQuestion = computed(() => questions.value[currentIndex.value])
  const correctCount = computed(() => selectedAnswerIds.value.reduce((sum, answerId, index) => sum + (questions.value[index]?.answers.find(a => a.id === answerId)?.correct ? 1 : 0), 0))
  const score = computed(() => correctCount.value * 10)
  const bestStreak = computed(() => {
    let best = 0, current = 0
    selectedAnswerIds.value.forEach((answerId, index) => {
      const ok = questions.value[index]?.answers.find(a => a.id === answerId)?.correct
      current = ok ? current + 1 : 0
      best = Math.max(best, current)
    })
    return best
  })

  async function bootstrap() {
    loading.value = true
    try {
      const [candidateData, questionData] = await Promise.all([gameApi.getCandidates(), gameApi.getQuestions()])
      candidates.value = candidateData
      questions.value = questionData
    } finally { loading.value = false }
  }

  function reset() {
    gameId.value = crypto.randomUUID()
    currentIndex.value = 0
    selectedAnswerIds.value = []
    teamIds.value = []
    interviewIds.value = []
    selectedTechIds.value = []
    issueSelections.value = {}
    candidates.value.forEach(c => c.answers = 0)
  }

  function toggleInterview(candidateId: string) {
    if (interviewIds.value.includes(candidateId)) interviewIds.value = interviewIds.value.filter(id => id !== candidateId)
    else if (interviewIds.value.length < 4) interviewIds.value.push(candidateId)
  }

  function beginInterview() {
    const chosen = interviewIds.value.length === 4 ? interviewIds.value : candidates.value.slice(0, 4).map(candidate => candidate.id)
    const baseIds = ['maria', 'alex', 'igor', 'dmitry']
    questions.value = questions.value.map(question => ({ ...question, answers: question.answers.map(answer => ({ ...answer, candidateId: chosen[baseIds.indexOf(answer.candidateId)] || answer.candidateId })) }))
    interviewIds.value = chosen
  }

  async function answer(answerId: string) {
    const q = currentQuestion.value
    if (!q) return
    selectedAnswerIds.value.push(answerId)
    const answer = q.answers.find(item => item.id === answerId)
    const candidate = candidates.value.find(item => item.id === answer?.candidateId)
    if (candidate) candidate.answers += 1
    await gameApi.submitAnswer(gameId.value, q.id, answerId)
    currentIndex.value += 1
  }

  function toggleTeam(candidateId: string) {
    if (teamIds.value.includes(candidateId)) teamIds.value = teamIds.value.filter(id => id !== candidateId)
    else if (teamIds.value.length < 3) teamIds.value.push(candidateId)
  }

  function addTeamMember(candidateId: string) {
    if (!teamIds.value.includes(candidateId) && teamIds.value.length < 5) teamIds.value.push(candidateId)
  }

  function toggleTechnology(id: string) {
    if (selectedTechIds.value.includes(id)) selectedTechIds.value = selectedTechIds.value.filter(item => item !== id)
    else if (selectedTechIds.value.length < 6) selectedTechIds.value.push(id)
  }

  function solveIssue(issueId: number, technologyId: string) {
    if (technologies.some(technology => technology.id === technologyId)) issueSelections.value = { ...issueSelections.value, [issueId]: technologyId }
  }

  return { gameId, candidates, questions, currentIndex, selectedAnswerIds, teamIds, interviewIds, selectedTechIds, issueSelections, loading, mode, currentQuestion, correctCount, score, bestStreak, bootstrap, reset, answer, toggleTeam, addTeamMember, toggleInterview, beginInterview, toggleTechnology, solveIssue, projectProblems }
})
