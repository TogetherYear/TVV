import { createApp } from 'vue';

import AppVue from './App.vue';

import router from './Router';

import { Renderer } from './Plugins/Renderer';
await Renderer.Run();

createApp(AppVue).use(router).mount('#App');
