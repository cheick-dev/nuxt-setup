<template>
  <div class="flex bg-gray-50">
    <!-- Sidebar Desktop -->
    <aside
      :class="[
        'hidden lg:flex bg-white border-r border-gray-200 flex-col transition-all duration-300 fixed h-full z-10',
        sidebarCollapsed ? 'w-16' : 'w-64',
      ]"
    >
      <!-- Logo -->
      <div class="px-3 py-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center p-2"
          >
            <Package class="w-5 h-5 text-white" />
          </div>
          <span
            v-show="!sidebarCollapsed"
            class="text-xl font-bold text-gray-900 transition-opacity duration-300"
          >
            Dashboard
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-2 space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :to="item.href"
          :class="[
            'flex items-center space-x-3 p-3 rounded-lg font-medium group p-2',
            $route.path === item.href
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
          >
            {{ item.name }}
          </span>
        </NuxtLink>
      </nav>

      <!-- User info -->
      <NuxtLink
        href="/dashboard/profile"
        class="p-4 border-t border-gray-200"
        v-if="userProfile"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <div
              v-if="userProfile.full_name"
              class="text-xl font-bold text-gray-900"
            >
              {{ userProfile.full_name[0] }}
            </div>
            <User v-else class="w-5 h-5 text-gray-600" />
          </div>
          <div
            v-show="!sidebarCollapsed"
            class="flex-1 min-w-0 transition-opacity duration-300"
          >
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ userProfile.full_name }}
            </p>
            <p class="text-xs text-gray-500">{{ userProfile.role }}</p>
          </div>
        </div>
      </NuxtLink>
    </aside>

    <!-- Sidebar Mobile (Sheet) -->
    <Sheet v-model:open="mobileMenuOpen" v-if="userProfile">
      <SheetContent side="left" class="w-64 p-0">
        <div class="flex flex-col h-full bg-white">
          <!-- Logo Mobile -->
          <div class="px-3 py-4 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <div
                class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center p-2"
              >
                <Package class="w-5 h-5 text-white" />
              </div>
              <span
                v-show="!sidebarCollapsed"
                class="text-xl font-bold text-gray-900 transition-opacity duration-300"
              >
                Dashboard
              </span>
            </div>
          </div>

          <!-- Navigation Mobile -->
          <nav class="flex-1 p-4 space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :to="item.href"
              :class="[
                'flex items-center space-x-3 rounded-lg font-medium group p-2',
                $route.path === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span
                v-show="!sidebarCollapsed"
                class="transition-opacity duration-300"
              >
                {{ item.name }}
              </span>
            </NuxtLink>
          </nav>

          <!-- User info Mobile -->
          <NuxtLink
            href="/dashboard/profile"
            class="p-4 border-t border-gray-200"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
              >
                <div
                  v-if="userProfile.full_name"
                  class="text-xl font-bold text-gray-900"
                >
                  {{ userProfile.full_name[0] }}
                </div>
                <User v-else class="w-5 h-5 text-gray-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ userProfile.full_name }}
                </p>
                <p class="text-xs text-gray-500">{{ userProfile.role }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </SheetContent>
    </Sheet>

    <!-- Contenu principal -->
    <main
      :class="[
        'flex-1 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64',
      ]"
    >
      <!-- Header -->
      <header
        class="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Menu Hamburger Mobile -->
            <Button
              variant="ghost"
              size="sm"
              class="lg:hidden"
              @click="mobileMenuOpen = true"
            >
              <Menu class="w-5 h-5" />
            </Button>

            <!-- Toggle Sidebar Desktop -->
            <Button
              variant="ghost"
              size="sm"
              class="hidden lg:flex"
              @click="sidebarCollapsed = !sidebarCollapsed"
            >
              <PanelLeftClose v-if="!sidebarCollapsed" class="w-5 h-5" />
              <PanelLeftOpen v-else class="w-5 h-5" />
            </Button>

            <h1 class="text-xl lg:text-2xl font-bold text-gray-900">
              {{ $route.meta.title || "Dashboard" }}
            </h1>
          </div>

          <!-- <StoreForm /> -->
        </div>
      </header>

      <div class="flex-1 p-4 lg:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Package,
  PlusCircle,
  User,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import StoreForm from "@/components/store/CreateStoreForm.vue";

const { userProfile } = useUserProfile();

const mobileMenuOpen = ref(false);
const sidebarCollapsed = ref(false);

const navItems = ref([
  { name: "Mes annonces", href: "/dashboard", icon: Package },
  //   {
  //     name: "Historique d'achats",
  //     href: "/dashboard/orders",
  //     icon: ShoppingBag,
  //   },
  //   { name: "Mes dons", href: "/dashboard/donations", icon: Heart },
  {
    name: "Créer une annonce",
    href: "/dashboard/create-listing",
    icon: PlusCircle,
  },
  //   { name: "Faire un don", href: "/dashboard/donate", icon: Gift },
  //   { name: "Mon compte", href: "/dashboard/profile", icon: User },
]);
</script>
