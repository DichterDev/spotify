<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore()

onBeforeMount(async () => { await auth.getAccessToken() })
</script>

<template>
  <main>
    <RouterView></RouterView>
  </main>
</template>

<style scoped>
</style>
