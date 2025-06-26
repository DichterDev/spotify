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
    <div>Editor</div>
    <div class="target">
      <div>Target:</div>
      <div class="playlists">
        <PlaylistComp :playlist="p" v-for="p in playlists"></PlaylistComp>
      </div>
    </div>
    <div class="from">

    </div>
    <div class="delta"></div>
  </div>
</template>