// pages/dashboard.vue
<template>
  <div class="p-6 space-y-6 min-h-screen" v-if="!isProfileLoading">
    <AdminDashboard v-if="userProfile.role === 'admin'" />
    <StoreDashboard v-else-if="userProfile.role === 'store'" />
    <CustomerDashboard v-else />
    <!-- <component :is="dashboardComponent" />
    {{ userProfile.role }} -->
  </div>
  <div v-else class="flex items-center justify-center h-screen">
    <Loader2 class="w-12 h-12 text-gray-600 animate-spin" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});
import AdminDashboard from "@/components/dashboard/AdminDashboard.vue";
import StoreDashboard from "@/components/dashboard/StoreDashboard.vue";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard.vue";
import { Loader2 } from "lucide-vue-next";

const { userProfile, isProfileLoading } = useUserProfile();
</script>
