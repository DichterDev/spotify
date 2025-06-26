<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';

const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()
</script>

<template>
  <div class="playlist">
    <img :src="props.playlist?.images[0].url" />
    <span v-if="props.playlist">{{ props.playlist?.name }}</span>
  </div>
</template>