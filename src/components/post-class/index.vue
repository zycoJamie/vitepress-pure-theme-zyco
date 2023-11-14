<template>
  <Teleport to="body">
    <aside class="post-class-container">
      <div>全部</div>
      <div v-for="tag of classTags" :key="tag">{{ tag }}</div>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IPostClassProps } from "./postClass";

const props = defineProps<IPostClassProps>();
const { posts } = usePosts();
const classTags = computed(() => posts.classTags);
</script>

<style lang="scss" scoped>
.post-class-container {
  position: fixed;
  left: 300px;
  top: 400px;
}
</style>
