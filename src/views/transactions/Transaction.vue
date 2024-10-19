<template>
  <v-card :loading="loading" max-width="40rem" class="mx-auto">
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
      <v-row align="center">
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
      <v-row>
        <v-col cols="auto">
          Account:
          <router-link
            :to="{
              name: 'account',
              params: { accountId: transaction.account_id },
            }"
          >
            {{
              accounts.find((a) => a.id === transaction.account_id)?.name ||
              transaction.account_id
            }}
          </router-link>
        </v-col>
      </v-row>

      <!-- Categories -->
      <!-- TODO: external component -->
      <v-row align="center">
        <v-col>
          <v-card outlined>
            <v-toolbar flat>
              <v-toolbar-title>Categories</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                :to="{ name: 'transaction_categories' }"
                outlined
                class="mr-2"
              >
                Manage
              </v-btn>
              <!-- TODO: better handling of the categoryAdded event-->

              <AddCategoryDialog
                :transactionId="String(transactionId)"
                :accountId="String(accountId)"
                @categoryAdded="get_transaction()"
              />
            </v-toolbar>
            <v-card-text>
              <v-chip
                cols="auto"
                v-for="category of transaction.categories"
                :key="category.id"
                class="mb-2 mr-2"
                close
                :to="{
                  name: 'transaction_category',
                  params: { categoryId: category.id },
                }"
                @click:close="removeCategory(category.id)"
                >{{ category.name }}</v-chip
              >
            </v-card-text>
          </v-card>
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
      accounts: [],
    }
  },
  mounted() {
    this.get_transaction()
    this.get_transaction_categories()
    this.getAccounts()

    // TODO: get accounts
  },
  methods: {
    async getAccounts() {
      const { data } = await this.axios.get(`/accounts`)
      this.accounts = data.accounts
    },
    async get_transaction_categories() {
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
