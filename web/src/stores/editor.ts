import type { SimplifiedPlaylist, Track } from "@/types/spotify";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEditorStore = defineStore('editor', () => {
  const target = ref<SimplifiedPlaylist>()
  const from = ref<string>()
  const added = ref<Track[]>([])
  const removed = ref<Track[]>([])

  function toggle(ts: Track[], t: Track): Track[] {
    const i = ts.findIndex(({ id }) => id === t.id)
    if (i === -1) ts.push(t)
    else ts.splice(i, 1)
    return ts
  }

  function toggleAdded(t: Track) {
    added.value = toggle(added.value, t)
  }

  function toggleRemoved(t: Track) {
    removed.value = toggle(removed.value, t)
  }

  function reset() {
    from.value = undefined
    added.value = []
    removed.value = []
  }

  return {
    target,
    from,
    added,
    removed,
    toggleAdded,
    toggleRemoved,
    reset
  }
})