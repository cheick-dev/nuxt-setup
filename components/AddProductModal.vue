<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ product ? "Modifier le produit" : "Ajouter un produit" }}
        </DialogTitle>
        <DialogDescription>
          {{
            product
              ? "Modifiez les informations du produit"
              : "Créez un nouveau produit pour votre boutique"
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Type -->
        <div>
          <Label for="type">Type de produit *</Label>
          <Select v-model="form.type" required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interne">
                <div class="flex items-center space-x-2">
                  <Store class="w-4 h-4" />
                  <span>Interne</span>
                </div>
              </SelectItem>
              <SelectItem value="webshop">
                <div class="flex items-center space-x-2">
                  <Globe class="w-4 h-4" />
                  <span>WebShop</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Titre -->
        <div>
          <Label for="title">Titre du produit *</Label>
          <Input
            id="title"
            v-model="form.title"
            placeholder="Ex: iPhone 14 Pro Max"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="form.description"
            placeholder="Décrivez votre produit..."
            rows="3"
          />
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
              required
            />
            <Euro
              class="w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <!-- Statut (si modification) -->
        <div v-if="product">
          <Label for="status">Statut</Label>
          <Select v-model="form.status">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_stock">En stock</SelectItem>
              <SelectItem value="reserve">Réservé</SelectItem>
              <SelectItem value="vendu">Vendu</SelectItem>
              <SelectItem value="archive">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Aperçu du code-barres (si modification) -->
        <div v-if="product" class="space-y-2">
          <Label>Code-barres actuel</Label>
          <div class="p-3 bg-gray-50 rounded border">
            <div
              v-html="generateBarcodeSVG(product.barcode)"
              class="w-full h-8 mb-2"
            ></div>
            <code class="text-xs text-gray-500">{{ product.barcode }}</code>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="$emit('close')">
            Annuler
          </Button>
          <Button type="submit" :disabled="!isFormValid">
            {{ product ? "Modifier" : "Ajouter" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Store, Globe, Euro } from "lucide-vue-next";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "save"]);

// Formulaire
const form = ref({
  type: "",
  title: "",
  description: "",
  price: null,
  status: "en_stock",
});

// Validation
const isFormValid = computed(() => {
  return (
    form.value.type &&
    form.value.title &&
    form.value.price !== null &&
    form.value.price > 0
  );
});

// Initialisation du formulaire
onMounted(() => {
  if (props.product) {
    form.value = { ...props.product };
  }
});

// Soumission
const handleSubmit = () => {
  if (isFormValid.value) {
    emit("save", { ...form.value });
  }
};

// Génération du code-barres pour l'aperçu
const generateBarcodeSVG = (barcode) => {
  const width = 150;
  const height = 32;
  const barWidth = 1.5;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  for (let i = 0; i < barcode.length && i * barWidth < width - 10; i++) {
    const charCode = barcode.charCodeAt(i);
    const barHeight = (charCode % 20) + 12;
    const x = 5 + i * barWidth;

    if (charCode % 2 === 0) {
      svg += `<rect x="${x}" y="${
        (height - barHeight) / 2
      }" width="${barWidth}" height="${barHeight}" fill="black"/>`;
    }
  }

  svg += "</svg>";
  return svg;
};
</script>
