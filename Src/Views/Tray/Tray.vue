<script lang="ts" setup>
import { provide } from 'vue';
import { Tray } from './Tray';

const instance = new Tray();

provide('instance', instance);

const { menu } = instance.InitStates();

instance.Run();
</script>

<template>
    <div class="Tray">
        <span :class="{ Item: true, Separator: m.key === 'Separator' }" v-for="m in menu" :key="m.id" @click="instance.OnMenuClick(m)">
            <span v-if="m.key !== 'Separator'">
                <span class="Icon"><img v-show="m.check" :src="m.icon" alt="" /></span>
                <span class="Label">{{ m.key }}</span>
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Tray.scss';
</style>
