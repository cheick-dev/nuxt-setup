<!-- components/ui/StatsCard.vue -->
<template>
  <div class="p-4 bg-white dark:bg-gray-900 shadow rounded-2xl">
    <h3 class="text-sm text-muted-foreground">{{ label }}</h3>
    <p class="text-xl font-bold mt-1">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number }>();
</script>
