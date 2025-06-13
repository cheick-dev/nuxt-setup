<script setup>
import { ref, computed, reactive } from "vue";
import { z } from "zod";
import { Store, Phone, RotateCcw, Loader2, PlusCircle } from "lucide-vue-next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "vue-sonner";

import { supabaseService } from "@/services/supabaseService";

// État
const isLoading = ref(false);
const open = ref(false);

defineEmits(["close"]);

// Schéma de validation Zod
const storeSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  address: z
    .string()
    .min(10, "L'adresse doit contenir au moins 10 caractères")
    .max(500, "L'adresse ne peut pas dépasser 500 caractères"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères")
    .regex(/^[\+]?[0-9\s\-$$$$\.]+$/, "Format de téléphone invalide"),
});

// Formulaire réactif
const form = reactive({
  name: "Magasin Test",
  address: "Air France 1, Rue 22 a gauche - Bouake",
  phone: "+2250102030405",
});

// Erreurs de validation
const errors = ref({});

// Validation du formulaire
const isFormValid = computed(() => {
  try {
    storeSchema.parse(form);
    return true;
  } catch {
    return false;
  }
});

// Fonctions
const validateForm = () => {
  try {
    storeSchema.parse(form);
    errors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors.value[path] = err.message;
      });
    }
    return false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    name: "",
    address: "",
    phone: "",
  });
  errors.value = {};
  open.value = false;
};

const onSubmit = async () => {
  if (!validateForm()) {
    toast("Erreurs de validation", {
      description: "Veuillez corriger les erreurs dans le formulaire",
      variant: "destructive",
    });
    return;
  }

  isLoading.value = true;

  try {
    // Simulation de l'appel API Supabase
    const storeData = {
      name: form.name,
      address: form.address,
      phone: form.phone,
    };

    const result = await supabaseService.createStore(storeData);
    console.log(result);

    if (result.error) {
      console.log(result);
      throw new Error(result.error || "Erreur serveur");
    }
    // Réinitialiser le formulaire
    resetForm();
  } catch (error) {
    toast("Erreur de création", {
      description: error.message || "Impossible de créer le store",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button>
        <PlusCircle class="w-4 h-4 mr-2" />
        <span class="hidden sm:inline">Créer un store</span>
        <span class="sm:hidden">Store</span>
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center space-x-2">
          <Store class="w-8 h-8 text-green-600" />
          <span>Nouveau Store</span>
        </DialogTitle>
        <DialogDescription>
          Remplissez les informations pour créer un nouveau point de vente et
          devenez une boutique certifiée
        </DialogDescription>
      </DialogHeader>

      <!-- Formulaire -->
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Nom du store -->
        <div class="space-y-2">
          <Label for="name">Nom du store *</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Ex: Boutique Bio Centre-Ville"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-sm text-red-500 mt-1">
            {{ errors.name }}
          </p>
        </div>

        <!-- Adresse -->
        <div class="space-y-2">
          <Label for="address">Adresse physique *</Label>
          <Textarea
            id="address"
            v-model="form.address"
            placeholder="123 Rue du Commerce&#10;75001 Paris, France"
            rows="3"
            :class="{ 'border-red-500': errors.address }"
          />
          <p v-if="errors.address" class="text-sm text-red-500 mt-1">
            {{ errors.address }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Adresse complète avec code postal et ville
          </p>
        </div>

        <!-- Téléphone -->
        <div class="space-y-2">
          <Label for="phone">Téléphone *</Label>
          <div class="relative">
            <Phone
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <Input
              id="phone"
              v-model="form.phone"
              placeholder="+33 1 23 45 67 89"
              class="pl-10"
              :class="{ 'border-red-500': errors.phone }"
            />
          </div>
          <p v-if="errors.phone" class="text-sm text-red-500 mt-1">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Aperçu des informations -->
        <div
          v-if="isFormValid"
          class="p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h3 class="font-medium text-blue-900 mb-2">Aperçu du store</h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Nom:</span> {{ form.name }}</p>
            <p><span class="font-medium">Adresse:</span> {{ form.address }}</p>
            <p><span class="font-medium">Téléphone:</span> {{ form.phone }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            @click="resetForm"
            class="sm:order-1"
          >
            <RotateCcw class="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>

          <Button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="sm:order-2 flex-1"
          >
            <template v-if="isLoading">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Création en cours...
            </template>
            <template v-else>
              <Store class="w-4 h-4 mr-2" />
              Créer le store
            </template>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
