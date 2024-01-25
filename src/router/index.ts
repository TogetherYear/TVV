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
        path: '/Application',
        name: 'Application',
        component: () => import('@/views/Application/Application.vue')
    },
    {
        path: '/Tray',
        name: 'Tray',
        component: () => import('@/views/Tray/Tray.vue')
    },
    {
        path: '/Extra',
        name: 'Extra',
        component: () => import('@/views/Extra/Extra.vue'),
        children: [
            {
                path: 'Code',
                name: 'Code',
                component: () => import('@/views/Extra/Children/Code/Code.vue')
            },
            {
                path: 'ImagePreview',
                name: 'ImagePreview',
                component: () => import('@/views/Extra/Children/ImagePreview/ImagePreview.vue')
            },
            {
                path: 'ModelPreview',
                name: 'ModelPreview',
                component: () => import('@/views/Extra/Children/ModelPreview/ModelPreview.vue')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
