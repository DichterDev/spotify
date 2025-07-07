<script setup lang="ts">
import { ref } from 'vue';
import { useEditorStore } from '@/stores/editor';

import Tracks from './Tracks.vue';
import PlaylistHeader from './PlaylistHeader.vue';

const editor = useEditorStore()
const hidden = ref(true)
</script>

<template>
  <div class="delta" v-if="!hidden">
    <div class="delta-header">
      <PlaylistHeader :playlist="editor.target" v-if="editor.target"></PlaylistHeader>
    </div>
    <div class="added" v-if="editor.added.length">
      <Tracks :tracks="editor.added"></Tracks>
    </div>
    <div class="removed" v-if="editor.removed.length">
      <Tracks :tracks="editor.removed"></Tracks>
    </div>
    <button>Submit</button>
  </div>
  <div class="delta-toggle" v-else>
    <i class="las la-check-double"></i>
  </div>
</template>

<style lang="css" scoped>
.delta {
  height: 100%;
  display: flex;
  flex-direction: column;

  margin: 1em;
  padding: 1em;
  box-sizing: border-box;
  background-color: var(--primary);
}
</style>