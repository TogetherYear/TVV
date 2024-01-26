<script lang="ts" setup>
import { ModelPreview } from './ModelPreview';

const instance = new ModelPreview()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="ModelPreview">
        <span class="View" id="WebGLWorld"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./ModelPreview.scss"
</style>