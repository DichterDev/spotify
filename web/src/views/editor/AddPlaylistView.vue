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
const visible = computed(() => searchTracks(search.value, tracks.value))
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
    <div class="playlist-header"></div>
    <div class="tracks-container">
      <div>
        <Search @change="handleSearch"></Search>
        <button>Sort</button>
      </div>
      <Tracks :tracks="visible" @track:click="clickTrack"></Tracks>
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlist {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tracks-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>