import { computed } from "vue"
import { useQueryParams } from "./useQueryParams"

export function useDateRange() {
  const { year, month } = useQueryParams()

  const start_date = computed(() => {
    if (month.value === -1) return new Date(`${year.value}/01/01`)
    return new Date(`${year.value}/${month.value}/01`)
  })

  const end_date = computed(() => {
    if (month.value === -1) return new Date(`${year.value}/12/31`)
    const end_year = month.value < 12 ? year.value : year.value + 1
    const end_month = month.value < 12 ? month.value + 1 : 1
    return new Date(`${end_year}/${end_month}/01`)
  })

  return { start_date, end_date }
}
