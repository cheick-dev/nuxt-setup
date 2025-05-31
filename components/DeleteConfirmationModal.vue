<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center space-x-2 text-red-600">
          <AlertTriangle class="w-5 h-5" />
          <span>Supprimer l'annonce</span>
        </DialogTitle>
        <DialogDescription>
          Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Informations de l'annonce -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 truncate">
                {{ listing.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatCurrency(listing.price) }}
              </p>
              <StatusBadge :status="listing.status" class="mt-2" />
            </div>
          </div>
        </div>

        <!-- Avertissements -->
        <div class="space-y-3">
          <div
            class="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <XCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div class="text-sm">
              <p class="font-medium text-red-900">Suppression définitive</p>
              <p class="text-red-700">
                L'annonce sera supprimée de la base de données
              </p>
            </div>
          </div>

          <div
            class="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <AlertTriangle
              class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
            />
            <div class="text-sm">
              <p class="font-medium text-yellow-900">
                Notification automatique
              </p>
              <p class="text-yellow-700">
                Le store sera notifié de la suppression
              </p>
            </div>
          </div>

          <div
            v-if="listing.status === 'published'"
            class="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div class="text-sm">
              <p class="font-medium text-blue-900">Annonce publiée</p>
              <p class="text-blue-700">
                Cette annonce est visible publiquement
              </p>
            </div>
          </div>
        </div>

        <!-- Confirmation -->
        <div class="space-y-3">
          <Label class="text-sm font-medium text-gray-900">
            Pour confirmer, tapez "SUPPRIMER" ci-dessous :
          </Label>
          <Input
            v-model="confirmationText"
            placeholder="SUPPRIMER"
            class="font-mono"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          @click="$emit('close')"
          :disabled="isDeleting"
        >
          Annuler
        </Button>
        <Button
          variant="destructive"
          @click="handleConfirm"
          :disabled="!canConfirm || isDeleting"
        >
          <template v-if="isDeleting">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            Suppression...
          </template>
          <template v-else>
            <Trash2 class="w-4 h-4 mr-2" />
            Supprimer définitivement
          </template>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { AlertTriangle, XCircle, Info, Trash2, Loader2 } from "lucide-vue-next";

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
import StatusBadge from "@/components/StatusBadge";

const props = defineProps({
  listing: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

// État
const confirmationText = ref("");
const isDeleting = ref(false);

// Calculs
const canConfirm = computed(() => confirmationText.value === "SUPPRIMER");

// Fonctions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const handleConfirm = async () => {
  if (!canConfirm.value) return;

  isDeleting.value = true;

  try {
    await emit("confirm");
    emit("close");
  } catch (error) {
    // Géré par le parent
  } finally {
    isDeleting.value = false;
  }
};
</script>
