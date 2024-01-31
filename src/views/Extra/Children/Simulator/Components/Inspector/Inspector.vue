<script lang="ts" setup>
import { inject } from 'vue';
import { Simulator } from '../../Simulator';
import { Type } from '../../Type';

const instance = inject("instance") as Simulator

const {
    currentFocus,
} = instance.InitStates()

const {
    isShow,
} = instance.inspector.InitStates()

instance.inspector.InitHooks()

instance.inspector.Run()
</script>

<template>
    <div class="Inspector" v-show="isShow">
        <span class="Main" v-if="currentFocus?.type == Type.ActionType.Main">

        </span>
        <span class="KeyboardClick" v-if="currentFocus?.type == Type.ActionType.KeyboardClick">

        </span>
        <span class="KeyboardToggle" v-if="currentFocus?.type == Type.ActionType.KeyboardToggle">

        </span>
        <span class="MouseClick" v-if="currentFocus?.type == Type.ActionType.MouseClick">

        </span>
        <span class="MouseDown" v-if="currentFocus?.type == Type.ActionType.MouseDown">

        </span>
        <span class="MouseUp" v-if="currentFocus?.type == Type.ActionType.MouseUp">

        </span>
        <span class="MouseMove" v-if="currentFocus?.type == Type.ActionType.MouseMove">

        </span>
        <span class="WriteText" v-if="currentFocus?.type == Type.ActionType.WriteText">

        </span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Inspector.scss"
</style>