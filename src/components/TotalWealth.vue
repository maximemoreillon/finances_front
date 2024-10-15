<!-- INFO: This is currently not used -->
<template>
  <v-card-subtitle>
    <template v-if="total">
      Total assets: {{ currency }} {{ parseFloat(total).toLocaleString() }}
    </template>
  </v-card-subtitle>
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
      await this.getExchangeRate()
      await this.getTotal()
    } catch (error) {
      console.error(error)
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
      const url = `/balance`
      const params = { start: "-1mo", last: "true" }
      const { data } = await this.axios.get(url, { params })
      this.total = data.reduce((prev, point) => {
        const { currency, _value } = point
        prev += _value / this.rates[currency]
        return prev
      }, 0)
    },
  },
  computed: {},
}
</script>
