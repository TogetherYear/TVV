import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Default',
        redirect: '/Application'
    },
    {
        path: '/:pathMatch(.*)',
        name: '404',
        redirect: '/Empty'
    },
    {
        path: '/Empty',
        name: 'Empty',
        component: () => import('@/views/Empty/Empty.vue')
    },
    {
        path: '/Tool',
        name: 'Tool',
        component: () => import('@/views/Tool/Tool.vue'),
        children: [
            {
                path: 'Suspend',
                name: 'Suspend',
                component: () => import('@/views/Tool/Children/Suspend/Suspend.vue'),
            },
            {
                path: 'Live2D',
                name: 'Live2D',
                component: () => import('@/views/Tool/Children/Live2D/Live2D.vue'),
            }
        ]
    },
    {
        path: '/Application',
        name: 'Application',
        component: () => import('@/views/Application/Application.vue')
    },
    {
        path: '/Tray',
        name: 'Tray',
        component: () => import('@/views/Tray/Tray.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
