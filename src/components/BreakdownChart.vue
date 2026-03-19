<template>
  <apexchart height="300" :options="options" :series="series" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useTheme } from "vuetify"
import type { Transaction } from "@/types"
import { colors } from "@/constants"
import { useQueryParams } from "@/composables/useQueryParams"

const props = defineProps<{ transactions: Transaction[] }>()

const theme = useTheme()
const { category, setQueryParam } = useQueryParams()

const isDark = computed(() => theme.global.current.value.dark)

interface GraphEntry {
  label: string
  amount: number
  id?: number
}

const explicitlyCategorized = computed(() =>
  props.transactions.map((t) => ({
    ...t,
    categories: t.categories?.length ? t.categories : [{ name: t.description, id: undefined }],
  }))
)

const generatedGraphData = computed((): GraphEntry[] => {
  const max = 8
  return explicitlyCategorized.value
    .reduce<GraphEntry[]>((acc, t) => {
      for (const cat of t.categories) {
        const entry = acc.find((e) => e.label === cat.name)
        const amount = Math.abs(t.amount)
        if (!entry) acc.push({ label: cat.name, amount, id: cat.id })
        else entry.amount += amount
      }
      return acc
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .reduce<GraphEntry[]>((acc, item, index) => {
      if (index < max) acc.push(item)
      else {
        if (!acc[max]) acc.push({ label: "Other", amount: item.amount })
        else acc[max].amount += item.amount
      }
      return acc
    }, [])
})

const series = computed(() => generatedGraphData.value.map((x) => x.amount))

const options = computed(() => ({
  chart: {
    type: "donut",
    events: {
      dataPointSelection: (_: unknown, __: unknown, config: { dataPointIndex: number }) => {
        const entry = generatedGraphData.value[config.dataPointIndex]
        if (entry.id === undefined) return
        if (String(entry.id) === category.value) setQueryParam("category", null)
        else setQueryParam("category", entry.id)
      },
    },
  },
  theme: { mode: isDark.value ? "dark" : "light" },
  colors,
  labels: generatedGraphData.value.map(
    (x) => `${x.label}: ${new Intl.NumberFormat().format(x.amount)}`
  ),
}))
</script>
