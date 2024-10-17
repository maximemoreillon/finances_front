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
          :category="category"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AccountTransactionsTable
          :month="month"
          @monthSelection="month = $event"
          :year="year"
          @yearSelection="year = $event"
          :category="category"
          @categoryChanged="category = $event"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AccountBalanceHistory from "@/components/AccountBalanceHistory.vue"
import AccountTransactionsTable from "@/components/AccountTransactionsTable.vue"
import AccountMonthlyExpensesTotal from "@/components/AccountMonthlyExpensesTotal.vue"
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
      // Those chould be query params
      month: this.$route.query.month ? Number(this.$route.query.month) : 0, // 0 Means all
      year: this.$route.query.year
        ? Number(this.$route.query.year)
        : new Date().getFullYear(),
      category: this.$route.query.category
        ? Number(this.$route.query.category)
        : 0,
      account: null,
      deleting: false,
      loading: false,
    }
  },
  watch: {
    accountId() {
      this.getAccountInfo()
    },
    year(newVal) {
      this.setQueryParam("year", newVal)
    },
    month(newVal) {
      this.setQueryParam("month", newVal)
    },
    category(newVal) {
      this.setQueryParam("category", newVal)
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
