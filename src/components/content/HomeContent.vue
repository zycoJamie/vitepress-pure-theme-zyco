<template>
  <div class="content">
    <h1 class="main-title">Recent Articles</h1>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { useData, useRouter } from "vitepress";
import { data } from "../../support/posts.data.mjs";

console.log("test", data);
</script>

<style lang="scss" scoped>
.content {
  margin: auto;
  max-width: 700px;
  .main-title {
    font-size: 2.8rem;
    line-height: 1.2;
    margin: 0 0 16px 0;
    text-align: center;
  }
}
</style>
