<template>
  <div class="flex bg-gray-50">
    <!-- Sidebar Desktop -->
    <aside
      :class="[
        'hidden lg:flex bg-white border-r border-gray-200 flex-col transition-all duration-300 fixed h-full z-10',
        sidebarCollapsed ? 'w-16' : 'w-64',
      ]"
    >
      <!-- Logo et nom du store -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"
          >
            <Store class="w-5 h-5 text-white" />
          </div>
          <div
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
          >
            <span class="text-lg font-bold text-gray-900">Ma Boutique</span>
            <p class="text-xs text-gray-500">Gestionnaire</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink
          v-for="item in navItems"
          :to="item.href"
          :class="[
            'flex items-center space-x-3 p-3 rounded-lg font-medium group',
            $route.path === item.href
              ? 'bg-blue-50 text-green-700'
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

        <!-- <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-50 text-green-700 font-medium"
          :title="sidebarCollapsed ? 'Produits' : ''"
        >
          <Package class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Produits</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Statistiques' : ''"
        >
          <BarChart3 class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Statistiques</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Commandes' : ''"
        >
          <ShoppingCart class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Commandes</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Avis & réclamations' : ''"
        >
          <MessageSquare class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Avis & réclamations</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Dons reçus' : ''"
        >
          <Gift class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Dons reçus</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Paramètres' : ''"
        >
          <Settings class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Paramètres</span
          >
        </a> -->
      </nav>

      <!-- Info boutique -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <User class="w-5 h-5 text-green-600" />
          </div>
          <div
            v-show="!sidebarCollapsed"
            class="flex-1 min-w-0 transition-opacity duration-300"
          >
            <p class="text-sm font-medium text-gray-900 truncate">
              Marie Dupont
            </p>
            <p class="text-xs text-gray-500">Gestionnaire</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Sidebar Mobile (Sheet) -->
    <Sheet v-model:open="mobileMenuOpen">
      <SheetContent side="left" class="w-64 p-0">
        <div class="flex flex-col h-full bg-white">
          <!-- Logo Mobile -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <div
                class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"
              >
                <Store class="w-5 h-5 text-white" />
              </div>
              <div>
                <span class="text-lg font-bold text-gray-900">Ma Boutique</span>
                <p class="text-xs text-gray-500">Gestionnaire</p>
              </div>
            </div>
          </div>

          <!-- Navigation Mobile -->
          <nav class="flex-1 p-4 space-y-2">
            <NuxtLink
              v-for="item in navItems"
              :to="item.href"
              :class="[
                'flex items-center space-x-3 p-3 rounded-lg font-medium group',
                $route.path === item.href
                  ? 'bg-blue-50 text-green-700'
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

          <!-- Info boutique Mobile -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <User class="w-5 h-5 text-green-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  Marie Dupont
                </p>
                <p class="text-xs text-gray-500">Gestionnaire</p>
              </div>
            </div>
          </div>
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
      <!-- Header avec info store -->
      <header class="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
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

            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900">
                Produits
              </h1>
              <p class="text-sm text-gray-500 hidden sm:block">
                Gérez votre catalogue de produits
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2 lg:space-x-4">
            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-gray-900">Ma Boutique Bio</p>
              <p class="text-xs text-gray-500">
                Dernière connexion: Aujourd'hui
              </p>
            </div>
            <Button variant="outline" size="sm">
              <LogOut class="w-4 h-4 lg:mr-2" />
              <span class="hidden lg:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <!-- Zone de contenu scrollable -->
      <div class="flex-1 p-4 lg:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Store,
  Package,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  Gift,
  Settings,
  User,
  LogOut,
  Euro,
  PlusCircle,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const mobileMenuOpen = ref(false);
const sidebarCollapsed = ref(false);

const navItems = ref([
  { name: "Produits", href: "/dashboard/store", icon: Package },
  { name: "Statistiques", href: "/dashboard/statistics", icon: BarChart3 },
  { name: "Commandes", href: "/dashboard/commands", icon: ShoppingCart },
  {
    name: "Avis & réclamations",
    href: "/dashboard/reviews",
    icon: MessageSquare,
  },
  { name: "Dons reçus", href: "/dashboard/donations", icon: Gift },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]);
</script>
