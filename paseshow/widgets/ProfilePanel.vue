<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-row justify-around mb-4 pt-8">
      <ProfileCard
        label="Miguel"
        avatar="https://api.dicebear.com/9.x/dylan/svg?backgroundColor=c0aede"
      />
      <ProfileCard
        label="Nahuel"
        avatar="https://api.dicebear.com/9.x/dylan/svg?seed=Sophia"
      />
      <ProfileCard
        label="Joaco"
        avatar="https://api.dicebear.com/9.x/dylan/svg?seed=Jade"
      />
    </div>

    <div class="flex flex-row justify-around mb-4">
      <ProfileCard
        label="Nesmar"
        avatar="https://api.dicebear.com/9.x/dylan/svg?seed=Sadie"
      />
      <ProfileCard
        label="Chelo"
        avatar="https://api.dicebear.com/9.x/dylan/svg?seed=Liam"
      />
    </div>
  </div>
</template>

<script setup>
import ProfileCard from "../components/cards/ProfileCard.vue";
</script>
