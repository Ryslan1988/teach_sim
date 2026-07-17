<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <button class="brand" @click="router.push('/')"><span>TL</span> TECH LEAD <b>SIMULATOR</b></button>
      <div class="topbar-session"><i></i><span>INTERVIEW SESSION</span></div>
      <button class="icon-btn" title="Пауза" @click="router.push('/pause')">Ⅱ</button>
    </header>
    <section class="page"><slot /></section>
  </main>
</template>
