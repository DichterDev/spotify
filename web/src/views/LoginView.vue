<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';


const auth = useAuthStore()

</script>

<template>
  <div class="login-container">
    <div>Login to access this application</div>
    <div>Sorry for the inconvenience :3</div>
    <div class="login-button" @click="auth.login">Login</div>
  </div>
</template>

<style lang="css" scoped>
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.login-button {
  height: 3em;
  width: 8em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  border-radius: 0.25em;
}
</style>