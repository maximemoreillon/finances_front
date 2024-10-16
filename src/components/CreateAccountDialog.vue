<template>
  <v-dialog v-model="dialog" width="50rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon left>mdi-plus</v-icon>
        <span>New</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Create account </v-card-title>

      <v-form @submit.prevent="createCategory">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text-field v-model="newAccount.name" label="Account name" />
            </v-col>
            <v-col>
              <v-text-field v-model="newAccount.currency" label="Currency" />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" text> cancel </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="registering" color="primary">
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateAccountDialog",
  props: {
    accountId: String,
  },
  data() {
    return {
      dialog: false,
      registering: false,
      newAccount: {
        name: "",
        currency: "JPY",
      },
    }
  },
  mounted() {},

  methods: {
    async createCategory() {
      this.registering = true
      try {
        const url = `/accounts`
        const { data } = await this.axios.post(url, {
          ...this.newAccount,
        })
        this.$router.push({
          name: "account",
          params: { accountId: data.id },
        })
      } catch (error) {
        console.error(error)
        alert("Error")
      } finally {
        this.registering = false
      }
    },
  },
  computed: {},
}
</script>
