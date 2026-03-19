<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Balance</v-toolbar-title>
      <v-spacer />
      <BalanceRegisterDialog
        :accountId="accountId"
        :currency="currency"
        @balanceRegistered="getBalanceHistory"
      />
    </v-toolbar>

    <v-card-text>
      <v-row align="center" dense>
        <v-col cols="auto">
          <template v-if="currentBalance">
            <v-row dense>
              <v-col
                >{{ currency }}
                {{ parseFloat(String(currentBalance)).toLocaleString() }}</v-col
              >
            </v-row>
            <v-row dense>
              <v-col class="text-caption"
                >Last retrieved on {{ lastRetrievedFormatted }}</v-col
              >
            </v-row>
          </template>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            v-for="(button, index) in graphTimeRanges"
            :key="index"
            class="mr-2"
            size="x-small"
            variant="outlined"
            :color="rangeStart === button.value ? 'primary' : undefined"
            @click="rangeStart = button.value"
          >
            {{ button.text }}
          </v-btn>
        </v-col>
      </v-row>
      <apexchart
        v-if="series.length"
        width="100%"
        height="300px"
        :options="options"
        :series="series"
      />
      <div v-else-if="!loading" class="text-center">No data available</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTheme } from "vuetify";
import axios from "@/axios";
import { graphTimeRanges } from "@/constants";
import BalanceRegisterDialog from "./BalanceRegisterDialog.vue";

defineProps<{ currency?: string }>();

const route = useRoute();
const theme = useTheme();

const loading = ref(false);
const currentBalance = ref(0);
const lastRetrieved = ref<string | null>(null);
const rangeStart = ref(graphTimeRanges[2].value);
const series = ref<{ name: string; data: [number, number][] }[]>([]);

const accountId = computed(() => route.params.accountId as string);
const isDark = computed(() => theme.global.current.value.dark);

const lastRetrievedFormatted = computed(() => {
  if (!lastRetrieved.value) return "";
  const date = new Date(lastRetrieved.value);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
});

const options = computed(() => ({
  theme: { mode: isDark.value ? "dark" : "light" },
  chart: {
    id: "area-datetime",
    type: "area",
    zoom: { autoScaleYaxis: true },
  },
  stroke: { curve: "straight" },
  colors: ["#c00000"],
  xaxis: { type: "datetime" },
  dataLabels: { enabled: false },
}));

async function getBalanceHistory() {
  loading.value = true;
  try {
    const { data } = await axios.get<{
      records: { balance: number; time: string }[];
    }>(`/accounts/${accountId.value}/balance`, {
      params: { from: rangeStart.value },
    });
    const { records } = data;
    if (!records.length) {
      series.value = [];
      currentBalance.value = 0;
      return;
    }
    const last = records[0];
    currentBalance.value = last.balance;
    lastRetrieved.value = last.time;
    series.value = [
      {
        name: "balance",
        data: records.map(({ balance, time }) => [
          new Date(time).getTime(),
          Math.round(balance),
        ]),
      },
    ];
  } catch (error) {
    console.error(error);
    alert("Failed to load data");
  } finally {
    loading.value = false;
  }
}

watch(accountId, getBalanceHistory);
watch(rangeStart, getBalanceHistory);
onMounted(getBalanceHistory);
</script>
