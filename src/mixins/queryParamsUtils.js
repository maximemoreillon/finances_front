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
}
