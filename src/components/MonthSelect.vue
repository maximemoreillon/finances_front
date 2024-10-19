<template>
  <v-select
    :items="months"
    :value="month"
    @change="handleChage"
    label="Month"
  />
</template>

<script>
import queryParamsUtils from "@/mixins/queryParamsUtils"

export default {
  name: "MonthSelect",
  mixins: [queryParamsUtils],
  data() {
    return {
      months: [
        { text: "Any", value: -1 },
        ...Array.from(Array(12).keys()).map((m) => m + 1),
      ],
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleChage(val) {
      if (val === -1) this.setQueryParam("month", null)
      else this.setQueryParam("month", val)
    },
  },
  computed: {},
}
</script>
