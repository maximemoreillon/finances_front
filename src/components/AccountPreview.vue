<template>
  <v-card
    height="100%"
    :to="{ name: 'account', params: { accountId: account.id } }"
  >
    <v-card-title>{{ account.name }}</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col>Currency: {{ account.currency }}</v-col>
      </v-row>
      <v-row dense v-if="account.balance">
        <v-col>Balance: {{ Math.round(account.balance * 100) / 100 }}</v-col>
      </v-row>
      <v-row dense v-if="account.transaction_count">
        <v-col>Transactions: {{ account.transaction_count }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Account } from "@/types";

defineProps<{ account: Account }>();
</script>
