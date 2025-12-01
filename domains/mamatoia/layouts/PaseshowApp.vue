<template>
  <div class="flex flex-col h-screen justify-start items-start">
    <header>
      <slot name="header" />
    </header>

    <div class="flex-1 flex flex-col w-full bg-cover bg-center bg-no-repeat">
      <slot />
    </div>
  </div>
</template>
