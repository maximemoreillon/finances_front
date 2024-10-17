<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined v-bind="attrs" v-on="on">
        <v-icon left>mdi-calendar</v-icon>
        <span>{{ year }}</span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="year in years"
        :key="year"
        @click="handleSelection(year)"
      >
        <v-list-item-title>{{ year }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
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
      // TODO: query parameter
      this.$emit("yearSelection", year)
    },
  },
  computed: {},
}
</script>
