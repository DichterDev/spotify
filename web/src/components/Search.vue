<script setup lang="ts">

const emit = defineEmits<{
  change: [string]
}>()

function change(event: Event) {
  const target = event.target as HTMLInputElement
  emit('change', target.value)
}

</script>

<template>
  <input class="search" type="text" placeholder="Search..." @input="change" />
</template>

<style lang="css" scoped>
.search {
  flex: 1;
  background-color: var(--secondary);
  border-radius: 0.25em;
  padding: 5px;
}
</style>