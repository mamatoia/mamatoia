<template>
  <div
    class="flex flex-col h-screen bg-gradient-to-b from-[#3a3a3a] via-[#1a1a1a] to-black"
  >
    <header>
      <slot name="header" />
    </header>

    <div class="flex-1 flex flex-col justify-center w-full">
      <slot />
    </div>
  </div>
</template>
