<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Monthly transactions</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <YearSelect />
        </v-col>
      </v-row>
      <apexchart
        v-if="transactions.length"
        width="100%"
        height="300"
        :options="options"
        :series="series"
      />
      <div v-else-if="!loading" class="text-center">No Data available</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { useTheme } from "vuetify"
import type { Transaction } from "@/types"
import axios from "@/axios"
import { colors } from "@/constants"
import { useQueryParams } from "@/composables/useQueryParams"
import YearSelect from "./YearSelect.vue"

const route = useRoute()
const theme = useTheme()
const { year, setQueryParam } = useQueryParams()

const loading = ref(false)
const transactions = ref<Transaction[]>([])

const accountId = computed(() => route.params.accountId as string | undefined)
const categoryId = computed(() => route.params.categoryId as string | undefined)
const isDark = computed(() => theme.global.current.value.dark)

function transactionsOfMonth(y: number, m: number) {
  const start = new Date(`${y}/${m}/01`)
  const endYear = m < 12 ? y : y + 1
  const endMonth = m < 12 ? m + 1 : 1
  const end = new Date(`${endYear}/${endMonth}/01`)
  return transactions.value.filter((t) => start <= new Date(t.time) && new Date(t.time) < end)
}

function incomeTotalForMonth(y: number, m: number) {
  return transactionsOfMonth(y, m).reduce((acc, { amount }) => {
    if (amount > 0) acc += amount
    return acc
  }, 0)
}

function expensesTotalForMonth(y: number, m: number) {
  return transactionsOfMonth(y, m).reduce((acc, { amount }) => {
    if (amount < 0) acc -= amount
    return acc
  }, 0)
}

const months = Array.from(Array(12).keys()).map((m) => m + 1)

const series = computed(() => [
  { name: "Expenses", data: months.map((m) => expensesTotalForMonth(year.value, m)) },
  { name: "Income", data: months.map((m) => incomeTotalForMonth(year.value, m)) },
])

const options = computed(() => ({
  chart: {
    id: "bar-monthly",
    type: "bar",
    events: {
      dataPointSelection: (_: unknown, __: unknown, config: { dataPointIndex: number }) => {
        setQueryParam("month", config.dataPointIndex + 1)
      },
    },
  },
  theme: { mode: isDark.value ? "dark" : "light" },
  xaxis: { categories: months },
  colors,
  dataLabels: { enabled: false },
}))

async function getTransactions() {
  loading.value = true
  try {
    let url: string
    if (categoryId.value) url = `/categories/${categoryId.value}/transactions`
    else if (accountId.value) url = `/accounts/${accountId.value}/transactions`
    else url = "/transactions"

    const { data } = await axios.get<{ records: Transaction[] }>(url, {
      params: {
        from: new Date(`${year.value}/1/1`),
        to: new Date(`${year.value + 1}/1/1`),
      },
    })
    transactions.value = data.records
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(accountId, getTransactions)
watch(year, getTransactions)
onMounted(getTransactions)
</script>
