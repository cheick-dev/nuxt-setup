<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar Desktop -->
    <aside
      :class="[
        'hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col transition-all duration-300',
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
      ]"
    >
      <!-- Logo Admin -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"
          >
            <Shield class="w-5 h-5 text-white" />
          </div>
          <div
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
          >
            <span class="text-lg font-bold text-gray-900">Admin Panel</span>
            <p class="text-xs text-gray-500">Système</p>
          </div>
        </div>
      </div>

      <!-- Navigation Admin -->
      <nav class="flex-1 p-4 space-y-2">
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg bg-red-50 text-red-700 font-medium"
          :title="sidebarCollapsed ? 'Dashboard' : ''"
        >
          <LayoutDashboard class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Dashboard</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Utilisateurs' : ''"
        >
          <Users class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Utilisateurs</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Annonces' : ''"
        >
          <ShoppingBag class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Annonces</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Dons' : ''"
        >
          <Gift class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Dons</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Demandes' : ''"
        >
          <FileText class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Demandes</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Partenaires' : ''"
        >
          <Handshake class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Partenaires</span
          >
        </a>
        <a
          href="#"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :title="sidebarCollapsed ? 'Paramètres système' : ''"
        >
          <Settings class="w-5 h-5 flex-shrink-0" />
          <span
            v-show="!sidebarCollapsed"
            class="transition-opacity duration-300"
            >Paramètres système</span
          >
        </a>
      </nav>

      <!-- Admin info -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <User class="w-5 h-5 text-red-600" />
          </div>
          <div
            v-show="!sidebarCollapsed"
            class="flex-1 min-w-0 transition-opacity duration-300"
          >
            <p class="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p class="text-xs text-gray-500">Administrateur</p>
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
                class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"
              >
                <Shield class="w-5 h-5 text-white" />
              </div>
              <div>
                <span class="text-lg font-bold text-gray-900">Admin Panel</span>
                <p class="text-xs text-gray-500">Système</p>
              </div>
            </div>
          </div>

          <!-- Navigation Mobile -->
          <nav class="flex-1 p-4 space-y-2">
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg bg-red-50 text-red-700 font-medium"
            >
              <LayoutDashboard class="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Users class="w-5 h-5" />
              <span>Utilisateurs</span>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <ShoppingBag class="w-5 h-5" />
              <span>Annonces</span>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Gift class="w-5 h-5" />
              <span>Dons</span>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <FileText class="w-5 h-5" />
              <span>Demandes</span>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Handshake class="w-5 h-5" />
              <span>Partenaires</span>
            </a>
            <a
              href="#"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Settings class="w-5 h-5" />
              <span>Paramètres système</span>
            </a>
          </nav>

          <!-- Admin info Mobile -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
              >
                <User class="w-5 h-5 text-red-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">Admin</p>
                <p class="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <!-- Contenu principal -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header Admin -->
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
                Dashboard Administrateur
              </h1>
              <p class="text-sm text-gray-500 hidden sm:block">
                Vue d'ensemble du système
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2 lg:space-x-4">
            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-gray-900">
                Administrateur Système
              </p>
              <p class="text-xs text-gray-500">
                {{ new Date().toLocaleDateString("fr-FR") }}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              class="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut class="w-4 h-4 lg:mr-2" />
              <span class="hidden lg:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <!-- Zone de contenu scrollable -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div class="max-w-7xl mx-auto space-y-4 lg:space-y-6">
          <!-- Métriques principales -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Card class="p-4 lg:p-6">
              <div class="flex items-center space-x-2 lg:space-x-3">
                <div
                  class="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <Users class="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
                <div>
                  <p class="text-xs lg:text-sm text-gray-600">Utilisateurs</p>
                  <p class="text-xl lg:text-2xl font-bold text-gray-900">
                    1,247
                  </p>
                  <p class="text-xs text-green-600">+12% ce mois</p>
                </div>
              </div>
            </Card>

            <Card class="p-4 lg:p-6">
              <div class="flex items-center space-x-2 lg:space-x-3">
                <div
                  class="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <ShoppingBag class="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
                <div>
                  <p class="text-xs lg:text-sm text-gray-600">Annonces</p>
                  <p class="text-xl lg:text-2xl font-bold text-gray-900">
                    3,891
                  </p>
                  <p class="text-xs text-green-600">+8% ce mois</p>
                </div>
              </div>
            </Card>

            <Card class="p-4 lg:p-6">
              <div class="flex items-center space-x-2 lg:space-x-3">
                <div
                  class="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <Gift class="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <div>
                  <p class="text-xs lg:text-sm text-gray-600">Dons</p>
                  <p class="text-xl lg:text-2xl font-bold text-gray-900">567</p>
                  <p class="text-xs text-green-600">+23% ce mois</p>
                </div>
              </div>
            </Card>

            <Card class="p-4 lg:p-6">
              <div class="flex items-center space-x-2 lg:space-x-3">
                <div
                  class="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
                >
                  <AlertTriangle
                    class="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600"
                  />
                </div>
                <div>
                  <p class="text-xs lg:text-sm text-gray-600">Signalements</p>
                  <p class="text-xl lg:text-2xl font-bold text-gray-900">23</p>
                  <p class="text-xs text-red-600">À traiter</p>
                </div>
              </div>
            </Card>
          </div>

          <!-- Activité récente -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <Card class="p-4 lg:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Activité récente
              </h2>
              <div class="space-y-4">
                <div
                  class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <UserPlus class="w-4 h-4 text-green-600" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      Nouvel utilisateur inscrit
                    </p>
                    <p class="text-xs text-gray-500">Il y a 5 minutes</p>
                  </div>
                </div>

                <div
                  class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <ShoppingBag class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      Nouvelle annonce publiée
                    </p>
                    <p class="text-xs text-gray-500">Il y a 12 minutes</p>
                  </div>
                </div>

                <div
                  class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <AlertTriangle class="w-4 h-4 text-red-600" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      Signalement reçu
                    </p>
                    <p class="text-xs text-gray-500">Il y a 1 heure</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card class="p-4 lg:p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div class="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  class="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2"
                >
                  <Users class="w-4 h-4 lg:w-5 lg:h-5" />
                  <span class="text-xs">Gérer utilisateurs</span>
                </Button>
                <Button
                  variant="outline"
                  class="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2"
                >
                  <ShoppingBag class="w-4 h-4 lg:w-5 lg:h-5" />
                  <span class="text-xs">Modérer annonces</span>
                </Button>
                <Button
                  variant="outline"
                  class="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2"
                >
                  <FileText class="w-4 h-4 lg:w-5 lg:h-5" />
                  <span class="text-xs">Rapports</span>
                </Button>
                <Button
                  variant="outline"
                  class="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2"
                >
                  <Settings class="w-4 h-4 lg:w-5 lg:h-5" />
                  <span class="text-xs">Configuration</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Shield,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Gift,
  FileText,
  Handshake,
  Settings,
  User,
  LogOut,
  AlertTriangle,
  UserPlus,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const mobileMenuOpen = ref(false);
const sidebarCollapsed = ref(false);
</script>
