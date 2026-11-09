<template>
  <div>
    <v-row>
      <v-col>
        <v-card :loading="loading">
          <template #prepend>
            <AccountIcon :icon-url="account?.icon_url" />
          </template>

          <template #title>
            <span v-if="account">{{ account.name }}</span>
            <v-progress-circular indeterminate size="24" v-else />
          </template>

          <template #subtitle v-if="account">{{ account.currency }}</template>

          <template #append>
            <AccountEditDialog
              v-if="account"
              :account="account"
              @updated="account = $event"
            />
            <v-btn @click="deleteAccount" :loading="deleting" variant="outlined">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <AccountBalanceHistory :currency="account?.currency" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsBarChart />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ExpensesBreakdown />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsTable />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Account } from "@/types";
import axios from "@/axios";
import AccountBalanceHistory from "@/components/AccountBalanceHistory.vue";
import TransactionsTable from "@/components/TransactionsTable.vue";
import TransactionsBarChart from "@/components/TransactionsBarChart.vue";
import ExpensesBreakdown from "@/components/ExpensesBreakdown.vue";
import AccountIcon from "@/components/AccountIcon.vue";
import AccountEditDialog from "@/components/AccountEditDialog.vue";

const route = useRoute();
const router = useRouter();

const account = ref<Account | null>(null);
const loading = ref(false);
const deleting = ref(false);

const accountId = computed(() => route.params.accountId as string);

async function getAccountInfo() {
  loading.value = true;
  try {
    const { data } = await axios.get<Account>(`/accounts/${accountId.value}`);
    account.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function deleteAccount() {
  if (!confirm("Delete account?")) return;
  deleting.value = true;
  try {
    await axios.delete(`/accounts/${accountId.value}`);
    router.push("/accounts");
  } catch (error) {
    console.error(error);
  } finally {
    deleting.value = false;
  }
}

watch(accountId, getAccountInfo);
onMounted(getAccountInfo);
</script>
