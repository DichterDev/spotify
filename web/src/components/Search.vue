<script setup lang="ts">

const emit = defineEmits(["search:change", "button:refresh"])
</script>

<template>
  <div class="search-container">
    <input placeholder="Search..." @input="emit('search:change', ($event.target as HTMLInputElement).value)" />
  </div>
</template>

<style lang="css" scoped></style>