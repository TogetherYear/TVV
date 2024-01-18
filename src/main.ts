import { createApp } from 'vue'

import AppVue from './App.vue'

import router from './router'

import { naive } from './naive'

import pinia from './pinia'

import { Debug } from './plugins/Debug'
Debug.Instance.Run()

import { AppRequest } from './plugins/AppRequest'
AppRequest.Instance.Run()

import { FieldObserver } from './plugins/FieldObserver'
FieldObserver.Instance.Run()

import { Renderer } from './plugins/Renderer'
await Renderer.Instance.Run()

createApp(AppVue)
  .use(router)
  .use(naive)
  .use(pinia)
  .mount('#app')
