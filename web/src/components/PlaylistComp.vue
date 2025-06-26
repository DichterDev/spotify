<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';

const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()
</script>

<template>
  <div><span>{{ props.playlist.name }}</span></div>
</template>