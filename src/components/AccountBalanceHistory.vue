<template>
  <v-card :loading="loading" flat>
    <v-toolbar flat extended>
      <v-toolbar-title>Balance</v-toolbar-title>
      <v-spacer />
      <BalanceRegisterDialog
        :accountId="String(accountId)"
        @balanceRegistered="get_balance_history()"
        :currecy="currency"
      />

      <template v-slot:extension>
        <v-row align="center" dense>
          <v-col cols="auto">
            <template v-if="current_balance">
              <v-row dense>
                <v-col>
                  {{ currency }}
                  {{ parseFloat(current_balance).toLocaleString() }}
                </v-col>
              </v-row>
              <v-row dense>
                <v-col> (As of {{ last_retrieved_formatted }}) </v-col>
              </v-row>
            </template>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              v-for="(button, index) in graphTimeRanges"
              :key="index"
              class="mr-2"
              x-small
              outlined
              :color="rangeStart === button.value ? 'primary' : undefined"
              @click="rangeStart = button.value"
            >
              {{ button.text }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-toolbar>

    <v-card-text v-if="series.length">
      <apexchart
        ref="chart"
        width="100%"
        height="300px"
        :options="options"
        :series="series"
      />
    </v-card-text>

    <v-card-text v-else-if="!loading" class="text-center">
      No data available
    </v-card-text>
  </v-card>
</template>

<script>
import BalanceRegisterDialog from "./BalanceRegisterDialog.vue"
import { graphTimeRanges } from "../constants"
export default {
  name: "AccountBalanceHistory",
  components: {
    BalanceRegisterDialog,
  },
  props: {
    currency: String,
  },
  data() {
    return {
      loading: false,
      current_balance: 0,
      last_retrieved: null,
      rangeStart: graphTimeRanges[2].value,
      graphTimeRanges,
      series: [],
    }
  },
  watch: {
    accountId() {
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
      this.loading = true

      const url = `/accounts/${this.accountId}/balance`
      const params = { from: this.rangeStart }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          const { records } = data
          if (!records.length) {
            this.series = []
            this.current_balance = 0
            return
          }

          const last_item = records.at(0)

          this.current_balance = last_item.balance
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
      const year = date.getFullYear()
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
