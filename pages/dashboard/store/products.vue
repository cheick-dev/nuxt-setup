<template>
  <div class="flex bg-gray-50">
    <!-- Contenu principal -->
    <main class="">
      <!-- Header -->
      <!-- <header class="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
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
                Gestion des produits
              </h1>
              <p class="text-sm text-gray-500 hidden sm:block">
                {{ filteredProducts.length }} produit(s) au total
              </p>
            </div>
          </div>

          <Button
            @click="showAddProduct = true"
            class="bg-green-600 hover:bg-green-700"
          >
            <PlusCircle class="w-4 h-4 mr-2" />
            <span class="hidden sm:inline">Ajouter un produit</span>
            <span class="sm:hidden">Ajouter</span>
          </Button>
        </div>
      </header> -->

      <!-- Zone de contenu -->
      <div class="flex-1 overflow-y-auto p-4 lg:p-6">
        <div class="max-w-7xl w-full mx-auto space-y-6">
          <!-- Filtres et recherche -->
          <Card class="p-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Recherche -->
              <div class="flex-1">
                <div class="relative">
                  <Search
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  />
                  <Input
                    v-model="searchQuery"
                    placeholder="Rechercher un produit..."
                    class="pl-10"
                  />
                </div>
              </div>

              <!-- Filtres -->
              <div class="flex gap-2">
                <Select v-model="statusFilter">
                  <SelectTrigger class="w-40">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_stock">En stock</SelectItem>
                    <SelectItem value="reserve">Réservé</SelectItem>
                    <SelectItem value="vendu">Vendu</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                  </SelectContent>
                </Select>

                <Select v-model="typeFilter">
                  <SelectTrigger class="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="interne">Interne</SelectItem>
                    <SelectItem value="webshop">WebShop</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" @click="toggleView">
                  <component
                    :is="viewMode === 'grid' ? List : Grid3X3"
                    class="w-4 h-4"
                  />
                </Button>
              </div>
            </div>
          </Card>

          <!-- Vue Grid -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @edit="editProduct"
              @archive="archiveProduct"
              @download-barcode="downloadBarcode"
            />
          </div>

          <!-- Vue Tableau -->
          <Card v-else class="overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Produit
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prix
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Code-barres
                    </th>
                    <th
                      class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-4">
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ product.title }}
                        </div>
                        <div class="text-sm text-gray-500 truncate max-w-xs">
                          {{ product.description }}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-4">
                      <Badge
                        :variant="
                          product.type === 'webshop' ? 'default' : 'secondary'
                        "
                      >
                        {{ product.type === "webshop" ? "WebShop" : "Interne" }}
                      </Badge>
                    </td>
                    <td class="px-4 py-4 font-medium">
                      {{ formatCurrency(product.price) }}
                    </td>
                    <td class="px-4 py-4">
                      <StatusBadge :status="product.status" />
                    </td>
                    <td class="px-4 py-4">
                      <div class="flex items-center space-x-2">
                        <code class="text-xs bg-gray-100 px-2 py-1 rounded"
                          >{{ product.barcode.slice(0, 8) }}...</code
                        >
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="downloadBarcode(product)"
                        >
                          <Download class="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-right">
                      <div class="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="editProduct(product)"
                        >
                          <Edit class="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="archiveProduct(product)"
                          :class="
                            product.status === 'archive'
                              ? 'text-green-600'
                              : 'text-red-600'
                          "
                        >
                          <Archive class="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <!-- Modal Ajout/Édition Produit -->
      <AddProductModal
        v-if="showAddProduct || editingProduct"
        :product="editingProduct"
        @close="closeProductModal"
        @save="saveProduct"
      />
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: "store",
  title: "Gestion des produits",
});

