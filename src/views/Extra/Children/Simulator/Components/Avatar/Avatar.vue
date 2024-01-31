<script lang="ts" setup>
const attribute = withDefaults(defineProps<{
    url?: string,
    width?: number,
    height?: number,
}>(), {
    url: '',
    width: 20,
    height: 20
})
</script>

<template>
    <div class="Avatar" :style="{ width: `${attribute.width}px`, height: `${attribute.height}px` }">
        <img :src="attribute.url" alt="">
    </div>
</template>

<style lang="scss" scoped>
.Avatar {
    position: relative;
    display: inline-block;

    img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
}
</style>