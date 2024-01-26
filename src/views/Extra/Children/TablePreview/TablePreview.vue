<script lang="ts" setup>
import HeaderBarVue from '@/common/HeaderBar/HeaderBar.vue';
import { TablePreview } from './TablePreview';

const instance = new TablePreview()

const {
    view,
} = instance.InitStates()

instance.InitHooks()

instance.Run()
</script>

<template>
    <div class="TransparentWindow TablePreview">
        <HeaderBarVue :type="'table'"></HeaderBarVue>
        <span class="ExtraView" ref="view"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./TablePreview.scss"
</style>