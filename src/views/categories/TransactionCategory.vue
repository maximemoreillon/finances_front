<template>
  <div>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar flat>
            <v-btn icon exact :to="{ name: 'transaction_categories' }">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title>Category</v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="update_category()" disabled>
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="deleteCategory()"
              color="#c00000"
              :loading="deleting"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <template v-if="category">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="category.name"
                    label="Name"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <CategoryKeywords />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsBarChart />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TransactionsTable from "@/components/TransactionsTable.vue"
import CategoryKeywords from "@/components/categories/CategoryKeywords.vue"
import TransactionsBarChart from "../../components/TransactionsBarChart.vue"
export default {
  name: "CreateTransactionCategory",
  components: {
    TransactionsTable,
    CategoryKeywords,
    TransactionsBarChart,
  },

  data() {
    return {
      loading: false,
      deleting: false,
      category: null,
    }
  },
  mounted() {
    this.get_category()
  },
  methods: {
    get_category() {
      this.axios
        .get(`/categories/${this.categoryId}`)
        .then((response) => {
          this.category = response.data
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
    add_keyword() {
      alert("WIP")
      // this.category.keywords.push("")
    },
    async deleteKeyword(keywordId) {
      if (!confirm("Delete keyword?")) return

      await this.axios.delete(
        `/categories/${this.categoryId}/keywords/${keywordId}`
      )
      const foundIndex = this.category.keywords.findIndex(
        (k) => k.id === keywordId
      )
      if (foundIndex > -1) this.category.keywords.splice(foundIndex, 1)
    },
    update_category() {
      alert("WIP")
      // let categoryId = this.$route.params.categoryId
      // this.axios
      //   .put(`/transactions/categories/${categoryId}`, this.category)
      //   .then(() => {
      //     this.$router.push({ name: "transaction_categories" })
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //     alert("Error")
      //   })
    },
    async deleteCategory() {
      if (!confirm("Delete category?")) return
      this.deleting = true
      try {
        await this.axios.delete(`/categories/${this.categoryId}`)
        this.$router.push({ name: "transaction_categories" })
      } catch (error) {
        console.error(error)
        alert("Error")
      } finally {
        this.deleting = false
      }
    },
  },
  computed: {
    categoryId() {
      return this.$route.params.categoryId
    },
  },
}
</script>
