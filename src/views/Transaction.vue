<template>
  <v-card :loading="loading" max-width="50rem" class="mx-auto">
    <v-toolbar flat>
      <v-btn
        icon
        :to="{ name: 'account', params: { account: this.account } }"
        exact
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Transaction</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="update_transaction()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn color="#c00000" icon @click="delete_transaction()">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text v-if="transaction">
      <v-row>
        <v-col>
          <v-text-field
            label="Description"
            v-model="transaction.description"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Amount"
            type="number"
            v-model.number="transaction.amount"
            :prefix="transaction.currency"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            label="Date"
            :value="new Date(transaction.date).toLocaleDateString()"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="baseline">
        <v-col>
          <v-select
            :items="transactionCategories"
            v-model="transaction.category"
            item-value="_id"
            item-text="label"
            label="Category"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn :to="{ name: 'transaction_categories' }">
            Manage categories
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-checkbox
            label="Business expense"
            v-model="transaction.business_expense"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Transaction",

  data() {
    return {
      transaction: null,
      loading: false,
      transactionCategories: [],
    }
  },
  mounted() {
    this.get_transaction_categories()
    this.get_transaction()
  },
  methods: {
    get_transaction_categories() {
      this.loading = true
      this.axios
        .get(`/transactions/categories`)
        .then((response) => {
          this.transactionCategories = response.data
        })
        .catch((error) => {
          if (error.response) console.error(error.response.data)
          else console.error(error)
          alert("Error")
        })
    },
    get_transaction() {
      this.transaction = null
      this.loading = true

      const url = `/accounts/${this.account}/transactions/${this.transaction_id}`
      this.axios
        .get(url)
        .then(({ data }) => {
          this.transaction = data
          this.loading = false
        })
        .catch((error) => console.log(error))
    },

    update_transaction() {
      const url = `/accounts/${this.account}/transactions/${this.transaction_id}`
      this.axios
        .patch(url, this.transaction)
        .then(() => {
          this.get_transaction()
        })
        .catch((error) => console.log(error))
    },

    delete_transaction() {
      if (!confirm("Delete transaction? This action is irreversible")) return
      const url = `/accounts/${this.account}/transactions/${this.transaction_id}`
      this.axios
        .delete(url)
        .then(() => {
          this.$router.go(-1)
        })
        .catch((error) => console.log(error))
    },
  },
  computed: {
    account() {
      return this.$route.params.account
    },
    transaction_id() {
      return this.$route.params.transaction_id
    },
  },
}
</script>

<style scoped></style>
