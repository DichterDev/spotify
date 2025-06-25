<script setup lang="ts">
import type { CurrentUser } from '@/types/spotify';
import { ref } from 'vue';

const user = ref<CurrentUser>()
</script>

<template>
  <div>
    <span>{{ user?.display_name }}</span>
    <a :href="user?.external_urls.spotify"></a>
    <img :src="user?.images[0].url" />
  </div>
</template>

<style lang="css" scoped></style>