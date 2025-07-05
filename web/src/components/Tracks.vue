<script setup lang="ts">
import { getTracks, searchTracks } from '@/scripts/util';
import type { SimplifiedPlaylist, Track } from '@/types/spotify';
import { onBeforeMount, onMounted, ref } from 'vue';

import Search from './Search.vue';
import TrackComp from './TrackComp.vue';
import PlaylistComp from './PlaylistComp.vue';

const props = defineProps<{
  tracks: Track[]
}>()

const emit = defineEmits<{
  'track:click': [track: Track]
}>()
</script>

<template>
  <div class="tracks" v-if="tracks.length">
    <TrackComp :track="t" v-for="t in tracks" @click="emit('track:click', t)"></TrackComp>
  </div>
</template>

<style lang="css" scoped>
.tracks {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  overflow-y: scroll;
  overflow-x: hidden;
}
</style>