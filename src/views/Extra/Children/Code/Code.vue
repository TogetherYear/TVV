<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { Code } from './Code';

const instance = new Code()

const {
    canvas,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="DefaultWindow Code">
        <HeaderBarVue></HeaderBarVue>
        <span class="ExtraView">
            <canvas ref="canvas" class="Canvas"></canvas>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Code.scss"
</style>