<script setup lang="ts">
import type { Track } from '@/types/spotify';

const props = defineProps<{
  track: Track
}>()
</script>

<template>
  <div class="track">
    <img class="track-cover" :src="props.track.album.images[0].url" />
    <span class="track-name">{{ props.track.name }}</span>
    <div class="track-artists">
      <span v-for="artist in props.track.artists">
        <a :href="artist.external_urls.spotify">{{ artist.name }}</a>
        &nbsp;
      </span>
    </div>
  </div>
</template>

<style lang="css" scoped>
.track {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 50% 50%;
  column-gap: 0.5em;

  height: 3em;
}

.track-cover {
  grid-row: span 2;
}

.track-name,
.track-artists {
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.track-name {
  grid-row: 1;
  grid-column: 2;

  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}

.track-artists {
  grid-row: 2;
  grid-column: 2;

  font-size: 0.85em;
}
</style>