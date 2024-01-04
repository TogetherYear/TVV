<script lang="ts" setup>
import { HeaderBar } from './HeaderBar'

const attribute = withDefaults(defineProps<{
    bgc?: string
}>(), {
    bgc: '#212121',
})

const instance = new HeaderBar()

const {
    options,
    fullscreen,
    dragDomRegion,
} = instance.InitStates()
instance.InitHooks()
instance.Run()
</script>

<template>
    <div class="HeaderBar" :style="{ background: attribute.bgc }">
        <span class="Btn">
            <span class="Item" v-for="item in options" :key="item.type" @click="instance.OptionClick(item.type)">
                <img :src="item.icon" :title="item.label" class="Icon" />
            </span>
        </span>
        <span class="Drag" ref="dragDomRegion" v-show="!fullscreen" data-tauri-drag-region></span>
        <span class="Drag" v-show="fullscreen"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./HeaderBar.scss";
</style>
