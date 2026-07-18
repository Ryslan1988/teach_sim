<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useDuelStore } from '@/stores/duel'
import { multiplayer } from '@/services/multiplayer'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()

const scoreRows = computed(() => [
  { label: 'Техническое интервью', local: duel.localScores.interview, remote: duel.remote.scores.interview },
  { label: 'Состав команды', local: duel.localScores.team, remote: duel.remote.scores.team },
  { label: 'Техническая стратегия', local: duel.localScores.strategy, remote: duel.remote.scores.strategy },
  { label: 'Решение инцидентов', local: duel.localScores.incidents, remote: duel.remote.scores.incidents },
])

const title = computed(() => {
  if (duel.winner === 'pending') return 'ВЫ НА ФИНИШЕ'
  if (duel.winner === 'you') return 'ВЫ ПОБЕДИЛИ!'
  if (duel.winner === 'opponent') return `ПОБЕЖДАЕТ ${duel.opponentName.toUpperCase()}`
  return 'БОЕВАЯ НИЧЬЯ'
})

const subtitle = computed(() => {
  if (duel.winner === 'pending') return `${duel.opponentName} ещё проходит этапы. Итог появится автоматически.`
  if (duel.winner === 'draw') return 'Решения и скорость оказались одинаковыми — победа разделена.'
  return duel.winnerReason
})

function leaveDuel() {
  multiplayer.close()
  duel.deactivate()
  router.push('/')
}

onMounted(() => { if (duel.active) duel.finish() })
</script>

<template>
  <div v-if="duel.active" class="duel-final-screen">
    <section class="duel-final-hero">
      <span class="screen-kicker">ДУЭЛЬ ТЕХЛИДОВ · ФИНАЛ</span>
      <div class="duel-trophy" :class="duel.winner">{{ duel.winner === 'pending' ? '⌛' : duel.winner === 'draw' ? '⚔' : '🏆' }}</div>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <span v-if="duel.winner !== 'pending' && duel.winner !== 'draw'" class="victory-reason">РЕШАЮЩИЙ КРИТЕРИЙ · {{ duel.winnerReason }}</span>
    </section>

    <section class="duel-scoreboard">
      <div class="final-player" :class="{ winner: duel.winner === 'you' }">
        <span>ВЫ</span><strong>{{ duel.playerName }}</strong><b>{{ duel.localScore }}</b><small>ОЧКОВ</small>
      </div>
      <div class="final-versus"><span>VS</span><b>{{ duel.winner === 'pending' ? 'СОПЕРНИК ЕЩЁ В ИГРЕ' : 'ФИНАЛЬНЫЙ СЧЁТ' }}</b></div>
      <div class="final-player rival" :class="{ winner: duel.winner === 'opponent', waiting: !duel.remote.finished }">
        <span>СОПЕРНИК</span><strong>{{ duel.opponentName }}</strong><b>{{ duel.remote.score }}</b><small>{{ duel.remote.finished ? 'ОЧКОВ' : `${duel.remoteStageLabel} · ${duel.remoteOverallProgress}%` }}</small>
      </div>
    </section>

    <section class="duel-breakdown">
      <header><span>РАЗБОР ПО ЭТАПАМ</span><b>{{ duel.playerName }}</b><i>{{ duel.opponentName }}</i></header>
      <div v-for="row in scoreRows" :key="row.label" class="breakdown-row">
        <span>{{ row.label }}</span>
        <b :class="{ best: row.local > row.remote }">{{ row.local }}</b>
        <i :class="{ best: row.remote > row.local }">{{ row.remote }}</i>
      </div>
      <p class="score-rules">Очки начисляются за сильные ответы, баланс ролей, стратегический стек и корректное решение инцидентов. При равенстве учитываются этапы по приоритету, затем скорость.</p>
    </section>

    <div class="duel-final-actions">
      <button v-if="duel.winner !== 'pending'" class="btn primary" @click="leaveDuel">ВЕРНУТЬСЯ НА ГЛАВНУЮ&nbsp; →</button>
      <button v-else class="btn secondary" disabled>ЖДЁМ ФИНИША СОПЕРНИКА…</button>
      <button v-if="duel.winner === 'pending'" class="back-link" @click="leaveDuel">Выйти из дуэли</button>
    </div>
  </div>

  <div v-else class="center-wrap">
    <div class="panel wide final">
      <h1>ПОЗДРАВЛЯЕМ!</h1><p>Вы собрали отличную команду!</p><div class="trophy">🏆</div>
      <div class="final-score"><span>Итоговые очки</span><b>{{ game.score + game.teamIds.length * 250 }}</b></div>
      <button class="btn primary block" @click="router.push('/')">На главную</button>
    </div>
  </div>
</template>
