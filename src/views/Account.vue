<template>
  <v-card>

    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>{{ account.toUpperCase() }}</v-card-title>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <AccountBalanceHistory />
    </v-card-text>
    <v-card-text>
      <AccountTransactionsTable />
    </v-card-text>
    <v-card-text>
      <AccountMonthlyExpensesTotal
        @yearSelection="year = $event"
        @monthSelection="month = $event"
        :year="year"/>
    </v-card-text>
    <v-card-text>
      <AccountExpenseBreakdown
        @yearSelection="year = $event"
        @monthSelection="month = $event"
        :month="month"
        :year="year"/>
    </v-card-text>

  </v-card>
</template>

<script>
import AccountBalanceHistory from '@/components/AccountBalanceHistory.vue'
import AccountTransactionsTable from '@/components/AccountTransactionsTable.vue'
import AccountMonthlyExpensesTotal from '@/components/AccountMonthlyExpensesTotal.vue'
import AccountExpenseBreakdown from '@/components/AccountExpenseBreakdown.vue'

export default {
  name: 'Account',
  components: {
    AccountBalanceHistory,
    AccountTransactionsTable,
    AccountMonthlyExpensesTotal,
    AccountExpenseBreakdown
  },
  data(){
    return {
      month: new Date().getMonth() + 1,
      year: new Date().getYear() + 1900,
    }
  },
  watch: {
    account(){

    }
  },

  mounted(){
  },
  methods: {



  },
  computed: {
    account(){
      return this.$route.params.account
    }
  }
}
</script>

<style scoped>


</style>
