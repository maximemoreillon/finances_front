<template>
  <v-select
    :items="years"
    :model-value="year"
    @update:model-value="setQueryParam('year', $event)"
    label="Year"
    hide-details
  />
</template>

<script setup lang="ts">
import { useQueryParams } from "@/composables/useQueryParams"

const { year, setQueryParam } = useQueryParams()

const years = Array.from(Array(10).keys()).map((y) => new Date().getFullYear() - y)
</script>
