<template>
  <div class="flex min-h-screen bg-gray-50 items-center justify-center mb-5">
    <!-- <div class="max-w-2xl mx-auto p-6"></div> -->
    <CreateStoreForm @store-created="handleStoreCreated" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Créer un nouveau store",
});

import { toast } from "vue-sonner";

import CreateStoreForm from "@/components/store/CreateStoreForm";

// Fonctions
const goBack = () => {
  // Simulation de navigation vers la liste des stores
  console.log("Retour à la liste des stores");
};

const handleStoreCreated = (store) => {
  toast("Store créé avec succès !", {
    description: `Le store "${store.name}" a été créé et est maintenant actif.`,
  });

  // Redirection vers la liste des stores ou le dashboard du store
  setTimeout(() => {
    console.log("Redirection vers le dashboard du store:", store.id);
  }, 2000);
};
</script>
