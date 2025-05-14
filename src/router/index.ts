import { createRouter, createWebHistory } from 'vue-router'
import HtmlPage from '../views/HtmlPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'htmlPage',
      component: HtmlPage,
    },
  ],
})

export default router
