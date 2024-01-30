<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import PanelVue from './Components/Panel/Panel.vue'
import { Simulator } from './Simulator';
import { provide } from 'vue';

const instance = new Simulator()

provide("instance", instance)

const {
    view,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="DefaultWindow Simulator">
        <HeaderBarVue></HeaderBarVue>
        <span class="ExtraView">
            <span class="Canvas" ref="view"></span>
            <PanelVue></PanelVue>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Simulator.scss"
</style>