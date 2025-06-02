<template>
  <Card class="overflow-hidden">
    <CardHeader class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <CardTitle class="flex items-center space-x-2">
        <Share2 class="w-5 h-5 text-blue-600" />
        <span>Partager cette annonce</span>
      </CardTitle>
      <CardDescription>
        Générez un lien court et partagez facilement votre annonce
      </CardDescription>
    </CardHeader>

    <CardContent class="p-6 space-y-6">
      <!-- Informations de l'annonce -->
      <div class="flex items-start space-x-4">
        <div class="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
          <img
            v-if="listing.images && listing.images.length > 0"
            :src="listing.images[0].url"
            alt="Aperçu du produit"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-900 truncate">
            {{ listing.title }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ formatCurrency(listing.price) }}
          </p>

          <!-- Badge d'expiration -->
          <div class="flex items-center space-x-2 mt-2">
            <ExpirationBadge :expiry-date="listing.expiryDate" />
          </div>
        </div>
      </div>

      <!-- Lien court -->
      <div class="space-y-2">
        <Label class="text-sm text-gray-500">Lien de partage</Label>
        <div class="flex space-x-2">
          <div class="relative flex-1">
            <Input
              :value="shortLink"
              readonly
              class="pr-10 font-mono text-sm"
              ref="linkInput"
            />
            <Button
              variant="ghost"
              size="sm"
              class="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              @click="copyLink"
            >
              <component :is="copied ? Check : Copy" class="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            @click="regenerateLink"
            :disabled="isGenerating"
          >
            <RefreshCw v-if="isGenerating" class="w-4 h-4 animate-spin" />
            <RefreshCw v-else class="w-4 h-4" />
          </Button>
        </div>
        <p v-if="copied" class="text-xs text-green-600 animate-fade-in">
          Lien copié dans le presse-papier !
        </p>
      </div>

      <!-- QR Code -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Label class="text-sm text-gray-500">QR Code</Label>
          <Button variant="ghost" size="sm" @click="downloadQRCode">
            <Download class="w-4 h-4 mr-1" />
            <span class="text-xs">Télécharger</span>
          </Button>
        </div>

        <div class="flex justify-center p-4 bg-white border rounded-lg">
          <div ref="qrCodeContainer" class="w-48 h-48"></div>
        </div>
      </div>

      <!-- Message d'expiration -->
      <Alert class="bg-amber-50 border-amber-200">
        <Clock class="h-4 w-4 text-amber-600" />
        <AlertTitle class="text-amber-800">Expiration automatique</AlertTitle>
        <AlertDescription class="text-amber-700">
          Cette annonce expirera dans {{ daysUntilExpiry }} jours.
          <br />
          <span class="text-xs">
            Date d'expiration : {{ formatDate(listing.expiryDate) }}
          </span>
        </AlertDescription>
      </Alert>

      <!-- Boutons de partage -->
      <div class="space-y-3">
        <Label class="text-sm text-gray-500">Partager via</Label>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- WhatsApp -->
          <Button
            variant="outline"
            class="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            @click="shareViaWhatsApp"
          >
            <div class="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
            </div>
            <span class="text-sm">WhatsApp</span>
          </Button>

          <!-- Email -->
          <Button
            variant="outline"
            class="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            @click="shareViaEmail"
          >
            <Mail class="w-4 h-4" />
            <span class="text-sm">Email</span>
          </Button>

          <!-- Facebook -->
          <Button
            variant="outline"
            class="flex items-center justify-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
            @click="shareViaFacebook"
          >
            <div class="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </div>
            <span class="text-sm">Facebook</span>
          </Button>

          <!-- Twitter -->
          <Button
            variant="outline"
            class="flex items-center justify-center space-x-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
            @click="shareViaTwitter"
          >
            <div class="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </div>
            <span class="text-sm">Twitter</span>
          </Button>
        </div>

        <!-- Bouton de partage natif -->
        <Button v-if="canUseShareAPI" class="w-full" @click="shareNative">
          <Share2 class="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import {
  Share2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Mail,
  Clock,
} from "lucide-vue-next";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
//   import { useToast } from '@/components/ui/use-toast'
import { toast } from "vue-sonner";

import ExpirationBadge from "~/components/ExpirationBadge";

// Importation de QRCode.js
import QRCode from "qrcode";

const props = defineProps({
  listing: {
    type: Object,
    required: true,
  },
});

//   const { toast } = useToast()

// Références
const linkInput = ref(null);
const qrCodeContainer = ref(null);

// État
const copied = ref(false);
const isGenerating = ref(false);
const shortLink = ref("");

// Calculs
const canUseShareAPI = computed(() => {
  return typeof navigator !== "undefined" && navigator.share;
});

const daysUntilExpiry = computed(() => {
  const today = new Date();
  const expiryDate = new Date(props.listing.expiryDate);
  const diffTime = Math.abs(expiryDate - today);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Fonctions
const generateShortLink = () => {
  isGenerating.value = true;

  // Simulation de génération d'un lien court
  setTimeout(() => {
    const randomId = Math.random().toString(36).substring(2, 8);
    shortLink.value = `https://webshop.app/a/${randomId}`;

    // Générer le QR code
    generateQRCode(shortLink.value);

    isGenerating.value = false;
  }, 500);
};

const regenerateLink = () => {
  generateShortLink();
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shortLink.value);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
    const input = linkInput.value;
    input.select();
    document.execCommand("copy");

    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const generateQRCode = async (url) => {
  if (!qrCodeContainer.value) return;

  try {
    // Vider le conteneur
    qrCodeContainer.value.innerHTML = "";

    // Générer le QR code
    await QRCode.toCanvas(qrCodeContainer.value, url, {
      width: 192,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error);
  }
};

const downloadQRCode = () => {
  const canvas = qrCodeContainer.value.querySelector("canvas");
  if (!canvas) return;

  // Créer un lien temporaire
  const link = document.createElement("a");
  link.download = `qrcode-${props.listing.id}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast({
    title: "QR Code téléchargé",
    description: "Le QR code a été téléchargé avec succès",
  });
};

const shareViaWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(
    `${props.listing.title} - ${shortLink.value}`
  )}`;
  window.open(url, "_blank");
};

const shareViaEmail = () => {
  const subject = encodeURIComponent(
    `Découvrez cette annonce : ${props.listing.title}`
  );
  const body = encodeURIComponent(
    `Bonjour,\n\nJ'ai trouvé cette annonce qui pourrait vous intéresser :\n\n${
      props.listing.title
    } - ${formatCurrency(props.listing.price)}\n\n${
      shortLink.value
    }\n\nCordialement,`
  );

  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

const shareViaFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shortLink.value
  )}`;
  window.open(url, "_blank");
};

const shareViaTwitter = () => {
  const text = encodeURIComponent(
    `Découvrez cette annonce : ${props.listing.title} - ${formatCurrency(
      props.listing.price
    )}`
  );
  const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
    shortLink.value
  )}`;
  window.open(url, "_blank");
};

const shareNative = async () => {
  try {
    await navigator.share({
      title: props.listing.title,
      text: `${props.listing.title} - ${formatCurrency(props.listing.price)}`,
      url: shortLink.value,
    });

    toast({
      title: "Partage réussi",
      description: "L'annonce a été partagée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du partage:", error);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
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
  generateShortLink();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
