<template>
  <div>
    <v-card v-if="total">
      <v-card-title> Total wealth </v-card-title>
      <v-card-text>
        {{ currency }} {{ parseFloat(total).toLocaleString() }}
      </v-card-text>
    </v-card>
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
