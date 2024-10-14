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
            :value="new Date(transaction.time).toLocaleDateString()"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="baseline">
        <v-col>
          <v-select
            :items="categorySelectOptions"
            v-model="transaction.category"
            item-value="_id"
            item-text="label"
            label="Category"
            :persistent-placeholder="!transaction.category && foundAutoCategory"
            :placeholder="!transaction.category ? foundAutoCategory : undefined"
          />
        </v-col>

        <v-col cols="auto">
          <v-btn :to="{ name: 'transaction_categories' }">
            Manage categories
          </v-btn>
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
      existingCategories: [],
    }
  },
  mounted() {
    this.get_transaction()
    this.get_transaction_categories()
  },
  methods: {
    async get_transaction_categories() {
      this.loading = true
      const { data } = await this.axios.get(`/categories`)
      this.existingCategories = data.categories
    },
    get_transaction() {
      this.transaction = null
      this.loading = true

      const url = `/accounts/${this.account}/transactions/${this.transactionId}`
      this.axios
        .get(url)
        .then(({ data }) => {
          this.transaction = data
          this.loading = false
        })
        .catch((error) => console.log(error))
    },

    update_transaction() {
      const url = `/accounts/${this.account}/transactions/${this.transactionId}`
      this.axios
        .patch(url, this.transaction)
        .then(() => {
          this.get_transaction()
        })
        .catch((error) => console.log(error))
    },

    delete_transaction() {
      if (!confirm("Delete transaction? This action is irreversible")) return
      const url = `/accounts/${this.account}/transactions/${this.transactionId}`
      this.axios
        .delete(url)
        .then(() => {
          this.$router.go(-1)
        })
        .catch((error) => console.log(error))
    },
  },
  computed: {
    foundAutoCategory() {
      return "WIP"
      // return this.existingCategories.find(({ keywords }) =>
      //   keywords.find((k) => this.transaction.description.includes(k))
      // )?.label
    },
    categorySelectOptions() {
      return [{ label: "None", _id: null }, ...this.existingCategories]
    },
    account() {
      return this.$route.params.account
    },
    transactionId() {
      return this.$route.params.transactionId
    },
  },
}
</script>

<style scoped></style>
