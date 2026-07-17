<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <svg class="technology-logo" viewBox="0 0 48 48" aria-hidden="true">
    <template v-if="id === 'vue'">
      <path d="M3 7h10l11 19L35 7h10L24 43z" fill="currentColor" opacity=".38" />
      <path d="M11 7h8l5 9 5-9h8L24 30z" fill="currentColor" />
    </template>
    <template v-else-if="id === 'typescript'">
      <rect x="4" y="4" width="40" height="40" rx="5" fill="currentColor" opacity=".2" />
      <text x="24" y="31" fill="currentColor" font-size="18" font-weight="800" text-anchor="middle">TS</text>
    </template>
    <template v-else-if="id === 'java'">
      <path d="M18 34c-8 2-7 6 1 7 8 2 19-1 20-4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
      <path d="M15 28h23c0 8-4 11-11 11s-11-3-12-11zM38 30h3c4 0 4 6-2 7" fill="none" stroke="currentColor" stroke-width="2.6" />
      <path d="M22 24c8-4-5-6 3-11M28 24c8-5-3-7 4-13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
    </template>
    <template v-else-if="id === 'postgres'">
      <ellipse cx="24" cy="11" rx="15" ry="6" fill="currentColor" opacity=".28" />
      <path d="M9 11v22c0 3 7 6 15 6s15-3 15-6V11M9 22c0 3 7 6 15 6s15-3 15-6" fill="none" stroke="currentColor" stroke-width="2.5" />
      <text x="24" y="20" fill="currentColor" font-size="11" font-weight="800" text-anchor="middle">PG</text>
    </template>
    <template v-else-if="id === 'kafka'">
      <path d="M24 10v28M24 17 12 24m12 7 12-7" fill="none" stroke="currentColor" stroke-width="2.6" />
      <circle cx="24" cy="9" r="5" fill="currentColor" /><circle cx="24" cy="39" r="5" fill="currentColor" />
      <circle cx="10" cy="25" r="5" fill="currentColor" /><circle cx="38" cy="25" r="5" fill="currentColor" />
    </template>
    <template v-else-if="id === 'k8s'">
      <path d="m24 3 18 10v22L24 45 6 35V13z" fill="currentColor" opacity=".2" />
      <circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" stroke-width="3" />
      <path d="M24 8v9m0 14v9M8 24h9m14 0h9M13 13l7 7m8 8 7 7m0-22-7 7m-8 8-7 7" stroke="currentColor" stroke-width="2.3" />
    </template>
    <template v-else-if="id === 'grafana'">
      <path d="M9 31c-3-13 8-24 21-20 10 3 14 15 7 23-5 6-16 7-21 1-4-5-1-13 6-15 6-2 12 4 9 10-2 4-9 4-10-1" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />
      <path d="M9 13h7M32 8l-2 6M41 19l-6 2" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </template>
    <template v-else-if="id === 'playwright'">
      <path d="M5 13c7-3 13-2 18 2l-2 18c-5 6-13 5-16-2z" fill="currentColor" opacity=".25" />
      <path d="M22 12c8-4 15-2 21 2l-3 19c-5 8-16 8-21 0z" fill="currentColor" opacity=".48" />
      <path d="M10 23c2-2 5-2 7 0m-6 7c2 2 5 2 7 0m16-8c2-2 5-2 6 0m-13 8c3 3 7 3 10 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
    </template>
    <template v-else-if="id === 'redis'">
      <path d="m24 5 19 9-19 9-19-9zM5 23l19 9 19-9M5 32l19 9 19-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" />
    </template>
    <template v-else-if="id === 'clickhouse'">
      <path d="M8 9v30M16 9v30M24 9v30M32 9v30M40 18v12" stroke="currentColor" stroke-width="5" />
    </template>
    <template v-else-if="id === 's3'">
      <path d="m24 4 17 9v22l-17 9-17-9V13z" fill="currentColor" opacity=".2" />
      <path d="m7 13 17 10 17-10M24 23v21" fill="none" stroke="currentColor" stroke-width="2.5" />
      <text x="24" y="19" fill="currentColor" font-size="10" font-weight="800" text-anchor="middle">S3</text>
    </template>
    <template v-else-if="id === 'prometheus'">
      <path d="M24 4c2 10 10 11 10 20 0 7-4 11-10 11s-10-4-10-11c0-6 4-9 6-14 1 5 4 7 4 11 3-4 3-10 0-17z" fill="currentColor" opacity=".75" />
      <path d="M10 37h28M15 42h18" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </template>
    <template v-else-if="id === 'argocd'">
      <circle cx="24" cy="24" r="19" fill="currentColor" opacity=".18" />
      <path d="m14 35 10-24 10 24M18 28h12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" />
      <circle cx="37" cy="11" r="4" fill="currentColor" />
    </template>
    <template v-else-if="id === 'docker'">
      <path d="M6 27h32c-1 10-8 15-18 15-8 0-13-5-14-15z" fill="currentColor" opacity=".3" />
      <path d="M11 21h7v6h-7zm8 0h7v6h-7zm8 0h7v6h-7zm-8-7h7v6h-7zm8 0h7v6h-7z" fill="currentColor" />
      <path d="M38 24c2-3 4-4 7-3-1 4-4 6-8 6" fill="none" stroke="currentColor" stroke-width="2.4" />
    </template>
    <template v-else-if="id === 'vault'">
      <path d="m24 4 17 7v12c0 11-7 18-17 22C14 41 7 34 7 23V11z" fill="currentColor" opacity=".2" />
      <path d="M18 23a6 6 0 1 1 9 5v7h-6v-7a6 6 0 0 1-3-5z" fill="currentColor" />
    </template>
    <template v-else-if="id === 'openapi'">
      <path d="m24 4 17 10v20L24 44 7 34V14z" fill="none" stroke="currentColor" stroke-width="2.5" />
      <circle cx="24" cy="14" r="4" fill="currentColor" /><circle cx="15" cy="31" r="4" fill="currentColor" /><circle cx="33" cy="31" r="4" fill="currentColor" />
      <path d="m22 18-5 9m9-9 5 9m-12 4h10" stroke="currentColor" stroke-width="2.5" />
    </template>
    <template v-else>
      <path d="m24 3 19 11v20L24 45 5 34V14z" fill="currentColor" opacity=".2" />
      <text x="24" y="31" fill="currentColor" font-size="20" font-weight="800" text-anchor="middle">N</text>
    </template>
  </svg>
</template>
