<template>
  <Card class="p-6">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          Simulation Edge Function
        </h3>
        <Badge variant="outline" class="bg-blue-50 text-blue-700">
          <Zap class="w-3 h-3 mr-1" />
          Supabase Cron
        </Badge>
      </div>

      <div class="text-sm text-gray-600">
        <p>
          Cette fonction s'exécute automatiquement chaque jour à minuit pour :
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Vérifier les annonces de plus de 30 jours</li>
          <li>Marquer les annonces comme expirées</li>
          <li>Envoyer des notifications aux vendeurs</li>
          <li>Archiver automatiquement les annonces</li>
        </ul>
      </div>

      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-2">
          <Clock class="w-4 h-4 text-gray-500" />
          <span class="text-sm">Dernière exécution: {{ lastRun }}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          @click="runManualCheck"
          :disabled="isRunning"
        >
          <template v-if="isRunning">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            Exécution...
          </template>
          <template v-else>
            <Play class="w-4 h-4 mr-2" />
            Exécuter maintenant
          </template>
        </Button>
      </div>

      <!-- Résultats de la dernière exécution -->
      <div v-if="lastResults" class="space-y-3">
        <h4 class="font-medium text-gray-900">Derniers résultats</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">
              {{ lastResults.checked }}
            </div>
            <div class="text-xs text-blue-700">Annonces vérifiées</div>
          </div>
          <div class="text-center p-3 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">
              {{ lastResults.expired }}
            </div>
            <div class="text-xs text-red-700">Annonces expirées</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">
              {{ lastResults.notified }}
            </div>
            <div class="text-xs text-green-700">Vendeurs notifiés</div>
          </div>
        </div>
      </div>

      <!-- Code SQL -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label class="text-sm text-gray-500">Code SQL de la fonction</Label>
          <Button variant="ghost" size="sm" @click="copySQL">
            <component :is="sqlCopied ? Check : Copy" class="w-3 h-3 mr-1" />
            <span class="text-xs">Copier</span>
          </Button>
        </div>

        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-xs text-gray-300 font-mono">{{ sqlCode }}</pre>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Zap, Clock, Play, Loader2, Copy, Check } from "lucide-vue-next";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
//   import { useToast } from '@/components/ui/use-toast'
import { toast } from "vue-sonner";

//   const { toast } = useToast()

// État
const isRunning = ref(false);
const lastRun = ref("");
const lastResults = ref(null);
const sqlCopied = ref(false);

// SQL Code pour la fonction d'expiration
const sqlCode = `-- Fonction Supabase pour expirer les annonces
  CREATE OR REPLACE FUNCTION expire_old_listings()
  RETURNS void AS $$
  DECLARE
    expired_count INTEGER := 0;
    notified_count INTEGER := 0;
  BEGIN
    -- Marquer les annonces comme expirées
    UPDATE listings
    SET status = 'expired',
        updated_at = NOW()
    WHERE 
      status IN ('published', 'draft') 
      AND created_at < NOW() - INTERVAL '30 days'
      AND id IN (
        SELECT id FROM listings FOR UPDATE SKIP LOCKED
      )
    RETURNING id INTO expired_count;
    
    -- Envoyer des notifications aux vendeurs
    INSERT INTO notifications (user_id, type, title, message, data, created_at)
    SELECT 
      user_id,
      'listing_expired',
      'Annonce expirée',
      'Votre annonce "' || title || '" a expiré après 30 jours',
      jsonb_build_object('listing_id', id),
      NOW()
    FROM listings
    WHERE 
      status = 'expired'
      AND updated_at > NOW() - INTERVAL '1 hour'
    RETURNING id INTO notified_count;
    
    -- Log des résultats
    INSERT INTO cron_logs (job_name, result, created_at)
    VALUES (
      'expire_old_listings',
      jsonb_build_object(
        'expired_count', expired_count,
        'notified_count', notified_count
      ),
      NOW()
    );
  END;
  $$ LANGUAGE plpgsql;
  
  -- Configuration du job cron
  SELECT cron.schedule(
    'expire-listings-daily',
    '0 0 * * *', -- Tous les jours à minuit
    'SELECT expire_old_listings();'
  );`;

// Simulation de l'Edge Function
const runManualCheck = async () => {
  isRunning.value = true;

  try {
    // Simulation du traitement
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Résultats simulés
    const results = {
      checked: Math.floor(Math.random() * 50) + 10,
      expired: Math.floor(Math.random() * 5) + 1,
      notified: Math.floor(Math.random() * 5) + 1,
    };

    lastResults.value = results;
    lastRun.value = new Date().toLocaleString("fr-FR");

    toast({
      title: "Vérification terminée",
      description: `${results.expired} annonce(s) expirée(s), ${results.notified} vendeur(s) notifié(s)`,
    });

    // Simulation des notifications aux vendeurs
    if (results.expired > 0) {
      setTimeout(() => {
        toast({
          title: "Notifications envoyées",
          description: `${results.notified} vendeur(s) notifié(s) des annonces expirées`,
          variant: "destructive",
        });
      }, 1000);
    }
  } catch (error) {
    toast({
      title: "Erreur d'exécution",
      description: "Impossible d'exécuter la vérification",
      variant: "destructive",
    });
  } finally {
    isRunning.value = false;
  }
};

const copySQL = async () => {
  try {
    await navigator.clipboard.writeText(sqlCode);
    sqlCopied.value = true;

    setTimeout(() => {
      sqlCopied.value = false;
    }, 2000);

    toast({
      title: "Code SQL copié",
      description: "Le code SQL a été copié dans le presse-papier",
    });
  } catch (err) {
    toast({
      title: "Erreur de copie",
      description: "Impossible de copier le code SQL",
      variant: "destructive",
    });
  }
};

// Initialisation
onMounted(() => {
  lastRun.value = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(
    "fr-FR"
  );
  lastResults.value = {
    checked: 42,
    expired: 3,
    notified: 3,
  };
});
</script>
