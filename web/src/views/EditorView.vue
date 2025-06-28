<script setup lang="ts">
import type { SimplifiedPlaylist, Track } from '@/types/spotify';
import { onBeforeMount, ref } from 'vue';
import { getPlaylists, searchPlaylists } from '@/scripts/util';

import Playlists from '@/components/Playlists.vue';
import Tracks from '@/components/Tracks.vue';
import { useEditorStore } from '@/stores/editor';

const editor = useEditorStore()
const playlists = ref<SimplifiedPlaylist[]>([])

onBeforeMount(async () => {
  playlists.value = await getPlaylists()
})

</script>

<template>
  <div class="editor">
    <div class="target container border">
      <Playlists :playlists="playlists" @click:playlist="(p) => editor.target = p"
        v-if="playlists.length && !editor.target">
      </Playlists>
      <Tracks :playlist="editor.target" v-if="editor.target" @track:click="(t) => editor.toggleAdded(t)"></Tracks>
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
</style>