<template>
  <div>
    <template v-if="total">
      <v-card-title> Total wealth </v-card-title>
      <v-card-text>
        {{ total }}
      </v-card-text>
    </template>
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
      // const currency = "JPY"
      const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/jpy.json`
      const { data } = await this.axios.get(url)
      this.rates = data.rates
    },
    async getTotal() {
      const url = `/balance`
      const params = { start: "-1mo", last: "true" }
      const { data } = await this.axios.get(url, { params })
      this.total = data.reduce((prev, point) => {
        const { currency, _value } = point
        prev += this.rates[currency] * _value
      }, 0)

      console.log(this.total)
    },
  },
  computed: {},
}
</script>
