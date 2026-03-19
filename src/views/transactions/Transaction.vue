<template>
  <v-card :loading="loading" max-width="40rem" class="mx-auto">
    <v-toolbar flat>
      <v-btn icon @click="router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Transaction</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="updateTransaction" :loading="saving">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn color="#c00000" icon @click="deleteTransaction" :loading="deleting">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text v-if="transaction">
      <v-row align="center">
        <v-col>
          <v-text-field label="Description" v-model="transaction.description" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Amount"
            type="number"
            v-model.number="transaction.amount"
            :prefix="transaction.currency"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Date"
            :model-value="new Date(transaction.time).toLocaleDateString()"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto">
          Account:
          <router-link
            :to="{
              name: 'account',
              params: { accountId: transaction.account_id },
            }"
          >
            {{
              accounts.find((a) => a.id === transaction!.account_id)?.name ||
              transaction.account_id
            }}
          </router-link>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col>
          <v-card variant="outlined">
            <v-toolbar flat>
              <v-toolbar-title>Categories</v-toolbar-title>
              <v-spacer />
              <v-btn :to="{ name: 'transaction_categories' }" variant="outlined" class="mr-2">
                Manage
              </v-btn>
              <AddCategoryDialog
                :transactionId="String(transactionId)"
                :accountId="String(transaction.account_id)"
                @categoryAdded="getTransaction"
              />
            </v-toolbar>
            <v-card-text>
              <v-chip
                v-for="category of transaction.categories"
                :key="category.id"
                class="mb-2 mr-2"
                closable
                :to="{
                  name: 'transaction_category',
                  params: { categoryId: category.id },
                }"
                @click:close="removeCategory(category.id)"
              >
                {{ category.name }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { Account, Transaction } from "@/types"
import axios from "@/axios"
import AddCategoryDialog from "@/components/AddCategoryDialog.vue"

const route = useRoute()
const router = useRouter()

const transaction = ref<Transaction | null>(null)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const accounts = ref<Account[]>([])

const transactionId = computed(() => route.params.transactionId as string)

async function getAccounts() {
  const { data } = await axios.get<{ accounts: Account[] }>("/accounts")
  accounts.value = data.accounts
}

async function getTransaction() {
  transaction.value = null
  loading.value = true
  try {
    const { data } = await axios.get<Transaction>(`/transactions/${transactionId.value}`)
    transaction.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function updateTransaction() {
  saving.value = true
  try {
    await axios.put(`/transactions/${transactionId.value}`, transaction.value)
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}

async function deleteTransaction() {
  if (!confirm("Delete transaction? This action is irreversible")) return
  deleting.value = true
  try {
    await axios.delete(`/transactions/${transactionId.value}`)
    router.go(-1)
  } catch (error) {
    console.error(error)
  } finally {
    deleting.value = false
  }
}

async function removeCategory(categoryId: number) {
  if (!confirm("Remove category?")) return
  await axios.delete(`/transactions/${transactionId.value}/categories/${categoryId}`)
  if (!transaction.value) return
  const idx = transaction.value.categories.findIndex((c) => c.id === categoryId)
  if (idx > -1) transaction.value.categories.splice(idx, 1)
}

onMounted(() => {
  getTransaction()
  getAccounts()
})
</script>
