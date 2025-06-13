<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { onMounted, watchEffect } from "vue";

import { Button } from "@/components/ui/button";

import { useCartStore } from "~/stores/cart";
import { Loader2, Trash } from "lucide-vue-next";
import { supabaseService } from "~/services/supabaseService";
// import{} from "@/composables/usePaystack";

const cart = useCartStore();
const { pay } = usePaystackPayment();
const { user } = useUserProfile();

const history = ref([]);

const shipping = 500;

const getHistory = async () => {
  const response = await supabaseService.getPayments();
  history.value = response.data;
};

onMounted(() => {
  cart.fetchCart();
  getHistory();
});

watchEffect(() => {
  // Réexécute quand un élément change
  cart.fetchCart();
});

const handleQuantityChange = (itemId, newQty) => {
  const quantity = parseInt(newQty);
  if (!isNaN(quantity) && quantity > 0) {
    cart.updateQuantity(itemId, quantity);
  }
};

const handleRemove = (itemId) => {
  cart.removeFromCart(itemId);
};

const calculateTotal = () => {
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );
  return (subtotal + shipping).toFixed(2);
};

const checkout = () => {
  pay({
    email: user.value.email,
    amount: calculateTotal() * 1,
    metadata: {
      cart_id: cart.items.map((item) => item.product.id),
    },
    onSuccess: async (reference) => {
      console.log("Paiement validé avec ref :", reference);
      // Optionnel : vérifie la référence côté serveur
      const verify = await $fetch("/api/verify-payment", {
        method: "POST",
        body: { reference },
      });
      const paymentMethod = verify.payment_method;

      for (const item of cart.items) {
        const payload = {
          product_id: item.product.id,
          buyer_id: user.value.id,
          seller_id: item.product.user_id,
          store_id: item.product.store_id,
          amount: calculateTotal() * 100,
          payment_method: paymentMethod,
        };

        console.log(payload);
        const response = await supabaseService.createPayment(payload);
        console.log(response);

        console.log("Transaction enregistrée :", response);
      }

      // Optionnel : supprime le produit du panier
      //   cart.removeFromCart(itemId);
    },
    onClose: () => {
      console.log("Fenêtre de paiement fermée");
    },
  });
};
</script>

<template>
  <div class="bg-white py-6 sm:py-8 lg:py-12 min-h-screen">
    <div class="mx-auto max-w-screen-lg px-4 md:px-8">
      <div class="mb-6 sm:mb-10 lg:mb-16">
        <h2
          class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl"
        >
          Mon panier
        </h2>
      </div>

      <div v-if="cart.items.length === 0" class="text-center text-gray-500">
        Votre panier est vide.
      </div>

      <div v-else class="mb-6 flex flex-col gap-4 sm:mb-8 md:gap-6">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex flex-wrap gap-x-4 overflow-hidden rounded-lg border sm:gap-y-4 lg:gap-6"
        >
          <div
            class="group relative block h-48 w-32 overflow-hidden bg-gray-100 sm:h-56 sm:w-40"
          >
            <img
              :src="item.images[0]"
              alt="Product image"
              class="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
            />
          </div>

          <div class="flex flex-1 flex-col justify-between py-4">
            <div>
              <span
                class="mb-1 inline-block text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl"
              >
                {{ item.product.title }}
              </span>

              <span class="block text-gray-500">
                {{ item.product.description }}
              </span>
            </div>

            <div>
              <span class="mb-1 block font-bold text-gray-800 md:text-lg">
                {{ item.product.price }} XOF
              </span>
            </div>
          </div>

          <div
            class="flex w-full justify-between border-t p-4 sm:w-auto sm:border-none sm:pl-0 lg:p-6 lg:pl-0"
          >
            <div class="flex flex-col items-start gap-2">
              <div class="flex h-12 w-20 overflow-hidden rounded border">
                <input
                  type="number"
                  min="1"
                  :value="item.quantity"
                  @input="handleQuantityChange(item.id, $event.target.value)"
                  class="w-full px-4 py-2 outline-none ring-inset ring-indigo-300 transition duration-100 focus:ring"
                />
              </div>

              <Button
                @click="handleRemove(item.id)"
                variant="ghost"
                :disabled="cart.loading"
              >
                <Loader2 class="w-4 h-4 animate-spin" v-if="cart.loading" />
                <Trash class="w-4 h-4" v-else />
                Supprimer
              </Button>
            </div>

            <div class="ml-4 pt-3 md:ml-8 md:pt-2 lg:ml-16">
              <span class="block font-bold text-gray-800 md:text-lg">
                {{ (item.quantity * item.product.price).toFixed(2) }} XOF
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-end gap-4" v-if="cart.items.length">
        <div class="w-full rounded-lg bg-gray-100 p-4 sm:max-w-xs">
          <div class="space-y-1">
            <div class="flex justify-between gap-4 text-gray-500">
              <span>Sous-total</span>
              <span>
                {{
                  cart.items
                    .reduce((acc, i) => acc + i.product.price * i.quantity, 0)
                    .toFixed(2)
                }}
                XOF
              </span>
            </div>

            <div class="flex justify-between gap-4 text-gray-500">
              <span>Livraison</span>
              <span>{{ shipping.toFixed(2) }} XOF</span>
            </div>
          </div>

          <div class="mt-4 border-t pt-4">
            <div class="flex items-start justify-between gap-4 text-gray-800">
              <span class="text-lg font-bold">Total</span>

              <span class="flex flex-col items-end">
                <span class="text-lg font-bold">
                  {{ calculateTotal() }} XOF</span
                >
              </span>
            </div>
          </div>
          <Button size="lg" class="w-full mt-5" @click="checkout">
            Commander
          </Button>
        </div>
      </div>
    </div>
    <div v-if="history.length" class="mt-6">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <div
              class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <User class="w-10 h-10 text-gray-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Commande #{{ history.length }}
              </h1>
              <p class="text-sm text-gray-500">
                {{ history[history.length - 1].created_at }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <table class="w-full text-left text-sm md:text-base">
            <thead>
              <tr>
                <th class="py-2 pr-4 font-semibold">Date</th>
                <th class="py-2 pr-4 font-semibold">Montant</th>
                <th class="py-2 pr-4 font-semibold">Payment method</th>
                <th class="py-2 pr-4 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in history" :key="item.id">
                <td class="py-2 pr-4">{{ item.created_at }}</td>
                <td class="py-2 pr-4">{{ item.amount / 100 }} XOF</td>
                <td class="py-2 pr-4">{{ item.payment_method }}</td>
                <td class="py-2 pr-4">{{ item.buyer_email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
