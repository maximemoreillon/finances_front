<template>
  <div>
    <v-row>
      <v-col>
        <v-toolbar elevation="1" extended>
          <v-toolbar-title v-if="account">{{ account.name }}</v-toolbar-title>
          <v-progress-circular indeterminate v-else />

          <v-spacer />
          <v-btn @click="deleteAccount()" outlined color="#c00000">
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <template v-slot:extension>
            <v-row v-if="account">
              <v-col> Currency: {{ account.currency }} </v-col>
            </v-row>
          </template>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <AccountBalanceHistory :currency="account?.currency" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <AccountMonthlyExpensesTotal />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AccountExpenseBreakdown />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AccountTransactionsTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AccountBalanceHistory from "@/components/AccountBalanceHistory.vue"
import AccountTransactionsTable from "@/components/AccountTransactionsTable.vue"
import AccountMonthlyExpensesTotal from "@/components/TransactionsBarChart.vue"
import AccountExpenseBreakdown from "@/components/AccountExpenseBreakdown.vue"
import queryParamsUtils from "../mixins/queryParamsUtils"
export default {
  name: "Account",
  components: {
    AccountBalanceHistory,
    AccountTransactionsTable,
    AccountMonthlyExpensesTotal,
    AccountExpenseBreakdown,
  },
  mixins: [queryParamsUtils],
  data() {
    return {
      account: null,
      deleting: false,
      loading: false,
    }
  },
  watch: {
    accountId() {
      this.getAccountInfo()
    },
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
