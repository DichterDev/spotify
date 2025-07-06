<script setup lang="ts">
import { getPlaylists, likedSongs, searchPlaylists } from '@/scripts/util';
import type { SimplifiedPlaylist } from '@/types/spotify';
import { computed, onBeforeMount, ref } from 'vue';

import Playlists from '@/components/Playlists.vue';
import Search from '@/components/Search.vue';
import { useEditorStore } from '@/stores/editor';
import { useRouter } from 'vue-router';

const editor = useEditorStore()
const router = useRouter()

const playlists = ref<SimplifiedPlaylist[]>([likedSongs])
const visible = computed<SimplifiedPlaylist[]>(() => searchPlaylists(search.value, playlists.value))
const search = ref('')

function handleSearch(query: string) {
  search.value = query
}

function clickPlaylist(playlist: SimplifiedPlaylist) {
  editor.target = playlist
  router.push(`/editor/${editor.target.id}`)
}

onBeforeMount(async () => {
  const res = await getPlaylists()
  playlists.value = playlists.value.concat(res)
})

</script>

<template>
  <div class="editor">
    <div class="editor-header">
      <Search @change="handleSearch"></Search>
      <button id="sort">Sort</button>
    </div>
    <div class="playlist-container">
      <button id="create">Create Playlist</button>
      <Playlists :playlists="visible" @click:playlist="clickPlaylist" v-if="visible.length"></Playlists>
    </div>
  </div>
</template>

<style lang="css" scoped>
.editor {
  height: calc(100% - 2em);

  display: flex;
  flex-direction: column;
  gap: 0.5em;

  margin: 1em;
  padding: 1em;

  box-sizing: border-box;
  background-color: var(--primary);
}

.editor-header {
  display: flex;
  flex-direction: row;
}

.playlist-container {
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--secondary);
  padding: 0.5em;
  gap: 0.5em;
}

#create {
  height: 3em;
  background: none;

  border: 3px grey;
  border-style: dashed solid;

  box-sizing: border-box;

  color: grey;
}
</style>