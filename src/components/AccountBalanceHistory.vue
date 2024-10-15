: ["#00c000", "#c00000"]
<template>
  <v-card :loading="loading" outlined>
    <v-card-text v-if="loading || series.length">
      <v-row aling="center">
        <v-col class="text-h6"> Balance </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            color="primary"
            :to="{
              name: 'register_balance',
              params: { accountId: accountId },
              query: { currency },
            }"
          >
            Register
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center" dense>
        <v-col cols="auto">
          <v-row dense>
            <v-col>
              {{ currency }}
              {{ parseFloat(current_balance).toLocaleString() }}
            </v-col>
          </v-row>
          <v-row dense>
            <v-col> (As of {{ last_retrieved_formatted }}) </v-col>
          </v-row>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            v-for="(button, index) in chartControlButtons"
            :key="index"
            class="mr-2"
            x-small
            :color="rangeStart === button.value ? 'primary' : undefined"
            @click="rangeStart = button.value"
          >
            {{ button.text }}
          </v-btn>
        </v-col>
      </v-row>

      <apexchart
        ref="chart"
        width="100%"
        height="300px"
        :options="options"
        :series="series"
      />
    </v-card-text>

    <v-card-text v-if="!loading && !series.length">
      This account does not have a balance history
    </v-card-text>
  </v-card>
</template>

<script>
const chartControlButtons = [
  {
    text: "1M",
    value: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  },
  {
    text: "6M",
    value: new Date(new Date().setMonth(new Date().getMonth() - 6)),
  },
  {
    text: "1Y",
    value: new Date(new Date().setMonth(new Date().getMonth() - 12)),
  },
  {
    text: "2Y",
    value: new Date(new Date().setMonth(new Date().getMonth() - 24)),
  },
  { text: "ALL", value: new Date(0) },
]

export default {
  name: "AccountBalanceHistory",
  components: {},
  data() {
    return {
      loading: false,
      current_balance: 0,
      currency: null,
      last_retrieved: null,
      rangeStart: chartControlButtons[0].value,
      chartControlButtons,
      series: [],
    }
  },
  watch: {
    account() {
      this.get_balance_history()
    },
    rangeStart() {
      this.get_balance_history()
    },
  },
  mounted() {
    this.get_balance_history()
  },
  methods: {
    get_balance_history() {
      // Loading history
      this.loading = true

      this.series = []

      const url = `/accounts/${this.accountId}/balance`
      const params = { from: this.rangeStart }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          const { records } = data
          if (!records.length) return

          const last_item = records.at(-1)

          this.current_balance = last_item.balance
          this.currency = last_item.currency
          this.last_retrieved = last_item.time

          const chart_data = records.map(({ balance, time }) => [
            new Date(time).getTime(),
            Math.round(balance),
          ])

          this.series = [{ name: "balance", data: chart_data }]
        })
        .catch((error) => {
          console.error(error)
          alert(`Failed to load data`)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {
    last_retrieved_formatted() {
      const date = new Date(this.last_retrieved)
      const year = date.getYear() + 1900
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}/${month}/${day}`
    },
    accountId() {
      return this.$route.params.accountId
    },
    dark() {
      return this.$vuetify.theme.dark
    },
    options() {
      return {
        theme: {
          mode: this.dark ? "dark" : "light",
        },
        background: "#c00",

        chart: {
          id: "area-datetime",
          type: "area",
          zoom: {
            autoScaleYaxis: true,
          },
        },
        stroke: {
          curve: "straight",
        },

        colors: ["#c00000"],

        xaxis: {
          type: "datetime",
        },
        dataLabels: {
          enabled: false,
        },
      }
    },
  },
}
</script>
