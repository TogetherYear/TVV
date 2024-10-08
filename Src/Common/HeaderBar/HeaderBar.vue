<script lang="ts" setup>
import { HeaderBar } from './HeaderBar';
import { TWindow } from '@/Decorators/TWindow';

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

const { currentState } = TWindow;

instance.Run();
</script>

<template>
    <div class="HeaderBar" :style="{ background: attribute.bgc }">
        <span>
            <span class="Btn">
                <span class="Item" v-for="item in options" :key="item.type" @click="instance.OnOptionClick(item.type)">
                    <img :src="item.icon" :title="item.label" class="Icon" />
                </span>
            </span>
            <span class="Drag" @dblclick="instance.OnOptionClick('Max')" data-tauri-drag-region v-show="currentState == TWindow.WindowState.Default"></span>
            <span class="Drag" @dblclick="instance.OnOptionClick('Max')" v-show="currentState == TWindow.WindowState.Full"></span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './HeaderBar.scss';
</style>
