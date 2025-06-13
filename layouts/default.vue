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
              <NuxtLink to="/dashboard" class="flex items-center space-x-2">
                {{ user.email }}
              </NuxtLink>
            </Button>
            <Button>
              <NuxtLink to="/cart-list" class="flex items-center space-x-2"
                ><ShoppingBag class="w-6 h-6" />
                <span class="hidden sm:inline ml-2">Mon panier</span>
              </NuxtLink>
            </Button>

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
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div
                class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"
              >
                <Package class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-white">MarketPlace</span>
            </div>
            <p class="text-sm text-gray-400">
              Notre marketplace met en relation acheteurs et vendeurs
              responsables pour une consommation plus éthique et durable.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-white mb-4">Liens rapides</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-green-400">Accueil</a></li>
              <li><a href="#" class="hover:text-green-400">Catégories</a></li>
              <li><a href="#" class="hover:text-green-400">Boutiques</a></li>
              <li><a href="#" class="hover:text-green-400">À propos</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium text-white mb-4">Informations</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a href="#" class="hover:text-green-400"
                  >Conditions d'utilisation</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-green-400"
                  >Politique de confidentialité</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-green-400">Comment ça marche</a>
              </li>
              <li><a href="#" class="hover:text-green-400">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-medium text-white mb-4">Contact</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center">
                <Mail class="w-4 h-4 mr-2" />
                contact@marketplace.com
              </li>
              <li class="flex items-center">
                <Phone class="w-4 h-4 mr-2" />
                +33 1 23 45 67 89
              </li>
              <li class="flex items-center">
                <MapPin class="w-4 h-4 mr-2" />
                123 Rue du Commerce, Paris
              </li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p class="text-sm">&copy; 2024 MarketPlace. Tous droits réservés.</p>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Linkedin class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <!-- <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div> -->
    </footer>
  </div>
</template>

<script setup>
import { Package, LogOut, PlusCircle, ShoppingBag } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
const user = useSupabaseUser();
</script>
