<script lang="ts" setup>
import { provide } from 'vue';
import { Application } from './Application';
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';

const instance = new Application()

provide('instance', instance)

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="Application">
        <HeaderBarVue></HeaderBarVue>
        <n-button type="primary" class="Btn" @click="instance.Test()">Emit</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "./Application.scss";
</style>
