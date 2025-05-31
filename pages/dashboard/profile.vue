<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
import { Button } from "@/components/ui/button";

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
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Profile</h1>
      <NuxtLink to="/dashboard"> Back to Dashboard </NuxtLink>
    </div>

    <div class="max-w-md mx-auto">
      <div>
        <p>Your Profile</p>
        <p>Manage your account details</p>
      </div>
      <div>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium leading-none">Email</label>
            <p class="text-sm mt-1">{{ user?.email }}</p>
          </div>

          <div>
            <label class="text-sm font-medium leading-none">User ID</label>
            <p class="text-sm mt-1 font-mono">{{ user?.id }}</p>
          </div>

          <div
            v-if="error"
            class="p-3 bg-destructive/10 text-destructive text-sm rounded-md"
          >
            {{ error }}
          </div>

          <div
            v-if="success"
            class="p-3 bg-success/10 text-success text-sm rounded-md"
          >
            {{ success }}
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <Button variant="outline" to="/dashboard/profile/edit">
          Edit Profile
        </Button>
        <Button variant="destructive" :disabled="loading" @click="signOut">
          {{ loading ? "Signing out..." : "Sign Out" }}
        </Button>
      </div>
    </div>

    <div v-if="isProfileLoading">Chargement du profil...</div>
    <div v-else-if="profileError">Erreur : {{ profileError.message }}</div>
    <div v-else-if="userProfile">
      <p>Bienvenue {{ userProfile.full_name }}</p>
      <p>Rôle : {{ userProfile.role }}</p>
    </div>
    <div v-else>
      <p>Utilisateur non connecté</p>
    </div>
  </div>
</template>
