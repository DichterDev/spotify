<script setup lang="ts">
import { login } from '@/scripts/auth';



</script>

<template>
  <div class="login-container">
    <div>To access this application you need to login</div>
    <div>Sorry for the inconvenience :D</div>
    <div @click="() => login()">Login</div>
  </div>
</template>