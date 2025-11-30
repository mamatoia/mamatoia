<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header>
      <slot name="header" />
    </header>

    <!-- Main Content -->
    <div class="flex-1 h-[calc(100vh-8rem)]">
      <!-- Aside -->
      <aside class="w-full h-full">
        <slot name="sidebar" />
      </aside>
    </div>

    <!-- Footer -->
    <footer class="h-20">
      <slot name="footer" />
    </footer>
  </div>
</template>
