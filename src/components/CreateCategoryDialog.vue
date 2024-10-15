<template>
  <v-dialog v-model="dialog" width="50rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon left>mdi-plus</v-icon>
        <span>New</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Create transaction category </v-card-title>

      <v-form @submit.prevent="createCategory">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text-field v-model="name" label="Category name" />
            </v-col>
            <v-col cols="auto"> </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false"> Cancel </v-btn>
          <v-btn type="submit" :loading="registering" color="primary">
            Register
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateCategoryDialog",
  props: {
    accountId: String,
  },
  data() {
    return {
      dialog: false,
      registering: false,
      name: "",
    }
  },
  mounted() {},

  methods: {
    async createCategory() {
      this.registering = true
      try {
        const url = `/accounts/${this.accountId}/balance/`
        const { data } = await this.axios.post(url, {
          name: this.name,
        })
        this.$router.push({
          name: "transaction_category",
          params: { categoryId: data.id },
        })
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
