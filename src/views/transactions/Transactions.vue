<template>
  <div>
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
import TransactionsTable from "@/components/TransactionsTable.vue"
import TransactionsBarChart from "@/components/TransactionsBarChart.vue"
import ExpensesBreakdown from "@/components/ExpensesBreakdown.vue"
</script>
