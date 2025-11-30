<template>
  <ItemContainer padClass="pl-0 pr-1 py-2">
    <DateCard :eventName="eventName" :date="date" />
  </ItemContainer>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

import DateCard from "../cards/DateCard/index.vue";
import ItemContainer from "../../containers/ItemContainer.vue";

const props = defineProps({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: false,
    default: undefined,
  },
});
</script>
