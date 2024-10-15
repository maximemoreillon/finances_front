<template>
  <v-card class="mx-auto" max-width="60rem">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>Transaction categories</v-card-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            exact
            :to="{ name: 'new_transaction_category' }"
            color="primary"
          >
            New category
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-data-table :headers="headers" :items="categories">
        <template v-slot:item.name="{ item }">
          <router-link
            :to="{
              name: 'transaction_category',
              params: { categoryId: item.id },
            }"
          >
            {{ item.name }}
          </router-link>
        </template>
        <template v-slot:item.keywords="{ item }">
          <v-chip
            v-for="(keyword, index) in item.keywords"
            :key="`${item._id}_kw_${index}`"
            class="ma-2"
          >
            {{ keyword }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TransactionCategories",

  data() {
    return {
      categories: [],
      headers: [
        { value: "name", text: "Name" },
        { value: "keywords", text: "Keywords" },
      ],
    }
  },
  mounted() {
    this.get_categories()
  },
  methods: {
    get_categories() {
      this.axios
        .get(`/categories`)
        .then(({ data }) => {
          this.categories = data.categories
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
  },
}
</script>

<style scoped></style>
