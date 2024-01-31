<script lang="ts" setup>
import { inject } from 'vue';
import deleteIcon from "@/assets/images/delete.png"
import { Simulator } from '../../Simulator';
import { Type } from '../../Type';
import { MouseClick } from '../../Core/Behaviour/MouseClick';
import { MouseMove } from '../../Core/Behaviour/MouseMove';
import { WriteText } from '../../Core/Behaviour/WriteText';
import { KeyboardToggle } from '../../Core/Behaviour/KeyboardToggle';
import { KeyboardClick } from '../../Core/Behaviour/KeyboardClick';

const instance = inject("instance") as Simulator

const {
    currentFocus,
    delay,
    isSelect,
    keys,
} = instance.InitStates()

const {
    isShow,
} = instance.inspector.InitStates()

instance.inspector.InitHooks()

instance.inspector.Run()
</script>

<template>
    <div class="Inspector" v-show="isShow">
        <span class="Main Common" v-if="currentFocus?.type == Type.ActionType.Main">
            <span class="Label">执行间隔</span>
            <input type="number" class="Input" placeholder="请输入执行间隔" max="999999999" min="100" v-model="delay" id="">
        </span>
        <span class="KeyboardClick Common" v-if="currentFocus?.type == Type.ActionType.KeyboardClick">
            <span class="Label">键盘点击</span>
            <span class="Box">
                <span class="Title" @click="instance.OnClickSelectKey()">选择按键</span>
                <span class="Select" v-show="isSelect">
                    <span class="Item" v-for="s in keys" :key="s.text"
                        @click="(currentFocus as unknown as KeyboardClick).OnAddKey({ key: s.value, text: s.text })">{{
                            s.text
                        }}</span>
                </span>
            </span>
            <span class="Split"></span>
            <span class="KeyC"
                v-for="(k, i) in ((currentFocus as unknown as KeyboardClick).keys as unknown as Array<{ key: number, text: string }>)"
                :key="k.text">
                <span class="Current">{{ k.text }}</span>
                <span class="Delete" @click="(currentFocus as unknown as KeyboardClick).OnDeleteKey(i)">
                    <img :src="deleteIcon" alt="">
                </span>
            </span>
        </span>
        <span class="KeyboardToggle Common" v-if="currentFocus?.type == Type.ActionType.KeyboardToggle">
            <span class="Label">键盘状态</span>
            <span class="Box">
                <span class="Title" @click="instance.OnClickSelectKey()">选择按键</span>
                <span class="Select" v-show="isSelect">
                    <span class="Item" v-for="s in keys" :key="s.text"
                        @click="(currentFocus as unknown as KeyboardToggle).OnAddKey({ key: s.value, text: s.text })">{{
                            s.text
                        }}</span>
                </span>
            </span>
            <span class="Split"></span>
            <span class="KeyT"
                v-for="(k, i) in ((currentFocus as unknown as KeyboardToggle).keys as unknown as Array<{ key: Renderer.Key, text: string, down: boolean }>)"
                :key="k.text">
                <span class="Current">{{ k.text }}</span>
                <span class="Down" :style="{ background: k.down ? '#dd8080' : '#444444' }"
                    @click="(currentFocus as unknown as KeyboardToggle).OnCheckDown(i)"></span>
                <span class="Delete" @click="(currentFocus as unknown as KeyboardToggle).OnDeleteKey(i)">
                    <img :src="deleteIcon" alt="">
                </span>
            </span>
        </span>
        <span class="MouseClick Common" v-if="currentFocus?.type == Type.ActionType.MouseClick">
            <span class="Label">鼠标点击</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(0)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 0 ? '#dd8080' : '#444444' }">左键</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(1)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 1 ? '#dd8080' : '#444444' }">中键</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(2)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 2 ? '#dd8080' : '#444444' }">右键</span>
        </span>
        <span class="MouseDown Common" v-if="currentFocus?.type == Type.ActionType.MouseDown">
            <span class="Label">鼠标点击</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(0)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 0 ? '#dd8080' : '#444444' }">左键</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(1)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 1 ? '#dd8080' : '#444444' }">中键</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(2)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 2 ? '#dd8080' : '#444444' }">右键</span>
        </span>
        <span class="MouseUp Common" v-if="currentFocus?.type == Type.ActionType.MouseUp">
            <span class="Label">鼠标点击</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(0)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 0 ? '#dd8080' : '#444444' }">左键</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(1)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 1 ? '#dd8080' : '#444444' }">中键</span>
            <span class="Button" @click="(currentFocus as unknown as MouseClick).OnSwitchButton(2)"
                :style="{ background: ((currentFocus as unknown as MouseClick).button as unknown as number) == 2 ? '#dd8080' : '#444444' }">右键</span>
        </span>
        <span class="MouseMove Common" v-if="currentFocus?.type == Type.ActionType.MouseMove">
            <span class="Label">鼠标移到</span>
            <span class="Label">X:</span>
            <input type="number" class="Input" placeholder="请输入目标X" max="999999999" min="-999999999"
                v-model="(currentFocus as unknown as MouseMove).target.targetX" id="">
            <span class="Label">Y:</span>
            <input type="number" class="Input" placeholder="请输入目标Y" max="999999999" min="-999999999"
                v-model="(currentFocus as unknown as MouseMove).target.targetY" id="">
        </span>
        <span class="WriteText Common" v-if="currentFocus?.type == Type.ActionType.WriteText">
            <span class="Label">输入文本</span>
            <textarea name="" class="InputArea"
                v-model="((currentFocus as unknown as WriteText).content as unknown as string)" id="" cols="30" rows="10">
            </textarea>
            <span class="Label">是否为剪切板输入</span>
            <span class="Check" @click="(currentFocus as unknown as WriteText).OnSwitchPaste()"
                :style="{ background: (currentFocus as unknown as WriteText).paste ? '#dd8080' : '#444444' }"></span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import "./Inspector.scss"
</style>