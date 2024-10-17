<template>
  <header class="post-title">
    <h1>{{ pageData.title }}</h1>
    <time :datetime="pageData.frontmatter.date">{{ formatPostDate(pageData.frontmatter.date) }}</time>
    <template v-if="theme?.valine">
      <ClientOnly>
        <img class="reading-icon" src="../../assets/img/reading.svg" />
        <span :id="valineUseVisitId" class="leancloud_visitors">
          <span class="leancloud-visitors-count">-</span>
        </span>
      </ClientOnly>
    </template>
  </header>
  <Content class="pure-doc" />
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import type { PureThemeConfig } from "../../config";
import { useFormatPost, useValine } from '../../compositions/post';
import { themeConfig } from '../../compositions/configProvider';
import { inject, computed } from "vue";

const { page: pageData } = useData<PureThemeConfig>();
console.log("page", pageData);
const { formatPostDate } = useFormatPost();
const theme = inject<PureThemeConfig>(themeConfig);
useValine();
const valineUseVisitId = computed(() => decodeURI(window.location.pathname)); // valine使用的阅读统计id

</script>

<style lang="scss" scoped>
.post-title {
  box-sizing: border-box;
  padding: 0px 32px;
  margin: auto;
  margin-bottom: 32px;
  max-width: 700px;
  text-align: center;

  h1 {
    margin: 0;
    margin-bottom: 16px;
  }

  time {
    color: #616e7c;
    vertical-align: middle;
  }

  .reading-icon {
    height: .8em;
    margin: 0 5px 0 10px;
    vertical-align: middle;
  }

  .leancloud_visitors {
    font-size: .8em;
    color: #616e7c;
    vertical-align: middle;
  }
}
</style>
