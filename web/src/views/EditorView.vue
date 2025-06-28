<script setup lang="ts">
import type { SimplifiedPlaylist, Track } from '@/types/spotify';
import { onBeforeMount, ref } from 'vue';
import { getPlaylists, searchPlaylists } from '@/scripts/util';
import { useEditorStore } from '@/stores/editor';


import Playlists from '@/components/Playlists.vue';
import Tracks from '@/components/Tracks.vue';
import TrackComp from '@/components/TrackComp.vue';
import PlaylistComp from '@/components/PlaylistComp.vue';

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
      <Tracks v-if="editor.target" :playlist="editor.target" @track:click="(t) => editor.toggleAdded(t)"
        @back="() => editor.target = undefined">
      </Tracks>
    </div>
    <div class="from container border">
    </div>
    <div class="delta container border">
      <div class="added">
        <TrackComp :track="t" v-for="t in editor.added"></TrackComp>
      </div>
      <div class="removed">
        <TrackComp :track="t" v-for="t in editor.removed"></TrackComp>
      </div>
      <button>Submit</button>
    </div>
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

  width: 30%;
  height: 95%;
}
</style>