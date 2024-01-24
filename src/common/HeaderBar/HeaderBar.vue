<script lang="ts" setup>
import { HeaderBar } from './HeaderBar'
import minIcon from '@/assets/mc/min.png'
import maxIcon from '@/assets/mc/max.png'
import closeIcon from '@/assets/mc/close.png'

const attribute = withDefaults(defineProps<{
    bgc?: string,
    /**
     * 是否为主窗口 默认 false
     */
    main?: boolean,
}>(), {
    bgc: '#212121',
    main: false
})

const instance = new HeaderBar()

const {
    isMax,
} = instance.InitStates()
instance.InitHooks()
instance.Run()
</script>

<template>
    <div class="HeaderBar" :style="{ background: attribute.bgc }">
        <span class="Btn">
            <span class="Min">
                <img :src="minIcon" class="Icon" />
            </span>
            <span class="Max">
                <img :src="maxIcon" class="Icon" />
            </span>
            <span class="Close">
                <img :src="closeIcon" class="Icon" />
            </span>
        </span>
        <span class="Drag" data-tauri-drag-region v-show="!isMax"></span>
        <span class="Drag" v-show="isMax"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./HeaderBar.scss";
</style>
