<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { multiplayer, type MultiplayerEvent } from '@/services/multiplayer'
import { useGameStore } from '@/stores/game'
import { useDuelStore } from '@/stores/duel'

const router = useRouter()
const game = useGameStore()
const duel = useDuelStore()
const name = ref(localStorage.getItem('tech-lead-player-name') || 'Tech Lead')
const opponentName = ref('Второй техлид')
const roomInput = ref('')
const room = ref('')
const playerOnline = ref(false)
const ready = ref(false)
const remoteReady = ref(false)
const isHost = ref(false)
const mode = ref<'duel' | 'co-op'>('duel')
const error = ref('')
const launching = ref(false)
let stop: (() => void) | undefined

const canStart = computed(() => isHost.value && playerOnline.value && ready.value && remoteReady.value)

function saveName() {
  name.value = name.value.trim()
  if (!name.value) {
    error.value = 'Укажите имя техлида'
    return false
  }
  localStorage.setItem('tech-lead-player-name', name.value)
  return true
}

function create() {
  error.value = ''
  if (!saveName()) return
  multiplayer.lockedCandidates.clear()
  multiplayer.connect()
  multiplayer.create(name.value)
}

function join() {
  error.value = ''
  if (!saveName()) return
  if (!roomInput.value.trim()) {
    error.value = 'Введите код комнаты'
    return
  }
  multiplayer.lockedCandidates.clear()
  multiplayer.connect()
  multiplayer.join(roomInput.value, name.value)
}

function sendProfile() {
  multiplayer.gameEvent('player-profile', { name: name.value })
}

function launch(selectedMode: 'duel' | 'co-op') {
  if (launching.value) return
  launching.value = true
  mode.value = selectedMode
  multiplayer.mode = selectedMode
  game.reset()
  if (selectedMode === 'duel') duel.prepare(name.value, opponentName.value)
  else duel.deactivate()
  router.push('/lobby')
}

function handle(event: MultiplayerEvent) {
  if (event.type === 'room-created' || event.type === 'room-joined') {
    room.value = event.room
    isHost.value = event.type === 'room-created'
    if (event.type === 'room-joined') playerOnline.value = true
    sendProfile()
  }
  if (event.type === 'player-joined') {
    playerOnline.value = true
    opponentName.value = event.player.name
    duel.setOpponent(event.player.name)
    sendProfile()
    if (isHost.value) multiplayer.selectMode(mode.value)
  }
  if (event.type === 'player-left') {
    playerOnline.value = false
    remoteReady.value = false
  }
  if (event.type === 'player-ready' && event.playerId !== multiplayer.playerId) remoteReady.value = event.ready
  if (event.type === 'mode-selected') mode.value = event.mode
  if (event.type === 'error') error.value = event.message
  if (event.type === 'game-event' && event.event === 'player-profile') {
    const payload = event.payload as { name?: string; playerId?: string }
    if (payload.playerId !== multiplayer.playerId && payload.name) {
      opponentName.value = payload.name
      playerOnline.value = true
      duel.setOpponent(payload.name)
    }
  }
  if (event.type === 'game-event' && event.event === 'session-start') {
    const payload = event.payload as { mode?: 'duel' | 'co-op'; playerId?: string }
    if (payload.playerId !== multiplayer.playerId) launch(payload.mode === 'co-op' ? 'co-op' : 'duel')
  }
}

function toggleReady() {
  ready.value = !ready.value
  multiplayer.ready(ready.value)
}

function selectFormat(value: 'duel' | 'co-op') {
  mode.value = value
  multiplayer.selectMode(value)
}

async function copyRoom() {
  if (room.value) await navigator.clipboard?.writeText(room.value)
}

function start() {
  if (!canStart.value) return
  multiplayer.selectMode(mode.value)
  multiplayer.gameEvent('session-start', { mode: mode.value })
  launch(mode.value)
}

onMounted(() => { stop = multiplayer.on(handle) })
onUnmounted(() => stop?.())
</script>