import { ref, computed } from "vue";
import {
  Store,
  Package,
  BarChart3,
  ShoppingCart,
  User,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Search,
  List,
  Grid3X3,
  Download,
  Edit,
  Archive,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "vue-sonner";

import ProductCard from "~/components/ProductCard";
import StatusBadge from "@/components/StatusBadge";
import AddProductModal from "@/components/AddProductModal";

// État de l'interface
const mobileMenuOpen = ref(false);
const sidebarCollapsed = ref(false);
const showAddProduct = ref(false);
const editingProduct = ref(null);
const viewMode = ref("grid"); // 'grid' ou 'table'

// Filtres et recherche
const searchQuery = ref("");
const statusFilter = ref("all");
const typeFilter = ref("all");

// const { toast } = useToast();

// Données des produits (simulées)
const products = ref([
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    description: "Smartphone Apple 256GB, état excellent",
    price: 899.99,
    type: "webshop",
    status: "en_stock",
    barcode: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-15",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    description: "Ordinateur portable Apple, 8GB RAM, 256GB SSD",
    price: 1299.99,
    type: "interne",
    status: "reserve",
    barcode: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2024-01-20",
  },
  {
    id: 3,
    title: "Samsung Galaxy S24",
    description: "Smartphone Samsung 128GB, comme neuf",
    price: 699.99,
    type: "webshop",
    status: "vendu",
    barcode: "550e8400-e29b-41d4-a716-446655440003",
    created_at: "2024-01-10",
  },
]);

// Produits filtrés
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // Filtre par statut
  if (statusFilter.value !== "all") {
    filtered = filtered.filter(
      (product) => product.status === statusFilter.value
    );
  }

  // Filtre par type
  if (typeFilter.value !== "all") {
    filtered = filtered.filter((product) => product.type === typeFilter.value);
  }

  return filtered;
});

// Fonctions
const toggleView = () => {
  viewMode.value = viewMode.value === "grid" ? "table" : "grid";
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const editProduct = (product) => {
  editingProduct.value = { ...product };
};

const archiveProduct = (product) => {
  const newStatus = product.status === "archive" ? "en_stock" : "archive";
  const productIndex = products.value.findIndex((p) => p.id === product.id);
  if (productIndex !== -1) {
    products.value[productIndex].status = newStatus;

    toast({
      title: newStatus === "archive" ? "Produit archivé" : "Produit restauré",
      description: `${product.title} a été ${
        newStatus === "archive" ? "archivé" : "restauré"
      }`,
    });
  }
};

const downloadBarcode = (product) => {
  // Génération et téléchargement du code-barres SVG
  const svg = generateBarcodeSVG(product.barcode);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `barcode-${product.title.replace(/\s+/g, "-")}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  toast({
    title: "Code-barres téléchargé",
    description: `Code-barres de ${product.title} téléchargé`,
  });
};

const generateBarcodeSVG = (barcode) => {
  // Génération simple d'un code-barres SVG
  const width = 200;
  const height = 50;
  const barWidth = 2;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Génération des barres basée sur l'UUID
  for (let i = 0; i < barcode.length && i * barWidth < width - 20; i++) {
    const charCode = barcode.charCodeAt(i);
    const barHeight = (charCode % 30) + 20;
    const x = 10 + i * barWidth;

    if (charCode % 2 === 0) {
      svg += `<rect x="${x}" y="${
        (height - barHeight) / 2
      }" width="${barWidth}" height="${barHeight}" fill="black"/>`;
    }
  }

  svg += `<text x="${width / 2}" y="${
    height - 5
  }" text-anchor="middle" font-family="monospace" font-size="8">${barcode.slice(
    0,
    12
  )}</text>`;
  svg += "</svg>";

  return svg;
};

const closeProductModal = () => {
  showAddProduct.value = false;
  editingProduct.value = null;
};

const saveProduct = (productData) => {
  if (editingProduct.value) {
    // Modification
    const index = products.value.findIndex(
      (p) => p.id === editingProduct.value.id
    );
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...productData };
      toast({
        title: "Produit modifié",
        description: `${productData.title} a été mis à jour`,
      });
    }
  } else {
    // Ajout
    const newProduct = {
      id: Date.now(),
      ...productData,
      barcode: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    products.value.push(newProduct);

    toast({
      title: "Produit ajouté",
      description: `${productData.title} a été ajouté avec succès`,
    });
  }

  closeProductModal();
};
</script>
