<template>
  <div class="fixed bottom-4 right-4 z-50">
    <Card class="p-4 bg-gray-900 text-white border-gray-700 shadow-lg max-w-sm">
      <div class="flex items-center justify-between space-x-3">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
          >
            <Trash2 class="w-4 h-4 text-red-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-white">Annonce supprimée</p>
            <p class="text-sm text-gray-300 truncate">{{ listing.title }}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          @click="$emit('dismiss')"
          class="text-gray-400 hover:text-white"
        >
          <X class="w-4 h-4" />
        </Button>
      </div>

      <div class="flex items-center justify-between mt-3">
        <div class="text-xs text-gray-400">
          Suppression dans {{ timeLeft }}s
        </div>

        <Button
          variant="outline"
          size="sm"
          @click="$emit('undo')"
          class="bg-white text-gray-900 hover:bg-gray-100"
        >
          <Undo class="w-3 h-3 mr-1" />
          Annuler
        </Button>
      </div>

      <!-- Barre de progression -->
      <div class="mt-2">
        <div class="w-full bg-gray-700 rounded-full h-1">
          <div
            class="bg-red-500 h-1 rounded-full transition-all duration-1000"
            :style="{ width: `${(timeLeft / 10) * 100}%` }"
          ></div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Trash2, X, Undo } from "lucide-vue-next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const props = defineProps({
  listing: {
    type: Object,
    required: true,
  },
});

defineEmits(["undo", "dismiss"]);

// État
const timeLeft = ref(10);
let timer = null;

// Décompte
const startCountdown = () => {
  timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// Lifecycle
onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
