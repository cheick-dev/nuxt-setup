<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
});
import { Button } from "@/components/ui/button";

import { AlertCircle, CheckCircle, LogOut, User } from "lucide-vue-next";

const { userProfile, isProfileLoading, profileError } = useUserProfile();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const loading = ref(false);
const error = ref("");
const success = ref("");

async function signOut() {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) throw logoutError;

    navigateTo("/auth/login");
  } catch (e: any) {
    error.value = e.message || "An error occurred during sign out";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- En-tête du profil -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div
            class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center"
          >
            <User class="w-10 h-10 text-gray-500" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ userProfile?.full_name || "Utilisateur" }}
            </h1>
            <p class="text-sm text-gray-500">
              {{ userProfile?.role || "Membre" }}
            </p>
          </div>
        </div>
        <Button variant="outline" to="/dashboard/profile/edit">
          Modifier le profil
        </Button>
      </div>

      <!-- Informations du profil -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-gray-900">{{ user?.email }}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="text-sm font-medium text-gray-700">Identifiant</label>
            <p class="mt-1 font-mono text-sm text-gray-900">{{ user?.id }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="text-sm font-medium text-gray-700">Statut</label>
            <p class="mt-1 text-gray-900">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Actif
              </span>
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="text-sm font-medium text-gray-700"
              >Dernière connexion</label
            >
            <p class="mt-1 text-gray-900">
              {{ new Date().toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages d'état -->
    <div v-if="error" class="mb-6">
      <div class="bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertCircle class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="success" class="mb-6">
      <div class="bg-green-50 border-l-4 border-green-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircle class="h-5 w-5 text-green-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">{{ success }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isProfileLoading" class="flex items-center justify-center p-6">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Bouton de déconnexion -->
    <div class="flex justify-end mt-6">
      <Button
        variant="destructive"
        :disabled="loading"
        @click="signOut"
        class="flex items-center space-x-2"
      >
        <LogOut class="w-4 h-4" />
        <span>{{
          loading ? "Déconnexion en cours..." : "Se déconnecter"
        }}</span>
      </Button>
    </div>
  </div>
</template>
