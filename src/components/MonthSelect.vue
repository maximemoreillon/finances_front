<template>
  <v-select
    :items="months"
    :model-value="month"
    @update:model-value="handleChange"
    label="Month"
    hide-details
  />
</template>

<script setup lang="ts">
import { useQueryParams } from "@/composables/useQueryParams"

const { month, setQueryParam } = useQueryParams()

const months = [
  { title: "Any", value: -1 },
  ...Array.from(Array(12).keys()).map((m) => m + 1),
]

function handleChange(val: number) {
  if (val === -1) setQueryParam("month", null)
  else setQueryParam("month", val)
}
</script>
