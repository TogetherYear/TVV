<script lang="ts" setup>
import { App } from '@/App';
import { Empty } from './Empty'
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
const instance = new Empty()

const {
    isMax,
} = App.Instance.InitStates()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div :class="{ ShadowWindow: !isMax, DefaultWindow: isMax, Empty: true }">
        <HeaderBarVue></HeaderBarVue>
        <span class="Title">404</span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Empty.scss"
</style>