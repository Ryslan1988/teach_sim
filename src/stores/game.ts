import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { gameApi } from '@/services/api'
import type { AnswerEvaluation, Candidate, InterviewResult, Question } from '@/types/game'
import { projectProblems, technologies } from '@/data/project'

export const useGameStore = defineStore('game', () => {
  const gameId = ref(crypto.randomUUID())
  const interviewId = ref(Date.now())
  const candidates = ref<Candidate[]>([])
  const questionTemplates = ref<Question[]>([])
  const questions = ref<Question[]>([])
  const currentIndex = ref(0)
  const selectedAnswerIds = ref<string[]>([])
  const answerEvaluations = ref<AnswerEvaluation[]>([])
  const interviewResult = ref<InterviewResult | null>(null)
  const teamIds = ref<string[]>([])
  const interviewIds = ref<string[]>([])
  const selectedTechIds = ref<string[]>([])
  const issueSelections = ref<Record<number, string>>({})
  const loading = ref(false)
  const questionLoading = ref(false)
  const resultLoading = ref(false)
  const mode = ref<'career' | 'quick'>('career')
  const preparedQuestionIndexes = new Set<number>()
  const preparationPromises = new Map<number, Promise<void>>()
  let bootstrapPromise: Promise<void> | undefined

  const currentQuestion = computed(() => questions.value[currentIndex.value])

  function isAnswerCorrect(index: number) {
    const evaluation = answerEvaluations.value[index]
    if (evaluation) return evaluation.correct
    const question = questions.value[index]
    const answerId = selectedAnswerIds.value[index]
    return Boolean(question && answerId && question.answers.find(answer => answer.id === answerId)?.correct)
  }

  const correctCount = computed(() => selectedAnswerIds.value.reduce((sum, _, index) => sum + (isAnswerCorrect(index) ? 1 : 0), 0))
  const score = computed(() => correctCount.value * 10)
  const bestStreak = computed(() => {
    let best = 0
    let current = 0
    selectedAnswerIds.value.forEach((_, index) => {
      current = isAnswerCorrect(index) ? current + 1 : 0
      best = Math.max(best, current)
    })
    return best
  })

  async function bootstrap() {
    if (bootstrapPromise) return bootstrapPromise
    bootstrapPromise = (async () => {
      loading.value = true
      try {
        const [candidateData, questionData] = await Promise.all([gameApi.getCandidates(), gameApi.getQuestions()])
        candidates.value = candidateData
        questionTemplates.value = structuredClone(questionData)
        if (!questions.value.length) questions.value = structuredClone(questionData)
      } finally {
        loading.value = false
        bootstrapPromise = undefined
      }
    })()
    return bootstrapPromise
  }

  function reset() {
    gameId.value = crypto.randomUUID()
    interviewId.value = Date.now()
    currentIndex.value = 0
    selectedAnswerIds.value = []
    answerEvaluations.value = []
    interviewResult.value = null
    teamIds.value = []
    interviewIds.value = []
    selectedTechIds.value = []
    issueSelections.value = {}
    questions.value = structuredClone(questionTemplates.value)
    preparedQuestionIndexes.clear()
    preparationPromises.clear()
    questionLoading.value = false
    resultLoading.value = false
    candidates.value.forEach(candidate => candidate.answers = 0)
  }

  function toggleInterview(candidateId: string) {
    if (interviewIds.value.includes(candidateId)) interviewIds.value = interviewIds.value.filter(id => id !== candidateId)
    else if (interviewIds.value.length < 4) interviewIds.value.push(candidateId)
  }

  function beginInterview() {
    const chosen = interviewIds.value.length === 4 ? interviewIds.value : candidates.value.slice(0, 4).map(candidate => candidate.id)
    const totalQuestions = mode.value === 'quick' ? 5 : 10
    const templates = questionTemplates.value.length ? questionTemplates.value : questions.value
    questions.value = structuredClone(templates.slice(0, totalQuestions)).map(question => ({
      ...question,
      answers: question.answers.map((answer, index) => ({ ...answer, candidateId: chosen[index % Math.max(chosen.length, 1)] || answer.candidateId })),
    }))
    interviewIds.value = chosen
    currentIndex.value = 0
    selectedAnswerIds.value = []
    answerEvaluations.value = []
    interviewResult.value = null
    preparedQuestionIndexes.clear()
    preparationPromises.clear()
  }

  async function prepareQuestion(index = currentIndex.value) {
    if (preparedQuestionIndexes.has(index)) return
    const existingPromise = preparationPromises.get(index)
    if (existingPromise) return existingPromise
    const fallback = questions.value[index]
    if (!fallback) return
    const sessionId = gameId.value
    const selectedCandidates = candidates.value.filter(candidate => interviewIds.value.includes(candidate.id))

    const promise = (async () => {
      if (index === currentIndex.value) questionLoading.value = true
      try {
        const prepared = await gameApi.prepareInterviewQuestion({
          fallback,
          candidates: selectedCandidates,
          previousQuestions: questions.value.slice(0, index).map(question => question.title),
          level: 'MIDDLE+',
          difficulty: Math.min(10, 4 + index),
        })
        if (gameId.value !== sessionId) return
        questions.value[index] = prepared
        preparedQuestionIndexes.add(index)
      } finally {
        preparationPromises.delete(index)
        if (index === currentIndex.value) questionLoading.value = false
      }
    })()
    preparationPromises.set(index, promise)
    return promise
  }

  async function evaluateCurrentAnswer(answerId: string) {
    const question = currentQuestion.value
    if (!question) return undefined
    return gameApi.evaluateAnswer(question, answerId)
  }

  async function completeInterview() {
    if (interviewResult.value || !questions.value.length) return
    resultLoading.value = true
    try {
      const answers = questions.value.map((question, index) => {
        const selectedId = selectedAnswerIds.value[index]
        return {
          question: question.title,
          answer: question.answers.find(option => option.id === selectedId)?.text || 'Ответ не выбран',
          correct: isAnswerCorrect(index),
        }
      })
      interviewResult.value = await gameApi.generateInterviewResult({
        interviewId: interviewId.value,
        position: 'Backend Developer',
        declaredLevel: 'MIDDLE+',
        answers,
      })
    } finally {
      resultLoading.value = false
    }
  }

  async function answer(answerId: string, preparedEvaluation?: AnswerEvaluation) {
    const question = currentQuestion.value
    if (!question) return undefined
    const answerIndex = currentIndex.value
    const evaluation = preparedEvaluation || await gameApi.evaluateAnswer(question, answerId)
    selectedAnswerIds.value.push(answerId)
    answerEvaluations.value[answerIndex] = evaluation
    const answerOption = question.answers.find(item => item.id === answerId)
    const candidate = candidates.value.find(item => item.id === answerOption?.candidateId)
    if (candidate) candidate.answers += 1
    await gameApi.submitAnswer(gameId.value, question.id, answerId)
    currentIndex.value += 1
    if (currentIndex.value >= questions.value.length) await completeInterview()
    return evaluation
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

  return {
    gameId,
    interviewId,
    candidates,
    questions,
    currentIndex,
    selectedAnswerIds,
    answerEvaluations,
    interviewResult,
    teamIds,
    interviewIds,
    selectedTechIds,
    issueSelections,
    loading,
    questionLoading,
    resultLoading,
    mode,
    currentQuestion,
    correctCount,
    score,
    bestStreak,
    bootstrap,
    reset,
    answer,
    evaluateCurrentAnswer,
    prepareQuestion,
    completeInterview,
    isAnswerCorrect,
    toggleTeam,
    addTeamMember,
    toggleInterview,
    beginInterview,
    toggleTechnology,
    solveIssue,
    projectProblems,
  }
})
