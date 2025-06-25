import { defineStore } from "pinia";
import { ref } from "vue";

const userStore = defineStore('user', () => {
  const token = ref('')
  const isLoggedIn = ref(false)

  function setToken(t: string) {
    token.value = t
  }

  function clear() {
    token.value = ''
    isLoggedIn.value = false
  }
})