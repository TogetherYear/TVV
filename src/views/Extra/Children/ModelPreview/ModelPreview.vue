<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { ModelPreview } from './ModelPreview';

const instance = new ModelPreview()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="ShadowWindow ModelPreview">
        <HeaderBarVue></HeaderBarVue>
        <span class="ExtraView" id="WebGLWorldContainer"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./ModelPreview.scss"
</style>