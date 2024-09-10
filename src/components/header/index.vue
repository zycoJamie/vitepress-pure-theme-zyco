<template>
  <header class="header-container">
    <div class="profile">
      <img :class="{ 'rotate': isTouchAvatar }" :src="withBase(theme.avatar)" @mouseenter="handleMouseEnterAvatar"
        @mouseleave="handleMouseLeaveAvatar" @click="handleClickAvatar" />
      <div class="info">
        <div class="name">{{ name }}</div>
        <div class="brief">{{ brief }}</div>
      </div>
    </div>
    <div>
      <Nav :nav="nav" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject, computed, ref } from "vue";
import { useRouter, withBase } from "vitepress";
import { themeConfig } from "../../compositions/configProvider";
import Nav from "../nav/index.vue";
import type { INavProps } from "../nav/nav";

const props = defineProps<INavProps>();
const router = useRouter();

const theme = inject(themeConfig)!;
const name = computed(() => theme.name);
const brief = computed(() => theme.brief);
const nav = computed(() => props.nav);

const isTouchAvatar = ref(false);
// 添加头像动效
const handleMouseEnterAvatar = () => {
  isTouchAvatar.value = true;
};
const handleMouseLeaveAvatar = () => {
  isTouchAvatar.value = false;
};
const handleClickAvatar = () => {
  router.go('/');
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "Header" });
</script>

<style lang="scss" scoped>
@use '@style-theme/mixins.scss';

.header-container {
  max-width: 1150px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  margin-bottom: clamp(32px, 5vh, 64px);

  .profile {
    display: flex;

    img {
      display: block;
      height: 64px;
      width: 64px;
      border-radius: 50%;
      padding: 8px;
    }

    .rotate {
      @include mixins.rotate;
    }

    .info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      .name {
        padding: 4px 8px;
        color: #27272a;
        font-weight: 600;
        font-size: 23px;
        transition: color 0.1s ease-in-out;
      }

      .brief {
        padding: 0 0 4px 8px;
        color: #616e7c;
        font-size: 18px;
      }
    }
  }
}
</style>
