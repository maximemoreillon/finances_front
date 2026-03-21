<template>
  <v-row v-if="loading">
    <v-col>
      <v-progress-linear indeterminate />
    </v-col>
  </v-row>
  <v-row align="center" v-else>
    <v-col cols="auto">
      Total assets: {{ parseFloat(String(total)).toLocaleString() }}
    </v-col>
    <v-col cols="auto">
      <v-select variant="plain" :items="currencies" v-model="currency" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Account } from "@/types";
import axios from "@/axios";

const loading = ref(false);
const rates = ref<Record<string, number> | null>(null);
const currency = ref("JPY");
const accounts = ref<Account[]>([]);

const total = computed(() => {
  if (!rates.value) return 0;
  return accounts.value.reduce((prev, account) => {
    prev += account.balance / rates.value![account.currency];
    return prev;
  }, 0);
});

const currencies = computed(() => [
  ...new Set(accounts.value.map((a) => a.currency)),
]);

async function getExchangeRate() {
  const { data } = await axios.get<{ rates: Record<string, number> }>("/rate", {
    params: { currency: currency.value },
  });
  rates.value = data.rates;
}

async function getAccounts() {
  const { data } = await axios.get<{ accounts: Account[] }>("/accounts");
  accounts.value = data.accounts;
}

watch(currency, getExchangeRate);

onMounted(async () => {
  loading.value = true;
  try {
    await getExchangeRate();
    await getAccounts();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
