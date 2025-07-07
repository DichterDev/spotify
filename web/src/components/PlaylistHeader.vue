<script setup lang="ts">
import type { SimplifiedPlaylist } from '@/types/spotify';


const props = defineProps<{
  playlist: SimplifiedPlaylist
}>()

const emits = defineEmits<{
  'click:back': [],
}>()

</script>
<template>
  <div class="playlist-header">
    <button class="pl-header-back" @click="() => $router.back()"> <i class=" las la-reply"></i></button>
    <div>
      <img class="pl-cover" :src="props.playlist.images[0].url" />
      <span class="pl-name">{{ props.playlist.name }}</span>
    </div>
  </div>
</template>
<style lang="css" scoped>
.playlist-header {
  height: 3em;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.pl-header-back {
  flex: 1;
  height: 100%;
  aspect-ratio: 1 / 1;
}

.pl-header-back>i {
  font-size: 1.3em;
}

.pl-cover {
  height: 100%;
  aspect-ratio: 1 / 1;
}
</style>