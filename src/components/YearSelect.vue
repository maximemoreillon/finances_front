<template>
  <v-select
    :items="years"
    :value="year"
    @change="handleSelection"
    label="year"
  />
</template>

<script>
export default {
  name: "YearSelect",
  components: {},
  props: {
    year: Number,
  },
  data() {
    return {
      years: Array.from(Array(10).keys()).map(
        (y) => new Date().getFullYear() - y
      ),
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleSelection(year) {
      this.$emit("yearSelection", year)
    },
  },
  computed: {},
}
</script>
