<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';


const auth = useAuthStore()
</script>

<template>
  <div class="home-container">
    <RouterLink to="/editor">Editor</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/profile">Profile</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/settings">Settings</RouterLink>
  </div>
  <div v-show="auth.isLoggedIn">
    Logged
  </div>
</template>
