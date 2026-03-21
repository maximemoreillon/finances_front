<template>
  <v-app>
    <v-app-bar color="#333333">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Finances</v-app-bar-title>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Accounts"
          :to="{ name: 'accounts' }"
        />
        <v-list-item
          prepend-icon="mdi-swap-horizontal"
          title="Transactions"
          :to="{ name: 'transactions' }"
        />
        <v-list-item
          prepend-icon="mdi-shape"
          title="Transaction categories"
          :to="{ name: 'transaction_categories' }"
        />
        <v-list-item
          prepend-icon="mdi-information-outline"
          title="About"
          :to="{ name: 'about' }"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const drawer = ref(true);
const theme = useTheme();
const dark = computed(() => theme.global.current.value.dark);

theme.global.name.value = localStorage.getItem("theme") ?? "light";

function toggleTheme() {
  const next = dark.value ? "light" : "dark";
  theme.global.name.value = next;
  localStorage.setItem("theme", next);
}
</script>

<style>
.apexcharts-toolbar {
  z-index: 0 !important;
}
.apexcharts-svg {
  background: none !important;
}
.apexcharts-zoom-icon.apexcharts-selected svg {
  fill: #c00000 !important;
}
.apexcharts-pan-icon.apexcharts-selected svg {
  stroke: #c00000 !important;
}
</style>
