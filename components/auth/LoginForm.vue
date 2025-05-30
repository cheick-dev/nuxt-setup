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
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="text-xl"> Connexion </CardTitle>
      <CardDescription> Entrez vos informations de connexion </CardDescription>
    </CardHeader>
    <CardContent class="text-base">
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" placeholder="********" />
        </div>
        <Button type="submit" class="w-full"> Connexion </Button>
        <Button variant="outline" class="w-full"> Github </Button>
      </div>
      <div class="mt-4 text-center">
        Pas encore inscrit ?
        <NuxtLink to="/auth/register" class="underline"> Inscription </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
