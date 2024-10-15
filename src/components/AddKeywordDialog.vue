<template>
  <v-dialog v-model="dialog" width="50rem">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"> Add keyword </v-btn>
    </template>

    <v-card>
      <v-card-title> Add keyword </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="addKeyword">
          <v-row align="center">
            <v-col>
              <v-text-field label="Word" v-model="word" />
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="loading">Save</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddKeyword",
  props: {
    categoryId: Number,
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
