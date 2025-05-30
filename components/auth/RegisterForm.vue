<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const props = defineProps({
  email: String,
  password: String,
  full_name: String,
  role: String,
  loading: Boolean,
  error: String,
});
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-xl"> Inscription </CardTitle>
      <CardDescription> Entrez vos informations d'inscription </CardDescription>
    </CardHeader>
    <CardContent class="text-base">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="first-name">Nom et prénom</Label>
          <Input id="first-name" placeholder="Max Robinson" required />
        </div>
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" placeholder="********" />
        </div>
        <Button type="submit" class="w-full"> Creer un compte </Button>
        <Button variant="outline" class="w-full"> Github </Button>
      </div>
      <div class="mt-4 text-center">
        Déjà inscrit ?
        <NuxtLink to="/auth/login" class="underline"> Connexion </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
