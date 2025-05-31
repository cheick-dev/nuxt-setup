<template>
  <div class="space-y-4">
    <!-- Zone de drop -->
    <Label
      for="file-input"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors flex flex-col items-center justify-center',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        loading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400',
      ]"
      @dragenter="isDragging = true"
      @dragleave="isDragging = false"
    >
      <div class="space-y-4">
        <div
          class="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <Upload class="w-6 h-6 text-gray-400" />
        </div>

        <div>
          <p class="text-lg font-medium text-gray-900">
            Glissez vos images ici
          </p>
          <p class="text-sm text-gray-500">
            ou
            <Button
              type="button"
              variant="link"
              class="p-0 h-auto text-blue-600"
              @click="triggerFileInput"
            >
              parcourez vos fichiers
            </Button>
          </p>
        </div>

        <div class="text-xs text-gray-400">
          PNG, JPG, WEBP jusqu'à 5MB (max {{ maxFiles }} images)
        </div>
      </div>

      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
          <span class="text-sm text-gray-600">Upload en cours...</span>
        </div>
      </div>
    </Label>

    <!-- Input file caché -->
    <Input
      id="file-input"
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Prévisualisation des images -->
    <div
      v-if="modelValue.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="(image, index) in modelValue"
        :key="image.id"
        class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          :src="image.url"
          :alt="image.name"
          class="w-full h-full object-cover"
        />

        <!-- Overlay avec actions -->
        <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center"
        >
          <div
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2"
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              @click="removeImage(index)"
            >
              <Trash2 class="w-4 h-4" />
            </Button>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              @click="setMainImage(index)"
              v-if="index !== 0"
            >
              <Star class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Badge image principale -->
        <Badge
          v-if="index === 0"
          class="absolute top-2 left-2 bg-blue-600 text-white"
        >
          Principale
        </Badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Upload, Loader2, Trash2, Star } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxFiles: {
    type: Number,
    default: 5,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["update:modelValue", "upload"]);

// État local
const isDragging = ref(false);
const fileInput = ref(null);

// Fonctions
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
  event.target.value = ""; // Reset input
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;

  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = (files) => {
  // Filtrer les fichiers image
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  // Vérifier la limite
  const remainingSlots = props.maxFiles - props.modelValue.length;
  const filesToProcess = imageFiles.slice(0, remainingSlots);

  if (filesToProcess.length > 0) {
    emit("upload", filesToProcess);
  }
};

const removeImage = (index) => {
  const newImages = [...props.modelValue];
  newImages.splice(index, 1);
  emit("update:modelValue", newImages);
};

const setMainImage = (index) => {
  const newImages = [...props.modelValue];
  const [mainImage] = newImages.splice(index, 1);
  newImages.unshift(mainImage);
  emit("update:modelValue", newImages);
};
</script>
