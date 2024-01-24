<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { Extra } from './Extra';

const instance = new Extra()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="Extra">
        <HeaderBarVue></HeaderBarVue>
        <span class="Children">
            <router-view />
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Extra.scss"
</style>