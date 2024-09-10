<template>
    <slot></slot>
    <Teleport to="body">
        <div v-if="modelValue" class="popover" :style="styleObj">
            {{ props.content }}
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { CSSProperties, getCurrentInstance, ref, watch } from 'vue';
import type { IPopover } from './popover';

const app = getCurrentInstance();
const props = withDefaults(defineProps<IPopover>(), {
    modelValue: false,
    offsetY: 0,
    offsetX: 0
});

const styleRaw: CSSProperties = {
    position: 'fixed',
};
const styleObj = ref<CSSProperties>({ ...styleRaw });

watch(() => props.modelValue, () => {
    if (props.modelValue) calculatePosition();
    else clearEffect();
});

const calculatePosition = () => {
    const elm = (app?.vnode.el as HTMLElement).nextElementSibling;
    if (elm) {
        const { top, left, height } = elm.getBoundingClientRect();
        styleObj.value.top = `${top - height + props.offsetY}px`;
        styleObj.value.left = `${left + props.offsetX}px`;
    }
};

// 清理副作用
const clearEffect = () => {
    styleObj.value = { ...styleRaw };
}


</script>

<style lang="scss" scoped>
.popover {
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    padding: 2px 5px;
    border-radius: 5px;
}
</style>