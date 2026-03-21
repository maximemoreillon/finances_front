import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

export function useQueryParams() {
  const route = useRoute()
  const router = useRouter()

  function setQueryParam(key: string, value: string | number | null | undefined) {
    const query = { ...route.query }
    if (value !== null && value !== undefined) query[key] = String(value)
    else delete query[key]
    router.replace({ query })
  }

  const year = computed(() => {
    if (!route.query.year) return new Date().getFullYear()
    return Number(route.query.year)
  })

  const month = computed(() => {
    if (!route.query.month) return -1
    return Number(route.query.month)
  })

  const category = computed(() => route.query.category as string | undefined)

  return { setQueryParam, year, month, category }
}
