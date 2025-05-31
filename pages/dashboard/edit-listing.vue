<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Contenu principal -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              class="lg:hidden"
              @click="mobileMenuOpen = true"
            >
              <Menu class="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              class="hidden lg:flex"
              @click="sidebarCollapsed = !sidebarCollapsed"
            >
              <PanelLeftClose v-if="!sidebarCollapsed" class="w-5 h-5" />
              <PanelLeftOpen v-else class="w-5 h-5" />
            </Button>

            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900">
                Modifier l'annonce
              </h1>
              <p class="text-sm text-gray-500 hidden sm:block">
                {{ listing?.title || "Chargement..." }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <StatusBadge :status="listing?.status" />
            <Button variant="outline" @click="goBack" class="hidden sm:flex">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <!-- Zone de contenu scrollable -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <!-- Alerte si annonce publiée -->
          <Alert v-if="isPublished" class="border-amber-200 bg-amber-50">
            <AlertTriangle class="h-4 w-4 text-amber-600" />
            <AlertTitle class="text-amber-900"
              >Modification impossible</AlertTitle
            >
            <AlertDescription class="text-amber-800">
              Cette annonce est publiée et ne peut plus être modifiée. Vous
              pouvez uniquement la supprimer ou la dépublier.
            </AlertDescription>
          </Alert>

          <!-- Chargement -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
            <span class="ml-2 text-gray-600">Chargement de l'annonce...</span>
          </div>

          <!-- Formulaire -->
          <form
            v-else-if="listing"
            @submit.prevent="onSubmit"
            class="space-y-6"
          >
            <!-- Upload d'images -->
            <Card class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-gray-900">
                    Images du produit
                  </h2>
                  <Badge variant="secondary"
                    >{{ uploadedImages.length }}/5</Badge
                  >
                </div>

                <ImageUpload
                  v-model="uploadedImages"
                  :max-files="5"
                  :disabled="isPublished"
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
                  <Label for="title">Titre de l'annonce *</Label>
                  <Input
                    id="title"
                    v-model="form.title"
                    placeholder="Ex: iPhone 14 Pro Max 256GB"
                    :disabled="isPublished"
                    :class="{ 'border-red-500': errors.title }"
                  />
                  <p v-if="errors.title" class="text-sm text-red-500 mt-1">
                    {{ errors.title }}
                  </p>
                </div>

                <!-- Catégorie -->
                <div>
                  <Label for="category">Catégorie *</Label>
                  <Select v-model="form.category" :disabled="isPublished">
                    <SelectTrigger
                      :class="{ 'border-red-500': errors.category }"
                    >
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
                  <p v-if="errors.category" class="text-sm text-red-500 mt-1">
                    {{ errors.category }}
                  </p>
                </div>

                <!-- Prix -->
                <div>
                  <Label for="price">Prix *</Label>
                  <div class="relative">
                    <Input
                      id="price"
                      v-model.number="form.price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      class="pl-8"
                      :disabled="isPublished"
                      :class="{ 'border-red-500': errors.price }"
                    />
                    <Euro
                      class="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <p v-if="errors.price" class="text-sm text-red-500 mt-1">
                    {{ errors.price }}
                  </p>
                </div>

                <!-- Description -->
                <div class="lg:col-span-2">
                  <Label for="description">Description *</Label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    placeholder="Décrivez votre produit en détail..."
                    rows="4"
                    :disabled="isPublished"
                    :class="{ 'border-red-500': errors.description }"
                    @input="updateCharCount"
                  />
                  <div class="flex justify-between items-center mt-1">
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
                <Label for="store">Sélectionner une boutique *</Label>
                <Select v-model="form.storeId" :disabled="isPublished">
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
                  <Label for="depositDeadline">Délai de dépôt</Label>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        :disabled="isPublished"
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
                  <Label for="conditions">Conditions particulières</Label>
                  <Textarea
                    id="conditions"
                    v-model="form.conditions"
                    placeholder="Ex: Produit en excellent état, facture disponible..."
                    rows="3"
                    :disabled="isPublished"
                  />
                </div>

                <!-- Options -->
                <div>
                  <Label class="text-base font-medium">Options de vente</Label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div
                      class="flex items-center space-x-2 p-3 border rounded-lg"
                    >
                      <Switch
                        id="delivery"
                        v-model:checked="form.options.delivery"
                        :disabled="isPublished"
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
                        :disabled="isPublished"
                      />
                      <div class="flex items-center space-x-2">
                        <MessageCircle class="w-4 h-4 text-gray-500" />
                        <Label for="negotiable" class="text-sm font-medium"
                          >Prix négociable</Label
                        >
                      </div>
                    </div>

                    <div
                      class="flex items-center space-x-2 p-3 border rounded-lg"
                    >
                      <Switch
                        id="pickup"
                        v-model:checked="form.options.pickup"
                        :disabled="isPublished"
                      />
                      <div class="flex items-center space-x-2">
                        <MapPin class="w-4 h-4 text-gray-500" />
                        <Label for="pickup" class="text-sm font-medium"
                          >Remise en main propre</Label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                @click="showDeleteModal = true"
                class="sm:order-1"
              >
                <Trash2 class="w-4 h-4 mr-2" />
                Supprimer l'annonce
              </Button>

              <div class="flex flex-col sm:flex-row gap-3 sm:order-2">
                <Button
                  type="button"
                  variant="outline"
                  @click="saveDraft"
                  :disabled="isLoading || isPublished"
                  class="sm:order-1"
                >
                  <Save class="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>

                <Button
                  type="submit"
                  :disabled="isLoading || isPublished"
                  class="sm:order-2"
                >
                  <template v-if="isLoading">
                    <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                    Mise à jour...
                  </template>
                  <template v-else>
                    <Send class="w-4 h-4 mr-2" />
                    Mettre à jour
                  </template>
                </Button>
              </div>
            </div>
          </form>

          <!-- Erreur de chargement -->
          <div v-else class="text-center py-12">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <AlertTriangle class="w-8 h-8 text-red-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Annonce introuvable
            </h3>
            <p class="text-gray-500 mb-4">
              Cette annonce n'existe pas ou a été supprimée.
            </p>
            <Button @click="goBack">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Retour à mes annonces
            </Button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de suppression -->
    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :listing="listing"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />

    <!-- Toast Undo -->
    <UndoToast
      v-if="showUndoToast"
      :listing="deletedListing"
      @undo="handleUndo"
      @dismiss="showUndoToast = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { z } from "zod";
import {
  Package,
  ShoppingBag,
  PlusCircle,
  User,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  AlertTriangle,
  Euro,
  Store,
  CalendarIcon,
  Truck,
  MessageCircle,
  MapPin,
  Save,
  Send,
  Loader2,
  Trash2,
} from "lucide-vue-next";

// Composants UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "vue-sonner";

// Composants personnalisés
import StatusBadge from "@/components/StatusBadge";
import ImageUpload from "@/components/ImageUpload";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import UndoToast from "@/components/UndoToast";

// État de l'interface
const mobileMenuOpen = ref(false);
const sidebarCollapsed = ref(false);
const isLoading = ref(true);
const imageUploading = ref(false);
const uploadedImages = ref([]);
const showDeleteModal = ref(false);
const showUndoToast = ref(false);
const deletedListing = ref(null);

// Toast pour les notifications
//   const { toast } = useToast()

// Données de l'annonce (simulées)
const listing = ref(null);
const listingId = "1"; // Normalement récupéré depuis les params de route

// Schéma de validation Zod (même que création)
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

// Calculs
const isPublished = computed(() => listing.value?.status === "published");
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

// Chargement de l'annonce
const loadListing = async () => {
  isLoading.value = true;

  try {
    // Simulation du chargement depuis Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Données simulées
    const mockListing = {
      id: listingId,
      title: "iPhone 14 Pro Max 256GB",
      category: "electronics",
      price: 899.99,
      description:
        "Smartphone Apple en excellent état, avec tous les accessoires d'origine. Aucune rayure, batterie en parfait état. Vendu avec boîte, chargeur et écouteurs.",
      storeId: "1",
      depositDeadline: new Date("2024-02-15"),
      conditions: "Produit en excellent état, facture disponible",
      options: {
        delivery: true,
        negotiable: false,
        pickup: true,
      },
      status: "draft", // ou "published" pour tester le blocage
      images: [
        {
          id: 1,
          url: "/placeholder.svg?height=200&width=200",
          name: "image1.jpg",
        },
        {
          id: 2,
          url: "/placeholder.svg?height=200&width=200",
          name: "image2.jpg",
        },
      ],
      created_at: "2024-01-15",
      updated_at: "2024-01-20",
    };

    listing.value = mockListing;

    // Pré-remplir le formulaire
    Object.assign(form, {
      title: mockListing.title,
      category: mockListing.category,
      price: mockListing.price,
      description: mockListing.description,
      storeId: mockListing.storeId,
      depositDeadline: mockListing.depositDeadline,
      conditions: mockListing.conditions,
      options: { ...mockListing.options },
    });

    uploadedImages.value = [...mockListing.images];
  } catch (error) {
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger l'annonce",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Gestion de l'upload d'images
const handleImageUpload = async (files) => {
  imageUploading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const draftData = {
      ...form,
      images: uploadedImages.value,
      status: "draft",
      updated_at: new Date(),
    };

    console.log("Sauvegarde brouillon:", draftData);

    toast({
      title: "Modifications sauvegardées",
      description: "Votre annonce a été mise à jour",
    });
  } catch (error) {
    toast({
      title: "Erreur de sauvegarde",
      description: "Impossible de sauvegarder les modifications",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Soumission du formulaire (mise à jour)
const onSubmit = async () => {
  if (!validateForm()) {
    toast({
      title: "Erreurs de validation",
      description: "Veuillez corriger les erreurs dans le formulaire",
      variant: "destructive",
    });
    return;
  }

  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const updatedData = {
      ...form,
      images: uploadedImages.value,
      updated_at: new Date(),
    };

    console.log("Mise à jour annonce:", updatedData);

    toast({
      title: "Annonce mise à jour !",
      description: "Vos modifications ont été enregistrées",
    });
  } catch (error) {
    toast({
      title: "Erreur de mise à jour",
      description: "Impossible de mettre à jour l'annonce",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Suppression de l'annonce
const handleDelete = async () => {
  try {
    // Simulation de la suppression
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Sauvegarder pour l'undo
    deletedListing.value = { ...listing.value };

    // Simulation notification realtime au store
    console.log(
      "Notification realtime envoyée au store:",
      listing.value.storeId
    );

    toast({
      title: "Annonce supprimée",
      description: "L'annonce a été supprimée avec succès",
    });

    // Afficher le toast Undo
    showUndoToast.value = true;

    // Auto-fermeture après 10 secondes
    setTimeout(() => {
      if (showUndoToast.value) {
        showUndoToast.value = false;
        // Redirection vers la liste
        goBack();
      }
    }, 10000);
  } catch (error) {
    toast({
      title: "Erreur de suppression",
      description: "Impossible de supprimer l'annonce",
      variant: "destructive",
    });
  }
};

// Annulation de la suppression (Undo)
const handleUndo = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Restaurer l'annonce
    listing.value = { ...deletedListing.value };
    deletedListing.value = null;
    showUndoToast.value = false;

    toast({
      title: "Annonce restaurée",
      description: "L'annonce a été restaurée avec succès",
    });
  } catch (error) {
    toast({
      title: "Erreur de restauration",
      description: "Impossible de restaurer l'annonce",
      variant: "destructive",
    });
  }
};

// Navigation
const goBack = () => {
  // Simulation de navigation
  console.log("Retour à la liste des annonces");
};

// Initialisation
onMounted(() => {
  loadListing();
});
</script>
