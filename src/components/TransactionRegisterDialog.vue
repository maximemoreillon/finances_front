<template>
  <v-dialog v-model="dialog" width="50rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon left>mdi-plus</v-icon>
        <span>Register</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Register transaction </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="registerTransaction">
          <v-row>
            <v-col>
              <v-text-field v-model="newTransaction.description" label="Name" />
            </v-col>

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
              <v-date-picker v-model="newTransaction.date"></v-date-picker>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn type="submit" :loading="registering">Save</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Cancel </v-btn>
      </v-card-actions>
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
        // WARNING: if already exists, should not emit or push
        this.$emit("transactionRegistered", data)
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
