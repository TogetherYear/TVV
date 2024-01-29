<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { Simulator } from './Simulator';

const instance = new Simulator()

const {
    view,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="DefaultWindow Simulator">
        <HeaderBarVue></HeaderBarVue>
        <span class="ExtraView" ref="view"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Simulator.scss"
</style>