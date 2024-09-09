import { createApp } from 'vue';

import RootVue from './Root.vue';

import { router } from './Router';

import { Renderer } from './Plugins/Renderer';
await Renderer.Run();

createApp(RootVue).use(router).mount('#App');
