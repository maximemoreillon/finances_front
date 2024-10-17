<template>
  <v-dialog v-model="dialog" width="30rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Register balance </v-card-title>

      <v-form @submit.prevent="registerBalance">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text-field
                type="number"
                v-model.number="balance"
                label="Balance"
                :prefix="currency"
              />
            </v-col>
            <v-col cols="auto"> </v-col>
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
  name: "RegisterTransaction",
  props: {
    accountId: String,
    currency: String,
  },
  data() {
    return {
      dialog: false,
      registering: false,
      balance: 0,
    }
  },
  mounted() {},

  methods: {
    async registerBalance() {
      this.registering = true
      try {
        const url = `/accounts/${this.accountId}/balance/`
        const { data } = await this.axios.post(url, {
          balance: this.balance,
        })
        this.$emit("balanceRegistered", data)
        this.dialog = false
        this.categoryId = null
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
