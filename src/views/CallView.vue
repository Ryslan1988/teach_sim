<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import CandidateAvatar from '@/components/CandidateAvatar.vue'
import type { AnswerOption } from '@/types/game'
import { multiplayer, type MultiplayerEvent } from '@/services/multiplayer'

const router = useRouter()
const game = useGameStore()
const muted = ref(false)
const camera = ref(true)
const busy = ref(false)
const selectedId = ref('')
const seconds = ref(45)
const feedback = ref<'correct' | 'wrong' | ''>('')
const lastSpeaker = ref('')
const shuffledAnswers = ref<AnswerOption[]>([])
let timer: number | undefined
const q = computed(() => game.currentQuestion)
const finished = computed(() => game.questions.length > 0 && game.currentIndex >= game.questions.length)
const callCandidates = computed(() => game.candidates.filter(candidate => game.interviewIds.includes(candidate.id)))
const remoteAnswered = ref(0)
const remoteScore = ref(0)
const remoteFinished = ref(false)
const onlineSession = multiplayer.connected && Boolean(multiplayer.room)
const winner = computed(() => !finished.value || !remoteFinished.value ? '' : game.score === remoteScore.value ? 'DRAW' : game.score > remoteScore.value ? 'YOU' : 'FRIEND')
let stopRemote: (() => void) | undefined

watch(() => q.value?.id, () => {
  const answers = q.value?.answers ? [...q.value.answers] : []
  for (let index = answers.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[answers[index], answers[randomIndex]] = [answers[randomIndex]!, answers[index]!]
  }
  shuffledAnswers.value = answers
}, { immediate: true })

function candidate(id: string) {
  return game.candidates.find(candidate => candidate.id === id)!
}

async function chooseAnswer(id: string) {
  if (busy.value || !q.value) return
  busy.value = true
  selectedId.value = id
  const answer = q.value.answers.find(item => item.id === id)!
  feedback.value = answer.correct ? 'correct' : 'wrong'
  lastSpeaker.value = candidate(answer.candidateId).name
  await new Promise(resolve => window.setTimeout(resolve, 1100))
  await game.answer(id)
  if (onlineSession) multiplayer.gameEvent('progress', { answered: game.currentIndex, total: game.questions.length, score: game.score, finished: game.currentIndex >= game.questions.length })
  if (!finished.value) {
    selectedId.value = ''
    feedback.value = ''
    lastSpeaker.value = ''
    seconds.value = 45
    busy.value = false
  }
}

onMounted(async () => {
  if (!game.questions.length) await game.bootstrap()
  timer = window.setInterval(() => { if (seconds.value > 0 && !busy.value && !finished.value) seconds.value-- }, 1000)
})
onUnmounted(() => window.clearInterval(timer))
onMounted(() => { stopRemote = multiplayer.on((event: MultiplayerEvent) => { if (event.type === 'game-event' && event.event === 'progress') { const payload = event.payload as { answered?: number; score?: number; finished?: boolean; playerId?: string }; if (payload.playerId === multiplayer.playerId) return; remoteAnswered.value = payload.answered || 0; remoteScore.value = payload.score || 0; remoteFinished.value = Boolean(payload.finished) } }) })
onUnmounted(() => stopRemote?.())
</script>

