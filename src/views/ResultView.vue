<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
const router = useRouter()
const game = useGameStore()
</script>

<template>
  <div class="center-wrap">
    <div class="panel wide result">
      <h2>СОБЕСЕДОВАНИЕ ЗАВЕРШЕНО!</h2>
      <p>{{ game.interviewResult?.summary || 'Ваш результат' }}</p>
      <div class="big-score">{{ game.correctCount }}/{{ game.questions.length }}</div>
      <div class="result-metrics">
        <div><span>AI score</span><b>{{ game.interviewResult?.totalScore ?? game.score }}</b></div>
        <div><span>Уровень</span><b>{{ game.interviewResult?.level || '—' }}</b></div>
        <div><span>Источник</span><b>{{ game.interviewResult?.source === 'integration' ? 'AI' : 'MOCK' }}</b></div>
      </div>
      <button class="btn primary" @click="router.push('/details')">Посмотреть детально</button>
    </div>
  </div>
</template>
