<script setup lang="ts">

import Search from '@/components/Search.vue';
import Playlists from '@/components/Playlists.vue';
import { computed, onBeforeMount, ref } from 'vue';
import type { SimplifiedPlaylist } from '@/types/spotify';
import { getPlaylistID, getPlaylists, likedSongs, searchPlaylists } from '@/scripts/util';
import { useEditorStore } from '@/stores/editor';
import { useRouter } from 'vue-router';

const playlists = ref<SimplifiedPlaylist[]>([likedSongs])
const visible = computed<SimplifiedPlaylist[]>(() => searchPlaylists(search.value, playlists.value).filter(p => p.id !== editor.target?.id))
const search = ref('')

const editor = useEditorStore()
const router = useRouter()

function handleSearch(query: string) {
  const id = getPlaylistID(query)
  if (id) {
    router.push(`/editor/add/playlist/${id}`)
    editor.from = id
  }

  search.value = query
}

function clickPlaylist(playlist: SimplifiedPlaylist) {
  editor.from = playlist.id
  router.push(`/editor/add/playlist/${playlist.id}`)
}

onBeforeMount(async () => {
  const res = await getPlaylists()
  playlists.value = playlists.value.concat(res)
})

</script>

<template>
  <div class="add">
    <div class="add-header">
      <Search @change="handleSearch"></Search>
      <button>Sort</button>
    </div>
    <div class="my-playlists" v-if="visible.length">
      <Playlists :playlists="visible" @click:playlist="clickPlaylist"></Playlists>
    </div>
    <div class="spotify"></div>
  </div>
</template>

<style lang="css" scoped>
.add {
  height: calc(100% - 2em);
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  margin: 1em;
  padding: 1em;


  background-color: var(--primary);
  box-sizing: border-box;
}

.add-header {
  display: flex;
}

.my-playlists {
  padding: 0.5em;
  background-color: var(--secondary);
}
</style>