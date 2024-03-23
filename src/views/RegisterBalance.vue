<template>
  <v-card max-width="30em" class="mx-auto">
    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          <v-btn icon exact :to="{ name: 'account', params: { account } }">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-toolbar-title> Register balance </v-toolbar-title>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-form @submit.prevent="submit()">
        <v-row>
          <v-col cols="12">
            <v-select
              width="100%"
              :items="currencies"
              v-model="currency"
              label="Currency"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              width="100%"
              type="number"
              v-model.number="balance"
              label="Balance"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn type="submit" :loading="registering"> Register </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ViewTransaction",

  data() {
    return {
      currencies: ["JPY", "USD", "CHF", "EUR"],
      currency: this.$route.query.currency || "",
      balance: 0,
      registering: false,
    }
  },
  methods: {
    submit() {
      this.registering = true
      const body = {
        account: this.account,
        currency: this.currency,
        balance: this.balance,
      }
      this.axios
        .post(`/balance`, body)
        .then(() => {
          this.$router.push({
            name: "account",
            params: { account: this.account },
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.registering = false
        })
    },
  },
  computed: {
    account() {
      return this.$route.params.account
    },
  },
}
</script>

<style scoped>
label {
  margin-right: 0.5em;
}
</style>
