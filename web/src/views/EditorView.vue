<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';
import { onBeforeMount, ref } from 'vue';
import { getPlaylists, searchPlaylists } from '@/scripts/util';

import PlaylistComp from '@/components/PlaylistComp.vue';
import Search from '@/components/Search.vue';


const _playlists = ref<SimplifiedPlaylist[]>([])
const playlists = ref<SimplifiedPlaylist[]>([])

async function handleTargetSearch(query: string) {
  playlists.value = await searchPlaylists(query, _playlists.value)
}

onBeforeMount(async () => {
  _playlists.value = await getPlaylists()
  playlists.value = _playlists.value
})

</script>

<template>
  <div class="editor">
    <div class="target container border">
      <div class="playlists">
        <Search @search:change="handleTargetSearch"></Search>
        <PlaylistComp :key="p.id" :playlist="p" v-for="p in playlists"></PlaylistComp>
      </div>
    </div>
    <div class="from container border">
    </div>
    <div class="delta container border"></div>
  </div>
</template>

<style lang="css" scoped>
.editor {
  height: 100%;

  display: flex;
  flex-direction: row;

  justify-content: space-evenly;
  align-items: center;
}

.container {
  background-color: var(--primary);

  padding: 10px;

  overflow-y: scroll;
  overflow-x: hidden;
  width: 30%;
  height: 90%;
}

.playlists {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.playlists>* {
  height: 3em;
}
</style>