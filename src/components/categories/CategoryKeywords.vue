<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title> Keywords </v-toolbar-title>
      <v-spacer />

      <AddKeywordDialog
        :categoryId="String(categoryId)"
        @keywordAdded="keywords.push($event)"
      />
    </v-toolbar>
    <v-card-text>
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
