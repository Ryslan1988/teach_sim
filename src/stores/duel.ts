import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { multiplayer, type MultiplayerEvent } from '@/services/multiplayer'
import { useGameStore } from '@/stores/game'

export type DuelStageId = 'draft' | 'interview' | 'team' | 'strategy' | 'incidents' | 'finished'

export interface DuelStageScore {
  interview: number
  team: number
  strategy: number
  incidents: number
}

export interface DuelSnapshot {
  name: string
  stage: DuelStageId
  stageIndex: number
  progress: number
  score: number
  scores: DuelStageScore
  finished: boolean
  elapsedMs: number
}

export const duelStages = [
  { id: 'draft' as const, index: 1, short: 'Драфт', label: 'Драфт кандидатов' },
  { id: 'interview' as const, index: 2, short: 'Интервью', label: 'Техническое интервью' },
  { id: 'team' as const, index: 3, short: 'Команда', label: 'Сбор команды' },
  { id: 'strategy' as const, index: 4, short: 'Стратегия', label: 'Техническая стратегия' },
  { id: 'incidents' as const, index: 5, short: 'Инциденты', label: 'Разбор инцидентов' },
]

const emptyScores = (): DuelStageScore => ({ interview: 0, team: 0, strategy: 0, incidents: 0 })
const emptySnapshot = (): DuelSnapshot => ({
  name: 'Соперник',
  stage: 'draft',
  stageIndex: 1,
  progress: 0,
  score: 0,
  scores: emptyScores(),
  finished: false,
  elapsedMs: 0,
})

const strategicTechnologies = new Set(['typescript', 'java', 'postgres', 'kafka', 'k8s', 'grafana'])

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function isStage(value: unknown): value is DuelStageId {
  return ['draft', 'interview', 'team', 'strategy', 'incidents', 'finished'].includes(String(value))
}

