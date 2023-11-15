<template>
  <div class="content">
    <h1
      class="main-title"
      :style="{ marginBottom: isDateList ? '0px' : '40px' }"
    >
      Articles
    </h1>
    <template v-if="isDateList" v-for="year in dateTags" :key="year">
      <h2 class="year">{{ year }}</h2>
      <article
        class="article"
        v-for="(post, idx) in datePostsList[year]"
        :key="idx"
      >
        <div class="title" @click="goToArticle(post.url)">{{ post.title }}</div>
        <div class="divider"></div>
        <time :datetime="post.date">{{
          formatPostDateWithoutYear(post.date)
        }}</time>
      </article>
    </template>
    <template v-else>
      <article
        class="article"
        v-for="(post, idx) in classPostsList[curTag]"
        :key="idx"
      >
        <div class="title" @click="goToArticle(post.url)">{{ post.title }}</div>
        <div class="divider"></div>
        <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
      </article>
    </template>
  </div>
  <post-class-list v-model:tag="curTag" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useFormatPost, usePostRoute } from "../../compositions/post";
import PostClassList from "../post-class/index.vue";

const { posts } = usePosts();
const { goToArticle } = usePostRoute();
const { formatPostDateWithoutYear, formatPostDate } = useFormatPost();

console.log("ArticlesContent ", posts);

const classPostsList = computed(() => posts["class"]);
const datePostsList = computed(() => posts["date"]);
const dateTags = computed(() => posts.dateTags);

const isDateList = computed(() => curTag.value === "date"); // 是否按日期分类
const curTag = ref("date"); // 当前选中分类
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
  .year {
    margin-bottom: 0.8rem;
    margin-top: 40px;
    font-size: 1.618rem;
    line-height: 1.4;
  }
  .article {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 2rem;
    .title {
      cursor: pointer;
      text-decoration: underline;
      transition: color 0.1s ease;
      &:hover {
        color: #a0a1a7;
        text-decoration: none;
      }
    }
    .divider {
      width: 10px;
      height: 0px;
      border-bottom: 1px solid #000;
      margin: 0 10px;
    }
  }
  .article + .article {
    margin-top: 8px;
  }
}
</style>
