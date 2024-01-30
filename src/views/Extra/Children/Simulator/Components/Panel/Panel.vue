<script lang="ts" setup>
import { inject } from 'vue';
import { Simulator } from '../../Simulator';

const instance = inject("instance") as Simulator

const {
    behaviours,
} = instance.panel.InitStates()

instance.panel.InitHooks()

instance.panel.Run()
</script>

<template>
    <div class="Panel">
        <span class="Add">
            <span class="Type" v-for="b in behaviours" :key="b.type">
                <span class="Title">{{ b.type }}</span>
                <span class="Actions">
                    <span class="Action" v-for="a in b.actions" draggable="true"
                        @dragend="(e) => { instance.panel.OnDragEnd(e) }" @dragstart="instance.panel.OnDragStart(a)"
                        :key="a">{{ a }}</span>
                </span>
            </span>
        </span>
        <span class="Btn"></span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Panel.scss"
</style>