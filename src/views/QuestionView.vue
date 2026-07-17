<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'; import { useRouter } from 'vue-router'; import { useGameStore } from '@/stores/game'
const router=useRouter(); const game=useGameStore(); const seconds=ref(45); const q=computed(()=>game.currentQuestion)
onMounted(async()=>{if(!game.questions.length) await game.bootstrap(); if(!game.currentQuestion) game.reset()})
function next(){router.push('/answers')}
</script>
<template><div class="question-layout"><div class="interviewer-art"><div class="manager big"><div class="head"></div><div class="body"></div></div><div class="desk long"></div></div><div class="panel question-panel" v-if="q"><div class="question-meta">ВОПРОС {{game.currentIndex+1}} ИЗ {{game.questions.length}} · {{q.category}}</div><h2>{{q.title}}</h2><div class="timer">Время на ответ: <b>00:{{String(seconds).padStart(2,'0')}}</b></div><div class="progress"><i :style="{width: `${(game.currentIndex/game.questions.length)*100}%`}"></i></div><button class="btn primary block" @click="next">Показать ответы кандидатов</button></div></div></template>
