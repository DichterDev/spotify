<script setup lang="ts">

import Search from '@/components/Search.vue';
import Playlists from '@/components/Playlists.vue';
import { computed, onBeforeMount, ref } from 'vue';
import type { SimplifiedPlaylist } from '@/types/spotify';
import { getPlaylistID, getPlaylists, searchPlaylists } from '@/scripts/util';
import { useEditorStore } from '@/stores/editor';
import { useRouter } from 'vue-router';

const playlists = ref<SimplifiedPlaylist[]>([])
const visible = computed<SimplifiedPlaylist[]>(() => searchPlaylists(search.value, playlists.value))
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
  playlists.value = await getPlaylists()
})

</script>

<template>
  <div class="add">
    <div class="add-header">
      <Search @change="handleSearch"></Search>
    </div>
    <div class="my-playlists">
      <Playlists :playlists="visible" @click:playlist="clickPlaylist"></Playlists>
    </div>
    <div class="spotify"></div>
  </div>
</template>

<style lang="css" scoped></style>