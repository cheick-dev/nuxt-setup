<template>
  <div class="flex bg-gray-50">
    <!-- Zone de contenu scrollable -->
    <div class="flex-1 p-4 lg:p-6 mb-10 overflow-y-auto">
      <div class="max-w-4xl mx-auto">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Upload d'images -->
          <Card class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">
                  Images du produit
                </h2>
                <Badge variant="secondary">{{ uploadedImages.length }}/5</Badge>
              </div>

              <ImageUpload
                v-model="uploadedImages"
                :max-files="5"
                @upload="handleImageUpload"
                :loading="imageUploading"
              />
            </div>
          </Card>

          <!-- Informations principales -->
          <Card class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Informations du produit
            </h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Titre -->
              <div class="lg:col-span-2">
                <Label for="title" class="mb-2">Titre de l'annonce *</Label>
                <Input
                  id="title"
                  v-model="form.title"
                  placeholder="Ex: iPhone 14 Pro Max 256GB"
                  :class="{ 'border-red-500': errors.title }"
                />
                <p v-if="errors.title" class="text-sm text-red-500 mt-2">
                  {{ errors.title }}
                </p>
              </div>

              <!-- Catégorie -->
              <div>
                <Label for="category" class="mb-2">Catégorie *</Label>
                <Select v-model="form.category">
                  <SelectTrigger :class="{ 'border-red-500': errors.category }">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Électronique</SelectItem>
                    <SelectItem value="clothing">Vêtements</SelectItem>
                    <SelectItem value="home">Maison & Jardin</SelectItem>
                    <SelectItem value="sports">Sport & Loisirs</SelectItem>
                    <SelectItem value="books">Livres</SelectItem>
                  </SelectContent>
                </Select>
                <p v-if="errors.category" class="text-sm text-red-500 mt-2">
                  {{ errors.category }}
                </p>
              </div>

              <!-- Prix -->
              <div>
                <Label for="price" class="mb-2">Prix *</Label>
                <div class="relative">
                  <Input
                    id="price"
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="pl-8"
                    :class="{ 'border-red-500': errors.price }"
                  />
                  <Euro
                    class="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                <p v-if="errors.price" class="text-sm text-red-500 mt-2">
                  {{ errors.price }}
                </p>
              </div>

              <!-- Description -->
              <div class="lg:col-span-2">
                <Label for="description" class="mb-2">Description *</Label>
                <Textarea
                  id="description"
                  v-model="form.description"
                  placeholder="Décrivez votre produit en détail..."
                  rows="4"
                  :class="{ 'border-red-500': errors.description }"
                  @input="updateCharCount"
                />
                <div class="flex justify-between items-center mt-2">
                  <p v-if="errors.description" class="text-sm text-red-500">
                    {{ errors.description }}
                  </p>
                  <p class="text-sm text-gray-500 ml-auto">
                    {{ descriptionCharCount }}/1000
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Sélection du store -->
          <Card class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Boutique</h2>

            <div>
              <Label for="store" class="mb-2"
                >Sélectionner une boutique *</Label
              >
              <Select v-model="form.storeId">
                <SelectTrigger :class="{ 'border-red-500': errors.storeId }">
                  <SelectValue placeholder="Choisir une boutique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="store in availableStores"
                    :key="store.id"
                    :value="store.id"
                  >
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <Store class="w-3 h-3 text-green-600" />
                      </div>
                      <span>{{ store.name }}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p v-if="errors.storeId" class="text-sm text-red-500 mt-1">
                {{ errors.storeId }}
              </p>
            </div>
          </Card>

          <!-- Conditions et options -->
          <Card class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Conditions de vente
            </h2>

            <div class="space-y-6">
              <!-- Délai de dépôt -->
              <div>
                <Label for="depositDeadline" class="mb-2">Délai de dépôt</Label>
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="[
                        'w-full justify-start text-left font-normal',
                        !form.depositDeadline && 'text-muted-foreground',
                      ]"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        form.depositDeadline
                          ? formatDate(form.depositDeadline)
                          : "Sélectionner une date"
                      }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0" align="start">
                    <Calendar v-model="form.depositDeadline" />
                  </PopoverContent>
                </Popover>
              </div>

              <!-- Conditions de vente -->
              <div>
                <Label for="conditions" class="mb-2"
                  >Conditions particulières</Label
                >
                <Textarea
                  id="conditions"
                  v-model="form.conditions"
                  placeholder="Ex: Produit en excellent état, facture disponible..."
                  rows="3"
                />
              </div>

              <!-- Options -->
              <div>
                <Label class="text-base font-medium mb-2"
                  >Options de vente</Label
                >
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                  <div
                    class="flex items-center space-x-2 p-3 border rounded-lg"
                  >
                    <Switch
                      id="delivery"
                      v-model:checked="form.options.delivery"
                    />
                    <div class="flex items-center space-x-2">
                      <Truck class="w-4 h-4 text-gray-500" />
                      <Label for="delivery" class="text-sm font-medium"
                        >Livraison possible</Label
                      >
                    </div>
                  </div>

                  <div
                    class="flex items-center space-x-2 p-3 border rounded-lg"
                  >
                    <Switch
                      id="negotiable"
                      v-model:checked="form.options.negotiable"
                    />
                    <div class="flex items-center space-x-2">
                      <MessageCircle class="w-4 h-4 text-gray-500" />
                      <Label for="negotiable" class="text-sm font-medium mb-2"
                        >Prix négociable</Label
                      >
                    </div>
                  </div>

                  <div
                    class="flex items-center space-x-2 p-3 border rounded-lg"
                  >
                    <Switch id="pickup" v-model:checked="form.options.pickup" />
                    <div class="flex items-center space-x-2">
                      <MapPin class="w-4 h-4 text-gray-500" />
                      <Label for="pickup" class="text-sm font-medium mb-2"
                        >Remise en main propre</Label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              @click="saveDraft"
              :disabled="isLoading"
              class="sm:order-1"
            >
              <Save class="w-4 h-4 mr-2" />
              Sauvegarder le brouillon
            </Button>

            <Button type="submit" :disabled="isLoading" class="sm:order-2">
              <template v-if="isLoading">
                <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                Publication...
              </template>
              <template v-else>
                <Send class="w-4 h-4 mr-2" />
                Publier l'annonce
              </template>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "dashboard",
  title: "Créer une annonce",
});

