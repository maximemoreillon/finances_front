<template>
  <v-card outlined>
    <v-card-title> Summary </v-card-title>
    <v-card-text>
      <v-row v-if="loading">
        <v-col>
          <v-progress-linear indeterminate />
        </v-col>
      </v-row>

      <v-row v-else align="center">
        <v-col>
          Total assets: {{ currency }} {{ parseFloat(total).toLocaleString() }}
        </v-col>
        <v-col cols="3">
          <v-select :items="currencies" v-model="currency" label="Currency" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TotalWealth",
  data() {
    return {
      loading: false,
      rates: null,
      currency: "JPY",
      accounts: [],
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.getExchangeRate()
      await this.getAccounts()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  watch: {
    currency() {
      this.getExchangeRate()
    },
  },
  methods: {
    async getExchangeRate() {
      const url = `/rate`
      const params = { currency: this.currency }
      const { data } = await this.axios.get(url, { params })
      this.rates = data.rates
    },
    async getAccounts() {
      const url = `/accounts`
      const { data } = await this.axios.get(url)
      this.accounts = data.accounts
    },
  },
  computed: {
    total() {
      return this.accounts.reduce((prev, account) => {
        const { currency, balance } = account
        prev += balance / this.rates[currency]
        return prev
      }, 0)
    },
    currencies() {
      return this.accounts.map((a) => a.currency)
    },
  },
}
</script>
