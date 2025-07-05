<script setup lang="ts">
import { getPlaylists, searchPlaylists } from '@/scripts/util';
import type { SimplifiedPlaylist } from '@/types/spotify';
import { computed, onBeforeMount, ref } from 'vue';

import Playlists from '@/components/Playlists.vue';
import Search from '@/components/Search.vue';
import { useEditorStore } from '@/stores/editor';
import { useRouter } from 'vue-router';

const editor = useEditorStore()
const router = useRouter()

const playlists = ref<SimplifiedPlaylist[]>([])
const visible = computed<SimplifiedPlaylist[]>(() => searchPlaylists(search.value, playlists.value))
const search = ref('')

function handleSearch(query: string) {
  console.log(query)
  search.value = query
}

function clickPlaylist(playlist: SimplifiedPlaylist) {
  editor.target = playlist
  router.push(`/editor/${editor.target.id}`)
}

onBeforeMount(async () => {
  playlists.value = await getPlaylists()
})

</script>

<template>
  <div class="editor">
    <div class="editor-header">
      <Search @change="handleSearch"></Search>
      <button id="sort">Sort</button>
    </div>
    <div class="playlist-container">
      <div>Create Playlist</div>
      <Playlists :playlists="visible" @click:playlist="clickPlaylist"></Playlists>
    </div>
  </div>
</template>

<style lang="css" scoped>
.editor {
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  flex-direction: row;
}
</style>