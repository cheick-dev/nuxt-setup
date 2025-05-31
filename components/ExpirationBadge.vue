<template>
  <Badge :variant="badgeVariant" :class="badgeClass">
    <component :is="badgeIcon" class="w-3 h-3 mr-1" />
    {{ badgeText }}
  </Badge>
</template>

<script setup>
import { computed } from "vue";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const props = defineProps({
  expiryDate: {
    type: [Date, String],
    required: true,
  },
});

// Calculs
const daysUntilExpiry = computed(() => {
  const today = new Date();
  const expiryDate = new Date(props.expiryDate);
  const diffTime = Math.abs(expiryDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return expiryDate > today ? diffDays : -diffDays;
});

const isExpired = computed(() => {
  return daysUntilExpiry.value <= 0;
});

const isExpiringSoon = computed(() => {
  return daysUntilExpiry.value > 0 && daysUntilExpiry.value <= 7;
});

const badgeVariant = computed(() => {
  if (isExpired.value) return "destructive";
  if (isExpiringSoon.value) return "secondary";
  return "secondary";
});

const badgeClass = computed(() => {
  if (isExpired.value) {
    return "bg-red-100 text-red-800 border-red-200";
  }
  if (isExpiringSoon.value) {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }
  return "bg-green-100 text-green-800 border-green-200";
});

const badgeIcon = computed(() => {
  if (isExpired.value) return XCircle;
  if (isExpiringSoon.value) return AlertTriangle;
  return Clock;
});

const badgeText = computed(() => {
  if (isExpired.value) {
    return "Expirée";
  }
  if (isExpiringSoon.value) {
    return `Expire dans ${daysUntilExpiry.value} jour${
      daysUntilExpiry.value > 1 ? "s" : ""
    }`;
  }
  return `Expire dans ${daysUntilExpiry.value} jours`;
});
</script>
