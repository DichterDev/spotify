<script setup lang="ts">
import { getTracks, searchTracks } from '@/scripts/util';
import type { SimplifiedPlaylist, Track } from '@/types/spotify';
import { onBeforeMount, onMounted, ref } from 'vue';

import Search from './Search.vue';
import TrackComp from './TrackComp.vue';
import PlaylistComp from './PlaylistComp.vue';

const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()

const emit = defineEmits<{
  'back': []
  'track:click': [track: Track]
}>()

const tracks = ref<Track[]>([])
const visibleTracks = ref<Track[]>([])

function callbackTracks(ts: Track[]) {
  tracks.value = tracks.value.concat(ts)
  visibleTracks.value = tracks.value
}

function handleSearch(query: string) {
  visibleTracks.value = searchTracks(query, tracks.value)
}

onMounted(async () => {
  const res = await getTracks(props.playlist.id, callbackTracks)
  callbackTracks(res)
})
</script>

<template>
  <div class="tracks-container">
    <PlaylistComp :playlist="playlist" @click="emit('back')"></PlaylistComp>
    <Search @search:change="handleSearch"></Search>
    <div class="tracks" v-if="tracks.length">
      <TrackComp :track="t" v-for="t in visibleTracks" @click="emit('track:click', t)"></TrackComp>
    </div>
  </div>
</template>

<style lang="css" scoped>
.tracks {
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  overflow-y: scroll;
  overflow-x: hidden;
}
</style>