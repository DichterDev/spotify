<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';
import PlaylistComp from './PlaylistComp.vue';
import Search from './Search.vue';
import { ref } from 'vue';
import { searchPlaylists } from '@/scripts/util';

const props = defineProps<{
  playlists: SimplifiedPlaylist[]
}>()

const emits = defineEmits<{
  "click:playlist": [playlist: SimplifiedPlaylist]
}>()

const playlists = ref<SimplifiedPlaylist[]>(props.playlists)

console.log(playlists.value)

async function handleSearch(query: string) {
  playlists.value = await searchPlaylists(query, props.playlists)
}
</script>

<template>
  <div class="playlists-container">
    <Search @search:change="handleSearch"></Search>
    <div class="playlists">
      <PlaylistComp :playlist="p" v-for="p in playlists" @click="emits('click:playlist', p)"></PlaylistComp>
    </div>
  </div>
</template>

<style lang="css" scoped>
.playlists {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.playlists>* {
  height: 3em;
}
</style>