<template>
  <v-select
    :items="months"
    :value="month"
    @change="handleSelection"
    label="Month"
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
        { text: "Any", value: 0 },
        ...Array.from(Array(12).keys()).map((m) => m + 1),
      ],
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleSelection(month) {
      this.$emit("monthSelection", month)
    },
  },
  computed: {},
}
</script>
