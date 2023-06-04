import { createApp } from 'vue'

import AppVue from './App.vue'

import router from './router'

import { naive } from './naive'

import pinia from './pinia'

import { AppRequest } from './plugins/AppRequest'
AppRequest.Instance.Run()

createApp(AppVue)
  .use(router)
  .use(naive)
  .use(pinia)
  .mount('#app')
