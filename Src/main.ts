import { createApp } from 'vue'

import AppVue from './App.vue'

import router from './Router'

import { naive } from './Naive'

import './Plugins/Debug'

import './Plugins/FieldObserver'

import { Renderer } from './Plugins/Renderer'
await Renderer.Run()

createApp(AppVue)
  .use(router)
  .use(naive)
  .mount('#App')
