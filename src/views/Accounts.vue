<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar>
          <v-toolbar-title> Accounts </v-toolbar-title>

          <template v-slot:append>
            <CreateAccountDialog />
          </template>
        </v-toolbar>
        <v-card-text>
          <TotalWealth />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="loading" justify="center">
    <v-col cols="auto">
      <v-progress-circular indeterminate size="72" />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" md="3" v-for="account in accounts" :key="account.id">
      <AccountPreview :account="account" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Account } from "@/types";
import axios from "@/axios";
import AccountPreview from "@/components/AccountPreview.vue";
import TotalWealth from "@/components/TotalWealth.vue";
import CreateAccountDialog from "@/components/CreateAccountDialog.vue";

const loading = ref(false);
const accounts = ref<Account[]>([]);

async function getAccounts() {
  loading.value = true;
  try {
    const { data } = await axios.get<{ accounts: Account[] }>("/accounts");
    accounts.value = data.accounts;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(getAccounts);
</script>
