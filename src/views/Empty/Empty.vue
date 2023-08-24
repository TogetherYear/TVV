<script lang="ts" setup>
import { Empty } from './Empty'
const instance = new Empty()

const {

} = instance.InitStates()
instance.InitHooks()
instance.Run()
</script>

<template>
    <div class="Empty">
        <span class="Title">看到我 就说明你路由错误 快去添加</span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Empty.scss"
</style>