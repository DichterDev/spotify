<script setup lang="ts">
import { getProfile } from '@/scripts/util';
import type { CurrentUser } from '@/types/spotify';
import { onBeforeMount, onMounted, ref } from 'vue';

const user = ref<CurrentUser>()

console.log("profile")

onMounted(async () => {
  console.log("profile")

  user.value = await getProfile()
})
</script>

<template>
  <div>
    <span>{{ user?.display_name }}</span>
    <a :href="user?.external_urls.spotify"></a>
    <img :src="user?.images[0].url" />
  </div>
</template>

<style lang="css" scoped></style>