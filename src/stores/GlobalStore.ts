import { defineStore } from 'pinia'

const GlobalStore = defineStore('GlobalStore', {
    state: () => {
        return {
            test: 'Hello World !'
        }
    },
    getters: {},
    actions: {}
})

export { GlobalStore }