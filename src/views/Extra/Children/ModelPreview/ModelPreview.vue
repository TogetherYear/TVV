<script lang="ts" setup>
import { ModelPreview } from './ModelPreview';

const instance = new ModelPreview()

const {
    view,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="ModelPreview">
        <span class="View" ref="view" id="WebGLWorld"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./ModelPreview.scss"
</style>