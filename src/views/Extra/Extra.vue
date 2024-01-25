<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { Extra } from './Extra';
import { App } from '@/App';

const instance = new Extra()

const {
    isMax,
} = App.Instance.InitStates()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="ShadowWindow Tray">
        <HeaderBarVue></HeaderBarVue>
        <span class="Children">
            <router-view />
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Extra.scss"
</style>