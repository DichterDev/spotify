import { defineStore } from "pinia";
import { ref } from "vue";

export const userStore = defineStore('user', () => {
  const token = ref('')
  const isLoggedIn = ref(false)

  function setToken(t: string) {
    token.value = t
    isLoggedIn.value = true
  }

  function clear() {
    token.value = ''
    isLoggedIn.value = false
  }

  return { token, isLoggedIn, setToken, clear}
})