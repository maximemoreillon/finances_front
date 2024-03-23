<template>
  <AppTemplate @user="get_user($event)" :options="options">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item :to="{ name: 'accounts' }">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group :value="false" no-action prepend-icon="mdi-chart-line">
          <template v-slot:activator>
            <v-list-item-title>Accounts</v-list-item-title>
          </template>

          <v-list-item
            v-for="(account, account_index) in accounts"
            :key="`account_${account_index}`"
            :to="{ name: 'account', params: { account } }"
            exact
          >
            <v-list-item-icon>
              <v-icon>mdi-chart-line</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ account.toUpperCase() }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item :to="{ name: 'about' }">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </AppTemplate>
</template>

<script>
import AppTemplate from "@moreillon/vue_application_template_vuetify"
const { VUE_APP_LOGIN_URL, VUE_APP_IDENTIFICATION_URL } = process.env
export default {
  name: "App",

  components: {
    AppTemplate,
  },

  data: () => ({
    accounts: [],
    loading: false,

    options: {
      title: "Finances",
      login_url: VUE_APP_LOGIN_URL,
      identification_url: VUE_APP_IDENTIFICATION_URL,
    },
  }),

  methods: {
    get_user(user) {
      if (!user) return
      this.get_accounts()
    },
    get_accounts() {
      this.loading = true
      this.axios
        .get(`/accounts`)
        .then(({ data }) => {
          this.accounts = data
        })
        .catch((error) => {
          if (error.response) console.log(error.response.data)
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
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
