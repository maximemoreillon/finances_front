export default {
  methods: {},
  computed: {
    start_date() {
      if (this.month === -1) return new Date(`${this.year}/01/01`)
      return new Date(`${this.year}/${this.month}/01`)
    },
    end_date() {
      if (this.month === -1) return new Date(`${this.year}/12/31`)

      const end_year = this.month < 12 ? this.year : this.year + 1
      const end_month = this.month < 12 ? this.month + 1 : 1
      return new Date(`${end_year}/${end_month}/01`)
    },
  },
}
