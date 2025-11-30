<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header>
      <slot name="header" />
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 h-[calc(100vh-8rem)]">
      <!-- Aside -->
      <aside class="hidden sm:flex sm:min-w-64 md:w-3/12 h-full">
        <slot name="sidebar" />
      </aside>

      <!-- Main -->
      <main class="flex-1 h-full overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Footer -->
    <footer class="h-20">
      <slot name="footer" />
    </footer>
  </div>
</template>
