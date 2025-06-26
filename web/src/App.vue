<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const state = route.query.state;
  const success = route.query.authSuccess;

  if(state && success === "true") {
    await auth.getAccessToken(state.toString())
    router.push({ path: '/'})
  }
})
</script>

<template>
  <nav v-if="$route.path !== '/'">
    <RouterLink to="/home">Home</RouterLink>
    <RouterLink to="/editor">Editor</RouterLink>
    <RouterLink to="/profile">Profile</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
  </nav>
  <main>
    <RouterView></RouterView>
  </main>
</template>

<style scoped>
</style>
