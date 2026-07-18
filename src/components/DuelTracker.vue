<script setup lang="ts">
import { computed } from 'vue'
import { duelStages, useDuelStore } from '@/stores/duel'

const duel = useDuelStore()
const advantage = computed(() => {
  const difference = duel.localScore - duel.remote.score
  if (!difference) return 'СЧЁТ РАВНЫЙ'
  return difference > 0 ? `ВЫ ВПЕРЕДИ НА ${difference}` : `СОПЕРНИК ВПЕРЕДИ НА ${Math.abs(difference)}`
})
</script>

<template>
  <section v-if="duel.active" class="duel-tracker" aria-label="Прогресс дуэли">
    <div class="duel-player you">
      <span class="duel-avatar">{{ duel.playerName.slice(0, 1).toUpperCase() }}</span>
      <span><small>ВЫ · {{ duel.localStageLabel }}</small><strong>{{ duel.playerName }}</strong></span>
      <b>{{ duel.localScore }}</b>
    </div>

    <div class="duel-race">
      <div class="race-title"><span>⚔ ДУЭЛЬ ТЕХЛИДОВ</span><b>{{ advantage }}</b></div>
      <div class="race-lane you"><span>ВЫ</span><div><i :style="{ width: `${duel.localOverallProgress}%` }"></i></div><b>{{ duel.localOverallProgress }}%</b></div>
      <div class="race-lane rival"><span>ОН</span><div><i :style="{ width: `${duel.remoteOverallProgress}%` }"></i></div><b>{{ duel.remoteOverallProgress }}%</b></div>
      <div class="race-stages" aria-hidden="true"><span v-for="stage in duelStages" :key="stage.id">{{ stage.index }}. {{ stage.short }}</span></div>
    </div>

    <div class="duel-player rival" :class="{ offline: !duel.opponentOnline }">
      <b>{{ duel.remote.score }}</b>
      <span><small>{{ duel.opponentOnline ? duel.remoteStageLabel : 'НЕ В СЕТИ' }}</small><strong>{{ duel.opponentName }}</strong></span>
      <span class="duel-avatar">{{ duel.opponentName.slice(0, 1).toUpperCase() }}</span>
    </div>
  </section>
</template>
