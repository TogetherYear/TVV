<script lang="ts" setup>
import { Live2D } from './Live2D';

const instance = new Live2D()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="Live2D">

    </div>
</template>

<style lang="scss" scoped>
@import "./Live2D.scss"
</style>