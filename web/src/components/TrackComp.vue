<script setup lang="ts">
import type { Track } from '@/types/spotify';
import { ref, type Ref } from 'vue';

const props = defineProps<{
  track: Track
}>()

</script>

<template>
  <div class="track">
    <img class="track-cover" :src="props.track.album.images[0].url" />
    <div class="track-info">
      <span class="track-name">{{ props.track.name }}</span>
      <div class="track-artists">
        <span v-for="artist in props.track.artists">
          <a :href="artist.external_urls.spotify">{{ artist.name }}</a>
          &nbsp;
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.track {
  height: 3em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;

  user-select: none;
}

.track:hover {
  cursor: pointer;
}

.track-info {
  display: flex;
  flex-direction: column;
}

.track-cover {
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.25em;
}

.track-name,
.track-artists {
  flex: 1;
  overflow-x: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
</style>