<template>
  <div class="content">
    <h1 class="main-title">Recent Articles</h1>
    <article class="post" v-for="(post, idx) in recentPosts" :key="idx">
      <h2 class="title">
        <div @click="goToArticle(post.url)">{{ post.title }}</div>
      </h2>
      <time>{{ formatPostDate(post.date) }}</time>
      <div class="brief" home-content v-html="post.brief"></div>
    </article>
  </div>
</template>

<script setup lang="ts">
// import { data, IMetaPost } from "../../support/posts.data.mjs";
import { computed } from "vue";
import { useFormatPost, usePostRoute } from "../../compositions/post";

const { posts } = usePosts();
const recentPosts = computed(() => posts.all.slice(0, 7));
const { formatPostDate } = useFormatPost();
const { goToArticle } = usePostRoute();
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
  .post {
    display: flex;
    flex-direction: column;
    .title {
      font-size: 1.618rem;
      line-height: 1.4;
      & > div {
        text-decoration: none;
        color: #27272a;
        transition: color 0.1s ease;
        &:hover {
          color: #a0a1a7;
        }
      }
    }
    time {
      color: #616e7c;
      margin-bottom: 8px;
    }
  }
}
</style>
<style lang="scss">
@use "../../assets/style/variables.scss" as val;
.post {
  .brief[home-content] {
    code {
      background: val.$code-background-color;
      border-radius: 3px;
      font-size: 0.8rem;
      font-variant-ligatures: none;
      padding: 3px 5px;
      white-space: pre;
      -webkit-font-smoothing: auto;
      font-family: "JetBrains Mono", Menlo, Consolas, Monaco, "Courier New",
        monospace;
    }
  }
}
</style>
