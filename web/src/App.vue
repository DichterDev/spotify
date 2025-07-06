<script setup lang="ts">
import { ref } from 'vue';

const hiddenSidebar = ref(true)

function displayRoute(route?: string): string {
  if (!route) return "Home"
  route = route.split('-')[0]
  return route.charAt(0).toUpperCase() + route.slice(1)
}

</script>

<template>
  <div>
    <nav class="navbar">
      <span id="toggle-sidebar"><i class="las la-bars" @click="() => hiddenSidebar = !hiddenSidebar"></i></span>
      <span id="current-page">{{ displayRoute($router.currentRoute.value.name?.toString()) }}</span>
    </nav>
    <main>
      <RouterView></RouterView>
    </main>
    <div class="sidebar" v-if="!hiddenSidebar" @click="() => hiddenSidebar = true">
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
.navbar {
  height: 5vh;
  min-height: 2em;

  display: grid;
  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  border-bottom: 1px solid var(--border);
  background-color: var(--secondary);
}

#toggle-sidebar {
  margin-left: 0.5em;
  grid-column: 1;
}

#toggle-sidebar>i {
  font-size: 1.5em;
}


#toggle-sidebar>i:hover {
  cursor: pointer;
}


#current-page {
  grid-column: 2;
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
  justify-content: center;
  gap: 1em;
}

.sidebar-content>* {
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--primary);
}

.sidebar-content>*>* {
  font-size: 1.3em;
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
