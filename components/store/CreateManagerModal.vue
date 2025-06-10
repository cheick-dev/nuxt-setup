<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center space-x-2">
          <UserPlus class="w-5 h-5 text-blue-600" />
          <span>Créer un gestionnaire</span>
        </DialogTitle>
        <DialogDescription>
          Ajoutez un nouveau gestionnaire pour pouvoir l'assigner à ce store
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Prénom -->
        <div>
          <Label for="firstName">Prénom *</Label>
          <Input
            id="firstName"
            v-model="form.firstName"
            placeholder="Marie"
            :class="{ 'border-red-500': errors.firstName }"
          />
          <p v-if="errors.firstName" class="text-sm text-red-500 mt-1">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Nom -->
        <div>
          <Label for="lastName">Nom *</Label>
          <Input
            id="lastName"
            v-model="form.lastName"
            placeholder="Dupont"
            :class="{ 'border-red-500': errors.lastName }"
          />
          <p v-if="errors.lastName" class="text-sm text-red-500 mt-1">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <Label for="email">Email *</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="marie.dupont@example.com"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Téléphone -->
        <div>
          <Label for="phone">Téléphone *</Label>
          <Input
            id="phone"
            v-model="form.phone"
            placeholder="+33 1 23 45 67 89"
            :class="{ 'border-red-500': errors.phone }"
          />
          <p v-if="errors.phone" class="text-sm text-red-500 mt-1">
            {{ errors.phone }}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="$emit('close')"
            :disabled="isLoading"
          >
            Annuler
          </Button>
          <Button type="submit" :disabled="!isFormValid || isLoading">
            <template v-if="isLoading">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Création...
            </template>
            <template v-else>
              <UserPlus class="w-4 h-4 mr-2" />
              Créer
            </template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { z } from "zod";
import { UserPlus, Loader2 } from "lucide-vue-next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";

const emit = defineEmits(["close", "manager-created"]);

// État
const isLoading = ref(false);

// Schéma de validation
const managerSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
});

// Formulaire
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

// Erreurs
const errors = ref({});

// Validation
const isFormValid = computed(() => {
  try {
    managerSchema.parse(form);
    return true;
  } catch {
    return false;
  }
});

const validateForm = () => {
  try {
    managerSchema.parse(form);
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

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    // Simulation de la création du gestionnaire
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newManager = {
      id: crypto.randomUUID(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      isAvailable: true,
      storesCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Simulation de l'insertion en base
    /*
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          role: 'manager'
        }])
        .select()
        .single()
  
      if (error) throw error
      */

    emit("manager-created", newManager);
  } catch (error) {
    toast("Erreur de création", {
      description: "Impossible de créer le gestionnaire",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
