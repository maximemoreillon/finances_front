<template>
  <div>
    <template v-if="!loading && total">
      Total assets: {{ currency }} {{ parseFloat(total).toLocaleString() }}
    </template>
    <v-progress-circular indeterminate v-if="loading" />
  </div>
</template>

<script>
export default {
  name: "TotalWealth",
  data() {
    return {
      total: null,
      loading: false,
      rates: null,
      currency: "JPY",
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.getExchangeRate()
      await this.getTotal()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async getExchangeRate() {
      const url = `/rate`
      const params = { currency: "JPY" }
      const { data } = await this.axios.get(url, { params })
      this.rates = data.rates
    },
    async getTotal() {
      const url = `/accounts`
      const { data } = await this.axios.get(url)
      this.total = data.accounts.reduce((prev, account) => {
        const { currency, balance } = account
        prev += balance / this.rates[currency]
        return prev
      }, 0)
    },
  },
  computed: {},
}
</script>
