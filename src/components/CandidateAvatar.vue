<script setup lang="ts">
import type { Candidate } from '@/types/game'

import portrait00 from '@/assets/images/portraits/00.png'
import portrait01 from '@/assets/images/portraits/01.png'
import portrait02 from '@/assets/images/portraits/02.png'
import portrait03 from '@/assets/images/portraits/03.png'
import portrait04 from '@/assets/images/portraits/04.png'
import portrait05 from '@/assets/images/portraits/05.png'
import portrait06 from '@/assets/images/portraits/06.png'
import portrait07 from '@/assets/images/portraits/07.png'
import portrait08 from '@/assets/images/portraits/08.png'
import portrait09 from '@/assets/images/portraits/09.png'
import portrait10 from '@/assets/images/portraits/10.png'
import portrait11 from '@/assets/images/portraits/11.png'
import portrait12 from '@/assets/images/portraits/12.png'
import portrait13 from '@/assets/images/portraits/13.png'
import portrait14 from '@/assets/images/portraits/14.png'
import portrait15 from '@/assets/images/portraits/15.png'
import portrait16 from '@/assets/images/portraits/16.png'
import portrait17 from '@/assets/images/portraits/17.png'
import portrait18 from '@/assets/images/portraits/18.png'
import portrait19 from '@/assets/images/portraits/19.png'

defineProps<{ candidate: Candidate; size?: 'sm' | 'md' | 'lg' }>()

const portraits = [
  portrait00, portrait01, portrait02, portrait03, portrait04,
  portrait05, portrait06, portrait07, portrait08, portrait09,
  portrait10, portrait11, portrait12, portrait13, portrait14,
  portrait15, portrait16, portrait17, portrait18, portrait19,
]
</script>

<template>
  <div class="avatar portrait-avatar" :class="[size || 'md', `candidate-${candidate.id}`]" :style="{ '--accent': candidate.accent, backgroundImage: `url(${portraits[candidate.portraitIndex ?? 0] ?? portrait00})` }">
    <span class="sr-only">{{ candidate.name }}</span>
  </div>
</template>
