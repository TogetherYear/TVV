<script lang="ts" setup>
import { ImagePreview } from './ImagePreview';

const instance = new ImagePreview()

const {
    view,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="ImagePreview">
        <span class="View" ref="view"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./ImagePreview.scss"
</style>