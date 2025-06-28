<script setup lang="ts"></script>

<template>
  <div class="home-container">
    <RouterLink to="/editor">Editor</RouterLink>
    <RouterLink to="/profile">Profile</RouterLink>
    <RouterLink to="/settings">Settings</RouterLink>
  </div>
</template>

<style lang="css" scoped>
.home-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: center;

  gap: 1em;
}

.home-container>* {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20%;
  aspect-ratio: 1 / 1;
  border-radius: 0.25em;

  background-color: var(--primary);
}
</style>