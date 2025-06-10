<template>
  <Card class="p-6">
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="text-center space-y-2">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <Store class="w-8 h-8 text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Nouveau Store</h2>
        <p class="text-gray-500">
          Remplissez les informations pour créer un nouveau point de vente
        </p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Nom du store -->
        <div>
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
        <div>
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
        <div>
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

        <!-- Gestionnaire -->
        <div>
          <Label for="manager">Gestionnaire du store *</Label>
          <ManagerSelector
            v-model="form.managerId"
            :error="errors.managerId"
            @manager-selected="handleManagerSelected"
          />
          <p v-if="errors.managerId" class="text-sm text-red-500 mt-1">
            {{ errors.managerId }}
          </p>
        </div>

        <!-- Statut actif -->
        <div
          class="flex items-center space-x-2 p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <Switch id="is-active" v-model:checked="form.isActive" />
          <div class="flex-1">
            <Label for="is-active" class="text-base font-medium"
              >Store actif</Label
            >
            <p class="text-sm text-gray-500">
              Le store sera immédiatement disponible sur la plateforme
            </p>
          </div>
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
            <p>
              <span class="font-medium">Gestionnaire:</span>
              {{ selectedManagerName }}
            </p>
            <p>
              <span class="font-medium">Statut:</span>
              <Badge
                :variant="form.isActive ? 'default' : 'secondary'"
                class="ml-1"
              >
                {{ form.isActive ? "Actif" : "Inactif" }}
              </Badge>
            </p>
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
    </div>
  </Card>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { z } from "zod";
import { Store, Phone, RotateCcw, Loader2 } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "vue-sonner";

import ManagerSelector from "@/components/store/ManagerSelector";

const emit = defineEmits(["store-created"]);

// État
const isLoading = ref(false);
const selectedManagerName = ref("");

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
  managerId: z.string().uuid("Veuillez sélectionner un gestionnaire valide"),
  isActive: z.boolean(),
});

// Formulaire réactif
const form = reactive({
  name: "",
  address: "",
  phone: "",
  managerId: "",
  isActive: true,
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

const handleManagerSelected = (manager) => {
  selectedManagerName.value = manager
    ? `${manager.firstName} ${manager.lastName}`
    : "";
};

const resetForm = () => {
  Object.assign(form, {
    name: "",
    address: "",
    phone: "",
    managerId: "",
    isActive: true,
  });
  errors.value = {};
  selectedManagerName.value = "";
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
    const storeData = await createStore({
      name: form.name,
      address: form.address,
      phone: form.phone,
      manager_id: form.managerId,
      is_active: form.isActive,
    });

    // Émission de l'événement avec les données du store créé
    emit("store-created", storeData);

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

// Simulation de l'API Supabase
const createStore = async (storeData) => {
  // Simulation d'un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulation d'un taux de succès de 95%
  if (Math.random() < 0.05) {
    throw new Error("Erreur de connexion à la base de données");
  }

  // Simulation de la création en base
  const newStore = {
    id: crypto.randomUUID(),
    ...storeData,
    created_at: new Date().toISOString(),
  };

  console.log("Store créé en base:", newStore);

  // Simulation de l'insertion dans Supabase
  /*
    const { data, error } = await supabase
      .from('stores')
      .insert([storeData])
      .select()
      .single()
  
    if (error) throw error
    return data
    */

  return newStore;
};
</script>
