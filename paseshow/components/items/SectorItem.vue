<template>
  <ItemContainer padClass="pl-0 pr-1 py-2">
    <SectorCard :name="name" :capacity="capacity" :sectorId="sectorId" />
  </ItemContainer>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import SectorCard from "../cards/SectorCard.vue";
import ItemContainer from "../../containers/ItemContainer.vue";

const props = defineProps({
  name: { type: String, required: true },
  capacity: { type: Number, required: false },
  sectorId: { type: String, required: false },
});
</script>
