<script setup lang="ts">
import { getPlaylist, getTracks, searchTracks } from '@/scripts/util';
import { useEditorStore } from '@/stores/editor';
import type { Playlist, Track } from '@/types/spotify';
import { computed, onBeforeMount, ref } from 'vue';

import Search from '@/components/Search.vue';
import Tracks from '@/components/Tracks.vue';

const editor = useEditorStore()


const playlist = ref<Playlist>()
const tracks = ref<Track[]>([])
const visible = computed(() => searchTracks(search.value, tracks.value.filter(t => editor.targetTrackIds.findIndex((id) => id === t.id) === -1)))
const search = ref('')

function callbackTracks(ts: Track[]) {
  tracks.value = tracks.value.concat(ts)
}

function handleSearch(query: string) {
  search.value = query
}

function clickTrack(track: Track) {
  editor.toggleAdded(track)
}

onBeforeMount(async () => {
  const id = editor.from!
  playlist.value = await getPlaylist(id)
  tracks.value = await getTracks(id, callbackTracks)
})
</script>

<template>
  <div class="playlist">
    <div class="playlist-header">
      <img id="cover" :src="playlist?.images[0].url" alt="Playlist Cover">
      <span>{{ playlist?.name }}</span>
    </div>
    <div class="tracks-container">
      <div class="tracks-header">
        <Search @change="handleSearch"></Search>
        <button>Sort</button>
      </div>
      <Tracks :tracks="visible" @track:click="clickTrack" v-if="visible.length"></Tracks>
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlist {
  height: calc(100% - 2em);
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  margin: 1em;
  padding: 1em;

  background-color: var(--primary);
  box-sizing: border-box;
}

.playlist-header {
  height: 3em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;

  padding: 0.5em;
  box-sizing: content-box;

  background-color: var(--secondary);
}

#cover {
  height: 100%;
}

.tracks-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.tracks-header {
  display: flex;
  gap: 1em;
}

.tracks-container>:nth-child(2) {
  padding: 0.5em;
  background-color: var(--secondary);
}
</style>