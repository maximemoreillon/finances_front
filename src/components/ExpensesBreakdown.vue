<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Transactions breakdown</v-toolbar-title>
      <v-spacer />
      <v-btn :to="{ name: 'transaction_categories' }" variant="outlined">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-row align="baseline">
        <v-col cols="auto">
          <YearSelect />
        </v-col>
        <v-col cols="auto">
          <MonthSelect />
        </v-col>
        <v-spacer />
        <v-col cols="auto">{{ transactions.length }} transactions</v-col>
      </v-row>
      <v-row v-if="transactions.length">
        <v-col cols="12" md="6">
          <h3>Income</h3>
          <BreakdownChart :transactions="income" />
        </v-col>
        <v-col cols="12" md="6">
          <h3>Expenses</h3>
          <BreakdownChart :transactions="expenses" />
        </v-col>
      </v-row>
      <div v-else-if="!loading" class="text-center">No Data available</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import type { Transaction } from "@/types"
import axios from "@/axios"
import { useQueryParams } from "@/composables/useQueryParams"
import { useDateRange } from "@/composables/useDateRange"
import YearSelect from "./YearSelect.vue"
import MonthSelect from "./MonthSelect.vue"
import BreakdownChart from "./BreakdownChart.vue"

const route = useRoute()
const { year, month } = useQueryParams()
const { start_date, end_date } = useDateRange()

const loading = ref(false)
const transactions = ref<Transaction[]>([])

const accountId = computed(() => route.params.accountId as string | undefined)

const expenses = computed(() => transactions.value.filter((t) => t.amount < 0))
const income = computed(() => transactions.value.filter((t) => t.amount > 0))

async function getTransactions() {
  loading.value = true
  try {
    const url = accountId.value ? `/accounts/${accountId.value}/transactions` : "/transactions"
    const { data } = await axios.get<{ records: Transaction[] }>(url, {
      params: { from: start_date.value, to: end_date.value },
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
watch(month, getTransactions)
onMounted(getTransactions)
</script>
