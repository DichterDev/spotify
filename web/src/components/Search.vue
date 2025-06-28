<script setup lang="ts">

const emit = defineEmits(["search:change", "refresh:click"])
</script>

<template>
  <div class="search-container">
    <input class="search-input" placeholder="Search..."
      @input="emit('search:change', ($event.target as HTMLInputElement).value)" />
  </div>
</template>

<style lang="css" scoped>
.search-container {
  display: flex;
  flex-direction: row;
}

.search-input {
  flex: 1;
  background-color: var(--secondary);
  border-radius: 0.25em;
  padding: 5px;
}
</style>