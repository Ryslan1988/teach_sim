<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import CandidateAvatar from '@/components/CandidateAvatar.vue'
import { multiplayer, type MultiplayerEvent } from '@/services/multiplayer'
import { useDuelStore } from '@/stores/duel'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()
const legacyLocks = ref(new Set<string>(multiplayer.lockedCandidates))
const lockedByOther = computed(() => new Set(duel.active ? [...duel.remoteDraftIds, ...legacyLocks.value] : [...legacyLocks.value]))
let stop: (() => void) | undefined
onMounted(() => {
  if (!game.candidates.length) game.bootstrap()
  legacyLocks.value = new Set(multiplayer.lockedCandidates)
  if (duel.active) duel.enterStage('draft', game.interviewIds.length / 4 * 100)
  stop = multiplayer.on((event: MultiplayerEvent) => {
    if (event.type === 'candidate-locked' && event.playerId !== multiplayer.playerId) legacyLocks.value = new Set([...legacyLocks.value, event.candidateId])
    if (event.type === 'candidate-lock-rejected' && game.interviewIds.includes(event.candidateId)) {
      game.toggleInterview(event.candidateId)
      if (duel.active) duel.updateDraft(game.interviewIds)
    }
  })
})
onUnmounted(() => stop?.())
function selectCandidate(id: string) {
  if (lockedByOther.value.has(id)) return
  if (duel.active && game.interviewIds.includes(id)) return
  if (!game.interviewIds.includes(id) && game.interviewIds.length >= 4) return
  game.toggleInterview(id)
  if (duel.active) {
    multiplayer.lockCandidate(id)
    duel.updateDraft(game.interviewIds)
  }
  else multiplayer.lockCandidate(id)
}
function start() {
  game.beginInterview()
  if (duel.active) duel.enterStage('interview', 0)
  router.push('/call')
}
</script>

<template>
  <div class="selection-screen">
    <header class="selection-heading"><div><span class="screen-kicker">{{ duel.active ? 'ЭТАП 01 / 05 · TALENT DRAFT' : 'TALENT POOL · 2026' }}</span><h1>{{ duel.active ? 'Заберите сильнейших' : 'Сформируйте состав' }}<br><em>для интервью</em></h1><p>{{ duel.active ? 'Кандидат достаётся тому, кто выбрал его первым. Состав соперника отмечен замком.' : 'Изучите профили и пригласите до четырёх специалистов на один звонок.' }}</p></div><div class="selection-counter"><strong>{{ game.interviewIds.length }}<small>/4</small></strong><span>приглашено</span></div></header>
    <div class="selection-toolbar"><span>ДОСТУПНЫЕ СПЕЦИАЛИСТЫ <b>20</b></span><span class="hint">Наведите на карточку, чтобы открыть резюме · Нажмите, чтобы пригласить</span></div>
    <div class="talent-grid">
      <button v-for="candidate in game.candidates" :key="candidate.id" class="talent-card" :class="{ selected: game.interviewIds.includes(candidate.id), locked: lockedByOther.has(candidate.id) }" :disabled="lockedByOther.has(candidate.id)" @click="selectCandidate(candidate.id)">
        <CandidateAvatar :candidate="candidate" size="lg" />
        <span class="talent-index">{{ String(game.candidates.indexOf(candidate) + 1).padStart(2, '0') }}</span>
        <span class="invite-mark">{{ lockedByOther.has(candidate.id) ? '🔒' : (game.interviewIds.includes(candidate.id) ? '✓' : '+') }}</span>
        <div class="talent-meta"><strong>{{ candidate.name }}</strong><span>{{ candidate.role }}</span><small>{{ candidate.experience }}</small></div>
        <div class="resume-popover"><span>{{ lockedByOther.has(candidate.id) ? 'ЗАНЯТ ВТОРЫМ ИГРОКОМ · ' : 'РЕЗЮМЕ · ' }}{{ candidate.experience }}</span><p>{{ candidate.summary }}</p><div><b v-for="skill in candidate.skills" :key="skill">{{ skill }}</b></div></div>
      </button>
    </div>
    <footer class="selection-footer"><span><i></i> Можно выбрать ещё {{ 4 - game.interviewIds.length }} кандидата</span><button class="btn primary" :disabled="game.interviewIds.length !== 4" @click="start">НАЧАТЬ СОБЕСЕДОВАНИЕ&nbsp; →</button></footer>
  </div>
</template>
