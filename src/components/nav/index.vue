<template>
  <dl class="nav">
    <dd
      :class="{ menu: true, active: getCurPathValid(item.path) }"
      v-for="item of list"
      @click="goTo(item)"
      :key="item.name"
    >
      {{ item.name }}
    </dd>
  </dl>
</template>

<script setup lang="ts">
import { useRouter } from "vitepress";
import { useMatchPath } from "../../compositions/check";
import { computed } from "vue";
import type { INavProps, TNavMenu } from "./nav";

const props = defineProps<INavProps>();

const router = useRouter();
const getCurPathValid = useMatchPath(); // 判断当前path与目标path是否一致

const list = computed(() => props.nav);

// 菜单点击路由
const goTo = ({ path }: TNavMenu) => {
  router.go(path);
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "Nav" });
</script>

<style lang="scss" scoped>
.nav {
  display: grid;
  min-width: 350px;
  grid-template-columns: repeat(4, 1fr);
  .menu {
    padding: 4px 12px;
    margin: 0 4px;
    color: #6b7381;
    font-size: 18px;
    transition: color 0.1s ease-in-out;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #27272a;
    }
    &.active {
      color: #27272a;
    }
  }
}
</style>
