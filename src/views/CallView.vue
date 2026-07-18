<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import CandidateAvatar from '@/components/CandidateAvatar.vue'
import AiConnectionOverlay from '@/components/AiConnectionOverlay.vue'
import type { AnswerOption } from '@/types/game'
import { multiplayer } from '@/services/multiplayer'
import { useDuelStore } from '@/stores/duel'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()
const muted = ref(false)
const camera = ref(true)
const busy = ref(false)
const selectedId = ref('')
const seconds = ref(45)
const feedback = ref<'correct' | 'wrong' | ''>('')
const feedbackText = ref('')
const lastSpeaker = ref('')
const shuffledAnswers = ref<AnswerOption[]>([])
let timer: number | undefined
const q = computed(() => game.currentQuestion)
const finished = computed(() => game.questions.length > 0 && game.currentIndex >= game.questions.length)
const callCandidates = computed(() => game.candidates.filter(candidate => game.interviewIds.includes(candidate.id)))
const onlineSession = multiplayer.connected && Boolean(multiplayer.room)

watch(q, () => {
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
  if (busy.value || game.questionLoading || !q.value) return
  busy.value = true
  try {
    selectedId.value = id
    const answer = q.value.answers.find(item => item.id === id)
    const speaker = answer && game.candidates.find(item => item.id === answer.candidateId)
    if (!answer || !speaker) return
    lastSpeaker.value = speaker.name
    const evaluation = await game.evaluateCurrentAnswer(id)
    if (!evaluation) return
    feedback.value = evaluation.correct ? 'correct' : 'wrong'
    feedbackText.value = evaluation.feedback || evaluation.explanation
    await new Promise(resolve => window.setTimeout(resolve, 1100))
    await game.answer(id, evaluation)
    if (duel.active) duel.updateProgress(game.currentIndex / Math.max(game.questions.length, 1) * 100)
    else if (onlineSession) multiplayer.gameEvent('progress', { answered: game.currentIndex, total: game.questions.length, score: game.score, finished: game.currentIndex >= game.questions.length })
    if (!finished.value) {
      selectedId.value = ''
      feedback.value = ''
      feedbackText.value = ''
      lastSpeaker.value = ''
      seconds.value = 45
      await game.prepareQuestion()
    }
  } catch (error) {
    if (import.meta.env.DEV) console.error('[interview] answer transition failed', error)
  } finally {
    busy.value = false
  }
}

onMounted(async () => {
  if (!game.questions.length) await game.bootstrap()
  await game.prepareQuestion()
  if (duel.active) duel.enterStage('interview', game.currentIndex / Math.max(game.questions.length, 1) * 100)
  timer = window.setInterval(() => { if (seconds.value > 0 && !busy.value && !game.questionLoading && !finished.value) seconds.value-- }, 1000)
})
onUnmounted(() => window.clearInterval(timer))
</script>

<template>
  <div class="live-interview">
    <AiConnectionOverlay v-if="game.questionLoading" />
    <section class="call-stage">
      <div class="call-stage-head">
        <div><span class="record-dot"></span><b>LIVE INTERVIEW</b><small>Защищённое соединение</small></div>
        <div class="call-time">00:{{ String(45 - seconds).padStart(2, '0') }} <span>● REC</span></div>
      </div>
      <div v-if="duel.active" class="friend-progress"><span>СОПЕРНИК · ЭТАП {{ Math.min(duel.remote.stageIndex, 5) }}/5</span><b>{{ duel.remote.score }} очков</b><div><i :style="{ width: `${duel.remoteOverallProgress}%` }"></i></div><small>{{ duel.remote.finished ? 'Уже на финише' : duel.remoteStageLabel }}</small></div>

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
        <div><span>{{ duel.active ? 'ЭТАП 02 / 05 · ТЕХНИЧЕСКОЕ ИНТЕРВЬЮ' : 'ТЕХНИЧЕСКОЕ ИНТЕРВЬЮ' }}</span><b>Вопрос {{ game.currentIndex + 1 }} / {{ game.questions.length }} · {{ q.source === 'integration' ? 'AI GENERATED' : 'MOCK FALLBACK' }}</b></div>
        <div class="console-timer" :class="{ danger: seconds < 10 }">00:{{ String(seconds).padStart(2, '0') }}</div>
      </header>

      <section class="active-question">
        <span class="question-category">{{ q.category }} · УРОВЕНЬ {{ q.level || 'MIDDLE+' }}</span>
        <h2>{{ q.title }}</h2>
        <div class="question-progress"><i :style="{ width: `${(game.currentIndex + 1) / game.questions.length * 100}%` }"></i></div>
      </section>

      <section class="live-transcript">
        <div class="transcript-heading"><span><i></i> LIVE TRANSCRIPT</span><small>{{ game.questionLoading ? 'AI готовит вопрос и реплики…' : 'Выберите сильнейший ответ' }}</small></div>
        <button
          v-for="(answer, index) in shuffledAnswers"
          :key="answer.id"
          class="speech-line"
          :class="{ selected: selectedId === answer.id }"
          :style="{ '--delay': `${index * .14}s`, '--accent': candidate(answer.candidateId).accent }"
          :disabled="busy || game.questionLoading"
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
          <div><b>{{ feedback === 'correct' ? 'Сильный ответ' : 'Слабый ответ' }}</b><span>{{ feedbackText || `Реплика кандидата ${lastSpeaker} зафиксирована` }}</span></div>
        </div>
      </section>

      <footer class="console-footer"><span>● Расшифровка в реальном времени</span><b>AI ASSISTED</b></footer>
    </aside>
    <aside class="interview-console interview-complete" v-else-if="finished">
      <div class="complete-badge">INTERVIEW COMPLETE</div>
      <div class="complete-icon">✓</div>
      <span>СОБЕСЕДОВАНИЕ ЗАВЕРШЕНО</span>
      <h2>{{ game.correctCount }}<small>/{{ game.questions.length }}</small></h2>
      <p>{{ game.resultLoading ? 'AI формирует итоговый разбор интервью…' : game.interviewResult?.summary || 'Все вопросы пройдены. Результаты сохранены в профиле техлида.' }}</p>
      <div class="complete-stats"><div><span>AI SCORE</span><b>{{ game.interviewResult?.totalScore ?? game.score }}</b></div><div><span>УРОВЕНЬ</span><b>{{ game.interviewResult?.level || '—' }}</b></div></div>
      <div v-if="game.interviewResult?.strengths.length" class="ai-result-tags"><span v-for="strength in game.interviewResult.strengths.slice(0, 2)" :key="strength">✓ {{ strength }}</span></div>
      <div v-if="duel.active" class="winner-banner">ПРОМЕЖУТОЧНЫЙ СЧЁТ · {{ duel.localScore }} : {{ duel.remote.score }}</div>
      <button class="btn primary block" :disabled="game.resultLoading" @click="router.push('/details')">{{ game.resultLoading ? 'AI АНАЛИЗИРУЕТ…' : duel.active ? 'ПЕРЕЙТИ К ЭТАПУ 03' : 'ПРОДОЛЖИТЬ К ФИНАЛУ' }}&nbsp; →</button>
    </aside>
  </div>
</template>
