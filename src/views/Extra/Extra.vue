<script lang="ts" setup>
import { Extra } from './Extra';

const instance = new Extra()

const {

} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="Extra">
        <router-view />
    </div>
</template>

<style lang="scss" scoped>
@import "./Extra.scss"
</style>