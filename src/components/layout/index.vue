<template>
  <Header :nav="Navlist"></Header>
  <template v-for="item of Navlist" :key="item.name">
    <component v-if="getCurPathValid(item.path)" :is="item.component" />
  </template>
  <component v-if="matchPostPath()" :is="PostContent" />
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import Header from "../header/index.vue";
import { useMatchPath, useMatchPostPath } from "../../compositions/check";
import HomeContent from "../content/HomeContent.vue";
import PostContent from "../content/PostContent.vue";

const Navlist = ref([
  { name: "Home", path: "/", component: shallowRef(HomeContent) },
  { name: "Articles", path: "/articles" },
  { name: "Classes", path: "/classes" },
  { name: "About", path: "/about" },
]);

const getCurPathValid = useMatchPath();
const { matchPostPath } = useMatchPostPath();
</script>

<style lang="scss" scoped></style>
