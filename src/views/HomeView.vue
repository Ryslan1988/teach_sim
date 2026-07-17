<script setup lang="ts">
import { useRouter } from 'vue-router'
import heroImage from '@/assets/images/interview-hero.png'

const router = useRouter()
</script>

<template>
  <main class="home-screen" :style="{ '--hero-image': `url(${heroImage})` }">
    <header class="home-nav">
      <button class="home-brand" aria-label="На главную">
        <span class="brand-mark">TL</span>
        <span>TECH LEAD <b>SIMULATOR</b></span>
      </button>
      <div class="home-nav-meta">
        <span><i></i> Симуляция готова</span>
        <button class="round-control" aria-label="Настройки">⚙</button>
      </div>
    </header>

    <section class="hero-copy">
      <div class="eyebrow"><span>01</span> INTERVIEW MANAGEMENT GAME</div>
      <h1>Соберите команду,<br><em>которой доверяют.</em></h1>
      <p>Проведите технические интервью, распознайте сильных инженеров и примите решения, которые определят будущее продукта.</p>

      <div class="actions hero-actions">
        <button class="btn primary hero-start" @click="router.push('/mode')">
          <span class="play-icon">▶</span>
          <span><small>НАЧАТЬ СИМУЛЯЦИЮ</small>Новая игра</span>
          <b>→</b>
        </button>
        <button class="btn secondary hero-settings">⚙ &nbsp; Настройки</button>
      </div>

      <div class="hero-stats">
        <div><strong>10</strong><span>технических<br>сценариев</span></div>
        <div><strong>4</strong><span>уникальных<br>кандидата</span></div>
        <div><strong>∞</strong><span>вариантов<br>решений</span></div>
      </div>
    </section>

    <aside class="interview-status">
      <div class="status-top"><span class="live-dot"></span> СОБЕСЕДОВАНИЕ · LIVE <b>42:18</b></div>
      <div class="status-person">
        <div class="mini-avatar">А</div>
        <div><strong>Алексей Воронов</strong><span>Senior Backend Developer</span></div>
        <span class="signal">▥</span>
      </div>
    </aside>

    <div class="scroll-cue"><span>SCROLL TO EXPLORE</span><i></i></div>
  </main>
</template>