import { ref, computed, reactive } from "vue";
import { z } from "zod";
import {
  Package,
  ShoppingBag,
  Heart,
  Settings,
  User,
  PlusCircle,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  FileEdit,
  Euro,
  Store,
  CalendarIcon,
  Truck,
  MessageCircle,
  MapPin,
  Save,
  Send,
  Loader2,
} from "lucide-vue-next";

// Composants UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
// import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

// Import du composant d'upload d'images
import ImageUpload from "~/components/ImageUpload";

// État de l'interface
const mobileMenuOpen = ref(false);
const sidebarCollapsed = ref(false);
const isLoading = ref(false);
const imageUploading = ref(false);
const uploadedImages = ref([]);

// Toast pour les notifications
// const { toast } = useToast();

// Schéma de validation Zod
const listingSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  price: z.number().min(0.01, "Le prix doit être supérieur à 0"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  storeId: z.string().min(1, "Veuillez sélectionner une boutique"),
  depositDeadline: z.date().optional(),
  conditions: z.string().optional(),
  options: z.object({
    delivery: z.boolean(),
    negotiable: z.boolean(),
    pickup: z.boolean(),
  }),
});

// Formulaire réactif
const form = reactive({
  title: "",
  category: "",
  price: null,
  description: "",
  storeId: "",
  depositDeadline: null,
  conditions: "",
  options: {
    delivery: false,
    negotiable: false,
    pickup: false,
  },
});

// Erreurs de validation
const errors = ref({});

// Boutiques disponibles (simulées)
const availableStores = ref([
  { id: "1", name: "Ma Boutique Bio", logo: "/store1.png" },
  { id: "2", name: "Tech Store", logo: "/store2.png" },
  { id: "3", name: "Fashion Corner", logo: "/store3.png" },
]);

// Comptage des caractères de la description
const descriptionCharCount = computed(() => form.description.length);

// Fonctions utilitaires
const formatDate = (date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const updateCharCount = () => {
  // Fonction appelée lors de la saisie dans la description
};

// Gestion de l'upload d'images
const handleImageUpload = async (files) => {
  imageUploading.value = true;

  try {
    // Simulation de l'upload vers Supabase Storage
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Ajouter les nouvelles images
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    uploadedImages.value.push(...newImages);

    toast({
      title: "Images uploadées",
      description: `${files.length} image(s) ajoutée(s) avec succès`,
    });
  } catch (error) {
    toast({
      title: "Erreur d'upload",
      description: "Impossible d'uploader les images",
      variant: "destructive",
    });
  } finally {
    imageUploading.value = false;
  }
};

// Validation du formulaire
const validateForm = () => {
  try {
    listingSchema.parse(form);
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

// Sauvegarde en brouillon
const saveDraft = async () => {
  isLoading.value = true;

  try {
    // Simulation de la sauvegarde en base
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Sauvegarde dans Supabase avec statut 'draft'
    const draftData = {
      ...form,
      images: uploadedImages.value,
      status: "draft",
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log("Sauvegarde brouillon:", draftData);

    toast({
      title: "Brouillon sauvegardé",
      description: "Votre annonce a été sauvegardée en brouillon",
    });
  } catch (error) {
    toast({
      title: "Erreur de sauvegarde",
      description: "Impossible de sauvegarder le brouillon",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Soumission du formulaire (publication)
const onSubmit = async () => {
  if (!validateForm()) {
    toast({
      title: "Erreurs de validation",
      description: "Veuillez corriger les erreurs dans le formulaire",
      variant: "destructive",
    });
    return;
  }

  if (uploadedImages.value.length === 0) {
    toast({
      title: "Images manquantes",
      description: "Veuillez ajouter au moins une image",
      variant: "destructive",
    });
    return;
  }

  isLoading.value = true;

  try {
    // Simulation de la publication
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Sauvegarde dans Supabase avec statut 'published'
    const listingData = {
      ...form,
      images: uploadedImages.value,
      status: "published",
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log("Publication annonce:", listingData);

    toast({
      title: "Annonce publiée !",
      description: "Votre annonce est maintenant visible sur la marketplace",
    });

    // Redirection vers la liste des annonces
    // router.push('/dashboard/listings')
  } catch (error) {
    toast({
      title: "Erreur de publication",
      description: "Impossible de publier l'annonce",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
