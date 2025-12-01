<template>
  <ItemContainer padClass="pl-0 pr-1 py-2" bgClass="bg-transparent">
    <EventCard
      :id="id"
      :eventName="eventName"
      :date="date"
      :filter="filter"
      :selected="selected"
      :show-favorite-icon="showFavoriteIcon"
    />
  </ItemContainer>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import EventCard from "../cards/EventCard.vue";
import ItemContainer from "../../panels/ItemContainer.vue";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: false,
    default: undefined,
  },
  filter: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  showFavoriteIcon: {
    type: Boolean,
    default: true,
  },
});
</script>
