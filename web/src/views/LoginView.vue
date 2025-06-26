<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';


const auth = useAuthStore()

</script>

<template>
  <div class="login-container">
    <div>To access this application you need to login</div>
    <div>Sorry for the inconvenience :3</div>
    <div @click="auth.login">Login</div>
    <div @click="auth.refresh">Refresh</div>
  </div>
</template>