<template>
  <div class="space-y-3">
    <!-- Sélecteur principal -->
    <Select
      v-model="selectedManagerId"
      @update:model-value="handleManagerChange"
    >
      <SelectTrigger :class="{ 'border-red-500': error }">
        <SelectValue placeholder="Sélectionner un gestionnaire" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Aucun gestionnaire sélectionné</SelectItem>
        <SelectItem
          v-for="manager in availableManagers"
          :key="manager.id"
          :value="manager.id"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <User class="w-4 h-4 text-gray-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900">
                {{ manager.firstName }} {{ manager.lastName }}
              </p>
              <p class="text-sm text-gray-500">{{ manager.email }}</p>
            </div>
            <Badge
              :variant="manager.isAvailable ? 'default' : 'secondary'"
              :class="
                manager.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ manager.isAvailable ? "Disponible" : "Occupé" }}
            </Badge>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Informations du gestionnaire sélectionné -->
    <div v-if="selectedManager" class="p-4 bg-gray-50 rounded-lg border">
      <div class="flex items-start space-x-3">
        <div
          class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
        >
          <User class="w-6 h-6 text-gray-600" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-900">
            {{ selectedManager.firstName }} {{ selectedManager.lastName }}
          </h3>
          <p class="text-sm text-gray-500">{{ selectedManager.email }}</p>
          <p class="text-sm text-gray-500">{{ selectedManager.phone }}</p>

          <div class="flex items-center space-x-4 mt-2">
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4 text-gray-400" />
              <span class="text-xs text-gray-500">
                Inscrit le {{ formatDate(selectedManager.createdAt) }}
              </span>
            </div>

            <div class="flex items-center space-x-1">
              <Store class="w-4 h-4 text-gray-400" />
              <span class="text-xs text-gray-500">
                {{ selectedManager.storesCount }} store(s) géré(s)
              </span>
            </div>
          </div>

          <!-- Statut de disponibilité -->
          <div class="mt-3">
            <Badge
              :variant="selectedManager.isAvailable ? 'default' : 'secondary'"
              :class="
                selectedManager.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              "
            >
              <component
                :is="selectedManager.isAvailable ? CheckCircle : AlertCircle"
                class="w-3 h-3 mr-1"
              />
              {{
                selectedManager.isAvailable
                  ? "Disponible pour gérer un nouveau store"
                  : "Gère déjà des stores"
              }}
            </Badge>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton pour créer un nouveau gestionnaire -->
    <div
      class="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg"
    >
      <div class="flex items-center space-x-2">
        <UserPlus class="w-4 h-4 text-gray-400" />
        <span class="text-sm text-gray-600">Gestionnaire non trouvé ?</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        @click="showCreateManagerModal = true"
      >
        <UserPlus class="w-3 h-3 mr-1" />
        Créer un gestionnaire
      </Button>
    </div>

    <!-- Modal de création de gestionnaire -->
    <CreateManagerModal
      v-if="showCreateManagerModal"
      @close="showCreateManagerModal = false"
      @manager-created="handleManagerCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  User,
  Calendar,
  Store,
  CheckCircle,
  AlertCircle,
  UserPlus,
} from "lucide-vue-next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";

import CreateManagerModal from "@/components/store/CreateManagerModal";

const props = defineProps({
  modelValue: {
    type: String,
    default: "none",
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "manager-selected"]);

// État
const selectedManagerId = ref(props.modelValue);
const availableManagers = ref([]);
const showCreateManagerModal = ref(false);

// Gestionnaire sélectionné
const selectedManager = computed(() => {
  return availableManagers.value.find(
    (manager) => manager.id === selectedManagerId.value
  );
});

// Fonctions
const handleManagerChange = (managerId) => {
  selectedManagerId.value = managerId;
  emit("update:modelValue", managerId);

  const manager = availableManagers.value.find((m) => m.id === managerId);
  emit("manager-selected", manager);
};

const handleManagerCreated = (newManager) => {
  availableManagers.value.push(newManager);
  selectedManagerId.value = newManager.id;
  emit("update:modelValue", newManager.id);
  emit("manager-selected", newManager);
  showCreateManagerModal.value = false;

  toast("Gestionnaire créé", {
    description: `${newManager.firstName} ${newManager.lastName} a été ajouté avec succès`,
  });
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

// Chargement des gestionnaires disponibles
const loadAvailableManagers = async () => {
  try {
    // Simulation de l'appel API Supabase
    /*
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'manager')
        .order('created_at', { ascending: false })
  
      if (error) throw error
      availableManagers.value = data
      */

    // Données simulées
    availableManagers.value = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie.dupont@example.com",
        phone: "+33 1 23 45 67 89",
        isAvailable: true,
        storesCount: 0,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        firstName: "Pierre",
        lastName: "Martin",
        email: "pierre.martin@example.com",
        phone: "+33 1 98 76 54 32",
        isAvailable: false,
        storesCount: 2,
        createdAt: "2024-01-10T14:20:00Z",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        firstName: "Sophie",
        lastName: "Bernard",
        email: "sophie.bernard@example.com",
        phone: "+33 1 11 22 33 44",
        isAvailable: true,
        storesCount: 1,
        createdAt: "2024-01-20T09:15:00Z",
      },
    ];
  } catch (error) {
    toast("Erreur de chargement", {
      description: "Impossible de charger la liste des gestionnaires",
    });
  }
};

// Initialisation
onMounted(() => {
  loadAvailableManagers();
});
</script>
