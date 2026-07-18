<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useDuelStore } from '@/stores/duel'
import CandidateAvatar from '@/components/CandidateAvatar.vue'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()
const sorted = computed(() => [...game.candidates].sort((a, b) => b.answers - a.answers))

function toggleCandidate(id: string) {
  game.toggleTeam(id)
  if (duel.active) duel.updateProgress(game.teamIds.length / 5 * 100)
}

onMounted(() => {
  if (duel.active) duel.enterStage('team', game.teamIds.length / 5 * 100)
})
</script>

<template>
  <div class="center-wrap">
    <div class="panel xwide team-select-panel">
      <span v-if="duel.active" class="screen-kicker">ЭТАП 03 / 05 · TEAM DESIGN</span>
      <h2>{{ duel.active ? 'СОБЕРИТЕ КОМАНДУ СИЛЬНЕЕ СОПЕРНИКА' : 'ВЫБЕРИТЕ КАНДИДАТОВ В КОМАНДУ' }}</h2>
      <div class="candidate-grid selectable">
        <button v-for="candidate in sorted" :key="candidate.id" class="candidate-card" :class="{ selected: game.teamIds.includes(candidate.id) }" @click="toggleCandidate(candidate.id)">
          <CandidateAvatar :candidate="candidate" size="lg" />
          <h3>{{ candidate.name }}</h3>
          <small>{{ candidate.role }}</small>
          <ul><li v-for="skill in candidate.skills" :key="skill">{{ skill }}</li></ul>
          <span class="picked">Выбрано ответов: {{ candidate.answers }}</span>
        </button>
      </div>
      <button class="btn primary block" :disabled="game.teamIds.length !== 3" @click="router.push('/team')">ПРИНЯТЬ В КОМАНДУ ({{ game.teamIds.length }}/3)&nbsp; →</button>
    </div>
  </div>
</template>
