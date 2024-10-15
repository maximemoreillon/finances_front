<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>
        {{ account ? account.name : "Account" }} ({{
          account ? account.currency : "loading"
        }})
      </v-toolbar-title>
    </v-toolbar>

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
        :year="year"
      />
    </v-card-text>
    <v-card-text>
      <AccountExpenseBreakdown
        @yearSelection="year = $event"
        @monthSelection="month = $event"
        :month="month"
        :year="year"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import AccountBalanceHistory from "@/components/AccountBalanceHistory.vue"
import AccountTransactionsTable from "@/components/AccountTransactionsTable.vue"
import AccountMonthlyExpensesTotal from "@/components/AccountMonthlyExpensesTotal.vue"
import AccountExpenseBreakdown from "@/components/AccountExpenseBreakdown.vue"

export default {
  name: "Account",
  components: {
    AccountBalanceHistory,
    AccountTransactionsTable,
    AccountMonthlyExpensesTotal,
    AccountExpenseBreakdown,
  },
  data() {
    return {
      month: new Date().getMonth() + 1,
      year: new Date().getYear() + 1900,
      account: null,
    }
  },
  watch: {
    accountId() {},
  },

  mounted() {
    this.getAccountInfo()
  },
  methods: {
    async getAccountInfo() {
      this.loading = false
      try {
        const { data } = await this.axios.get(`/accounts/${this.accountId}`)
        this.account = data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
  computed: {
    accountId() {
      return this.$route.params.accountId
    },
  },
}
</script>

<style scoped></style>
