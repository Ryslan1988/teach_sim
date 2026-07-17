<script setup lang="ts">import { onMounted } from 'vue'; import { useRoute } from 'vue-router'; import AppShell from '@/components/AppShell.vue'; import { useGameStore } from '@/stores/game'; const route=useRoute(); const game=useGameStore(); onMounted(()=>game.bootstrap())</script>
<template><RouterView v-if="route.meta.bare"/><AppShell v-else><RouterView/></AppShell></template>
