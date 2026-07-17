<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="stats-dashboard">
    <section class="stats-titlebar">
      <div><span class="screen-kicker">ПРОФИЛЬ ТЕХЛИДА</span><h1>Ваша статистика</h1></div>
      <div class="level-badge"><span>УРОВЕНЬ 07</span><b>ARCHITECT</b></div>
    </section>
    <div class="stats-layout">
      <section class="panel stats-primary">
        <div class="stats-grid">
          <div><span>Игр сыграно</span><b>12</b><small>+3 за неделю</small></div>
          <div><span>Процент побед</span><b>75%</b><small>выше 68% игроков</small></div>
          <div><span>Лучший результат</span><b>8/10</b><small>личный рекорд</small></div>
          <div><span>Команд создано</span><b>7</b><small>21 специалист</small></div>
        </div>
        <div class="last-session">
          <div class="section-row"><h3>ПОСЛЕДНЯЯ ИГРА</h3><span>Сегодня · 17:24</span></div>
          <div class="session-score"><strong>8<span>/10</span></strong><div><b>Backend Interview</b><small>Карьерный режим · 16 минут</small></div><em>+240 XP</em></div>
          <div class="progress-row"><div class="progress"><i style="width:80%"></i></div><strong>80%</strong></div>
        </div>
        <button class="btn primary block" @click="router.push('/lobby')">ПЕРЕЙТИ В ЛОББИ&nbsp; →</button>
      </section>
      <aside class="stats-aside">
        <div class="rank-card"><span>ТЕКУЩИЙ РЕЙТИНГ</span><strong>#1 284</strong><div class="rank-line"><i></i></div><small>До следующей лиги: 320 XP</small></div>
        <div class="achievements-card"><div class="sidebar-head"><span>ДОСТИЖЕНИЯ</span><b>3 / 12</b></div><div class="achievement"><i>◆</i><div><b>Холодная голова</b><span>5 верных ответов подряд</span></div></div><div class="achievement"><i>♜</i><div><b>Сильный состав</b><span>Соберите команду из трёх ролей</span></div></div><div class="achievement locked"><i>?</i><div><b>Скрытое достижение</b><span>Продолжайте играть</span></div></div></div>
        <div class="next-interview"><span class="live-dot"></span><div><b>Следующее интервью готово</b><small>4 кандидата уже в лобби</small></div></div>
      </aside>
    </div>
  </div>
</template>
