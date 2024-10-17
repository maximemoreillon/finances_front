<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title v-if="account">
        {{ account.name }} ({{ account.currency }})
      </v-toolbar-title>
      <v-progress-circular indeterminate v-else />
      <v-spacer />
      <v-btn @click="deleteAccount()" icon color="#c00000">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-row>
        <v-col>
          <AccountBalanceHistory :currency="account?.currency" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <AccountMonthlyExpensesTotal
            @yearSelection="year = $event"
            @monthSelection="month = $event"
            :year="year"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <AccountExpenseBreakdown
            @yearSelection="year = $event"
            @monthSelection="month = $event"
            @categorySelected="category = $event"
            :month="month"
            :year="year"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <AccountTransactionsTable
            :month="month"
            :year="year"
            :category="category"
            @categoryChanged="category = $event"
          />
        </v-col>
      </v-row>
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
      // Those chould be query params
      month: new Date().getMonth() + 1,
      year: new Date().getYear() + 1900,
      category: undefined,
      account: null,
      deleting: false,
      loading: false,
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
    async deleteAccount() {
      if (!confirm(`Delete account?`)) return
      this.deleting = false
      try {
        await this.axios.delete(`/accounts/${this.accountId}`)
        this.$router.push("/accounts")
      } catch (error) {
        console.error(error)
      } finally {
        this.deleting = false
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
