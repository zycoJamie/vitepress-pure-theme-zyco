<template>
  <div class="content">
    <h1 class="main-title">Recent Articles</h1>
    <template v-for="(post, idx) in recentPosts" :key="idx">
      <article class="post">
        <h2 class="title">
          <div @click="goToArticle(post.url)">{{ post.title }}</div>
        </h2>
        <time>{{ formatPostDate(post.date) }}</time>
        <div class="brief" home-content v-html="post.brief"></div>
      </article>
      <hr />
    </template>
    <footer @click="goToWhere">{{ footerText }}</footer>
  </div>
</template>

<script setup lang="ts">
// import { data, IMetaPost } from "../../support/posts.data.mjs";
import { computed, inject } from "vue";
import { useFormatPost, usePostRoute } from "../../compositions/post";
import {
  themeConfig,
  homeFooterDefault,
} from "../../compositions/configProvider";
import { useRouter } from "vitepress";

const { posts } = usePosts();
const router = useRouter();
const recentPosts = computed(() => posts.all.slice(0, 7));
const { formatPostDate } = useFormatPost();
const { goToArticle } = usePostRoute();

const { footer = homeFooterDefault } = inject(themeConfig)!;
const footerText = computed(() => {
  if ((footer as any).default) {
    return (footer.text as (count: number) => string)(posts.all.length);
  }
  return footer.text;
});

const goToWhere = () => {
  router.go(`/${footer.route}`);
};
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

  hr {
    border: none;
    border-top: 1px solid #ddd;
    height: 0;
    margin: 32px 0;

    &:last-of-type {
      display: none;
    }
  }

  .post {
    display: flex;
    flex-direction: column;

    .title {
      font-size: 1.618rem;
      line-height: 1.4;

      &>div {
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

  footer {
    margin-top: 32px;
    padding: 28px 36px;
    background: #f1f2f4;
    border-radius: 6px;
    cursor: pointer;
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
      white-space: pre-wrap;
      -webkit-font-smoothing: auto;
      font-family: "JetBrains Mono", Menlo, Consolas, Monaco, "Courier New",
        monospace;
    }
  }
}
</style>
