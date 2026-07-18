<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useDuelStore } from '@/stores/duel'
import { technologies } from '@/data/project'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()
function techName(id: string) { return technologies.find(technology => technology.id === id)?.name || id }
onMounted(() => { if (duel.active) duel.enterStage('incidents', 100) })
</script>

<template>
  <div class="roadmap-stage">
    <header class="project-step-head">
      <span class="screen-kicker">PROJECT ATLAS · FINAL PLAN</span>
      <h1>Ваша дорожная карта<br><em>до production</em></h1>
      <p>План собран из решений команды, выбранного стека и приоритетов риска.</p>
    </header>
    <section class="roadmap-board">
      <div class="roadmap-meta"><span>12 НЕДЕЛЬ · 4 ФАЗЫ · {{ game.teamIds.length }} УЧАСТНИКОВ</span><b>READY FOR REVIEW</b></div>
      <div class="roadmap-columns">
        <article><span class="phase">01 · FOUNDATION <small>WEEK 1—3</small></span><h3>Контракты и границы</h3><p>Согласовать домены, API и схему данных. Поднять observability до первой строки кода.</p><b class="road-tech">{{ techName(game.selectedTechIds[0] || 'typescript') }}</b><b class="road-tech">{{ techName(game.selectedTechIds[1] || 'postgres') }}</b></article>
        <article><span class="phase">02 · BUILD <small>WEEK 4—7</small></span><h3>Checkout core</h3><p>Собрать оплату, расчёт доставки и идемпотентную обработку событий заказа.</p><b class="road-tech">{{ techName(game.selectedTechIds[2] || 'java') }}</b><b class="road-tech">{{ techName(game.selectedTechIds[3] || 'kafka') }}</b></article>
        <article><span class="phase">03 · HARDEN <small>WEEK 8—10</small></span><h3>Надёжность и качество</h3><p>Закрыть критические сценарии тестами, нагрузкой и трассировкой.</p><b class="road-tech">{{ techName(game.selectedTechIds[4] || 'playwright') }}</b><b class="road-tech">{{ techName(game.selectedTechIds[5] || 'grafana') }}</b></article>
        <article><span class="phase">04 · LAUNCH <small>WEEK 11—12</small></span><h3>Постепенный rollout</h3><p>Canary-релиз, контроль SLO и готовый план отката для каждого региона.</p><b class="road-tech">Kubernetes rollout</b></article>
      </div>
      <div class="roadmap-footer">
        <div><span>КРИТИЧЕСКИХ РИСКОВ ЗАКРЫТО</span><strong>{{ Object.keys(game.issueSelections).length }}/10</strong></div>
        <div><span>ГОТОВНОСТЬ КОМАНДЫ</span><strong>92%</strong></div>
        <button class="btn primary" @click="router.push('/final')">{{ duel.active ? 'ЗАВЕРШИТЬ ДУЭЛЬ' : 'ПОДТВЕРДИТЬ ROADMAP' }}&nbsp; →</button>
      </div>
    </section>
  </div>
</template>
