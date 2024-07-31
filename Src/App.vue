<script lang="ts" setup>
import { App } from './App';

const {} = App.InitStates();
App.InitHooks();
App.Run();
</script>

<template>
    <el-config-provider>
        <router-view />
    </el-config-provider>
</template>

<style lang="scss">
@import './App.scss';
</style>
