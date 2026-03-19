<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Accounts</v-toolbar-title>
      <v-spacer />
      <CreateAccountDialog />
    </v-toolbar>
    <v-card-text>
      <h3>Summary</h3>
      <TotalWealth />
      <v-row>
        <v-col cols="12" md="6" v-for="account in accounts" :key="account.id">
          <AccountPreview :account="account" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Account } from "@/types"
import axios from "@/axios"
import AccountPreview from "@/components/AccountPreview.vue"
import TotalWealth from "@/components/TotalWealth.vue"
import CreateAccountDialog from "@/components/CreateAccountDialog.vue"

const loading = ref(false)
const accounts = ref<Account[]>([])

async function getAccounts() {
  loading.value = true
  try {
    const { data } = await axios.get<{ accounts: Account[] }>("/accounts")
    accounts.value = data.accounts
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(getAccounts)
</script>
