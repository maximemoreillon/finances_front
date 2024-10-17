<template>
  <v-card :loading="loading" max-width="30rem" class="mx-auto">
    <v-toolbar flat>
      <v-btn icon @click="$router.back()" exact>
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
          <v-text-field label="Description" v-model="transaction.description" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Amount"
            type="number"
            v-model.number="transaction.amount"
            :prefix="transaction.currency"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Date"
            :value="new Date(transaction.time).toLocaleDateString()"
            readonly
          />
        </v-col>
      </v-row>
      <!-- Categories -->
      <v-row align="center">
        <v-col>
          <h3>Categories</h3>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn :to="{ name: 'transaction_categories' }" outlined>
            Manage
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <!-- TODO: better handling of the categoryAdded event-->
          <AddCategoryDialog
            :transactionId="String(transactionId)"
            :accountId="String(accountId)"
            @categoryAdded="get_transaction()"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-chip
            cols="auto"
            v-for="category of transaction.categories"
            :key="category.id"
            class="ma-2"
            close
            @click:close="removeCategory(category.id)"
            >{{ category.name }}</v-chip
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import AddCategoryDialog from "@/components/AddCategoryDialog.vue"
export default {
  name: "Transaction",
  components: {
    AddCategoryDialog,
  },
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
    // TODO: get accounts
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

      const url = `/transactions/${this.transactionId}`
      this.axios
        .get(url)
        .then(({ data }) => {
          this.transaction = data
          this.loading = false
        })
        .catch((error) => console.log(error))
    },

    update_transaction() {
      const url = `/transactions/${this.transactionId}`
      this.axios
        .patch(url, this.transaction)
        .then(() => {
          this.get_transaction()
        })
        .catch((error) => console.log(error))
    },

    delete_transaction() {
      if (!confirm("Delete transaction? This action is irreversible")) return
      const url = `/transactions/${this.transactionId}`
      this.axios
        .delete(url)
        .then(() => {
          this.$router.go(-1)
        })
        .catch((error) => console.log(error))
    },
    async removeCategory(categoryId) {
      if (!confirm("Remove category?")) return
      const url = `/transactions/${this.transactionId}/categories/${categoryId}`
      await this.axios.delete(url)

      const foundIndex = this.transaction.categories.findIndex(
        (c) => c.id === categoryId
      )
      if (foundIndex > -1) this.transaction.categories.splice(foundIndex, 1)
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
    accountId() {
      return this.$route.params.accountId
    },
    transactionId() {
      return this.$route.params.transactionId
    },
  },
}
</script>

<style scoped></style>
