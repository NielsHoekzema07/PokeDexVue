import HomepageView from '@/views/HomepageView.vue'
import LikedPokemonView from '@/views/LikedPokemonView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', component: HomepageView
    },
    {
      path: '/Favorieten', component: LikedPokemonView
    },
  ],
})

export default router
