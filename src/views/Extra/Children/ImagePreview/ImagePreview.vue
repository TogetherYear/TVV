<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { ImagePreview } from './ImagePreview';

const instance = new ImagePreview()

const {
    view,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="DefaultWindow ImagePreview">
        <HeaderBarVue></HeaderBarVue>
        <span class="ExtraView" ref="view"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./ImagePreview.scss"
</style>