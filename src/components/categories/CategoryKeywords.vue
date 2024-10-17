<template>
  <v-card :loading="loading" outlined>
    <v-card-title> Keywords </v-card-title>
    <v-card-text>
      <template>
        <v-row align="center">
          <v-col cols="auto">
            <h3 class="my-4">Keywords</h3>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <AddKeywordDialog
              :categoryId="String(categoryId)"
              @keywordAdded="keywords.push($event)"
            />
          </v-col>
        </v-row>

        <v-chip
          v-for="keyword in keywords"
          :key="keyword.id"
          label
          outlined
          close
          class="ma-1"
          @click:close="deleteKeyword(keyword.id)"
        >
          {{ keyword.word }}
        </v-chip>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import AddKeywordDialog from "@/components/categories/AddKeywordDialog.vue"
export default {
  name: "CategoryKeywords",
  components: {
    AddKeywordDialog,
  },

  data() {
    return {
      loading: false,
      keywords: [],
    }
  },
  mounted() {
    this.getKeywords()
  },
  methods: {
    async getKeywords() {
      this.loading = true
      try {
        const { data } = await this.axios.get(
          `/categories/${this.categoryId}/keywords`
        )
        this.keywords = data.keywords
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async deleteKeyword(keywordId) {
      if (!confirm("Delete keyword?")) return

      try {
        await this.axios.delete(
          `/categories/${this.categoryId}/keywords/${keywordId}`
        )
        const foundIndex = this.keywords.findIndex((k) => k.id === keywordId)
        if (foundIndex > -1) this.keywords.splice(foundIndex, 1)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
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
