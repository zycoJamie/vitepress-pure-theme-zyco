<template>
  <Content class="pure-doc" />
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import type { PureThemeConfig } from "../../config";

const { page: pageData } = useData<PureThemeConfig>();
console.log("page", pageData);
</script>

<style lang="scss" scoped></style>
