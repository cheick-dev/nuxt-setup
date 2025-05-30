<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <header class="sticky top-0 z-40 w-full border-b bg-background">
      <div
        class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0"
      >
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="font-bold text-lg">Nuxt App</span>
        </NuxtLink>
        <div class="flex flex-1 items-center justify-end space-x-4">
          <nav class="flex items-center space-x-2">
            <NuxtLink
              to="/"
              class="text-sm font-medium transition-colors hover:text-primary"
              :class="$route.path === '/' ? 'text-primary' : 'text-foreground'"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="text-sm font-medium transition-colors hover:text-primary"
              :class="
                $route.path.startsWith('/dashboard')
                  ? 'text-primary'
                  : 'text-foreground'
              "
            >
              Dashboard
            </NuxtLink>
            <!-- <LayoutThemeToggle /> -->
          </nav>
        </div>
      </div>
    </header>
    <main class="container mx-auto py-8">
      <slot />
    </main>
    <footer class="border-t py-6">
      <div
        class="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row"
      >
        <p class="text-center text-sm text-muted-foreground md:text-left">
          &copy; {{ new Date().getFullYear() }} Nuxt App. All rights reserved.
        </p>
        <div class="flex gap-4">
          <a
            href="#"
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="#"
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
