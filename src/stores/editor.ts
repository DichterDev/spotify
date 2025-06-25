import { defineStore } from "pinia";
import { ref } from "vue";

const editorStore = defineStore('editor', () => {
  const target = ref(undefined)
  const from = ref(undefined)
  const added = ref([])
  const removed = ref([])
})