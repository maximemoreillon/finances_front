<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>{{ account || "Balance" }}</v-card-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn :to="{ name: 'register_balance' }"> Register new </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />

    <v-card-text>
      <v-card outlined>
        <v-card-title class="justify-center">
          Current balance: {{ currency }}
          {{ parseFloat(current_balance).toLocaleString() }}
        </v-card-title>
        <v-card-subtitle class="text-center">
          (Last retrieved {{ last_retrieved_formatted }})
        </v-card-subtitle>
      </v-card>
    </v-card-text>

    <v-card-text>
      <v-card outlined>
        <v-toolbar flat>
          <v-row align="baseline" dense>
            <v-col cols="auto">
              <v-btn
                id="one_month"
                :dark="selection === 'one_month'"
                @click="updateData('one_month')"
              >
                1M
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                id="six_months"
                @click="updateData('six_months')"
                :dark="selection === 'six_months'"
              >
                6M
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                id="one_year"
                @click="updateData('one_year')"
                :dark="selection === 'one_year'"
              >
                1Y
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                id="all"
                @click="updateData('all')"
                :dark="selection === 'all'"
              >
                ALL
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>

        <v-card-text>
          <apexchart
            ref="chart"
            width="100%"
            :options="options"
            :series="series"
          />
        </v-card-text>
      </v-card>
    </v-card-text>

    <!-- TODO: Replace by more appripriate div with proper styling -->
    <p class="zoom_buttons_wrapper"></p>
  </v-card>
</template>

<script>
export default {
  name: "BalanceHistory",
  components: {},
  data() {
    return {
      loading: false,
      current_balance: "loading",
      currency: null,
      last_retrieved: null,
      selection: "all",

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
      series: [
        {
          data: [],
        },
      ],
    }
  },
  beforeRouteUpdate(_to, _from, next) {
    next()
    this.$nextTick().then(() => {
      this.get_balance_history()
    })
  },
  mounted() {
    this.get_balance_history()
  },
  methods: {
    get_balance_history() {
      // Loading history
      this.loading = true

      const url = `/accounts/${this.account}/balance/history`

      this.axios
        .get(url)
        .then((response) => {
          const data_length = response.data.length
          const last_item = response.data[data_length - 1]

          this.current_balance = last_item.balance
          this.currency = last_item.currency
          this.last_retrieved = last_item.time

          const chart_data = response.data.map((entry) => {
            return [
              new Date(entry.time).getTime(),
              // not super clean but easy
              Math.round(entry.balance),
            ]
          })

          this.series = [{ name: "balance", data: chart_data }]
        })
        .catch((error) => {
          console.error(error)
          alert("`Failed to load data`")
        })
        .finally(() => {
          this.loading = false
        })
    },

    updateData(timeline) {
      this.selection = timeline

      switch (timeline) {
        case "one_month":
          this.$refs.chart.zoomX(
            new Date().setMonth(new Date().getMonth() - 1),
            new Date()
          )
          break
        case "six_months":
          this.$refs.chart.zoomX(
            new Date().setMonth(new Date().getMonth() - 6),
            new Date()
          )
          break
        case "one_year":
          this.$refs.chart.zoomX(
            new Date().setMonth(new Date().getMonth() - 12),
            new Date()
          )
          break
        case "all":
          this.$refs.chart.zoomX(this.series[0].data[0][0], new Date())
          break
        default:
      }
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

<style scoped>
.current_balance_container {
  text-align: center;
  font-size: 120%;
}

.last_retrieved {
  margin-top: 0.25em;
  font-size: 80%;
  text-align: center;
}

.current_weight_wrapper {
  text-align: center;
  font-size: 150%;
}

.chart_wrapper {
  height: 60vh;
}

.zoom_buttons_wrapper button:not(:last-child) {
  margin-right: 0.5em;
}

.zoom_buttons_wrapper button.active {
  color: white;
  background-color: #c00000;
  border-color: #c00000;
}
</style>
