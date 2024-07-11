import { createApp } from 'vue'

import AppVue from './App.vue'

import router from './Router'

import { naive } from './Naive'

import { Debug } from './Plugins/Debug'
Debug.Instance.Run()

import { FieldObserver } from './Plugins/FieldObserver'
FieldObserver.Instance.Run()

import { Renderer } from './Plugins/Renderer'
await Renderer.Instance.Run()

createApp(AppVue)
  .use(router)
  .use(naive)
  .mount('#App')
