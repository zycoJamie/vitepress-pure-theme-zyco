<template>
  <div class="content">
    <h1 class="main-title">Recent Articles</h1>
    <article class="post" v-for="(post, idx) in recentPosts" :key="idx">
      <h2 class="title">
        <div @click="goToArticle(post.url)">{{ post.title }}</div>
      </h2>
      <time>{{ formatPostDate(post.date) }}</time>
      <div>{{ post.brief }}</div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { data, IMetaPost } from "../../support/posts.data.mjs";
import { computed } from "vue";
import {
  useSortPosts,
  useFormatPost,
  usePostRoute,
} from "../../compositions/post";

console.log("test", data);
const posts = computed<(IMetaPost & { url: string })[]>(() =>
  data.map((item) => ({ ...item.frontmatter, url: item.url }))
);
const recentPosts = useSortPosts(posts);
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
