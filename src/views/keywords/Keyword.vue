<template>
  <v-card class="mx-auto" max-width="30rem">
    <v-toolbar flat>
      <v-btn icon @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Keyword</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="updateKeyword()" :loading="saving">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn icon @click="deleteKeyword()" color="#c00000" :loading="deleting">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <template v-if="keyword">
        <v-row>
          <v-col>
            <v-text-field v-model="keyword.word" label="Word"></v-text-field>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Keyword",
  components: {},

  data() {
    return {
      loading: false,
      deleting: false,
      saving: false,
      keyword: null,
    }
  },
  mounted() {
    this.getKeyword()
  },
  methods: {
    getKeyword() {
      this.axios
        .get(`/keywords/${this.keywordId}`)
        .then((response) => {
          this.keyword = response.data
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },

    async updateKeyword() {
      this.saving = true
      try {
        await this.axios.put(`/keywords/${this.keywordId}`, this.keyword)
      } catch (error) {
        console.error(error)
        alert("Error")
      } finally {
        this.saving = false
      }
    },
    async deleteKeyword() {
      if (!confirm("Delete keyword?")) return
      this.deleting = true
      try {
        await this.axios.delete(`/keywords/${this.keywordId}`)
        // TODO: find a better page to push to
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
    keywordId() {
      return this.$route.params.keywordId
    },
  },
}
</script>
