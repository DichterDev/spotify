<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { computed, onBeforeMount, ref } from 'vue';
import type { SimplifiedPlaylist, Track } from '@/types/spotify';

import Tracks from '@/components/Tracks.vue';
import Search from '@/components/Search.vue';
import { getTracks, searchTracks } from '@/scripts/util';

const editor = useEditorStore()
const playlist = ref(editor.target)
const tracks = ref<Track[]>([])
const search = ref('')
const visible = computed(() => searchTracks(search.value, tracks.value))

function callbackTracks(ts: Track[]) {
  tracks.value = tracks.value.concat(ts)
}

onBeforeMount(async () => {
  const id = editor.target!.id
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
        <button>Add</button>
        <Search></Search>
        <button>Sort</button>
      </div>
      <Tracks :tracks="visible"></Tracks>
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlist {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playlist-header {
  height: 6em;
  display: flex;
  flex-direction: row;
}

.tracks-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
}


.tracks-header {
  display: flex;
}
</style>