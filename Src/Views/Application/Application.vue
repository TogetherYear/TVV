<script lang="ts" setup>
import { provide } from 'vue';
import { Application } from './Application';
import HeaderBarVue from '@/Common/HeaderBar/HeaderBar.vue';

const instance = new Application();

provide('instance', instance);

const {} = instance.InitStates();

instance.Run();
</script>

<template>
    <div class="Application">
        <HeaderBarVue></HeaderBarVue>
    </div>
</template>

<style lang="scss" scoped>
@import './Application.scss';
</style>
