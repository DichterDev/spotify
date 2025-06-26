<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';
import { onBeforeMount, ref } from 'vue';

import PlaylistComp from '@/components/PlaylistComp.vue';
import { getPlaylists } from '@/scripts/util';

const playlists = ref<SimplifiedPlaylist[]>([])

onBeforeMount(async () => {
  playlists.value = await getPlaylists()
})

</script>

<template>
  <div class="editor">
    <div class="target container border">
      <div class="playlists">
        <PlaylistComp :playlist="p" v-for="p in playlists"></PlaylistComp>
      </div>
    </div>
    <div class="from container border">

    </div>
    <div class="delta container border"></div>
  </div>
</template>

<style lang="css" scoped>
.editor {
  display: flex;
  flex-direction: row;
  max-height: 90vh;

  justify-content: space-evenly;
}

.container {
  background-color: var(--primary);

  padding: 10px;

  overflow-y: scroll;
  overflow-x: hidden;
  width: 30%;
  max-height: 100%;
}

.playlists {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.playlists > * {
  height: 4em;
}

</style>