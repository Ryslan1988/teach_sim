<script setup lang="ts">
import { useRouter } from 'vue-router'
import DuelTracker from '@/components/DuelTracker.vue'
import { useDuelStore } from '@/stores/duel'
const router = useRouter()
const duel = useDuelStore()
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <button class="brand" @click="router.push('/')"><span>TL</span> TECH LEAD <b>SIMULATOR</b></button>
      <div class="topbar-session"><i></i><span>{{ duel.active ? 'DUEL SESSION · LIVE' : 'INTERVIEW SESSION' }}</span></div>
      <button class="icon-btn" title="Пауза" @click="router.push('/pause')">Ⅱ</button>
    </header>
    <DuelTracker />
    <section class="page"><slot /></section>
  </main>
</template>
