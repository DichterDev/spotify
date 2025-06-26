<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';

const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()
</script>

<template>
  <div class="playlist">
    <img class="cover" :src="props.playlist?.images[0].url" />
    <span class="name">{{ props.playlist?.name }}</span>
    <div class="info">
      <span>{{ props.playlist.tracks.total }}</span>
      <span>{{ props.playlist.owner.display_name }}</span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlist {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: fit-content(100%) 1fr;

  box-sizing: border-box;
}

.playlist:hover {
  cursor: pointer;
  background-color: lightslategrey;
}

.cover {
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.25em;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.cover {
  grid-row: span 2;
  grid-column: 1;
}

.name {
  grid-row: 1;
  grid-column: 2;
}

.info {

}

</style>