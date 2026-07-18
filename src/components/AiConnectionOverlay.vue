<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const steps = ['Передаём контекст', 'Генерируем вопрос', 'Готовим 4 ответа']
const activeStep = ref(0)
let stepTimer: number | undefined

const status = computed(() => steps[activeStep.value])

onMounted(() => {
  stepTimer = window.setInterval(() => {
    if (activeStep.value < steps.length - 1) activeStep.value += 1
  }, 1400)
})

onUnmounted(() => window.clearInterval(stepTimer))
</script>

<template>
  <div class="ai-connection-backdrop" role="status" aria-live="polite" aria-label="Устанавливается связь с AI-агентом">
    <section class="ai-connection-window">
      <header class="ai-connection-titlebar">
        <span class="ai-agent-light"></span>
        <div>
          <small>AI INTERVIEW CHANNEL</small>
          <strong>Связь с AI-агентом</strong>
        </div>
        <b>CONNECTING</b>
      </header>

      <div class="ai-connection-body">
        <div class="ai-orbit" aria-hidden="true"><i></i><span>AI</span></div>
        <h2>{{ status }}<span class="ai-loading-dots">...</span></h2>
        <p>Агент создаёт один технический вопрос и персональные ответы выбранных кандидатов.</p>

        <div class="ai-stage-toolbar">
          <div v-for="(step, index) in steps" :key="step" :class="{ active: index === activeStep, done: index < activeStep }">
            <i>{{ index < activeStep ? '✓' : String(index + 1).padStart(2, '0') }}</i>
            <span>{{ step }}</span>
          </div>
        </div>

        <div class="ai-connection-progress"><i></i></div>
        <small class="ai-fallback-note">Если AI-сервис не ответит, интервью автоматически продолжится на резервном сценарии.</small>
      </div>
    </section>
  </div>
</template>