<template>
  <div class="multiplayer-screen">
    <header class="project-step-head">
      <span class="screen-kicker">MULTIPLAYER HUB · ONLINE</span>
      <h1 v-if="mode === 'duel'">Сразитесь за звание<br><em>лучшего техлида</em></h1>
      <h1 v-else>Играйте вместе<br><em>в одной команде</em></h1>
      <p v-if="mode === 'duel'">Пять этапов, общий трекер прогресса и один победитель в финале.</p>
      <p v-else>Создайте комнату для коллеги и принимайте решения вместе.</p>
    </header>

    <div class="guest-auth">
      <div class="auth-avatar">{{ name.slice(0, 1).toUpperCase() }}</div>
      <div><span>ГОСТЕВОЙ ПРОФИЛЬ</span><strong>{{ name || 'Новый игрок' }}</strong><small>Без пароля · имя сохраняется на этом устройстве</small></div>
      <b>● ONLINE</b>
    </div>

    <div v-if="!room" class="room-gate">
      <section class="room-card">
        <span class="room-label">СОЗДАТЬ НОВУЮ КОМНАТУ</span>
        <h2>Бросьте вызов техлиду</h2>
        <label>Ваше имя<input v-model="name" placeholder="Например, Алексей" /></label>
        <button class="btn primary block" @click="create">СОЗДАТЬ КОМНАТУ&nbsp; →</button>
      </section>
      <div class="or-divider"><span>или</span></div>
      <section class="room-card join-card">
        <span class="room-label">ПОДКЛЮЧИТЬСЯ</span>
        <h2>У вас есть код?</h2>
        <label>Ваше имя<input v-model="name" placeholder="Например, Мария" /></label>
        <label>Код комнаты<input v-model="roomInput" maxlength="10" autocomplete="off" spellcheck="false" placeholder="ATLAS-3E3A" /></label>
        <button class="btn secondary block" @click="join">ВОЙТИ В КОМНАТУ&nbsp; →</button>
      </section>
    </div>

    <section v-else class="room-lobby">
      <div class="room-code">
        <span>КОД КОМНАТЫ</span><strong>{{ room }}</strong>
        <button class="copy-room" @click="copyRoom">⧉ КОПИРОВАТЬ</button>
        <small>Отправьте этот код второму игроку</small>
      </div>

      <div class="players-row">
        <div class="online-player"><i class="you"></i><span><b>{{ name }}</b><small>Вы · {{ ready ? 'готовы к старту' : 'не готовы' }}</small></span></div>
        <div class="connection-line"><i :class="{ active: playerOnline }"></i><span>{{ playerOnline ? 'Соперники подключены' : 'Ждём второго игрока…' }}</span></div>
        <div class="online-player" :class="{ waiting: !playerOnline }"><i></i><span><b>{{ playerOnline ? opponentName : 'Свободное место' }}</b><small>{{ playerOnline ? (remoteReady ? 'готов к старту' : 'выбирает режим') : 'Отправьте код комнаты' }}</small></span></div>
      </div>

      <div class="mode-select">
        <span>ВЫБЕРИТЕ ФОРМАТ</span>
        <button :class="{ selected: mode === 'duel' }" :disabled="!isHost" @click="selectFormat('duel')">⚔ <b>Дуэль техлидов</b><small>5 этапов · видимый прогресс · финальный победитель</small></button>
        <button :class="{ selected: mode === 'co-op' }" :disabled="!isHost" @click="selectFormat('co-op')">🤝 <b>Совместная команда</b><small>Принимайте решения вместе</small></button>
      </div>

      <div v-if="mode === 'duel'" class="duel-rules">
        <span v-for="(stage, index) in ['Драфт', 'Интервью', 'Команда', 'Стратегия', 'Инциденты']" :key="stage"><b>{{ index + 1 }}</b>{{ stage }}</span>
      </div>

      <div class="room-actions">
        <span v-if="ready && !remoteReady" class="ready-hint">Ждём готовности соперника…</span>
        <button class="btn secondary" :class="{ ready }" :disabled="!playerOnline" @click="toggleReady">{{ ready ? '✓ ГОТОВ' : 'Я ГОТОВ' }}</button>
        <button class="btn primary" :disabled="!canStart" @click="start">{{ !isHost ? 'ЖДЁМ СТАРТА' : mode === 'duel' ? 'НАЧАТЬ ДУЭЛЬ' : 'НАЧАТЬ ИГРУ' }}&nbsp; →</button>
      </div>
    </section>

    <p v-if="error" class="online-error">{{ error }}</p>
    <button class="back-link" @click="router.push('/')">← Вернуться в меню</button>
  </div>
</template>
