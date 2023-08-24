<script lang="ts" setup>
import { Transformable } from './Transformable';

const instance = new Transformable()

const {
    dom
} = instance.InitStates()
instance.InitHooks()
instance.Run()
</script>

<template>
    <div class="Transformable" ref="dom">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
@import "./Transformable.scss"
</style>