export const useDuelStore = defineStore('duel', () => {
  const game = useGameStore()
  const active = ref(false)
  const playerName = ref(localStorage.getItem('tech-lead-player-name') || 'Вы')
  const opponentName = ref('Соперник')
  const opponentOnline = ref(false)
  const localStage = ref<DuelStageId>('draft')
  const localProgress = ref(0)
  const localFinished = ref(false)
  const remote = ref<DuelSnapshot>(emptySnapshot())
  const remoteDraftIds = ref<string[]>([])
  const startedAt = ref(0)
  const elapsedMs = ref(0)
  let stopListening: (() => void) | undefined

  const localScores = computed<DuelStageScore>(() => {
    const selectedTeam = game.candidates.filter(candidate => game.teamIds.includes(candidate.id))
    const teamRoles = new Set(selectedTeam.map(candidate => candidate.role))
    const interview = game.correctCount * 100
    const team = Math.min(selectedTeam.length, 5) * 25 + Math.min(teamRoles.size, 5) * 25
    const strategy = game.selectedTechIds.filter(id => strategicTechnologies.has(id)).length * 50
    const incidents = game.projectProblems.reduce((score, issue) => {
      const selection = game.issueSelections[issue.id]
      return score + (selection && issue.suggested.includes(selection) ? 50 : 0)
    }, 0)
    return { interview, team, strategy, incidents }
  })

  const localScore = computed(() => Object.values(localScores.value).reduce((sum, value) => sum + value, 0))
  const localStageIndex = computed(() => localStage.value === 'finished' ? 6 : (duelStages.find(stage => stage.id === localStage.value)?.index || 1))
  const localOverallProgress = computed(() => localFinished.value ? 100 : clampProgress(((localStageIndex.value - 1) + localProgress.value / 100) / duelStages.length * 100))
  const remoteOverallProgress = computed(() => remote.value.finished ? 100 : clampProgress(((Math.max(1, remote.value.stageIndex) - 1) + remote.value.progress / 100) / duelStages.length * 100))
  const localStageLabel = computed(() => localFinished.value ? 'Финиш' : duelStages.find(stage => stage.id === localStage.value)?.label || 'Драфт кандидатов')
  const remoteStageLabel = computed(() => remote.value.finished ? 'Финиш' : duelStages.find(stage => stage.id === remote.value.stage)?.label || 'Драфт кандидатов')

  const winner = computed<'pending' | 'you' | 'opponent' | 'draw'>(() => {
    if (!localFinished.value || !remote.value.finished) return 'pending'
    const comparisons: Array<[number, number]> = [
      [localScore.value, remote.value.score],
      [localScores.value.interview, remote.value.scores.interview],
      [localScores.value.incidents, remote.value.scores.incidents],
      [localScores.value.strategy, remote.value.scores.strategy],
      [localScores.value.team, remote.value.scores.team],
    ]
    for (const [ours, theirs] of comparisons) {
      if (ours !== theirs) return ours > theirs ? 'you' : 'opponent'
    }
    if (elapsedMs.value && remote.value.elapsedMs && elapsedMs.value !== remote.value.elapsedMs) {
      return elapsedMs.value < remote.value.elapsedMs ? 'you' : 'opponent'
    }
    return 'draw'
  })

  const winnerReason = computed(() => {
    if (winner.value === 'pending' || winner.value === 'draw') return ''
    if (localScore.value !== remote.value.score) return 'Больше итоговых очков'
    if (localScores.value.interview !== remote.value.scores.interview) return 'Лучший результат интервью'
    if (localScores.value.incidents !== remote.value.scores.incidents) return 'Лучшее решение инцидентов'
    if (localScores.value.strategy !== remote.value.scores.strategy) return 'Более сильная стратегия'
    if (localScores.value.team !== remote.value.scores.team) return 'Более сбалансированная команда'
    return 'Более быстрое прохождение'
  })

  function snapshot(): DuelSnapshot {
    return {
      name: playerName.value,
      stage: localFinished.value ? 'finished' : localStage.value,
      stageIndex: localFinished.value ? 6 : localStageIndex.value,
      progress: localFinished.value ? 100 : localProgress.value,
      score: localScore.value,
      scores: { ...localScores.value },
      finished: localFinished.value,
      elapsedMs: elapsedMs.value,
    }
  }

  function publish() {
    if (active.value && multiplayer.connected && multiplayer.room) multiplayer.gameEvent('duel-progress', snapshot())
  }

  function readSnapshot(payload: unknown): DuelSnapshot | undefined {
    if (!payload || typeof payload !== 'object') return
    const value = payload as Partial<DuelSnapshot> & { playerId?: string }
    if (value.playerId === multiplayer.playerId || !isStage(value.stage)) return
    const scores = value.scores && typeof value.scores === 'object' ? value.scores : emptyScores()
    return {
      name: typeof value.name === 'string' && value.name.trim() ? value.name : opponentName.value,
      stage: value.stage,
      stageIndex: Number.isFinite(value.stageIndex) ? Number(value.stageIndex) : 1,
      progress: clampProgress(Number(value.progress) || 0),
      score: Math.max(0, Number(value.score) || 0),
      scores: {
        interview: Math.max(0, Number(scores.interview) || 0),
        team: Math.max(0, Number(scores.team) || 0),
        strategy: Math.max(0, Number(scores.strategy) || 0),
        incidents: Math.max(0, Number(scores.incidents) || 0),
      },
      finished: Boolean(value.finished),
      elapsedMs: Math.max(0, Number(value.elapsedMs) || 0),
    }
  }

  function handleEvent(event: MultiplayerEvent) {
    if (event.type === 'player-joined') {
      opponentName.value = event.player.name
      opponentOnline.value = true
    }
    if (event.type === 'player-left' && event.playerId !== multiplayer.playerId) opponentOnline.value = false
    if (event.type !== 'game-event') return
    if (event.event === 'player-profile') {
      const payload = event.payload as { name?: string; playerId?: string }
      if (payload.playerId !== multiplayer.playerId && payload.name) {
        opponentName.value = payload.name
        opponentOnline.value = true
      }
    }
    if (event.event === 'duel-draft') {
      const payload = event.payload as { selectedIds?: unknown; playerId?: string }
      if (payload.playerId !== multiplayer.playerId && Array.isArray(payload.selectedIds)) remoteDraftIds.value = payload.selectedIds.filter(id => typeof id === 'string')
    }
    if (event.event === 'duel-progress') {
      const received = readSnapshot(event.payload)
      if (received) {
        remote.value = received
        opponentName.value = received.name
        opponentOnline.value = true
      }
    }
  }

  function bind() {
    if (!stopListening) stopListening = multiplayer.on(handleEvent)
  }

  function prepare(name: string, opponent = opponentName.value) {
    bind()
    active.value = true
    playerName.value = name.trim() || 'Вы'
    opponentName.value = opponent || 'Соперник'
    opponentOnline.value = true
    localStage.value = 'draft'
    localProgress.value = 0
    localFinished.value = false
    remote.value = { ...emptySnapshot(), name: opponentName.value }
    remoteDraftIds.value = []
    startedAt.value = Date.now()
    elapsedMs.value = 0
    publish()
  }

  function deactivate() {
    active.value = false
    localFinished.value = false
    remoteDraftIds.value = []
  }

  function setOpponent(name: string) {
    if (name.trim()) opponentName.value = name.trim()
  }

  function enterStage(stage: Exclude<DuelStageId, 'finished'>, progress = 0) {
    if (!active.value) return
    localStage.value = stage
    localProgress.value = clampProgress(progress)
    publish()
  }

  function updateProgress(progress: number) {
    if (!active.value) return
    localProgress.value = clampProgress(progress)
    publish()
  }

  function updateDraft(selectedIds: string[]) {
    if (!active.value) return
    localStage.value = 'draft'
    localProgress.value = clampProgress(selectedIds.length / 4 * 100)
    multiplayer.gameEvent('duel-draft', { selectedIds })
    publish()
  }

  function finish() {
    if (!active.value) return
    localStage.value = 'finished'
    localProgress.value = 100
    localFinished.value = true
    elapsedMs.value = startedAt.value ? Date.now() - startedAt.value : 0
    publish()
  }

  bind()

  return {
    active,
    playerName,
    opponentName,
    opponentOnline,
    localStage,
    localProgress,
    localFinished,
    remote,
    remoteDraftIds,
    elapsedMs,
    localScores,
    localScore,
    localStageIndex,
    localStageLabel,
    remoteStageLabel,
    localOverallProgress,
    remoteOverallProgress,
    winner,
    winnerReason,
    prepare,
    deactivate,
    setOpponent,
    enterStage,
    updateProgress,
    updateDraft,
    publish,
    finish,
  }
})
