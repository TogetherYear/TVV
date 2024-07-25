<script lang="ts" setup>
import PreloadVue from './Preload/Preload.vue';
import { zhCN, dateZhCN } from 'naive-ui'
import { themeOverrides } from './Naive/index'
import { App } from './App'

const {

} = App.InitStates()
App.InitHooks()
App.Run()
</script>

<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
        <n-message-provider>
            <n-dialog-provider>
                <n-notification-provider placement="bottom-right">
                    <PreloadVue></PreloadVue>
                    <router-view />
                </n-notification-provider>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>

<style lang="scss">
@import "./App.scss";
</style>
