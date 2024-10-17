<template>
  <v-select
    :items="months"
    :value="month"
    @change="handleSelection"
    label="year"
  />
</template>

<script>
export default {
  name: "MonthSelect",
  components: {},
  props: {
    month: Number,
  },
  data() {
    return {
      months: [
        { text: "Any", valueL: 0 },
        ...Array.from(Array(12).keys()).map((m) => m + 1),
      ],
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleSelection(month) {
      // TODO: query parameter
      this.$emit("monthSelection", month)
    },
  },
  computed: {},
}
</script>
