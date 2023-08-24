import { defineStore } from 'pinia'

const TogetherStore = defineStore('Together', {
    state: () => {
        return {
            test: 'Hello World !'
        }
    },
    getters: {},
    actions: {}
})

export { TogetherStore }