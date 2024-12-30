<script lang="ts" setup>
import { HeaderBar } from './HeaderBar';

const attribute = withDefaults(
    defineProps<{
        bgc?: string;
    }>(),
    {
        bgc: '#212121ff'
    }
);

const instance = new HeaderBar();

const { options } = instance.InitStates();

instance.Run();
</script>

<template>
    <div class="HeaderBar" :style="{ background: attribute.bgc }">
        <span class="Drag" @dblclick="instance.OnOptionClick('Max')" data-tauri-drag-region></span>
        <span class="Btn">
            <span class="Item" v-for="item in options" :key="item.type" @click="instance.OnOptionClick(item.type)">
                <img :src="item.icon" :title="item.label" class="Icon" />
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './HeaderBar.scss';
</style>
