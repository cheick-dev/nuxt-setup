<template>
  <Badge :variant="statusConfig.variant" :class="statusConfig.class">
    <component :is="statusConfig.icon" class="w-3 h-3 mr-1" />
    {{ statusConfig.label }}
  </Badge>
</template>

<script setup>
import { computed } from "vue";
import { CheckCircle, Clock, XCircle, Archive } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const statusConfig = computed(() => {
  const configs = {
    en_stock: {
      label: "En stock",
      variant: "secondary",
      class: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    reserve: {
      label: "Réservé",
      variant: "secondary",
      class: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    vendu: {
      label: "Vendu",
      variant: "secondary",
      class: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle,
    },
    archive: {
      label: "Archivé",
      variant: "secondary",
      class: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Archive,
    },
  };

  return configs[props.status] || configs.en_stock;
});
</script>
