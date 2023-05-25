import { useSystemStore } from '@/stores/system';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import("@/pages/chatgpt/index.vue") },
    { path: '/account', component: () => import("@/pages/account/index.vue") },
    { path: '/image', component: () => import("@/pages/image/index.vue") },
    { path: '/note', component: () => import("@/pages/note/index.vue") },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    switch (to.path) {
        case '/':
            useSystemStore().setPageIndex(0)
            break;
        case '/image':
            useSystemStore().setPageIndex(1)
            break;
        case '/note':
            useSystemStore().setPageIndex(2)
            break;
        case '/account':
            useSystemStore().setPageIndex(3)
            break;
        default:
            useSystemStore().setPageIndex(0)
            break;
    }
    next()
})

export { router }