<template>
  <div class="space-y-6">
    <!-- Prix -->
    <div class="space-y-3">
      <h3 class="font-medium text-gray-900">Prix</h3>

      <div class="pt-4">
        <Slider
          v-model="localFilters.price"
          :min="0"
          :max="2000"
          :step="10"
          :minStepsBetweenThumbs="1"
          class="mb-6"
        />

        <div class="flex items-center justify-between">
          <div class="w-20">
            <Input
              v-model.number="localFilters.price.min"
              type="number"
              min="0"
              :max="localFilters.price.max"
              class="text-center"
            />
          </div>
          <span class="text-gray-500">-</span>
          <div class="w-20">
            <Input
              v-model.number="localFilters.price.max"
              type="number"
              :min="localFilters.price.min"
              max="2000"
              class="text-center"
            />
          </div>
          <span class="ml-2 text-gray-500">€</span>
        </div>
      </div>
    </div>

    <!-- Boutiques -->
    <div class="space-y-3">
      <h3 class="font-medium text-gray-900">Boutiques</h3>

      <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
        <div
          v-for="store in stores"
          :key="store.id"
          class="flex items-center space-x-2"
        >
          <Checkbox
            :id="`store-${store.id}`"
            v-model:checked="storeSelections[store.id]"
            @update:checked="updateStoreSelections"
          />
          <label :for="`store-${store.id}`" class="flex items-center text-sm">
            {{ store.name }}
            <Badge
              v-if="store.certified"
              variant="secondary"
              class="ml-2 bg-green-100 text-green-800 border-green-200"
            >
              <CheckCircle class="w-3 h-3 mr-1" />
              Certifié
            </Badge>
          </label>
        </div>
      </div>
    </div>

    <!-- Localisation -->
    <div class="space-y-3">
      <h3 class="font-medium text-gray-900">Localisation</h3>

      <Select v-model="localFilters.location">
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une ville" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les villes</SelectItem>
          <SelectItem
            v-for="location in locations"
            :key="location.id"
            :value="location.id"
          >
            {{ location.name }} ({{ location.zipCode }})
          </SelectItem>
        </SelectContent>
      </Select>

      <div class="pt-2">
        <Button variant="outline" size="sm" class="w-full">
          <MapPin class="w-3 h-3 mr-1" />
          Voir sur la carte
        </Button>
      </div>
    </div>

    <!-- Délai de dépôt -->
    <div class="space-y-3">
      <h3 class="font-medium text-gray-900">Délai de dépôt</h3>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            :class="[
              'w-full justify-start text-left font-normal',
              !localFilters.depositDeadline && 'text-muted-foreground',
            ]"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{
              localFilters.depositDeadline
                ? formatDate(localFilters.depositDeadline)
                : "Sélectionner une date"
            }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
          <Calendar v-model="localFilters.depositDeadline" />
        </PopoverContent>
      </Popover>
    </div>

    <!-- Options supplémentaires -->
    <div class="space-y-3">
      <h3 class="font-medium text-gray-900">Options</h3>

      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <Switch
            v-model:checked="localFilters.certifiedOnly"
            id="certified-only"
          />
          <Label for="certified-only" class="flex items-center">
            Vendeurs certifiés uniquement
            <Badge
              variant="secondary"
              class="ml-2 bg-green-100 text-green-800 border-green-200"
            >
              <CheckCircle class="w-3 h-3 mr-1" />
              Certifié
            </Badge>
          </Label>
        </div>

        <div class="flex items-center space-x-2">
          <Switch
            v-model:checked="localFilters.freeShipping"
            id="free-shipping"
          />
          <Label for="free-shipping">Livraison gratuite</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Switch v-model:checked="localFilters.negotiable" id="negotiable" />
          <Label for="negotiable">Prix négociable</Label>
        </div>
      </div>
    </div>

    <!-- Boutons (visible uniquement sur desktop) -->
    <div class="hidden lg:flex space-x-2 pt-4">
      <Button variant="outline" class="flex-1" @click="resetFilters">
        Réinitialiser
      </Button>
      <Button class="flex-1" @click="applyFilters"> Appliquer </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { MapPin, CheckCircle, CalendarIcon } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  stores: {
    type: Array,
    required: true,
  },
  locations: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:filters", "apply"]);

// État local
const localFilters = ref({ ...props.filters });
const storeSelections = ref({});

// Synchronisation des props avec l'état local
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
    updateStoreCheckboxes();
  },
  { deep: true }
);

// Mise à jour des filtres
watch(
  localFilters,
  (newFilters) => {
    emit("update:filters", { ...newFilters });
  },
  { deep: true }
);

// Fonctions
const updateStoreSelections = () => {
  const selectedStores = [];
  for (const [storeId, isSelected] of Object.entries(storeSelections.value)) {
    if (isSelected) {
      selectedStores.push(storeId);
    }
  }
  localFilters.value.stores = selectedStores;
};

const updateStoreCheckboxes = () => {
  const newSelections = {};
  props.stores.forEach((store) => {
    newSelections[store.id] = props.filters.stores.includes(store.id);
  });
  storeSelections.value = newSelections;
};

const resetFilters = () => {
  localFilters.value = {
    price: {
      min: 0,
      max: 2000,
    },
    stores: [],
    location: null,
    depositDeadline: null,
    certifiedOnly: false,
    freeShipping: false,
    negotiable: false,
  };
  updateStoreCheckboxes();
  emit("update:filters", { ...localFilters.value });
};

const applyFilters = () => {
  emit("apply");
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

// Initialisation
onMounted(() => {
  updateStoreCheckboxes();
});
</script>
