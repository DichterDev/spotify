<template>
  <div>
    <nav v-if="$route.path !== '/'">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/editor">Editor</RouterLink>
      <RouterLink to="/profile">Profile</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
    </nav>
    <main>
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style scoped>
</style>
