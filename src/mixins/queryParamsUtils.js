export default {
  methods: {
    setQueryParam(key, value) {
      if (this.$route.query[key] === value) return
      const query = { ...this.$route.query }
      if (value) query[key] = value
      else delete query[key]
      this.$router.replace({ query })
    },
  },
  computed: {
    year() {
      if (!this.$route.query.year) return new Date().getFullYear()

      return Number(this.$route.query.year)
    },
    month() {
      if (!this.$route.query.month) return -1
      return Number(this.$route.query.month)
    },
    category() {
      return this.$route.query.category
    },
  },
}
