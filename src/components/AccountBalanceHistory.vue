<template>
  <v-card :loading="loading" outlined>
    <v-card-text v-if="loading || series.length">
      <v-row aling="center">
        <v-col class="text-h6"> Balance </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn small :to="{ name: 'register_balance', params: { account } }">
            Register
          </v-btn>
        </v-col>
      </v-row>

      <v-row align="center" dense>
        <v-col cols="auto">
          <v-row dense>
            <v-col
              >{{ currency }}
              {{ parseFloat(current_balance).toLocaleString() }}</v-col
            >
          </v-row>
          <v-row dense>
            <v-col> (As of {{ last_retrieved_formatted }}) </v-col>
          </v-row>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            v-for="button in chartControlButtons"
            :key="button.value"
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
      Account {{ account }} does not have a balance history
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AccountBalanceHistory",
  components: {},
  data() {
    return {
      loading: false,
      current_balance: "loading",
      currency: null,
      last_retrieved: null,
      rangeStart: "-6mo",

      chartControlButtons: [
        { text: "1M", value: "-1mo" },
        { text: "6M", value: "-6mo" },
        { text: "1Y", value: "-1y" },
        { text: "ALL", value: 0 },
      ],

      options: {
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
      },
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

      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/balance`
      const params = { start: this.rangeStart }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          if (!data.length) return

          const last_item = data[data.length - 1]

          this.current_balance = last_item._value
          this.currency = last_item.currency
          this.last_retrieved = last_item._time

          const chart_data = data.map(({ _value, _time }) => [
            new Date(_time).getTime(),
            Math.round(_value),
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
    account() {
      return this.$route.params.account
    },
  },
}
</script>
