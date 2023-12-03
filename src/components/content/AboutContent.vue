<template>
  <div class="content">
    <h1>About</h1>
    <p class="brief">{{ aboutBrief }}</p>
    <ul class="links">
      <li
        v-for="(item, idx) in socialLinks"
        @click="goToSocialLink(item.url)"
        :style="{
          cursor: item.url ? 'pointer' : 'default',
          transform: startAnimation
            ? 'translateX(0px)'
            : `translateX(${idx * 700 + 700}px)`,
        }"
        :key="idx"
      >
        <img :src="item.icon" alt="icon" />
        <div class="desc">{{ item.description }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { themeConfig } from "../../compositions/configProvider";

onMounted(() => {
  setTimeout(() => {
    startAnimation.value = true;
  }, 500);
});

const { about } = inject(themeConfig)!;
const aboutBrief = computed(() => about.brief);
const socialLinks = computed(() => about.links ?? []);
const startAnimation = ref(false);

const goToSocialLink = (url?: string) => {
  url && window.open(url, "_blank");
};
</script>

<style lang="scss" scoped>
.content {
  margin: auto;
  max-width: 700px;
  overflow-x: hidden;
  h1 {
    font-size: 2.8rem;
    line-height: 1.2;
    margin: 0 0 16px 0;
    text-align: center;
  }
  .brief {
    word-wrap: break-word;
    margin-bottom: 60px;
  }
  .links {
    list-style-type: none;
    padding-left: 0px;
    li {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
      margin: 10px 0;
      transition: transform 1s ease-in-out;
      img {
        width: 20px;
        height: 20px;
      }
      .desc {
        margin-left: 10px;
      }
    }
  }
}
</style>
