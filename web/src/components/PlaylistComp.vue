<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';

const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()
</script>

<template>
  <div class="playlist">
    <img class="playlist-cover" :src="props.playlist?.images[0].url" />
    <div class="playlist-content">
      <div class="playlist-name">{{ props.playlist?.name }}</div>
      <div class="playlist-info">
        <span>{{ props.playlist.tracks.total }} Songs</span>
        <span> - </span>
        <span>{{ props.playlist.owner.display_name }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlist {
  height: 3em;

  display: flex;
  flex-direction: row;
  gap: 0.5em;
  justify-content: start;
  align-items: center;

  box-sizing: border-box;

  user-select: none;
}

.playlist:hover {
  cursor: pointer;
}

.playlist-cover {
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.25em;

  box-sizing: border-box;
}

.playlist-name {
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.playlist-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 0.5em;
}

.playlist-content {
  line-height: 1.2;
}
</style>