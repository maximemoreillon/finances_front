<template>
  <v-dialog v-model="dialog" width="50rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon left>mdi-plus</v-icon>
        <span>Add</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Add keyword </v-card-title>

      <v-form @submit.prevent="addCategory">
        <v-card-text>
          <v-row align="center">
            <v-col>
              <v-select
                :items="categories"
                v-model="categoryId"
                item-text="name"
                item-value="id"
                label="Category"
              />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" text> cancel </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="adding" color="primary">
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
  name: "AddCategory",
  props: {
    accountId: String,
    transactionId: String,
  },
  data() {
    return {
      dialog: false,
      categoryId: null,
      adding: false,
      categories: [],
    }
  },
  mounted() {
    this.getCategories()
  },

  methods: {
    async getCategories() {
      const { data } = await this.axios.get("/categories")
      this.categories = data.categories
    },
    async addCategory() {
      this.adding = true
      try {
        const url = `/accounts/${this.accountId}/transactions/${this.transactionId}/categories`
        const { data } = await this.axios.post(url, {
          category_id: this.categoryId,
        })
        this.$emit("categoryAdded", data)
        this.dialog = false
        this.categoryId = null
      } catch (error) {
        console.error(error)
        alert("Error")
      } finally {
        this.adding = false
      }
    },
  },
  computed: {},
}
</script>
