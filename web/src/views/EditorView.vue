<script setup lang="ts">
import type { SimplifiedPlaylist, Track } from '@/types/spotify';
import { onBeforeMount, ref } from 'vue';
import { getPlaylists, searchPlaylists, submit } from '@/scripts/util';
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
      <Tracks v-if="editor.target" :playlist="editor.target" @track:click="(t) => editor.toggleRemoved(t)"
        @back="() => editor.target = undefined">
      </Tracks>
    </div>
    <div class="from container border">
      <Playlists :playlists="playlists" @click:playlist="(p) => editor.from = p"
        v-if="playlists.length && !editor.from">
      </Playlists>
      <Tracks v-if="editor.from" :playlist="editor.from" @track:click="(t) => editor.toggleAdded(t)"
        @back="() => editor.from = undefined">
      </Tracks>
    </div>
    <div class="delta container border">
      <PlaylistComp :playlist="editor.target" v-if="editor.target" @click="editor.target = undefined"></PlaylistComp>
      <div class="added" v-if="editor.added.length">
        <TrackComp :track="t" :key="t.id" v-for="t in editor.added" @click="editor.toggleAdded(t)">
        </TrackComp>
      </div>
      <div class="removed" v-if="editor.removed.length">
        <TrackComp :track="t" :key="t.id" v-for="t in editor.removed" @click="editor.toggleRemoved(t)">
        </TrackComp>
      </div>
      <button :disabled="(editor.added.length + editor.removed.length) === 0" @click="submit">Submit</button>
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

.added,
.removed {
  padding: 5px;
}

.added {
  background-color: lightgreen;
}

.removed {
  background-color: lightcoral;
}
</style>