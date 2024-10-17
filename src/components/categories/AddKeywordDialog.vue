<template>
  <v-dialog v-model="dialog" width="30rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon left>mdi-plus</v-icon>
        <span>Add</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Add keyword </v-card-title>

      <v-form @submit.prevent="addKeyword">
        <v-card-text>
          <v-row align="center">
            <v-col>
              <v-text-field label="Word" v-model="word" />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" text> cancel </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="loading" color="primary">
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
  name: "AddKeyword",
  props: {
    categoryId: String,
  },
  data() {
    return {
      dialog: false,
      word: "",
      loading: false,
    }
  },

  methods: {
    async addKeyword() {
      this.loading = true
      try {
        const { data } = await this.axios.post(
          `/categories/${this.categoryId}/keywords`,
          {
            word: this.word,
          }
        )
        this.$emit("keywordAdded", data)
        this.dialog = false
        this.word = ""
      } catch (error) {
        console.error(error)
        alert("Error")
      } finally {
        this.loading = false
      }
    },
  },
  computed: {},
}
</script>
