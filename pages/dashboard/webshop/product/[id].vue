<template>
  <div class="min-h-screen bg-white flex flex-col">
    <main class="flex-grow flex flex-col justify-between py-6 md:py-12">
      <div class="w-[95%] sm:w-[90%] lg:w-[80%] mx-auto">
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16"
        >
          <!-- Product Image -->
          <div class="lg:w-1/2 order-1 lg:order-1 lg:sticky lg:top-24">
            <Carousel class="relative w-full max-w-xs">
              <CarouselContent>
                <CarouselItem
                  v-for="(image, index) in product.images"
                  :key="index"
                >
                  <div class="p-1">
                    <Card class="w-full">
                      <CardContent
                        class="flex aspect-square items-center justify-center p-6 w-full h-full"
                      >
                        <img
                          :src="image"
                          class="w-full h-full object-cover"
                          :alt="product.title + index"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <!-- <div
              class="flex justify-center gap-2 sm:gap-3 md:gap-4 mt-4 md:mt-6"
            >
              <Button
                v-for="(img, idx) in product.images"
                :key="idx"
                @click="currentIndex = idx"
                :class="[
                  'relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all',
                  currentIndex === idx
                    ? 'ring-2 ring-black'
                    : 'hover:ring-1 hover:ring-gray-200',
                ]"
              >
                <img
                  :src="img"
                  :alt="product.title + index"
                  class="w-full h-full object-cover"
                />
              </Button>
            </div> -->
          </div>

          <!-- Product Info -->
          <div class="lg:w-1/2 space-y-6 md:space-y-8 order-2 lg:order-2">
            <div>
              <h1
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2 md:mb-4"
              >
                {{ product.title }}
              </h1>
              <div class="flex items-center space-x-2">
                <div class="flex">
                  <Star
                    v-for="star in 5"
                    :key="star"
                    class="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current"
                  />
                </div>
                <span class="text-xs sm:text-sm text-gray-500"
                  >(4.5 / 120 reviews)</span
                >
              </div>
            </div>

            <p class="text-xl sm:text-2xl font-semibold">
              $ {{ product.price }}
            </p>

            <p
              class="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed"
            >
              {{ product.description }}
            </p>

            <div
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <div
                class="flex items-center border rounded-full w-full sm:w-auto sm:justify-around"
              >
                <Button
                  variant="ghost"
                  class="rounded-l-full"
                  @click="decrementQuantity"
                >
                  <Minus class="w-4 h-4" />
                </Button>
                <span class="w-12 md:w-16 text-center font-medium">{{
                  quantity
                }}</span>
                <Button
                  variant="ghost"
                  class="rounded-r-full"
                  @click="incrementQuantity"
                >
                  <Plus class="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="lg"
                class="flex-grow"
                @click="addToCart"
                :disabled="loading"
                v-if="!cart.isInCart(product.id).value"
              >
                <ShoppingBag class="w-6 h-6" /> Ajouter au panier
                <Loader2 v-if="loading" class="w-4 h-4 ml-2 animate-spin" />
              </Button>
              <Button
                v-else
                class="flex-grow"
                @click="removeFromCart"
                variant="secondary"
              >
                Retirer du panier
              </Button>
              <Button
                class="p-3 md:p-4 border border-gray-200 hover:bg-gray-50 transition-colors flex space-x-2"
                variant="outline"
              >
                <Link class="w-5 h-5 md:w-6 md:h-6" />
                <span> Partager </span>
              </Button>
            </div>
          </div>
        </div>

        <!-- Product Details Tabs -->
        <div class="mt-12 md:mt-16">
          <div class="border-b">
            <div class="flex space-x-4 overflow-x-auto">
              <Button
                :variant="activeTab === tab.id ? 'solid' : 'outline'"
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </Button>
            </div>
          </div>

          <div class="mt-6 md:mt-8">
            <div v-if="activeTab === 'details'" class="space-y-4">
              <p class="text-gray-700 text-sm md:text-base">
                Our Premium Drink Bottle is designed with both style and
                functionality in mind. The double-wall vacuum insulation keeps
                your drinks cold for up to 24 hours or hot for up to 12 hours.
              </p>
              <ul
                class="list-disc pl-5 space-y-2 text-gray-700 text-sm md:text-base"
              >
                <li>Made from high-quality, BPA-free stainless steel</li>
                <li>Leak-proof lid with convenient carry loop</li>
                <li>Wide mouth for easy filling and cleaning</li>
                <li>Fits most car cup holders</li>
                <li>Condensation-free exterior</li>
              </ul>
            </div>

            <div v-if="activeTab === 'specs'">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm md:text-base">
                  <tbody>
                    <tr
                      v-for="spec in specifications"
                      :key="spec.label"
                      class="border-b"
                    >
                      <th class="py-2 pr-4 font-semibold">{{ spec.label }}</th>
                      <td class="py-2">{{ spec.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="activeTab === 'reviews'" class="space-y-6">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="flex items-start space-x-4"
              >
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <span
                      class="text-sm md:text-xl font-semibold text-gray-600"
                      >{{ review.initials }}</span
                    >
                  </div>
                </div>
                <div class="flex-grow">
                  <h3 class="text-sm md:text-lg font-semibold">
                    {{ review.name }}
                  </h3>
                  <div class="flex items-center">
                    <Star
                      v-for="star in 5"
                      :key="star"
                      :class="[
                        'w-3 h-3 md:w-4 md:h-4',
                        star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300',
                      ]"
                    />
                  </div>
                  <p class="text-gray-600 mt-1 text-sm md:text-base">
                    {{ review.comment }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Star, Minus, Plus, Link, ShoppingBag, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useCartStore } from "~/stores/cart";

// Reactive data
// const currentIndex = ref(0);
const loading = ref(false);
const quantity = ref(1);
const activeTab = ref("details");

const cart = useCartStore();

const route = useRoute();

const product = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(route.query.data));
  } catch (e) {
    return null;
  }
});

// console.log(cart.isInCart(product.id).value);

const tabs = [
  { id: "details", label: "Product Details" },
  { id: "specs", label: "Specifications" },
  { id: "reviews", label: "Reviews" },
];

const specifications = [
  { label: "Capacity", value: "500ml, 750ml, 1L" },
  { label: "Material", value: "18/8 Stainless Steel" },
  { label: "Insulation", value: "Double-wall vacuum" },
  { label: "Lid Type", value: "Screw-top with carry loop" },
  { label: "Cold Retention", value: "Up to 24 hours" },
  { label: "Hot Retention", value: "Up to 12 hours" },
];

const reviews = [
  {
    id: 1,
    name: "John Doe",
    initials: "JD",
    rating: 5,
    comment: "Great bottle! Keeps my drinks cold all day.",
  },
  {
    id: 2,
    name: "Jane Smith",
    initials: "JS",
    rating: 4,
    comment: "Stylish design, but a bit heavy when full.",
  },
];

// Methods

const addToCart = async () => {
  loading.value = true;
  const response = await cart.addToCart(product.value.id, quantity.value);
  console.log(response);
  loading.value = false;
};
const removeFromCart = async () => {
  loading.value = true;
  const response = await cart.removeFromCart(product.value.id);
  console.log(response);
};

const incrementQuantity = () => {
  quantity.value += 1;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};
</script>
