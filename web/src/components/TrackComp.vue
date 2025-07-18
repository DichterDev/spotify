<script setup lang="ts">
import type { Track } from '@/types/spotify';
import { onBeforeMount, ref, type Ref } from 'vue';

const props = defineProps<{
  track: Track
}>()

</script>

<template>
  <div class="track">
    <img class="track-cover" :src="props.track.album.images[0].url" v-if="props.track.album.images[0]" />
    <div class="track-cover" v-else>
      <i class="las la-file-audio"></i>
    </div>
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
  flex-shrink: 0;
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

.track-cover>i {
  height: 100%;
  font-size: 2em;
}

.track-name,
.track-artists {
  flex: 1;
  overflow-x: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
</style>