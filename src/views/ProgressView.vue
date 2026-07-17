<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
const router = useRouter()
const game = useGameStore()
function go() { router.push(game.currentIndex >= game.questions.length ? '/result' : '/question') }
function isCorrect(index: number) {
  const question = game.questions[index]
  const selected = game.selectedAnswerIds[index]
  return Boolean(question && selected && question.answers.find(a => a.id === selected)?.correct)
}
</script>
<template>
  <div class="center-wrap">
    <div class="panel wide">
      <h2>ПРОГРЕСС ИГРЫ</h2>
      <div class="stats-grid three">
        <div><span>Правильных ответов</span><b>{{ game.correctCount }}</b></div>
        <div><span>Текущая серия</span><b>{{ game.bestStreak }}</b></div>
        <div><span>Очки</span><b class="blue">{{ game.score }}</b></div>
      </div>
      <div class="dots">
        <i v-for="(_, i) in game.questions" :key="i" :class="{ done: i < game.currentIndex, ok: i < game.currentIndex && isCorrect(i) }">
          {{ i < game.currentIndex ? (isCorrect(i) ? '✓' : '×') : '' }}
        </i>
      </div>
      <div class="progress-row">
        <span>Вопрос {{ game.currentIndex }} из {{ game.questions.length }}</span>
        <div class="progress"><i :style="{ width: `${game.currentIndex / Math.max(game.questions.length, 1) * 100}%` }"></i></div>
      </div>
      <button class="btn primary block" @click="go">{{ game.currentIndex >= game.questions.length ? 'Показать результат' : 'Следующий вопрос' }}</button>
    </div>
  </div>
</template>
