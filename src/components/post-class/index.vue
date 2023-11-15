<template>
  <Teleport to="body">
    <aside class="post-class-container">
      <div
        :class="{
          tag: true,
          active: isCurSelectedTag('date'),
          inactive: !isCurSelectedTag('date'),
        }"
        @click="changeTag('date')"
      >
        全部
      </div>
      <div
        :class="{
          tag: true,
          active: isCurSelectedTag(tag),
          inactive: !isCurSelectedTag(tag),
        }"
        v-for="tag of classTags"
        @click="changeTag(tag)"
        :key="tag"
      >
        {{ tag }}
      </div>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IPostClassProps } from "./postClass";

const props = defineProps<IPostClassProps>();
const emit = defineEmits<{
  (event: "update:tag", tag: string): void;
}>();
const { posts } = usePosts();
const classTags = computed(() => posts.classTags);
const isCurSelectedTag = computed(() => (tag: string) => props.tag === tag);

// 改变分类
const changeTag = (tag: string) => {
  emit("update:tag", tag);
};
</script>

<style lang="scss" scoped>
@use "../../assets/style/variables.scss" as val;
.post-class-container {
  position: fixed;
  left: 200px;
  top: 270px;
  border-right: 1px solid #d6d5d5;
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
