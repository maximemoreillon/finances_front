<template>
  <v-card max-width="50rem" class="mx-auto">
    <v-card-title>Create category</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="create_category()">
        <v-row align="baseline">
          <v-col>
            <v-text-field v-model="name" label="Name" />
          </v-col>
          <v-col cols="auto">
            <v-btn icon type="submit" :loading="loading">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CreateTransactionCategory",

  data() {
    return {
      name: "New category",
      loading: false,
    }
  },
  mounted() {},
  methods: {
    create_category() {
      this.loading = true
      const url = `/categories`
      this.axios
        .post(url, { name: this.name })
        .then(({ data }) => {
          this.$router.push({
            name: "transaction_category",
            params: { categoryId: data.id },
          })
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {},
}
</script>

<style scoped></style>