<template>
  <div class="live-interview">
    <section class="call-stage">
      <div class="call-stage-head">
        <div><span class="record-dot"></span><b>LIVE INTERVIEW</b><small>Защищённое соединение</small></div>
        <div class="call-time">00:{{ String(45 - seconds).padStart(2, '0') }} <span>● REC</span></div>
      </div>
      <div v-if="onlineSession" class="friend-progress"><span>FRIEND PROGRESS</span><b>{{ remoteAnswered }} / {{ game.questions.length }}</b><div><i :style="{ width: `${remoteAnswered / Math.max(game.questions.length, 1) * 100}%` }"></i></div><small>{{ remoteFinished ? `Финиш · ${remoteScore} очков` : 'Играет сейчас' }}</small></div>

      <div class="video-grid live-grid">
        <article v-for="(c, index) in callCandidates" :key="c.id" class="video-tile" :class="{ speaking: shuffledAnswers[index]?.candidateId === c.id }">
          <CandidateAvatar :candidate="c" size="lg" />
          <div class="audio-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <div class="participant-label"><b>{{ c.name }}</b><small>{{ c.role }}</small></div>
          <span class="tile-status">{{ camera ? '◉' : '○' }} ᴴᴰ</span>
        </article>
      </div>

      <div class="call-controls">
        <button :class="{ off: muted }" @click="muted = !muted" :title="muted ? 'Включить микрофон' : 'Выключить микрофон'">{{ muted ? '🔇' : '🎙' }}</button>
        <button :class="{ off: !camera }" @click="camera = !camera">{{ camera ? '▣' : '▧' }}</button>
        <button>⌁</button><button>☷</button><button>⚙</button>
        <button class="hang" @click="router.push('/pause')">☎</button>
      </div>
    </section>

    <aside class="interview-console" v-if="q">
      <header class="console-head">
        <div><span>ТЕХНИЧЕСКОЕ ИНТЕРВЬЮ</span><b>Вопрос {{ game.currentIndex + 1 }} / {{ game.questions.length }}</b></div>
        <div class="console-timer" :class="{ danger: seconds < 10 }">00:{{ String(seconds).padStart(2, '0') }}</div>
      </header>

      <section class="active-question">
        <span class="question-category">{{ q.category }} · УРОВЕНЬ MIDDLE+</span>
        <h2>{{ q.title }}</h2>
        <div class="question-progress"><i :style="{ width: `${(game.currentIndex + 1) / game.questions.length * 100}%` }"></i></div>
      </section>

      <section class="live-transcript">
        <div class="transcript-heading"><span><i></i> LIVE TRANSCRIPT</span><small>Выберите сильнейший ответ</small></div>
        <button
          v-for="(answer, index) in shuffledAnswers"
          :key="answer.id"
          class="speech-line"
          :class="{ selected: selectedId === answer.id }"
          :style="{ '--delay': `${index * .14}s`, '--accent': candidate(answer.candidateId).accent }"
          :disabled="busy"
          @click="chooseAnswer(answer.id)"
        >
          <CandidateAvatar :candidate="candidate(answer.candidateId)" size="sm" />
          <span class="speech-copy">
            <strong>{{ candidate(answer.candidateId).name }} <small>{{ candidate(answer.candidateId).role }}</small></strong>
            <q>{{ answer.text }}</q>
          </span>
          <span class="voice-bars"><i></i><i></i><i></i></span>
        </button>
        <div v-if="feedback" class="answer-feedback" :class="feedback">
          <i>{{ feedback === 'correct' ? '✓' : '×' }}</i>
          <div><b>{{ feedback === 'correct' ? 'Сильный ответ' : 'Слабый ответ' }}</b><span>Реплика кандидата {{ lastSpeaker }} зафиксирована</span></div>
        </div>
      </section>

      <footer class="console-footer"><span>● Расшифровка в реальном времени</span><b>AI ASSISTED</b></footer>
    </aside>
    <aside class="interview-console interview-complete" v-else-if="finished">
      <div class="complete-badge">INTERVIEW COMPLETE</div>
      <div class="complete-icon">✓</div>
      <span>СОБЕСЕДОВАНИЕ ЗАВЕРШЕНО</span>
      <h2>{{ game.correctCount }}<small>/{{ game.questions.length }}</small></h2>
      <p>Все вопросы пройдены. Результаты сохранены в профиле техлида.</p>
      <div class="complete-stats"><div><span>ОЧКИ</span><b>{{ game.score }}</b></div><div><span>ЛУЧШАЯ СЕРИЯ</span><b>{{ game.bestStreak }}</b></div></div>
      <div v-if="winner" class="winner-banner">{{ winner === 'DRAW' ? 'НИЧЬЯ' : winner === 'YOU' ? 'ВЫ ПОБЕДИЛИ' : 'ПОБЕДИЛ ВТОРОЙ ИГРОК' }}</div>
      <button class="btn primary block" @click="router.push('/details')">ПРОДОЛЖИТЬ К ФИНАЛУ&nbsp; →</button>
    </aside>
  </div>
</template>
