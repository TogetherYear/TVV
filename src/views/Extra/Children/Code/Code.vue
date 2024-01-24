<script lang="ts" setup>
import { Code } from './Code';

const instance = new Code()

const {
    canvas,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="Code">
        <canvas class="View" ref="canvas"></canvas>
    </div>
</template>

<style lang="scss" scoped>
@import "./Code.scss"
</style>