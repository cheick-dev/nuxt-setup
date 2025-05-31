<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header fixe -->
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <Package class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">WebShop</span>
          </div>

          <!-- Boutons d'authentification -->
          <div class="flex items-center space-x-3" v-if="!user">
            <NuxtLink to="/auth/login">
              <Button variant="ghost" class="hidden sm:inline-flex">
                Connexion
              </Button>
            </NuxtLink>
            <NuxtLink to="/auth/register">
              <Button class="hidden sm:inline-flex"> Créer un compte </Button>
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-3" v-else>
            <Button variant="ghost" class="hidden sm:inline-flex">
              {{ user.email }}
            </Button>
            <NuxtLink to="/dashboard">
              <Button>Dashboard </Button>
            </NuxtLink>
            <Button variant="destructive">
              <LogOut class="w-4 h-4" />
              <span class="hidden sm:inline ml-2">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="min-h-screen">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-gray-500">
          <p>&copy; 2024 WebShop. Tous droits réservés.</p>
          <div class="mt-2 space-x-4">
            <a href="#" class="hover:text-gray-700">Mentions légales</a>
            <a href="#" class="hover:text-gray-700"
              >Politique de confidentialité</a
            >
            <a href="#" class="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Package, LogOut, PlusCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
const user = useSupabaseUser();
</script>
