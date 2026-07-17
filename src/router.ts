import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
const routes = [
  { path: '/', component: HomeView, meta: { bare: true } },
  { path: '/mode', component: () => import('@/views/ModeView.vue') },
  { path: '/multiplayer', component: () => import('@/views/MultiplayerView.vue') },
  { path: '/multiplayer/:mode', component: () => import('@/views/CallView.vue') },
  { path: '/stats', component: () => import('@/views/StatsView.vue') },
  { path: '/lobby', component: () => import('@/views/LobbyView.vue') },
  { path: '/call', component: () => import('@/views/CallView.vue') },
  { path: '/question', component: () => import('@/views/QuestionView.vue') },
  { path: '/answers', component: () => import('@/views/AnswersView.vue') },
  { path: '/progress', component: () => import('@/views/ProgressView.vue') },
  { path: '/result', component: () => import('@/views/ResultView.vue') },
  { path: '/details', component: () => import('@/views/DetailsView.vue') },
  { path: '/team-select', component: () => import('@/views/TeamSelectView.vue') },
  { path: '/team', component: () => import('@/views/TeamView.vue') },
  { path: '/project', component: () => import('@/views/ProjectView.vue') },
  { path: '/issues', component: () => import('@/views/IssuesView.vue') },
  { path: '/roadmap', component: () => import('@/views/RoadmapView.vue') },
  { path: '/final', component: () => import('@/views/FinalView.vue') },
  { path: '/pause', component: () => import('@/views/PauseView.vue') }
]
export default createRouter({ history: createWebHistory(), routes })
