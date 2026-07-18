<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import CandidateAvatar from '@/components/CandidateAvatar.vue'
import { multiplayer } from '@/services/multiplayer'
import { useDuelStore } from '@/stores/duel'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()
function choose(mode: 'career'|'quick') { multiplayer.close(); duel.deactivate(); game.mode = mode; game.reset(); router.push('/stats') }
</script>

<template>
  <div class="mode-dashboard">
    <section class="mode-heading">
      <div>
        <span class="screen-kicker">ЦЕНТР УПРАВЛЕНИЯ · СЕССИЯ 01</span>
        <h1>Выберите формат<br><em>собеседования</em></h1>
        <p>Каждое решение влияет на рейтинг, состав команды и итоговый результат.</p>
      </div>
      <div class="session-clock"><span>LOCAL TIME</span><strong>18:42</strong><i>● ONLINE</i></div>
    </section>

    <div class="mode-content">
      <section class="mode-main">
        <div class="mode-grid">
          <button class="mode-card career-card" @click="choose('career')">
            <span class="card-index">01 / CAREER</span>
            <b class="mode-symbol">♛</b>
            <h3>КАРЬЕРНЫЙ РЕЖИМ</h3>
            <p>Полный путь техлида: проведите серию интервью, оцените специалистов и соберите сбалансированную команду.</p>
            <div class="mode-tags"><span>10 вопросов</span><span>4 кандидата</span><span>~20 мин</span></div>
          </button>
          <button class="mode-card quick-card" @click="choose('quick')">
            <span class="card-index">02 / QUICK PLAY</span>
            <b class="mode-symbol">◷</b>
            <h3>БЫСТРАЯ ИГРА</h3>
            <p>Динамичное интервью на время. Проверьте техническую насмотренность и скорость принятия решений.</p>
            <div class="mode-tags"><span>5 вопросов</span><span>таймер</span><span>~7 мин</span></div>
          </button>
        </div>

        <div class="candidate-preview">
          <div class="preview-title"><span>КАНДИДАТЫ СЕГОДНЯ</span><b>4 В ОЖИДАНИИ</b></div>
          <div class="preview-people">
            <div v-for="(candidate, index) in game.candidates" :key="candidate.id" class="preview-person">
              <CandidateAvatar :candidate="candidate" size="sm" />
              <div><strong>{{ candidate.name }}</strong><span>{{ candidate.role }}</span></div>
              <i :style="{ animationDelay: `${index * .35}s` }"></i>
            </div>
          </div>
        </div>
      </section>

      <aside class="mode-sidebar">
        <div class="brief-card">
          <div class="sidebar-head"><span>БРИФИНГ</span><b>⌁</b></div>
          <h3>Ваша задача</h3>
          <ul>
            <li><i>01</i><span>Задавайте технические вопросы</span></li>
            <li><i>02</i><span>Анализируйте ответы кандидатов</span></li>
            <li><i>03</i><span>Соберите сильную команду</span></li>
          </ul>
        </div>
        <div class="activity-card">
          <div class="sidebar-head"><span>АКТИВНОСТЬ</span><b class="live-label">LIVE</b></div>
          <div class="activity-row"><i class="green"></i><span>Мария подключилась</span><time>сейчас</time></div>
          <div class="activity-row"><i></i><span>Профили обновлены</span><time>2 мин</time></div>
          <div class="activity-row"><i></i><span>Система готова</span><time>5 мин</time></div>
        </div>
        <div class="tip-card"><span>СОВЕТ ТЕХЛИДА</span><p>Сильный ответ — это не только правильная технология, но и понимание компромиссов.</p><button class="btn online-mode-button" @click="router.push('/multiplayer')">🤝 ИГРАТЬ ВДВОЁМ&nbsp; →</button></div>
      </aside>
    </div>
  </div>
</template>
