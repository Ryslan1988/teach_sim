<script setup lang="ts">
import { computed, ref } from 'vue'; import { useRouter } from 'vue-router'; import { useGameStore } from '@/stores/game'; import CandidateAvatar from '@/components/CandidateAvatar.vue'
const router=useRouter(); const game=useGameStore(); const busy=ref(false); const q=computed(()=>game.currentQuestion)
async function select(id:string){if(busy.value)return;busy.value=true;await game.answer(id);busy.value=false;router.push(game.currentIndex>=game.questions.length?'/progress':'/progress')}
function candidate(id:string){return game.candidates.find(c=>c.id===id)!}
</script>
<template><div class="center-wrap"><div class="panel xwide"><h2>ВЫБЕРИТЕ ПРАВИЛЬНЫЙ ОТВЕТ</h2><div class="answer-list" v-if="q"><button v-for="a in q.answers" :key="a.id" :disabled="busy" @click="select(a.id)"><CandidateAvatar :candidate="candidate(a.candidateId)" size="sm"/><span>{{a.text}}</span></button></div></div></div></template>
