<template>
  <v-card
    :loading="loading"
    outlined
    :to="{ name: 'account', params: { accountId: account.id } }"
  >
    <v-card-title> {{ account.name }} </v-card-title>
    <v-card-subtitle v-if="balance">
      {{ currency }} {{ balance }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: "AccountPreview",
  props: {
    account: Object,
  },
  data() {
    return {
      balance: 0,
      currency: "",
      loading: false,
    }
  },
  mounted() {
    // this.get_balance()
  },
  methods: {
    get_balance() {
      this.loading = true

      const url = `/accounts/${this.account}/balance`
      const params = { start: "-1mo", last: "true" }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          if (!data.length) return

          const last_item = data[data.length - 1]

          this.balance = parseFloat(last_item._value).toLocaleString()
          this.currency = last_item.currency
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {},
}
</script>
