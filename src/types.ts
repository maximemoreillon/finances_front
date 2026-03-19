export interface Account {
  id: number
  name: string
  currency: string
  balance: number
  transaction_count: number
}

export interface Category {
  id: number
  name: string
  keywords?: Keyword[]
  transaction_count?: number
}

export interface Keyword {
  id: number
  word: string
  category_id: number
}

export interface Transaction {
  id: number
  description: string
  amount: number
  time: string
  currency: string
  account_id: number
  categories: Category[]
}
