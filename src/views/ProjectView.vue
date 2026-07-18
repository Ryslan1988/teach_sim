<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useDuelStore } from '@/stores/duel'
import { technologies } from '@/data/project'
import TechnologyIcon from '@/components/TechnologyIcon.vue'
const router = useRouter(); const game = useGameStore(); const duel = useDuelStore()
function toggleTechnology(id: string) { game.toggleTechnology(id); if (duel.active) duel.updateProgress(game.selectedTechIds.length / 6 * 100) }
function next() { if (duel.active) duel.enterStage('incidents', 0); router.push('/issues') }
onMounted(() => { if (duel.active) duel.enterStage('strategy', game.selectedTechIds.length / 6 * 100) })
</script>
<template><div class="project-stage"><header class="project-step-head"><span class="screen-kicker">ЭТАП 04 / 05 · TECH STRATEGY</span><h1>Техническое задание<br><em>«Atlas Commerce»</em></h1><p>Спроектируйте платформу для маркетплейса с 2 млн заказов в месяц и SLA 99.95%.</p></header><div class="project-brief-layout"><article class="project-brief"><div class="brief-label">PRODUCT BRIEF <b>CONFIDENTIAL</b></div><h2>Единый checkout для трёх рынков</h2><p>Команда должна запустить новый checkout за 12 недель. Платформа принимает оплату, рассчитывает доставку и синхронизирует статусы заказа между web, mobile и партнёрами.</p><div class="brief-metrics"><div><strong>2M</strong><span>заказов / месяц</span></div><div><strong>99.95%</strong><span>целевой SLA</span></div><div><strong>12</strong><span>недель до запуска</span></div></div><div class="constraints"><span>ОГРАНИЧЕНИЯ</span><b>GDPR</b><b>PCI DSS</b><b>Multi-region</b></div></article><section class="tech-pick"><div class="tech-pick-head"><div><span>TECH STACK</span><h2>Выберите технологии</h2></div><b>{{ game.selectedTechIds.length }} / 6</b></div><div class="tech-grid"><button v-for="tech in technologies" :key="tech.id" class="tech-card" :class="{ selected: game.selectedTechIds.includes(tech.id) }" @click="toggleTechnology(tech.id)"><span class="tech-icon" :style="{ color: tech.accent }"><TechnologyIcon :id="tech.id" /></span><span class="tech-category">{{ tech.category }}</span><strong>{{ tech.name }}</strong><p>{{ tech.description }}</p><small>↳ {{ tech.tradeoff }}</small><i>{{ game.selectedTechIds.includes(tech.id) ? '✓' : '+' }}</i></button></div><button class="btn primary block" :disabled="game.selectedTechIds.length < (duel.active ? 6 : 4)" @click="next">РАЗОБРАТЬ РИСКИ ПРОЕКТА&nbsp; →</button></section></div></div></template>
