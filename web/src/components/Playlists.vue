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
</script>

<template>
  <div class="playlists">
    <PlaylistComp :playlist="p" v-for="p in props.playlists" @click="emits('click:playlist', p)"></PlaylistComp>
  </div>
</template>

<style lang="css" scoped>
.playlists {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>