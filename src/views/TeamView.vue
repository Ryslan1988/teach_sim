<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import CandidateAvatar from '@/components/CandidateAvatar.vue'
import { useDuelStore } from '@/stores/duel'
const router = useRouter(); const game = useGameStore()
const duel = useDuelStore()
const team = computed(() => game.candidates.filter(c => game.teamIds.includes(c.id)))
const suggestions = computed(() => game.candidates.filter(c => !game.teamIds.includes(c.id)).slice(0, 4))
function addMember(id: string) { game.addTeamMember(id); if (duel.active) duel.updateProgress(game.teamIds.length / 5 * 100) }
function next() { if (duel.active) duel.enterStage('strategy', 0); router.push('/project') }
onMounted(() => { if (duel.active) duel.enterStage('team', game.teamIds.length / 5 * 100) })
</script>
<template>
  <div class="team-builder-screen">
    <header class="project-step-head"><span class="screen-kicker">ЭТАП 03 / 05 · TEAM DESIGN</span><h1>Соберите команду<br><em>для запуска проекта</em></h1><p>У вас уже есть сильное ядро. Добавьте ещё двух специалистов, чтобы закрыть пробелы.</p></header>
    <section class="team-builder-layout">
      <div class="panel team-panel"><div class="team-panel-head"><div><span>СОБРАННОЕ ЯДРО</span><h2>Ваша команда</h2></div><b>{{ team.length }} / 5</b></div><div class="expanded-team"><article v-for="c in team" :key="c.id" class="team-member"><CandidateAvatar :candidate="c" size="lg"/><strong>{{ c.name }}</strong><small>{{ c.role }}</small><i>✓</i></article><article v-for="n in 5-team.length" :key="n" class="team-empty"><span>+</span><small>Место свободно</small></article></div><div class="team-signal"><i></i><span>Командный баланс</span><b>{{ team.length >= 5 ? 'ОТЛИЧНЫЙ' : 'НУЖНЫ ЕЩЁ 2 РОЛИ' }}</b></div></div>
      <aside class="team-recruit"><div class="recruit-head"><span>РЕКОМЕНДАЦИИ AI</span><b>ДОБРАТЬ 2</b></div><h2>Закройте пробелы</h2><p>Эти специалисты лучше всего дополняют выбранное ядро.</p><div class="recruit-list"><button v-for="c in suggestions" :key="c.id" class="recruit-card" :class="{ added: game.teamIds.includes(c.id) }" @click="addMember(c.id)"><CandidateAvatar :candidate="c" size="sm"/><span><strong>{{ c.name }}</strong><small>{{ c.role }}</small></span><i>{{ game.teamIds.includes(c.id) ? '✓' : '+' }}</i></button></div></aside>
    </section>
    <footer class="team-footer"><span>Следующий шаг: определить техническую стратегию</span><button class="btn primary" :disabled="team.length < 5" @click="next">К ТЕХНИЧЕСКОМУ ЗАДАНИЮ&nbsp; →</button></footer>
  </div>
</template>
