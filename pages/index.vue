<script setup lang="ts"></script>

<template>
  <section class="px-4 md:px-6 py-12 md:py-24 lg:py-32">
    <div class="container mx-auto space-y-12 px-4 md:px-6">
      <div
        class="flex flex-col items-center justify-center space-y-4 text-center"
      >
        <div class="space-y-2">
          <div class="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
            Welcome
          </div>
          <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl">
            Modern Nuxt 3 with Supabase
          </h1>
          <p
            class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          >
            A scalable architecture with Tailwind CSS, Shadcn/ui components, and
            Supabase integration.
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/dashboard"> Get Started </NuxtLink>
          <NuxtLink as="nuxt-link" to="/auth/login" variant="outline">
            Sign In
          </NuxtLink>
        </div>
      </div>
      <div class="mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
        <div>
          <div>
            <div>Tailwind CSS</div>
            <div>Utility-first CSS framework with dark mode support</div>
          </div>
          <div>
            <p>
              Configure themes, use plugins for typography and forms, and
              leverage the power of Tailwind's utility classes.
            </p>
          </div>
        </div>
        <div>
          <div>
            <p>Shadcn UI Components</p>
            <div>Beautiful, accessible UI components</div>
          </div>
          <div>
            <p>
              Leverage reusable UI components built with Radix Vue primitives
              and styled with Tailwind CSS.
            </p>
          </div>
        </div>
        <div>
          <div>
            <p>Supabase Integration</p>
            <div>Authentication, database, storage, and realtime</div>
          </div>
          <div>
            <p>
              Easily connect to Supabase for auth, database, storage solutions,
              and realtime subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
