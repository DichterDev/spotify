<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { computed, onBeforeMount, ref } from 'vue';
import type { SimplifiedPlaylist, Track } from '@/types/spotify';

import Tracks from '@/components/Tracks.vue';
import Search from '@/components/Search.vue';
import { getTracks, searchTracks } from '@/scripts/util';
import { useRouter } from 'vue-router';

const editor = useEditorStore()
const playlist = ref(editor.target)
const tracks = ref<Track[]>([])
const search = ref('')
const visible = computed(() => searchTracks(search.value, tracks.value))

function callbackTracks(ts: Track[]) {
  tracks.value = tracks.value.concat(ts)
}

function handleSearch(query: string) {
  search.value = query
}

onBeforeMount(async () => {
  if (!editor.target) useRouter().push('/editor')
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
        <button @click="() => $router.push('/editor/add')">Add</button>
        <Search @change="handleSearch"></Search>
        <button>Sort</button>
      </div>
      <Tracks :tracks="visible" v-if="visible.length"></Tracks>
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
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.tracks-header {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

.tracks-container>:nth-child(2) {
  padding: 0.5em;
  background-color: var(--secondary);
}
</style>