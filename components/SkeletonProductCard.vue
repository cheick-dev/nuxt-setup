<template>
  <Card class="overflow-hidden">
    <div class="aspect-square bg-gray-100 animate-pulse"></div>
    <div class="p-4 space-y-3">
      <div class="flex justify-between items-start">
        <div class="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-5 bg-gray-200 rounded w-1/5 animate-pulse"></div>
      </div>

      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
      </div>

      <div class="flex gap-2">
        <div class="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>

      <div class="flex justify-between pt-2">
        <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Card } from "@/components/ui/card";
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
