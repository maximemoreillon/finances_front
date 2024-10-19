<template>
  <v-select
    :items="years"
    :value="year"
    @change="setQueryParam('year', $event)"
    label="year"
  />
</template>

<script>
import queryParamsUtils from "@/mixins/queryParamsUtils"

export default {
  name: "YearSelect",
  components: {},
  mixins: [queryParamsUtils],

  data() {
    return {
      years: Array.from(Array(10).keys()).map(
        (y) => new Date().getFullYear() - y
      ),
    }
  },
  watch: {},
  mounted() {},
  methods: {},
  computed: {},
}
</script>
