<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { getAccessToken } from './scripts/auth';


onBeforeMount(async () => { await getAccessToken()})
</script>

<template>
  <nav>
    <RouterLink to="/login">Login</RouterLink>
  </nav>
  <main>
    <RouterView></RouterView>
  </main>
</template>

<style scoped>
</style>
