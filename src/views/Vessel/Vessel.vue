<script lang="ts" setup>
// console.log(import.meta.env.VITE_APP_NAME)
import { provide } from 'vue';
import { Vessel } from './Vessel';
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';

const instance = new Vessel()
provide('instance', instance)
const { } = instance.InitStates()
instance.InitHooks()
instance.Run()
</script>

<template>
    <div class="Vessel">
        <HeaderBarVue></HeaderBarVue>
        <n-button type="primary" class="Btn" @click="instance.Test()">Emit</n-button>
    </div>
</template>

<style lang="scss" scoped>
@import "./Vessel.scss";
</style>
