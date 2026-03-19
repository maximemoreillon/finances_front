<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Transactions</v-toolbar-title>
      <v-spacer />
      <TransactionRegisterDialog
        v-if="accountId"
        :accountId="accountId"
        @transactionRegistered="getTransactions"
      />
    </v-toolbar>

    <v-card-text>
      <v-row dense align="center">
        <v-col cols="auto">
          <YearSelect />
        </v-col>
        <v-col cols="auto">
          <MonthSelect />
        </v-col>
        <v-col cols="auto">
          <v-text-field
            label="Search"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-chip
            closable
            v-if="category"
            @click:close="setQueryParam('category', null)"
          >
            {{ categories.find((c) => String(c.id) === category)?.name }}
          </v-chip>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="transactions"
        :loading="loading"
        :search="search"
      >
        <template #item.description="{ item }">
          <router-link
            :to="{
              name: 'transaction',
              params: { transactionId: item.id },
            }"
          >
            {{ item.description }}
          </router-link>
        </template>

        <template #item.time="{ item }">
          {{ new Date(item.time).toLocaleString("ja-JP", toLocaleStringOptions) }}
        </template>

        <template #item.amount="{ item }">
          <span :class="item.amount < 0 ? 'text-red' : 'text-green'">
            {{ new Intl.NumberFormat().format(item.amount) }}
          </span>
        </template>

        <template #item.categories="{ item }">
          <v-chip
            v-for="cat of item.categories"
            :key="cat.id"
            class="mx-1"
            :to="{
              name: 'transaction_category',
              params: { categoryId: cat.id },
            }"
          >
            {{ cat.name }}
          </v-chip>
        </template>

        <template #item.account_id="{ item }">
          <router-link :to="{ name: 'account', params: { accountId: item.account_id } }">
            {{ accounts.find((a) => a.id === item.account_id)?.name }}
          </router-link>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import type { Account, Category, Transaction } from "@/types"
import axios from "@/axios"
import { useQueryParams } from "@/composables/useQueryParams"
import { useDateRange } from "@/composables/useDateRange"
import MonthSelect from "./MonthSelect.vue"
import YearSelect from "./YearSelect.vue"
import TransactionRegisterDialog from "./TransactionRegisterDialog.vue"

const route = useRoute()
const { year, month, category, setQueryParam } = useQueryParams()
const { start_date, end_date } = useDateRange()

const loading = ref(false)
const search = ref("")
const transactions = ref<Transaction[]>([])
const categories = ref<Category[]>([])
const accounts = ref<Account[]>([])

const toLocaleStringOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}

const accountId = computed(() => route.params.accountId as string | undefined)
const categoryId = computed(() => route.params.categoryId as string | undefined)

const headers = computed(() => {
  const h = [
    { title: "Date", key: "time" },
    { title: "Description", key: "description" },
    { title: "Amount", key: "amount" },
    { title: "Categories", key: "categories", sortable: false },
  ]
  if (!categoryId.value && !accountId.value) {
    h.push({ title: "Account", key: "account_id" })
  }
  return h
})

async function getTransactionCategories() {
  const { data } = await axios.get<{ categories: Category[] }>("/categories")
  categories.value = data.categories
}

async function getAccounts() {
  const { data } = await axios.get<{ accounts: Account[] }>("/accounts")
  accounts.value = data.accounts
}

async function getTransactions() {
  loading.value = true
  try {
    let url: string
    if (accountId.value) url = `/accounts/${accountId.value}/transactions`
    else if (categoryId.value) url = `/categories/${categoryId.value}/transactions`
    else url = "/transactions"

    const { data } = await axios.get<{ records: Transaction[] }>(url, {
      params: { from: start_date.value, to: end_date.value, category: category.value },
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
watch(category, getTransactions)

onMounted(() => {
  getTransactionCategories()
  getAccounts()
  getTransactions()
})
</script>
