import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Default',
        redirect: '/Vessel'
    },
    {
        path: '/:pathMatch(.*)',
        name: 'Empty',
        redirect: '/404'
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/Empty/Empty.vue')
    },
    {
        path: '/Vessel',
        name: 'Vessel',
        component: () => import('@/views/Vessel/Vessel.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
