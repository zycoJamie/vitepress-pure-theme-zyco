<template>
  <Teleport to="body">
    <aside class="post-class-container">
      <div :class="{
        tag: true,
        active: isCurSelectedTag('date'),
        inactive: !isCurSelectedTag('date'),
      }" @click="changeTag('date')">
        全部
      </div>
      <Popover v-for="tag of classTags" v-model="isWholeTag[tag]" :content="tag" :key="tag">
        <div :class="{
        tag: true,
        active: isCurSelectedTag(tag),
        inactive: !isCurSelectedTag(tag),
      }" @click="changeTag(tag)" @mouseenter="handleMouseEnterTag($event, tag)" @mouseleave="handleMouseLeaveTag(tag)">
          {{ tag }}
        </div>
      </Popover>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useHasEllipsis } from "../../compositions/check";
import type { IPostClassProps } from "./postClass";
import Popover from '../popover/index.vue';

const props = defineProps<IPostClassProps>();
const emit = defineEmits<{
  (event: "update:tag", tag: string): void;
}>();
const { posts } = usePosts();
const classTags = computed(() => posts.classTags);
const isCurSelectedTag = computed(() => (tag: string) => props.tag === tag);

const wholeTag = Object.create(null);
classTags.value.map(tagStr => wholeTag[tagStr] = false);
const isWholeTag = reactive(wholeTag); // 是否显示完整tag

// 改变分类
const changeTag = (tag: string) => {
  emit("update:tag", tag);
};

/** 文本触发省略号后显示popover */
const handleMouseEnterTag = (ev: MouseEvent, tag: string) => {
  if (useHasEllipsis(ev.target as HTMLElement, 1.2)) {
    isWholeTag[tag] = true;
  }
};

const handleMouseLeaveTag = (tag: string) => {
  isWholeTag[tag] = false;
};
</script>

<style lang="scss" scoped>
@use "../../assets/style/variables.scss" as val;

.post-class-container {
  position: fixed;
  left: 200px;
  top: 270px;
  padding: 8px 16px;
  display: grid;
  gap: 10px 0px;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  width: 180px;

  .tag {
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;

    &.inactive {
      color: #6b7381;
    }

    &.active {
      color: #000;
      font-weight: 600;
      transform: scale(1.2);
    }

    &:hover {
      color: val.$anchor-color;
      transform: scale(1.2);
      transition: transform 0.3 ease;
    }
  }
}
</style>
