<script setup lang="ts">
import { ref } from 'vue';

const hiddenSidebar = ref(true)

</script>

<template>
  <div>
    <nav>
      <span @click="() => hiddenSidebar = !hiddenSidebar"><i class="las la-bars"></i></span>
      <span>{{ $router.currentRoute.value.name?.toString() }}</span>
    </nav>
    <main>
      <RouterView></RouterView>
    </main>
    <div class="sidebar" v-if="!hiddenSidebar">
      <div class="sidebar-content">
        <RouterLink to="/">
          <span><i class="las la-home"></i></span>
          <span>Home</span>
        </RouterLink>
        <RouterLink to="/editor">
          <span><i class="las la-edit"></i></span>
          <span>Editor</span>
        </RouterLink>
        <RouterLink to="/profile">
          <span><i class="las la-user-secret"></i></span>
          <span>Profile</span>
        </RouterLink>
        <RouterLink to="/about">
          <span><i class="las la-info-circle"></i></span>
          <span>About</span>
        </RouterLink>
        <RouterLink to="/settings">
          <span><i class="las la-cog"></i></span>
          <span>Settings</span>
        </RouterLink>
      </div>
      <div class="sidebar-back" @click="() => hiddenSidebar = true">
        <span><i class="las la-angle-left"></i></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
nav {
  height: 5vh;

  border-bottom: 1px solid var(--border);
  background-color: var(--secondary);
}

main {
  height: 95vh;
}

.sidebar {
  height: 100vh;
  width: 20vw;

  display: flex;
  flex-direction: row;

  position: absolute;
  left: 0;
  top: 0;

  background-color: var(--secondary);
  border-right: 1px solid var(--border);
  z-index: 2;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-back {
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  width: 2em;
  border-left: 1px solid grey;
}

.sidebar-back:hover {
  cursor: pointer;
}
</style>
