<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Register transaction </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="registerTransaction">
          <v-row>
            <v-col>
              <v-text-field
                v-model="newTransaction.description"
                label="Description"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="newTransaction.amount"
                label="Amount"
                type="number"
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="auto">
              <v-date-picker
                width="auto"
                v-model="newTransaction.date"
              ></v-date-picker>
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
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RegisterTransaction",
  props: {
    accountId: String,
  },
  data() {
    return {
      dialog: false,
      registering: false,
      newTransaction: {
        description: "",
        date: undefined,
        amount: 0,
      },
    }
  },
  mounted() {},

  methods: {
    async registerTransaction() {
      this.registering = true
      try {
        const url = `/accounts/${this.accountId}/transactions/`
        const { data } = await this.axios.post(url, {
          ...this.newTransaction,
        })
        if (data.id) this.$emit("transactionRegistered", data)
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
