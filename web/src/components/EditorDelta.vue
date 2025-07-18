<script setup lang="ts">
import { ref } from 'vue';
import { useEditorStore } from '@/stores/editor';

import Tracks from './Tracks.vue';
import type { Track } from '@/types/spotify';
import { submit } from '@/scripts/util';

const editor = useEditorStore()
const hidden = ref(true)

</script>

<template>
  <div class="delta" v-if="editor.target">
    <div class="delta-header">
          <div class="playlist-header">
      <img id="cover" :src="editor.target!.images[0].url" alt="Playlist Cover">
      <span>{{ editor.target?.name }}</span>
    </div>
    </div>
    <div class="added" v-if="editor.added.length">
      <Tracks :tracks="editor.added" @track:click="(t: Track) => editor.toggleAdded(t)"></Tracks>
    </div>
    <div class="removed" v-if="editor.removed.length">
      <Tracks :tracks="editor.removed" @track:click="(t: Track) => editor.toggleRemoved(t)"></Tracks>
    </div>
    <button id="delta-submit" @click="() => submit()">Submit</button>
  </div>
</template>

<style lang="css" scoped>
.delta {
  height: calc(100% - 2em);
  max-width: 30%;
  display: flex;
  flex-direction: column;

  gap: 0.5em;

  margin: 1em;
  padding: 1em;
  box-sizing: border-box;
  background-color: var(--primary);
}

.playlist-header {
  height: 3em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;

  padding: 0.5em;
  box-sizing: content-box;

  background-color: var(--secondary);
}

#cover {
  height: 100%;
}

.added {
  border: 0.3em solid lightgreen;
  padding: 0.5em;
}

.removed {
  border: 0.15em solid darkred;
  padding: 0.5em;
}

#delta-submit {
  height: 3em;
  background-color: green;
}

</style>